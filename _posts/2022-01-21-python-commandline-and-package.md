---
title: "[Python] 커맨드 라인과 패키지"
date: 2022-01-21 11:35:00 +09:00
categories:
  - Notes
tags:
  - python
math: true
toc: true
comments: true
---
> [파이썬 스킬 업](https://www.gilbut.co.kr/book/view?bookcode=BN003100)을 보고 정리한 내용입니다.
{: .prompt-info }

## 커맨드 라인에서 파이썬 실행하기

- IDLE이나 스크립트보다 빠르게 실행할 수 있음
- 맥의 터미널에서
   - `python3 test.py`

## doc string 작성하고 사용하기

- 주석을 작성하거나 무료 온라인 도움말을 가져올 때 활용할 수 있음
- 예를 들어

```python
def quad(a,b,c):
	'''Qudratic formla function

	This Function is...
	...
	'''
	determin =
	## ...

	return x1,x2
```

- 이런식으로 작성하면 help(quad) 시 작성해둔 도움말을 볼 수 있다.
- 규칙
   - 함수 이름 선언 후 바로 작성해야 한다.
   - 3개-따옴표 기능을 적용한 리터럴 문자열이여야 한다.
   - doc string의 들여쓰기는 함수 도입부의 ‘첫번째 레벨’들여쓰기와 동일해야 한다.
   - doc string의 하위줄들은 문자열이 리터럴 문자열이기 때문에 들여쓰기를 원하는대로 할 수 있다.
   - 스타일 가이드라인: 함수 선언 후 함수의 간략한 요약을 넣어서 1줄을 띄고 상세한 설명을 넣는 것을 권장한다.

## 패키지

- 패키지: 서비스를 수행하기 위해 필수적으로 필요한 객체와 함수를 담고 있는 소프트웨어 라이브러리
   - 두가지가 있음
      - 파이썬 자체에 기본적으로 포함된 패키지: math, random, sys, os, time, datetime, os.path
      - 인터넷에서 내려받아야 하는 패키지
- 패키지 불러오기
   - `import 패키지_이름`
   - `import 패키지_이름 as 신규_이름`
   - `from 패키지_이름 import 심벌_이름`
      - 패키지 내의 특정 모듈만 불러옴
   - `from 패키지_이름 import *`
      - 패키지 내 전체 모듈을 불러옴

## 일급 객체인 함수

- 파이썬 함수를 일급(first-class) 객체로 다루면 디버깅, 프로파일링, 관련 작업 수행 시 유용. 이 방법으로 런타임 시 함수 관련 정보를 확보하는 장점
- 예를 들어 다음과 같이 avg 함수를 정의할 경우

```python
def avg(a_list):
	'''리스트 항목의 평균값을 반환한다'''
	x = (sum(a_list) / len(a_list))
	print('The avearge is:', x)
	return x
```

- avg는 이 함수를 참조하는 심벌릭 이름이며 파이썬 언어 안에서 호출될 수 있는 콜러블이기도 함
- avg 타입이 function인 것을 검증하는 것과 같이 avg와 함께 여러 작업을 수행할 수 있음
- `type(avg)` → `<class 'function'>`
- 서로 다른 함수들을 모두 심벌릭 이름 avg로 지정할 수 있음

```python
def new_func(a_list)
	return (sum(a_list) / len(a_list))

old_avg = avg
avg = new_func
```

- 메타함수라고 부를 수 있는 다음 함수는 인수로 전달받은 다른 함수의 정보를 출력

```python
def func_info(func):
	print('Function name:', func.__name__)
	print('Function documentation:')
	help(func)
```

## 가변 길이 인수 리스트

### `*args` 리스트

- 모든 길이의 인수 리스트에 접근하는 데 사용

```python
def my_var_func(*args):
	print('The number of args is', len(args))
	for items in args:
		print(item)
```

- 호출할 때마다 다른 개수의 인수를 입력하여 호출할 수 있음
- *args 에 포함되지 않는 추가 인수도 설정 가능하며, 앞에 위치해야 함

```python
def avg(units, *args):
	print(sum(args)/len(args), units)
```

### **kwargs 리스트

- 이름을 지정할 수 있음
- 키-값 쌍으로 구성된 딕셔너리 형태의 인수
- 무명 인수와 명명 인수가 같이 존재할 수 있음

```python
def pr_vals(*args, **kwargs):
	for i in args:
		print(i)
	for k in kwargs:
		print(k, ':', kwargs[k])

pr_vals(1,2,3, a=100, b=200)
```

## 데코레이터와 함수 프로파일러

- 프로그램을 개선할 때 함수 실행 시간을 측정하는 것은 무척 유용함
- 파이썬 함수는 일급 클래스 객체이기 때문에 데코레이터 함수는 코드의 실행 속도를 측정하거나 다른 정보를 제공할 수 있음
- 데코레이션의 핵심 개념은 기존 함수가 그대로 동작하면서 추가 문장이 더 실행되는 래퍼 함수(wrapper function)라는 것

```python
import time

def make_timer(func):
	def wrapper():
		t1 = time.time()
		ret_val = func()
		t2 = time.time()
		print('소요 시간:', t2-t1)
		return ret_val
	return wrapper
```

   - 인수로 입력되는 함수 F1에 대해 이 함수에 우리가 원하는 문장을 추가(decorated) 하고 싶다.
   - 래퍼 함수는 우리가 원하는 문장을 추가한 결과다. 기존 함수가 실행되면서 걸린 시간을 초단위로 반환하는 문장을 추가했다.
   - 데코레이터는 래퍼 함수를 생성하여 반환하는 작업을 수행한다.
   - 함수 이름을 재대입하면서 기존 버전이 랩핑된 버전으로 교체된다.
   - 문제는 기존 함수 func의 인수가 없다. func의 인수가 있다면 래퍼 함수는 함수 func을 제대로 호출할 수 없게 된다.
   - 해결책은 *args와 **kwargs를 사용하는 것.
   - 제대로된 예시를 보자.

```python
import time

def make_timer(func):
	def wrapper(*args, **kwargs):
		t1 = time.time()
		ret_val = func(*args, **kwargs)
		t2 = time.time()
		print('소요 시간:', t2-t1)
		return ret_val
	return wrapper

def count_nums(n):
	for i in range(n):
		for j in range(1000):
			pass

count_nums = make_timer(count_nums)

count_nums(330000)
# 실행 시간이 출력된다.

# 함수 이름을 재대입하는 것을 다음과같이 자동화할 수 있다
@make_timer
def count_nums(n):
	for i in range(n):
		for j in range(1000):
			pass
```

## 제너레이터

- 제너레이터란, 시퀀스를 다룰 때 한번에 한 항목씩 처리할 수 있게 해주는 방법
- 이터레이터: 한번에 하나씩 값을 생산하여 결국 나열된 값의 묶음을 제공하는 객체
   - 모든 리스트는 이터레이터
   - 모든 이터레이터는 리스트가 아니지만, 리스트로 변환하여 출력할 수 있음
   - 이터레이터는 상태 정보를 가지고 있고 시퀀스의 끝에 도달하면 종료됨
- 제너레이터는 이터레이터를 만드는 가장 쉬운 방법이지만, 제너레이터 함수 그 자체가 이터레이터는 아님
- 제너레이터의 기본 생성 절차
   - 제너레이터 함수를 생성한다. (yield 문장 사용)
   - 위에서 만든 함수를 호출하여 이터레이터 객체를 확보한다.
   - next 함수가 반환한 yield 값이 이터레이터이고, 상태정보를 지니고 있으며, 필요시 재설정할 수 있다.

