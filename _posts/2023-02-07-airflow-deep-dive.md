---
title: Airflow Deep Dive
date: 2023-02-07 11:30:00 +09:00
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
---

## 질문 리뷰

- Airflow worker 노드에서 spark 처리하지는 않고, spark를 처리한 걸 받아서 실행
- 쿠버네티스
   - 하나의 서버 자원을 효율적으로 쓸 수 있게 해줌
   - 데이터 양이 많아지고, DAG가 늘어남에 따라 Airflow가 쿠버네티스의 worker 노드를 빌려서 쓰게 함
- Airflow 사용할 수 있는데 DBT 사용하는 이유
   - 앞뒤로 태스크를 붙이기 쉽고 이런 관계에서 리니지를 만들 수 있음
- SQL 실행 전에 퍼포먼스를 확인할 수 있는 방법
   - Explain ~ 어떻게 실행할지 실행계획
- 테이블 변경 부분 업데이트할 때 created, modified, deleted가 적재되어 있지 않은 경우 증분처리 할 수 없음
- 여러개 스레드가 sqlite가 동시에 접근할 경우 속도가 느림
- EC2 사용하여 airflow install 하는 비디오
[airflow install - Google Drive](https://drive.google.com/drive/folders/1PCTu0IfLVhGdEfxM64SLS5c1O2dR_S2z)

### 다른 포인트들

- PostgresHook의 autocommit 파라미터
   - Default 값은 False로 주어짐
   - 이 경우 BEGIN은 아무런 영향이 없음 (no-operation)
- DAG에서 task를 어느 정도로 분리하는 것이 좋을까?
   - task를 많이 만들면 전체 DAG이 실행되는데 오래 걸리고 스케줄러에 부하가 감
   - task를 너무 적게 만들면 모듈화가 안되고 실패시 재실행을 시간이 오래 걸림
   - 오래 걸리는 DAG이라는 실패시 재실행이 쉽게 다수의 task로 나누는 것이 좋음

## 숙제 리뷰

### Weather_Forcaste DAG

- Full Refresh
[data-engineering-batch11/Weather_to_Redshift.py at main · keeyong/data-engineering-batch11](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/Weather_to_Redshift.py)

   - 매번 테이블 지우고 다시 빌드
   - autocommit Flase로, 실제로 반영되려면 Commit을 해야 함. 에러가 나면 Rollback
- Incremental Update

[data-engineering-batch11/Weather_to_Redshift_v2.py at main · keeyong/data-engineering-batch11](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/Weather_to_Redshift_v2.py)

   - 임시 테이블 생성 후 임시 테이블로 원본 테이블 내용 복사
      - CTAS의 문제점: default와 같은 attribute가 보존되지 않음
      - CREATE TABLE (LIKE)를 사용
         - `CREATE TABLE keeyong.temp_nps (LIKE keeyong.nps INCLUDING DEFAULTS);`
   - 임시 테이블로 새 레코드 추가
      - 이때 중복 발
   - 임시 테이블을 원본 테이블로 교체하면서 중복 제거
      - `ROW_NUMBER()`를 통해 같은 date 내 update_date가 최신인 것만 남김
   - ROLLBACK시 raise

### Airflow 환경 설정 변경

1. Airflow의 환경 설정이 들어있는 파일의 이름은?
   - airflow.cfg
2. Airflow를 API 형태로 외부에서 조작하고 싶다면 어느 섹션을 변경해야하는가?
   - api 섹션의 `auth_backend`를 `airflow.api.auth.backend.basic_auth`로 변경
1. Variable에서 변수 값이 encrypt되려면 변수 이름에 어떤 단어들이 들어가야 하는가?
   - password, secret, passwd, authorization, api_key, apikey, access_token
1. 이 환경설정파일이 수정되었다면 이를 실제로 반영하기 위해서 해야 하는 일은?
   - sudo systemctl restart airflow-webserver
   - sudo systemctl restart airflow-scheduler
6. DAGs 폴더에 새로운 Dag를 만들면 언제 실제로 Airflow 시스템에서 이를 알게 되나? 이 스캔주기를 결정해주는 키의 이름이 무엇인가?
   - dag_dir_list_interval

### dags 폴더에서 코딩시 작성한다면 주의할 점

- Airflow는 dags 폴더를 주기적으로 스캔함
- 이때 DAG 모듈이 들어 있는 모든 파일들을 메인 함수가 실행이 됨
   - 이 경우 본의 아니게 개발 중인 테스트 코드도 실행될 수 있음

### DAG 디버깅 or 에러 메시지 확인

- Airflow WebUI DAG UI에서 문제가 있는 DAG를 클릭하고 거기서 빨간 색으로 표시된 task 클릭 후 View Log로 확인
- Airflow 서버에서 airlfow 계정으로 다음 실행

   `airflow dags list`

   `airflow tasks list dag_id`

   `airflow tasks test dag_id task_id 2021-09-11`

   `airflow tasks run dag_id task_id 2021-09-11`

## MySQL 테이블 복사하기

> **프로덕션 데이터베이스 (MySQL, OLTP) -> 데이터 웨어하우스 (Redshift, OLAP)**

### 구현하려는 ETL

- **MySQL 커넥션 > Amazon S3 > Redshift**
   - 파일로 다운로드, 클라우드 스토리지에 적재 후 Redshift에 COPY
   - 바로 MySQL > Redshift INSERT 시 데이터가 크면 너무 오래걸림
- MySQL Connection 확인
![[airflow-deep-dive-mysql-connection.png]]
   - mysql 모듈을 설치 해야함 (안 하면 Connection type에 MySQL 안 보임)
      - `sudo apt-get install -y libmysqlclient-dev`
      - `sudo pip3 install --ignore-installed "apache-airflow-providers-mysql"`
- S3 Connection 설정
   - Extra `{“region_name”:”ap_northeast-2”}`
   - airflow 서버 띄울 때 advanced setting에서 EC2 서버에서 기본적으로 s3 버킷에 접근권한을 갖도록 설정했기 때문에 별도 권한 설정 필요하지 않음
- 과정
   - Mysql의 테이블 확인

```sql
CREATE TABLE prod.nps (
id INT NOT NULL AUTO_INCREMENT primary key, created_at timestamp,
score smallint
);
```

   - Redshift에 해당 테이블 생성

```sql
CREATE TABLE (본인의스키마).nps ( id INT NOT NULL primary key, 
created_at timestamp,
score smallint
)
```

   - MySQL_to_Redshift DAG의 Task 구성
      - MySQLToS3Operator (mysql 모듈 설치하면 따라오는 애)
         - MySQL SQL 결과 -> S3
         - (s3://grepp-data-engineering/{본인ID}-nps)
         - s3://s3_bucket/s3_key
      - S3ToRedshiftOperator (mysql 모듈 설치하면 따라오는 애)
         - S3 -> Redshift 테이블
         - (s3://grepp-data-engineering/{본인ID}-nps) -> Redshift (본인스키마.nps)
         - COPY command is used

### 코드 리뷰

- MySQL_to_Redshift.py
[data-engineering-batch11/MySQL_to_Redshift.py at main · keeyong/data-engineering-batch11](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/MySQL_to_Redshift.py)

   - 2개의 Operator를 사용해서 구현
      - MySQLToS3Operator
         - 파라미터만 잘 채워주면 됨
         - query `SELECT * FROM prod.nps` (그냥 전체 데이터 다 읽어오기)
         - 문제점 s3에 뭐가 있으면 에러가 남
      - S3ToRedshiftOperatorMySQL 있는 테이블 nps를 Redshift내의 각자 스키마 밑의 nps 테이블로 복사
      - S3를 경유해서 COPY 명령으로 복사
- MySQL_to_Redshift_v2.py
[data-engineering-batch11/MySQL_to_Redshift_v2.py at main · keeyong/data-engineering-batch11](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/MySQL_to_Redshift_v2.py)

   - 3개의 Operator를 사용해서 구현
      - S3DeleteObjectsOperator
      - MySQLToS3Operator
         - replace라는 파라미터는 나중 버전의 MySQLToS3Operator에 존재
         - 이전 버전에서는 없기 때문에 Delete 목적의 Operator를 사용
      - S3ToRedshiftOperator

```python
s3_to_redshift_nps = S3ToRedshiftOperator( 
task_id = 's3_to_redshift_nps',
s3_bucket = s3_bucket,
s3_key = s3_key,
schema = schema,
table = table,
copy_options=['csv'],
truncate_table = True, redshift_conn_id = "redshift_dev_db", 
dag = dag
)
```

- MySQL_to_Redshift_v3.py
[data-engineering-batch11/MySQL_to_Redshift_v3.py at main · keeyong/data-engineering-batch11](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/MySQL_to_Redshift_v3.py)

   - MySQL 있는 테이블 nps를 Redshift내의 각자 스키마 밑의 nps 테이블로 복사
   - Variable로 iam_role_for_copy_access_token 추가
      - arn:aws:iam::080705373126:role/redshift.read.s3
      - 이 권한의 생성은 [Redshift에게 위 S3 버켓에 대한 액세스권한 지정](https://docs.google.com/document/d/1FArSdUmDWHM9zbgEWtmYSJnxPXDX-LB7HT33AYJlWIA/edit#heading=h.9u82ph29nth9) 참고
      - COPY 명령을 실행할 수 있는 권한이 있음을 보여주기 위해 사용됨
   - 3개의 Operator 사용해서 구현
      - S3DeleteObjectsOperator
      - MySQLToS3Operator: execution_date에 해당하는 레코드만 읽어오게 바뀜
         - [https://airflow.apache.org/docs/apache-airflow/stable/templates-ref.html](https://airflow.apache.org/docs/apache-airflow/stable/templates-ref.html)
         - `SELECT * FROM prod.npsn WHERE DATE(created_at) = DATE('{{ execution_date }}')`
            - airflow system variable을 `{{  }}`
      - 자체 구현한 S3ToRedshiftOperator (providers가 아닌 plugins에서 import)
         - 예전 버전의 Airflow는 UPSERT가 안 되기 때문에
         - 아래 Incremental Update에 따라 중복제거 하도록 만든 것

```python
s3_to_redshift_nps = S3ToRedshiftOperator( task_id = 's3_to_redshift_nps',
s3_bucket = s3_bucket,
s3_key = s3_key,
schema = schema,
table = table,
copy_options=['csv'], redshift_conn_id = "redshift_dev_db", primary_key = "id",
order_key = "created_at",
dag = dag )
```

**MySQL 테이블의 Incremental Update 방식**

- MySQL/PostgreSQL 테이블이라면 다음을 만족해야함
   - created (timestamp): Optional
   - modified (timestamp): 업데이트일
   - deleted (boolean): 레코드를 삭제하지 않고 deleted를 True로 설정
      - 그냥 삭제되어 버리면 삭제된 건지 알 도리가 없기 때문
- Daily Update이고 테이블의 이름이 A이고 MySQL에서 읽어온다면
   - 먼저 Redshift의 A 테이블의 내용을 temp_A로 복사
   - MySQL의 A 테이블의 레코드 중 modified의 날짜가 지난 일(execution_date)에 해당하는 모든 레코드를 읽어다가 temp_A로 복사
      - 아래는 MySQL에 보내는 쿼리. 결과를 파일로 저장한 후 S3로 업로드하고 COPY 수행
         - `SELECT * FROM A WHERE DATE(modified) = DATE(execution_date)`
- temp_A의 레코드들을 primary key를 기준으로 파티션한 다음에 modified 값을 기준으로 DESC 정렬해서, 일련번호가 1인 것들만 다시 A로 복사
   - 가장 최근의 레코드들만 남도록

## How to Backfill in Airflow

### Backfill을 커맨드라인에서 실행하는 방법

> airflow dags **backfill** dag_id **-s** 2018-07-01 **-e** 2018-08-01

- This assumes the followings:
   - catchUp이 True로 설정되어 있음
   - execution_date을 사용해서 Incremental update가 구현되어 있음
- start_date부터 시작하지만 end_date은 포함하지 않음
- 실행순서는 날짜/시간순은 아니고 랜덤. 만일 날짜순으로 하고 싶다면,
   - DAG default_args의 depends_on_past를 True로 설정
      - `default_args = {'depends_on_past': True,`

### How to Make Your DAG Backfill ready

- 모든 DAG가 backfill을 필요로 하지는 않음
   - Full Refresh를 한다면 backfill은 의미가 없음
- 여기서 backfill은 일별 혹은 시간별로 업데이트하는 경우를 의미함
   - 마지막 업데이트 시간 기준 backfill을 하는 경우라면 (Data Warehouse 테이블에 기록된 시간기준) 이런 경우에도 execution_date을 이용한 backfill은 필요하지 않음
- 데이터의 크기가 굉장히 커지면 backfill 기능을 구현해 두는 것이 필수
   - airflow가 큰 도움이 됨
   - 하지만 데이터 소스의 도움 없이는 불가능
- 어떻게 backfill로 구현할 것인가
   - 제일 중요한 것은 데이터 소스가 backfill 방식을 지원해야함
   - “execution_date”을 사용해서 업데이트할 데이터 결정
   - “catchup” 필드를 True로 설정
   - start_date/end_date을 backfill하려는 날짜로 설정
   - 다음으로 중요한 것은 DAG 구현이 execution_date을 고려해야 하는 것이고 idempotent 해야함

## Summary Table 구현

- [Build_Summary.py](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/Build_Summary.py)
- 이 부분을 DBT로 구현하는 회사들도 많음 (Analytics Engineer) [https://www.getdbt.com/](https://www.getdbt.com/)

---

# 6주차

