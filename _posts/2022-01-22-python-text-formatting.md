---
title: "[Python] 정밀한 텍스트 포맷팅"
date: 2022-01-22 11:35:00 +09:00
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

## 백분율 기호 연산자(%)를 사용한 포매팅

- 다음과 같이 2가지로 사용
   - `포맷_문자열 % 값`
      - `print('n is %d' % n)`
   - `포맷_문자열 % (여러_값들)`
      - `print('n is %d and m is %d' % (n,m))`

### 포맷 지시자

- 각종 포맷들을 다음과 같이 지정
   - `%d` : 10진수
   - `%i` : 정수
   - `%s` : 입력 값의 표준 문자열 표현
   - `%r` : %s와 동일할 때가 많지만 객체가 파이썬 코드에게 보이는 그대로 출력함 (`'Bob'`)
   - `%x` : 16진수 (%X 도 동일하지만 A-F를 대문자로)
   - `%o` : 8진수
   - `%u` : 무부호 정수
   - `%f` : 고정소수점 포맷으로 출력하는 부동소수점 숫자 (%F 도 동일)
   - `%e` : 지수 기호(e)를 출력하는 부동소수점 숫자
   - `%g:` 가장 짧은 기준 표현(canonical representation)을 사용한 부동소수점
   - `%%` : 리터럴 백분율 기호

### 너비와 정밀도 표현

- 다음 포맷 모두 허용
   - `%c`
   - `%너비c`
   - `%너비.정밀도c`
   - `%.정밀도c`
   - 기본적으로 너비보다 길이가 짧으면 왼쪽 자리맞춤을 하지만 %-너비c 이렇게 마이너스가 붙으면 오른쪽 자리맞춤을 함
   - 정밀도는 빈칸을 0으로 채우는데 정수의 경우 25의 정밀도를 5로 지정하면 00025 이런 식으로, 3.14의 정밀도를 5로 지정하면 3.14000 이런 식으로 부동소수점 숫자 표현에 사용
      - 정밀도 설정이 소수점 길이보다 짧게 되면 상황에 따라 반올림/버림을 함

### 변수-너비 출력 필드

- 고정 너비로 출력하고 싶을 때 그걸 어떻게 변수로 입력할까?
   - 별표 기호를 붙인다 + 추가 인수를 튜플 맨 앞에 집어넣는다.
      - `'Here is a number: %*d' % (3,6)`
         - 여기서 3이 내가 원하는 넓이
      - `'Here is a number:   6'`
   - 별표 기호는 여러개 사용할 수 있다. 그러면 추가 인수도 순서대로 여러개 넣어줘야 함.
      - `'Item 1: %*s, Item 2: %*s' % (8, 'Bob', 8, Suzanne')`
   - 사실 이건 별표가 저 위 너비와 정밀도 표현의 너비 값을 대체하기 때문임
   - 마찬가지로 정밀도 표현도 할 수 있는데 다음 코드는 `%8.3f`인 것과 동일함
      - `'%*.*f' % (8, 3, 3.141592)`

## format 메서드

### 전역 format 함수

- 문자열 클래스의 format 메서드는 문자열을 처리할 때 입력받은 데이터 객체와 함께 포맷 지시자를 분석하며 각각의 개별적 필드는 전역 format 함수를 호출하여 분석을 수행
   - format 함수는 데이터 객체 클래스의 `__format__` 메서드를 호출함
- `format(데이터, 사양)`
   - 데이터를 확보하여 사양에 맞는 포맷을 적용한 문자열을 반환함
   - 사양 문법: `[너비][,][.정밀도][타입_문자]`
      - `[너비]` 특정 길이의 출력 필드에 데이터를 문자로 표현
      - `[,]` 숫자인 경우 천 단위 위치 구분자로 쉼표 기호를 넣을지
      - `[정밀도]` 는 정수와 사용할 수 없고 f인 경우 소수점 오른쪽에 출력할 숫자의 고정된 자리수, 숫자가 아닌 경우 문자열 데이터의 최대 길이를 의미함

### format 메서드 소개

- format 함수의 모든 기능을 사용하지만 여러 출력 필드를 다룰 수 있어 훨씬 유연함
- `포맷이 지시된 문자열.format(인수들)`
   - 특별한 포맷을 지정하지 않는다면 단순하게 중괄호 기호 쌍을 각 항목에 사용할 수 있음
   - 인수들의 값은 상수일 수도 있고 변수에 의해 제공받을 수 있음

### 위치로 순서 정하기 (이름 혹은 색인)

- 정수 상수를 위치 필드에 사용하여 역순으로 인수를 출력할 수 있음
   - `'The items are {2}, {1}, {0}.'.format(10,20,30)`
   - 반복도 가능
- 리스트를 색인으로 사용

```python
a_list = [100,200,300]
print('{0[1]:}, {0[2]:}'.format(a_list))
print('{a[1]:}, {a[2]:}'.format(a=a_list))
```

### repr v.s. 문자열 변환

- repr 변환: 데이터 객체를 코드에서 표현하는 기준 방식으로 해석
- `test_str = 'Here is a \n newline! '`
   - 바로 출력하면 \n에서 개행이 되지만 repr를 적용하면 그대로 (따옴표까지 포함) 출력

### format 함수와 메서드의 ‘사양’ 필드

- 출력-필드 너비
- 텍스트 조정: 채우기와 자리 맞춤 문자
- 기호 문자
- 0으로 시작하는 문자
- 천 단위 위치 구분자
- 정밀도 제어
- 문자열에서 사용한 ‘정밀도(잘라내기)’
- ‘타입’ 지시자
- 이진수 출력하기
- 8진수와 16진수 출력하기
- 백분율 출력하기
- 이진수 예시


