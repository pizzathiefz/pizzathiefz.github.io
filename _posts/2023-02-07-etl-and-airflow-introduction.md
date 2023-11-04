---
title: Airflow 소개
date: 2023-02-07 11:28:00 +09:00
categories:
  - Notes
tags:
  - data-engineering
  - airflow
math: true
toc: true
comments: true
---
>  [프로그래머스 실리콘밸리에서 날아온  데이터 엔지니어링 스타터 키트 with Python](https://school.programmers.co.kr/learn/courses/19268)을 듣고 정리한 내용입니다.
{: .prompt-info }

## Spark / Athena 사용 시나리오

- 비구조화된 데이터 처리
- 매우 큰 비구조화된 데이터 → S3 → Spark, Athena를 통해 정제하고 크기를 줄이고 → Redshift
   - Redshift 비싸기 때문에 비구조화된 데이터를 바로 올릴 이유가 없음
- ML 모델의 입력으로 들어가는 feature를 배치로 미리 계산하는 경우
   - S3나 Redshift에 있는 데이터를 Spark로 처리 → NoSQL, MongoDB 등에 저장 → Reco API → ML 모델

## 데이터 파이프라인이란?

- ETL
   - Extract, Transform, Load
   - = DAG (Directed Acyclic Graph) in Airflow
   - ETL: 데이터 웨어하우스 외부에서 내부로 가져오는 프로세스
   - ELT: 데이터 웨어하우스 내부 데이터를 조작해서 (좀더 추상화되고 요약된) 데이터를 만드는 것
      - 데이터 레이크를 사용하기도 함
      - 프로세스 전용 기술들이 있음 - DBT
- 데이터 레이크
   - 싸고 큰 데이터를 부담없이 저장
   - structured + unstructured
   - historical data storage
- 데이터 웨어하우스
   - 보다 정제되고 구조화된 데이터 + retention policy
   - BI tools (Tableau, Superset 등) 과 연결

데이터 소스 → 데이터 레이크(S3) → 데이터 변형(Spark, Athena) → 데이터 웨어하우스 / 데이터마트

Data Pipeline의 정의

- 데이터를 소스로부터 목적지로 복사하는 작업
- 대부분의 경우 목적지는 데이터 웨어하우스가 됨 / 또는 캐시 시스템, 프로덕션 데이터베이스, NoSQL, S3, ...
- 데이터 소스: click stream, call data, transactions, metadata,
1. Raw data ETL
   - 외부와 내부 데이터 소스에서 데이터를 읽어다가(많은 경우 API)
   - 적당한 데이터 포맷 변환 후 (크기가 커지면 Spark 등이 필요)
   - 데이터 웨어하우스 로드
   *이 작업은 보통 데이터 엔지니어가 함

1. Summary/Report Jobs
   - DW or  DL로부터 데이터를 읽어 다시 DW에 쓰는 ETL
   - Raw Data를 읽어서 일종의 리포트 형태나 써머리 형태의 테이블을 다시 만드는 용도
   - 특수한 형태로는 AB 테스트 결과를 분석하는 데이터 파이프라인도 존재
   - 요약 테이블의 경우 SQL(CTAS를 통해)만으로 만들고 이는 데이터분석가가 하는 것이 맞음. 데이터 엔지니어 관점에서는 어떻게 분석가들이 편하게 할 수 있는 환경을 만들어 주느냐가 관건
   - 요즘은 DBT를 많이 씀 (Analytics Engineer)
1. Production Data Jobs
   - DW로부터 데이터를 읽어 다른 Storage(많은 경우 프로덕션 환경)로 쓰는 ETL
      - 써머리 정보가 프로덕션 환경에서 성능 이유로 필요한 경우
      - 혹은 머신러닝 모델에서 필요한 피쳐를 미리 계산해두는 경우
   - 이 경우 흔한 타겟 스토리지
      - NoSQL(HBase/DynamoDB/Cassandra)
      - MySQL과 같은 관계형 데이터베이스(OLTP)
      - 캐시(Redis/Memcache)
      - 검색엔진(Elastic Search)

## 간단한 ETL 작성해보기

- S3에서 읽어온 데이터를 Reshift에 저장해보자

```sql
%sql postgresql://keeyong:****@learnde.cduaw970ssvt.ap-northeast-2.redshift.amazonaws.com:5439/dev
  
DROP TABLE IF EXISTS keeyong.name_gender;
CREATE TABLE keeyong.name_gender (
   name varchar(32),
   gender varchar(8)
);
```

```python
import psycopg2

# Redshift connection 함수
# 본인 ID/PW 사용!
def get_Redshift_connection():
    host = "learnde.cduaw970ssvt.ap-northeast-2.redshift.amazonaws.com"
    redshift_user = "keeyong"
    redshift_pass = "Keeyong1!"
    port = 5439
    dbname = "dev"
    conn = psycopg2.connect("dbname={dbname} user={user} host={host} password={password} port={port}".format(
        dbname=dbname,
        user=redshift_user,
        password=redshift_pass,
        host=host,
        port=port
    ))
    conn.set_session(autocommit=True)
    return conn.cursor()
```

- ETL 함수를 하나씩 정의

```python
import requests

#읽어오기(s3)
def extract(url):
    f = requests.get(url)
    return (f.text)
#리스트로 나누기
def transform(text):
    lines = text.split("\n")
    return lines

#읽어온 데이터를 한줄씩 좀전에 만든 테이블에 insert
def load(lines):
    # BEGIN과 END를 사용해서 SQL 결과를 트랜잭션으로 만들어주는 것이 좋음
    # BEGIN;DELETE FROM (본인의스키마).name_gender;INSERT INTO TABLE VALUES ('KEEYONG', 'MALE');....;END;
    cur = get_Redshift_connection()
    for r in lines:
        if r != '':
            (name, gender) = r.split(",")
            print(name, "-", gender)
            sql = "INSERT INTO keeyong.name_gender VALUES ('{n}', '{g}')".format(n=name, g=gender)
            print(sql)
            cur.execute(sql)
```

- ETL 함수를 순서대로 실행

```python
link = "https://s3-geospatial.s3-us-west-2.amazonaws.com/name_gender.csv"

data = extract(link)
lines = transform(data)
load(lines)
```

## Airflow 소개

- 데이터 파이프라인 프레임워크(파이썬) + 스케줄링 with Web UI
- 데이터 파이프라인 = DAG
   - Task = Operator로 구성됨
- 1개 이상의 서버 = 워커, 스케줄러
- 스케줄러가 워커에서 태스크를 분배
- DAG와 스케줄링 정보는 DB에 저장 (SQLite이 default)
- 20년에 2.0이 나왔고 지금은 대부분 2.0을 씀
- 오픈소스이므로 가장 최신버전을 쓴다면 안정성에서 위험부담이 있음 → 구글 클라우드가 뭘 쓰는지 확인 (클라우드 회사는 아무거나 안 씀.. 2.4 쓴다면 안전할 것이다)

## Airflow 구성

- 총 5개
   - Web Server
   - Scheduler
   - Worker
   - Database (위 정보를 저장하는 metadata DB)
   - Queue (멀티노드 구성인 경우)
      - 이 경우 Executor가 달라짐(CeleryExecuter, KubernetesExecutor)
- 서버 한대로 부족할 경우 옵션: 스케일 업(더 좋은 사양의 서버 사용) or 스케일 아웃 (서버 추가)
- 장단점
   - 장점
      - 데이터 파이프라인을 세밀하게 제어
      - 다양한 데이터소스와 데이터 웨어하우스 지원
      - 백필이 쉬움
   - 단점
      - 배우기 쉽지 않음
      - 상대적으로 개발환경 구성이 쉽지 않음
      - 직접 운영이 쉽지 않음, 클라우드 버전 사용이 선호됨
         - GCP - Cloud Composer
         - AWS - Managed Workflows for Apache Airflow
- DAG란
   - Airflow에서 ETL을 부르는 명칭
   - Task로 구성됨 ex. 3개의 태스크로 구성된다면 Extract, Transform, Load
   - 태스크는 Airflow의 오퍼레이터로 만들어짐
      - 이미 다양한 종류의 오퍼레이터를 제공하므로 경우에 맞게 사용하거나 필요하다면 직접 개발
      - ex. Redshift writing, Postgres query, S3 Read/Write, Hive query, Spark job, shell script
- 모든 태스크에 필요한 기본 정보
   - default_args = 딕셔너리
      - owner, start_date, end_date, email(에러가 날 경우 수신), retries(실패할 경우 몇번까지 시도), retry_delay(재시도 할때 기다리는 시간)
   - `test_dag = DAG(“dag_v1”, schedule_interval = “0 9 * * *”, tags: [‘tag’], default_args = default_args)`
   - schedule_interval은 크론탭 문법을 따름
      - 순서대로 `분, 시간, 일, 월, 주`
         - 0 * * * * : 매시 0분에 시행됨
         - 0 12 * * * : 매일 12시 0분에 시행됨

## 데이터 파이프라인을 만들 때 고려할 점

- 데이터 파이프라인은 많은 이유로 실패함 (이상과 현실 간의 괴리)
   - 버그
   - 데이터 소스 상의 이슈
   - 파이프라인들 간의 의존도에 대한 이해도 부족
- 데이터 파이프라인 수가 늘어나면 유지보수 비용이 기하급수적으로 늘어남
   - 데이터 소스 간의 의존도가 생기면서 더 복잡해짐
      - 중요한 정보가 업데이트가 안된다면 관련 다른 모든 정보들이 갱신되지 않는다든지
      - best case를 가정하고 파이프라인을 만들면 안 됨 - 11시에는 a가 다 잘 돌 거니까 그게 필요한 b도 잘 실행 될 거야 → 안됨…
      - 더 많은 테이블들이 관리가 되어야 함
- Best Practices
   - 가능하면 데이터가 작을 경우 매번 통째로 복사해서 테이블 만들기 (Full Refresh)
      - Incremental update만이 가능하다면, 대신 데이터소스가 갖춰야 할 몇 가지 조건이 있음
         - 데이터소스가 프로덕션 데이터베이스 테이블이라면 다음 필드가 반드시 필요
            - created, modified, deleted
         - 데이터소스가 API라면 특정 날짜를 기준으로 새로 생성되거나 업데이트된 레코드들을 읽어올 수 있어야 함
   - 멱등성(Idempotency)을 보장하는 것이 중요
      - 동일한 입력 데이터로 데이터 파이프라인을 다수 반복해도 최종 결과물이 달라지지 않아야 함
      - 예를 들면 중복 데이터가 생기면 안 됨
   - 실패한 데이터파이프라인을 재실행하는 것과 과거 데이터를 다시 채우는 과정(backfill)이 쉬워야 함
      - Airflow는 이런 부분(특히 backfill)에 강점을 가지고 있음
         - DAG의 catchup 파라미터가 True여야 하고, start_date, end_date이 적절하게 설정되어야 함
         - 대상 테이블이 incremental update가 되는 경우만 의미가 있음
            - execution_date 파라미터를 사용해서 업데이트되는 날짜 혹은 시간을 알아내게 코드를 작성해야 함
            - 현재 시간을 기준으로 업데이트 대상을 선택하는 것은 안티 패턴
   - 데이터 파이프라인의 입력과 출력을 명확히 하고 문서화
      - 데이터 디스커버리 문제!
   - 주기적으로 쓸모없는 데이터들을 삭제 (규모가 커질수록 불필요한 데이터 파이프라인으로 생기는 이슈가 많음. 다 돈이 됨)
   - 데이터 파이프라인 사고시마다 리포트(post-mortem) 쓰기
   - 중요 데이터 파이프라인의 입력과 출력을 체크하기
      - 입력/출력 레코드 수 체크, 중복 레코드 체크, Primary key uniqueness 체크

## Airflow의 Backfill 방식 설명

- Daily incremental update를 구현한다면?
   - 예를 들어 20/11/7 데이터부터 매일매일 하루치 데이터를 읽어온다고 가정해보자.
   - 이 경우 언제부터 해당 ETL이 동작해야 하나? → 20/11/8
   - 20/11/8에 동작하고, 20/11/7에 데이터를 읽어오는 것으로 시작해서 매일매일 업데이트
   - **그렇다면 Airflow의 start_date은 11/7임**! 처음 DAG가 실행되는 날짜가 아님
   - execution_date라는 시스템 변수에 start_date을 넘겨서 11/8부터 실행되도록 함
- Incremental하게 1년치 데이터를 backfill 해야 한다면? 어떻게 ETL을 구현해야 할까?
   - 해결방법1
      - 기존 ETL 코드(지금 시간 기준으로 날짜를 정하도록)를 조금 수정해서 지난 1년치 데이터에 대해 돌린다
      - 실수하기 쉽고 수정하는데 시간이 걸림
   - 해결방법2
      - 시스템적으로 이걸 쉽게 해주는 방법을 구현한다
      - 읽어와야 하는 데이터의 날짜를 계산하지 않고 시스템이 지정해준 날짜에 해당하는 데이터를 다시 읽어온다
      - Airflow의 접근방식
         - 모든 DAG 실행에는 execution_date이 지정되어 있음
         - execution_date으로 채워야하는 날짜와 시간이 넘어오고 이를 바탕으로 데이터를 갱신하도록 코드를 작성해야함 → 잇점: backfill이 쉬워짐
- 만불짜리 눈물의 쿼리
   - catchup 파라미터 → 8/6인 start_date인 DAG을 14일에 뒤늦게 enable했을 때 catchup = True인 경우 놓쳤던 것들을 8번 실행하게 됨
   - full refresh로 할 경우 catchup은 무조건 false
      - incremental update로 할 경우 복잡도가 올라갈 수밖에 없기 때문에 할 수 있을 때까지는 full refresh 하는 게 좋음

## 간단한 Airflow 잡 실행하기

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

dag = DAG(
    dag_id = 'my_first_dag',
    start_date = datetime(2022,5,5),
    catchup=False,
    tags=['example'],
    schedule_interval = '0 2 * * *')

def print_hello():
    print("hello!")
    return "hello!"

def print_goodbye():
    print("goodbye!")
    return "goodbye!"

print_hello = PythonOperator(
    task_id = 'print_hello',
    #python_callable param points to the function you want to run 
    python_callable = print_hello,
    #dag param points to the DAG that this task is a part of
    dag = dag)

print_goodbye = PythonOperator(
    task_id = 'print_goodbye',
    python_callable = print_goodbye,
    dag = dag)

#Assign the order of the tasks in our DAG
print_hello >> print_goodbye
```

How to Trigger a DAG - 터미널에서 실행

   - 먼저 SSH로 Airflow 서버에 로그인하고 airflow 사용자로 변경
      - airflow dags list
      - airflow tasks list DAG이름
      - airflow tasks test DAG이름 Task이름 날짜 # test vs. run
         - 날짜는 YYYY-MM-DD
            - start_date보다 과거인 경우는 실행이 되지만 오늘 날짜보다 미래인 경우 실행 안됨
               - 이게 바로 execution_date의 값이 됨

## Airflow Operators, Variables and Connections

- task level에서 적용되는 파라미터 = default_args 내 값들
   - on_failure_callback : 실패시 이 함수 불러라
   - retires : 몇번 재시도 할건지, retry_delay
- DAG Object creation parameter
   - 이름, 태그
   - 스케줄 안하고 앞의 게 실행되면 하는 경우 스케줄이 아닌 None, @once
- DAG 파라미터
   - catchup
   - max_active_runs
   - max_active_tasks
   - 한번에 몇개씩
- DAG 파라미터와 task 파라미터 이해
   - DAG 파라미터는 DAG 객체를 만들 때 지정해줘야 함
   - default_args로 지정해주면 에러는 안 나지만 적용이 안 됨
- Python Operator는 매우 자유분방하게 내부에 python_callable을 통해 원하는 대로 파이썬 함수를 넣어줄 수 있고 Airflow에서 넘겨주는 execution_date를 함수에서 받아서 사용할 수 있음

# Name Gender DAG 개선하기

- Airflow Variable에 key value 저장
   - 민감한 정보들을 코드 밖으로 빼내기
   - Variable이라는 모듈 import해서 사용
- xcom → 앞의 태스크의 리턴값을 받아오는것 / return_value라는 키로 저장
- Connection
   - 인증정보 e.g. Redshift Connection