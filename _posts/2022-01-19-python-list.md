---
title: "[Python] 고급 리스트 기능"
date: 2022-01-19 11:31:00 +09:00
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

## 리스트 생성 및 활용

- 생성: 대입 연산자를 통해 가능, 빈 리스트 생성 후 `append`로 하나씩 추가하는 것도 가능 / `remove` 메서드로 삭제 ($*$ 그 값이 존재하지 않으면 ValueError)
   - 주의: `remove`는 여러 개의 값이 존재할 경우 가장 첫번째 순서만 지움
- 변수는 하나의 데이터 타입만 쭉 사용하는 것이 좋고, 데이터 타입을 연상시키는 이름을 사용한다 ex. `int_list`
- 리스트 안에 여러 개의 데이터 타입이 들어있을 수 있으나, 파이썬 3.0에서는 문자와 숫자가 섞여 있으면 sort 메서드를 이용할 수 없음 (정수와 실수는 가능)
- 리스트 복사 vs 리스트 변수 복사
   - 이렇게 하면 a_list와 동일한 데이터를 만드는 것이 아니라 a_list가 참조하고 있는 객체를 위한 새로운 별칭인 b_list를 만드는 것임

```python
a_list = [2,5,10]
b_list = a_list
```

  - 따라서 a_list를 변경하면 b_list도 변경되고 반대도 마찬가지
   - 만약 별도로 복사하고 싶다면 항목 간(member-by-member) 복사를 해야 하며 가장 간단한 방법은 슬라이싱

```python
b_list = a_list[:] #전체 값을 슬라이싱 해 새롭게 b_list를 만들었음
```

## 인덱스

- 파이썬은 0을 포함한 양수/음수 인덱스를 제공
   - 양수 인덱스는 0부터 시작! 리스트 항목 N개면 0 ~ N-1까지
   - 음수 인덱스의 경우 마지막으로부터의 거리, -1이 가장 마지막 항목이므로 -1 ~ N
- 리스트는 변경 가능하므로 인덱스를 통해 객체를 수정할 수 있다(문자열과 달리) ex. `a_list[1]=55`
- 인덱스 범위를 벗어나면 무조건 IndexError 발생
- 인덱스 순회하기
   - range는 정말 필요한 곳을 제외하고는 사용하지 않는 것이 파이써닉한 방법

```python
for s in a_list:
	print(s)

for i in range(len(a_list)): #비효율적, 느린 인덱스 사용
	print(s)
```

   - 각 항목을 숫자와 함께 출력하고 싶다면? `enumerate(이터러블, 시작=0)` 를 사용하자.
      - 이터러블(리스트)를 인수로 받아서 튜플이 나열된 또다른 이터러블을 생성함
         - 튜플: (숫자, 항목)
         - 이 숫자는 시작으로 지정해준 값부터 1씩 증가하는 정수

```
#['Tom', 'Dick', 'Jane']
# enumerate의 결과: (1,'Tom'), (2,'Dick'), (3,'Jane')
```
```python
for item_num, name_str in enumerate(a_list, 1):
	print(item_num, '.', name_str, sep(''))
```


## 슬라이싱

| **list[a:b]**  | **a ~ b-1까지**                      |
| -------------- | ---------------------------------- |
| list[:b]       | 처음 ~ b-1까지                         |
| list[a:]       | a ~ 끝까지                            |
| list[:]        | 전체                                 |
| list[a:b:step] | a ~ b-1까지 step만큼 건너뒤면서(기본 step은 1) |

- 음수 인덱스로도 슬라이싱 가능(종료 값은 포함하지 않는다는 것은 동일)
- step은 음수일 수도 있음 (0은 안됨) ex. 리스트 순서 거꾸로 뒤집기: `a_list[::-1]`
- 슬라이싱을 통한 값 대입
   - 슬라이싱된 부분을 삭제하고, 그 부분에 새로운 값(무조건 리스트/컬렉션)을 넣음 `a_list[1:4] = [4,5]` *스텝이 명시된다면 슬라이싱 범위와 넣는 값이 길이가 동일해야 함. 아니면 달라도 됨
   - 슬라이싱된 길이가 0이라면 아무것도 삭제하지 않고 그냥 그 자리에 새로운 값을 넣음

## 리스트 연산자

| **a + b**               | **cocatenation, 두 리스트의 항목을 모두 포함하는 새로운 리스트 생성** |
| ----------------------- | ----------------------------------------------- |
| a*n  또는 n*a             | 리스트의 항목을 n번 반복한 리스트 생성                          |
| a = b                   | a 에 b가 참조하는 객체를 대입, a는 b의 별칭이 됨                 |
| a = b[:]                | b를 항목 전체 복사하여 a에 신규 리스트 대입                      |
| a == b / a!=b           | 내용이 같으면/다르면 True                                |
| sth in a / sth not in a | 리스트 내에 항목이 존재하면/존재하지 않으면 True                   |
| a < b, a<=b             | 항목 간 미만/이하/초과/이상 비교                             |
| *a                      | 리스트를 언팩하여 나열한 독립적인 각각의 항목들로 대체                  |

## 얕은 복사 vs 깊은 복사

