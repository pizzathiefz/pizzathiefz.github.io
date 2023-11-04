---
title: Productionizing Airflow
date: 2023-02-07 11:32:00 +09:00
categories:
  - Notes
tags:
  - data-engineering
  - airflow
math: true
toc: true
comments: true
---
> [프로그래머스 실리콘밸리에서 날아온  데이터 엔지니어링 스타터 키트 with Python](https://school.programmers.co.kr/learn/courses/19268)을 듣고 정리한 내용입니다.
{: .prompt-info }


## Docker와 Kubernetes

- Docker
   - Docker Image
      - 단순히 응용프로그램 뿐 아니라 그 프로그램이 필요로 하는 모든 다른 환경까지 포함한 소프트웨어 패키지
      - Docker Registry에 가면 다양한 Image들을 찾아볼 수 있음
   - Docker Container
      - Docker Image를 Docker Engine에서 실행한 것을 지칭
      - Docker Engine만 실행하면 마치 가상 컴퓨터처럼 동작을 하면서 그 위에 다양한 소프트웨어들을 충돌없이 실행 가능
- Kubernetes (K8s)
   - 컨테이너 기반 서비스 배포/스케일/관리 자동화를 해주는 오픈소스 프레임웍
   - 가장 많이 사용되는 컨테이너 관리 (Orchestration) 시스템
   - 다수의 서버에 컨테이너 기반 프로그램을 실행하고 관리
      - 컨테이너 기반 프로그램 == Docker Container
      - 보통 Docker와 K8S는 같이 사용됨
      - Pod: 같은 디스크와 네트웍을 공유하는 1+ 컨테이너들의 집합
- Airflow와 Kubernetes
   - DAG 수가 많아지면 Worker 노드에서 task들을 실행하는 것이 어려워짐
      - 다양한 환경 설정이 필요해지고 그들간의 충돌이 발생하게 됨
      - 또한 다수의 worker 노드들을 Airflow 전용으로 쓰는 것이 낭비가 될 수도 있음
   - 해결책: Airflow에서 K8S를 Worker 노드 대용으로 사용
      - KubernetesExecutor를 먼저 사용 (*지금까지는 LocalExecutor 썼음)
      - 먼저 Airflow task 코드를 Docker 이미지로 만듬
      - 이 이미지를 K8S 클러스터에서 실행하는데 2가지 방법이 존재
         1. `KubernetesExecutor` - DAG의 전체 태스크들이 하나의 Pod로 실행
         2. `KubernetesPodOperator` - DAG의 특정 태스크들이 각각 별개의 Pod로 실행됨


## 5주차 질문 리뷰

- DBT 소개
   - Data Build Tool
      - ELT용 오픈소스
      - dbt Labs라는 회사가 상용화
      - Analytics Engineer라는 말을 만들어냄
   - 다양한 데이터 웨어하우스 지원
      - Redshift, Snowflake, Bigquery, Spark
   - 다수의 컴포넌트로 구성
      - 데이터 모델 (-> lineage 추적 가능 / 누가 사고쳤는지..), 입력 데이터, 데이터 체크, 스냅샷
   - 클라우드 버전도 존재 (dbtCloud)
- Airflow의 Variable로 관리하는 것과 코드 내에서 관리하는 것의 장단점
   - 장점: 코드 푸시의 필요성이 없음
   - 단점: 관리나 테스트가 안되어서 사고로 이어질 가능성이 있음 (코드에 들어가는 순간 기록이 남으므로 확인 가능)
- S3로 올린 파일은 어떻게 확인이 가능한가?
   - s3cmd를 통해 확인하거나 AWS의 S3 콘솔로 로그인해서 확인
   - s3cmd ls s3://grepp-data-engineering/
- [Airflow timezone 정리](https://yahwang.github.io/posts/87)
   - start_date, end_date, schedule_interval
      - default_timezone에 지정된 타임존을 따름
   - execution_date와 로그 시간
      - UTC를 따름
      - 즉 execution_date를 사용할 때는 타임존을 고려해서 변환후 사용필요
   - **현재로 가장 좋은 방법은 UTC를 일관되게 사용하는 것으로 보임**
- Data Lakehouse
   - 데이터 웨어하우스와 데이터 레이크의 장점을 취한 하이브리드 방식
      - 데이터 레이크의 장점: 비용 효율성과 스토리지 확장성 제공
      - 데이터 웨어하우스의 장점
         - ACID (Atomicity, Consistency, Isolation, Durability) 지원
         - 스키마와 같은 데이터 관리기능 제공
   - BI와 ML의 장점을 모두 취하는 것을 목표로 함
   - Databricks에서 2020년에서 처음 발표
      - Databricks Data Lakehouse Platform
      - 다음 컴포넌트로 구성됨
         - Cloud기반 데이터 레이크
         - Delta Lake: 오픈소스. 소프트웨어 레이어
         - Unity Catalog

## 5주차 숙제 리뷰: Build Summary 개선 (환경 설정 중심의 접근 방식)

- 일별 NPS를 SQL로 계산

```sql
SELECT LEFT(created_at, 10) AS date, 
  ROUND(SUM(CASE
    WHEN score >= 9 THEN 1
    WHEN score <= 6 THEN -1 END)::float*100/COUNT(1), 2) 
FROM keeyong.nps
GROUP BY 1
ORDER BY 1;
```

- NPS SQL을 주기적으로 요약 테이블로 만들기
   - 환경 설정 중심의 접근 방식


      - [Build_Summary_v2.py](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/Build_Summary_v2.py)
      - [config/nps_summary.py](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/config/nps_summary.py)
         - SQL문을 태스크에 하드코딩하지 말고 config로 따로 뺌
         - input_check : 레코드가 150000개는 되어야 진행하겠다 등의 체크
            - 체크 사항이 많아질수록 파이프라인의 품질이 올라감
   - 다른 방법은 dbt 사용하기
[dbt로 ELT 파이프라인 효율적으로 관리하기](https://www.humphreyahn.dev/blog/efficient-elt-pipelines-with-dbt)

## Airflow Configuration for Production Usage

### Things to Change

- airflow.cfg is in `/var/lib/airflow/airflow.cfg`
   - Any changes here will be reflected when you restart the webserver and scheduler
      - 재시작 안 하면 바꾼 거 변경 안 됨
   - [core] 섹션의 dags_folder가 DAG들이 있는 디렉토리가 되어야함
      - `/var/lib/airflow/dags`
   - dag_dir_list_interval: dags_folder를 Airflow가 얼마나 자주 스캔하는지 명시 (초 단위)
      - 300초 = 5분
      - 새로 폴더 만들어도 웹UI에 바로 뜨지 않고 이 주기만큼 기다려야 할 수 있음
- Airflow Database upgrade (Airflow 설치때 설명)
   - Sqlite -> Postgres or MySQL (이 DB는 주기적으로 백업되어야함)
   - sql_alchemy_conn in Core section of airflow.cfg
- LocalExecutor 사용 (Airflow 설치때 설명)
   - Executor in Core section of airflow.cfg
   - Single Server: from SequentialExecutor to LocalExecutor
      - Cluster: from SequentialExecutor to CeleryExecutor or KubernetesExecutor
- Enable Authentication & use a strong password (보안!)
   - In Airflow 2.0, authentication is ON by default
- Large disk volume for logs and local data
   - 많이 쓰다보면 디스크가 부족해지기 시작함 - 잘 삭제하든지 큰 스토리지로 옮기든지
   - Logs -> /dev/airflow/logs in (Core section of airflow.cfg)
      - base_log_folder
      - child_process_log_directory
   - Local data -> /dev/airflow/data
- Periodic Log data cleanup
   - The above folders need to be cleaned up periodically
   - You can write a shell Operator based DAG for this purpose
- From Scale Up to Scale Out
   - Go for Cloud Airflow options
      - **GCP Cloud Composer**
      - **Amazon MWAA**
- Backup Airflow metadata database
   - Backup variables and connections (command lines or APIs)
      - airflow variables export variables.json
      - airflow connections export connections.json
- Add health-check monitoring
   - [https://airflow.apache.org/docs/apache-airflow/stable/logging-monitoring/check-health.html](https://airflow.apache.org/docs/apache-airflow/stable/logging-monitoring/check-health.html)
      - API를 먼저 활성화하고 Health Check Endpoint API를 모니터링 툴과 연동
      - 뒤에서 별도 설명
   - 어느 정도 규모가 된다면 DataDog, Grafana등을 사용하는 것이 일반적


## API & Airflow 모니터링

- [Airflow API 활성화](https://airflow.apache.org/docs/apache-airflow/stable/security/api.html)
   - airflow.cfg의 api 섹션에서 auth_backend의 값을 변경
      - `[api]`
      - `auth_backend = airflow.api.auth.backend.basic_auth`
   - airflow 스케줄러 재실행
      - `sudo systemctl restart airflow-webserver`
   - basic_auth의 ID/Password 설정
      - Airflow 서버에서 airflow 사용자로 변경 `sudo su airflow`
      - `airflow config get-value api auth_backend`
   - Airflow Web UI에서 새로운 사용자 추가
      - Security -> List Users -> +
      - 이후 화면에서 새 사용자 정보 추가 (monitor:MonitorUser1)
- Health API 호출
   - `curl -X GET --user "monitor:MonitorUser1" https://[AirflowServer]:8080/health`
   - 정상 경우 응답:

```bash
{
"metadatabase": { "status": "healthy"
}, "scheduler": {
"status": "healthy",
"latest_scheduler_heartbeat": "2022-03-12T06:02:38.067178+00:00" }
}
```

- API 사용예
   - [특정 DAG를 API로 Trigger하기](https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#operation/post_dag_run)
   - [모든 DAG 리스트하기](https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#operation/get_dags)
   - [모든 Variable 리스트하기](https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#tag/Variable)

## Google Spreadsheet 연동하기

- 구글 서비스 어카운트 생성
   - 구글 클라우드 로그인  [https://console.cloud.google.com/](https://console.cloud.google.com/)
- 구글 스프레드시트 API 활성화 필요
   - [https://console.cloud.google.com/apis/library/sheets.googleapis.com](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
- 다음으로 구글 서비스 어카운트 생성 (JSON)
   - 아래 두문서 중 하나를 참고
      - [https://robocorp.com/docs/development-guide/google-sheets/interacting-with-google-sheets](https://robocorp.com/docs/development-guide/google-sheets/interacting-with-google-sheets)
      - [https://denisluiz.medium.com/python-with-google-sheets-service-account-step-by-step-8f74c26ed28e](https://denisluiz.medium.com/python-with-google-sheets-service-account-step-by-step-8f74c26ed28e)
   - 이 JSON 파일의 내용을 airflow에 google_sheet_access_token이란 이름의 Variable로 등록
   - 그리고 여기 JSON 파일을 보면 이메일 주소가 하나 존재. 이를 읽고 싶은 구글스프레드시트 파일에 공유
      - 이 이메일은 iam.gserviceaccount.com로 끝남
- 구글 시트를 테이블로 복사하는 예제
   - 실제 스프레드시트와 연동하는 방법은 아래 코드 두개를참고
      - [Gsheet_to_Redshift.py](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/Gsheet_to_Redshift.py) (이 파일의 시작부분 주석을 참고)
      - [plugins/gsheet.py](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/plugins/gsheet.py)

## Airflow 로그 파일 삭제하기

- Airflow 로그 위치
- 두 군데에 별도의 로그가 기록됨. 이를 [주기적으로 삭제](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/Cleanup_Log.py)하거나 백업 (s3) 필요

```bash
[logging]
# The folder where airflow should store its log files # This path must be absolute
base_log_folder = /var/lib/airflow/logs
[scheduler]
child_process_log_directory = /var/lib/airflow/logs/scheduler
```

## Airflow 메타데이터 백업하기

- Airflow 메타데이터의 주기적인 백업
   - 이 데이터베이스가 외부에 있다면 (특히 AWS RDS라면)
      - 거기에 바로 주기적인 백업 셋업
   - Airflow와 같은 서버에 메타 데이터 DB가 있다면 (예를 들어 PostgreSQL)
      - 그러면 DAG등을 이용해 [주기 백업](https://github.com/keeyong/data-engineering-batch11/blob/main/dags/Backup_Airflow_Data_to_S3.py) 실행 (S3로 저장)

## DAG간의 의존성 만들기

- Two ways to do this
   - Explicit trigger
      - TriggerDagOperator
      - DAG A triggers DAG B
         - A가 끝나면 B가 시작한다는 걸 A에서 아는 경우
   - Reactive trigger
      - ExternalTaskSensor
      - DAG B waits for a task of DAG A to complete in some fashion
         - A는 모르는데 B가 알아서 A 끝나면 시작하는 경우

### TriggerDagOperator

- How to create dependencies between DAGs?
- DAG A의 태스크를 TriggerDagRunOperator로 구현

```python
from airflow.operators.trigger_dagrun import TriggerDagRunOperator

	trigger_B = TriggerDagRunOperator( task_id="trigger_B", 
                                      trigger_dag_id="트리커하려는 DAG이름"
                                     )
```

```python
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
trigger_B = TriggerDagRunOperator(
  task_id="trigger_B",
  trigger_dag_id="트리커하려는 DAG이름",
  # DAG B에 넘기고 싶은 정보. DAG B에서는 Jinja 템플릿(dag_run.conf["path"])으로 접근 가능. 
  # DAG B PythonOperator(**context)에서라면 kwargs['dag_run'].conf.get('conf')
  conf={ 'path': '/opt/ml/conf' },
  # Jinja 템플릿을 통해 DAG A의 execution_date을 패스
  execution_date="{{ ds }}",
  reset_dag_run=True, # True일 경우 해당 날짜가 이미 실행되었더라는 다시 재실행 
  wait_for_completion=True # DAG B가 끝날 때까지 기다릴지 여부를 결정. 디폴트값은 False
  )
```

### ExternalTaskSensor

- 앞서와는 반대로 DAG B의 ExternalTaskSensor 태스크가 DAG A의 특정 태스크가 끝났는지 체크함
   - 먼저 동일한 schedule_interval을 사용
   - 이 경우 두 태스크들의 Execution Date이 동일해야함. 아니면 매칭이 안됨!

```python
from airflow.sensors.external_task import ExternalTaskSensor
waiting_for_end_of_dag_a = ExternalTaskSensor( 
  task_id='waiting_for_end_of_dag_a', 
  external_dag_id='DAG이름', 
  external_task_id='end',
  timeout=5*60,
  mode='reschedule' 
  )
```

- 만일 DAG A와 DAG B가 서로 다른 schedule interval을 갖는다면 ?
- 예를 들어 DAG A가 DAG B보다 5분 먼저 실행된다면?
   - execution_delta를 사용
   - execution_date_fn을 사용하면 조금더 복잡하게 컨트롤 가능
- 만일 두개의 DAG가 서로 다른 frequency를 갖고 있다면 이 경우 ExternalTaskSensor는 사용불가

```python
from airflow.sensors.external_task import ExternalTaskSensor
waiting_for_end_of_dag_a = ExternalTaskSensor( 
  task_id='waiting_for_end_of_dag_a', 
  external_dag_id='DAG이름', 
  external_task_id='end',
  timeout=5*60,
  mode='reschedule', 
  execution_delta=timedelta(minutes=5)
)
```

### BranchPythonOperator

- 상황에 따라 뒤에 실행되어야할 태스크를 동적으로 결정해주는 오퍼레이터
- TriggerDagOperator 앞에 이 오퍼레이터를 사용하는 경우도 있음

```python
from airflow.operators.python import BranchPythonOperator

# 상황에 따라 뒤에 실행되어야 하는 태스크를 리턴 def skip_or_cont_trigger():
if Variable.get("mode", "dev") == "dev": 
  return []
else:
  return ["trigger_b"]

  # "mode"라는 Variable의 값이 "dev"이면 trigger_b 태스크를 스킵 
branching = BranchPythonOperator(
  task_id='branching',
  python_callable=skip_or_cont_trigger, 
)
```