- 얕은 복사
   - 위에서 다룬 전체 슬라이싱해서 복사하는 방식의 경우, 그 리스트 내의 리스트가 있다면 그건 같이 변경됨 (그 내부 리스트의 참조를 복사했기 때문에 결국 같은 걸 참조하고 있는 것)
- 깊은 복사

```python
a_list = [1,2,[5,10]]

import copy
b_list = copy.deepcopy(a_list)
```

   - 위처럼 `deepcopy`를 사용하게 되면 내부 리스트까지도 분리된 복사본으로 복제하게 됨 👍

## 리스트 함수

- `len`, `max`, `min`, `reversed`, `sorted`, `sum`
- 주의점
   - min/max의 경우 모든 항목이 서로 비교 가능해야만 작동함 (모두 숫자이거나 모두 문자) *문자인 경우 문자 코드 순서
   - reversed의 경우 리스트나 튜플을 인풋으로 받아 역순을 돌려주지만 리스트나 튜플이 아닌 이터러블을 돌려줌 → 추가로 리스트나 튜플로 다시 변환해야 함 ex. `tuple(reversed(test_tuple))`

## 리스트 메서드

- 리스트 수정하기
   - `.append(값)`
   - `.clear()` : 모든 항목 제거
   - `.extend(이터러블)` :
      - 추가하는 건 `.append()` 랑 똑같지만, 컬렉션이나 이터러블로 여러 항목을 추가할 수 있음

```python
a_list.append(4)
a_list.extend([4]) #똑같음
```

   - `.insert(인덱스, 값)` : 지정된 위치에 값 삽입
   - `.remove(값)`: 값의 첫번째 인스턴스 제거 (*없으면 ValueError)
- 내용 정보 가져오기
   - `.count(값)` : 인스턴스 개수 반환
   - `.index(값,시작,종료)` : 값의 처음으로 나타내는 인덱스 반환
      - 시작, 종료 인수는 선택이며 입력하게 되면 해당 범위 내에서만 찾음
   - `.pop(인덱스)` : 인덱스 값 반환 및 제거; 인덱스 기본값은 마지막 인덱스
- 재편성하기
   - `.sort(key=None, reverse=False)`
      - key 인수는 함수(callable)을 받음, 이 함수는 각 값을 인수로 하여 연산 처리를 한 후 값을 반환하는데 이 값을 정렬에서 사용하는 기준으로 씀

```python
#예를 들어 대소문자를 구분하지 않고 정렬하고 싶다면?
def ignore_case(s):
	return s.casefold()
a_list = ['john', 'paul', 'George', 'brian', 'Ringo']
a_list.sort(key=ignore_case)
```

   - `.reverse()` : 현재 순서를 뒤집음(정렬은 하지 않음)
   - 두 메서드 모두 리스트의 모든 항목이 서로 비교할 수 있어야 한다(즉 모두 문자열이거나 모두 숫자여야 한다)

## reduce 함수

- 리스트의 모든 항목을 한번에 처리할 수 있는 함수를 직접 작성하여 사용할 수 있음

```python
import functools
def mul_func(a, b):
	return a*b
fac_num = functools.reduce(mul_func, my_list)
#my_list에 있는 숫자들을 모두 곱한 값을 돌려줌
```

- 첫번째, 두번째 항목을 함수에 넣고 반환되는 값과 세번째 항목을 또 함수에 넣고 ...(반복)
- 이 함수는 2개의 인수를 가져야 하며 결과값을 반환해야 함

## 람다 함수

- `lambda 인수들: 반환값`
- 일회적으로 한번 사용하기 위해 만드는 함수
   - ex. `add_func = lambda x,y: x+y`
- reduce 함수와 사용할 때
   - ex. `fac_num = functools.reduce(lambda x, y: x*y , [1,2,3,4,5])`

## 리스트 함축(comprehension)

- 모든 항목을 대상으로 항목 간 복사를 수행함
- `b_list = a_list[:]` 이렇게 할 수도 있지만, `b_list = [i for i in a_list]` 이게 리스트 함축
- 중첩 for 문도 가능
   - ex. `[i*j for i in range(3) for j in range(3)]`
- if 조건문도 가능
   - ex. `[i for in in a_list if i>0]`

## 딕셔너리와 세트의 함축

- 세트 함축
   - 리스트랑 똑같음
      - ex. `{i*i for i in a_list if i>0}`
- 딕셔너리 함축
   - 항상 `키:값` 사용
      - 다음과 같이 튜플로 이루어진 리스트가 있을 때

         `val_list = [('pi', 3.14), ('phi', 1.618)]`

      - 이렇게 딕셔너리로 변환

         `my_dict = { i[0]: i[1] for i in val_list }`

## 다차원 리스트

- 리스트 내의 항목이 리스트일 수 있음
- 행렬을 표현할 때 주로 사용
   - 불균형 행렬도 가능
   - 큰 행렬 만들기

```python
big_list = [0] *100
mat = [[0]*100] *200 #200개의 별도 행을 만드는 게 아니고 같은 행의 참조를 200개 만드는 것임

#200개의 행을 추가하려면
mat = []
for i in range(200):
	mat.append([0]*100)

#list comprehension way
mat = [[0]*100 for i in range(200)
```

