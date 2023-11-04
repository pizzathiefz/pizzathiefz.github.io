---
title: "[Python] 시퀀스"
date: 2020-10-03 11:33:00 +09:00
categories:
  - Notes
tags:
  - python
math: true
toc: true
comments: true
---
> [ 우리를 위한 프로그래밍 : 파이썬 중급 (Inflearn Original)](https://www.inflearn.com/course/프로그래밍-파이썬-중급-인프런-오리지널/dashboard)을 듣고 정리한  내용입니다.
{: .prompt-info }

데이터타입 구분하기

- 컨테이너(서로 다른 자료형을 담을 수 있음): `list`, `tuple`, `collections.deque`
- 플랫(단일 자료형만 담을 수 있음): `str` , `bytes`, `bytearray`,
- 가변: `list`, `bytearray`, `array.array`, `memoryview`, `deque`
- 불변: `tuple` , `str` , `bytes`

## 리스트 및 튜플 고급

### **지능형 리스트(Comprehending Lists)**

```python
chars = '+_)(*$@%$@'
code_list1 = []
for s in chars:
	#유니코드 리스트
	code_list1.append(ord(s))

#Comprehending List
code_list2 = [ord(s) for s in chars]
#Comprehending List +Map, filter
code_list3 = [ord(s) for s in chars if ord(s) > 40]
code_list4 = list(filter(lambda x : x>40, map(ord, chars)))

#다시 문자
print([chr(s) for s in code_list3])
```

- `append` 에 비해 comprehension으로 쓰는게 아주조금 속도가 빠르단 말이 있음. 근데 큰 차이는 없다고 함.
- `filter` 를 굳이 쓰자면 조금 고급인 함수를 써야할때?

### **Generator 생성**

제너레이터란? 로컬 상태를 유지, 다음에 쓸 값의 위치를 알고 있음. 작은 메모리로 연속되는 데이터 만들어낼 수 있음. 한번에 한개의 항목 생성(메모리 유지X)

`__iter__` 가 들어가 있으면 반복 가능

```python
import array

tuple_g = (ord(s) for s in chars)
#print(tuple_g) 하면 generator 나옴. 
#아직 값을 찍어내지 않았고, 반환할 준비만 한 것임.
print(next(tuple_g)) #첫번째인 43 나옴, 계속 다음값 

array_g = array.array('I', (ord(s) for s in chars))
#print(array_g) 하면 그대로 어레이 형태 출력
print(array_g.tolist) #리스트로 반환
```

array의 장점: list보다 low-level, 수치연산에 최적화

**제너레이터 예제: 각 A ~ D 반 학생 20명**

```python
print(('%s' % c + str(n) for c in ['A', 'B', 'C', 'D'] for n in range(1,21)))
for s in ('%s' % c + str(n) for c in ['A', 'B', 'C', 'D'] for n in range(1,21)):
	print s
```

### **리스트 주의할 점**

- 깊은 복사
- 얕은 복사

```python
#리스트 주의
marks1 = [['~'] * 3 for n in range(4)]
#['~', '~', '~']가 4개 들어있는 리스트 출력됨
marks2 = [['~']*3]*4 #이것도 똑같다.
#그런데?
#수정
marks1[0][1] = 'X'
#[['~', 'X', '~'], ['~', '~', '~'], ['~', '~', '~'], ['~', '~', '~']]
marks2[0][1] ='X' #이렇게 하면 다 바뀌어버림!
#[['~', 'X', '~'], ['~', 'X', '~'], ['~', 'X', '~'], ['~', 'X', '~']]
print([id(i) for i in marks1])
print([id(i) for i in marks2])
```

첫번째 복사는 id값이 4개 다 다르게 되고, 두번째 복사는 id값이 다 똑같아져버림

## Tuple Advanced

Unpacking

- `b,a = a, b` 이런식으로 지정 가능
- `print(divmod(*(100,9)))` 튜플로 넣으려면 이렇게 풀어서 넣어줘야 함. 아니며는 2개 인자 받아야 되는데 왜 1개 주냐고 할것.
- `print(*(divmod(100,9)))` 결과값을 언패킹하는 것도 가능.
- `x, y, *rest = range(10)` 이러면 rest에는 [2,3,4,5,6,7,8,9] 가 할당. `range(2)` 였으면 빈 리스트 할당

### 가변형과 불변형

```python
l = (15,20,25)
m = [15,20,25]
#print(l,id(l))
l = l *2
m = m*2
#곱한다음에 재할당 -> id값이 달라짐
l *= 2
m *= 2
#튜플(불변형)은 계속 id가 바뀜. 이경우 리스트는 id가 안바뀜!
```

만약 튜플에 담아놓고 계속 연산을 하면서 할당을 할 경우 메모리에 계속 새로운 id로 할당.

만약 반복되는 많은 연산이 필요하다면 리스트를 쓰자.

### sort v.s. sorted

- sort: 정렬 후 객체 직접 변경 → 원본이 직접 변경
- 옵션
   - `reverse= True` 역순
   - `key = Len`  길이순
   - `key = lambda x: x[-1]` 끝글자 기준 *이렇게 내가 만든 함수를 사용할수도 있음!
   - key-str.Lower, key=func..

```python
f_list = ['orange', 'apple', 'mango', 'lemon', 'strawberry', 'coconut']
print('sorted - ', sorted(f_list)) #원본 그대로
print(f_list)
```

- sorted: 정렬 후 새로운 객체 반환 (원본은 그대로), 반환값 없음

```python
print('sort - ', f_list.sort(), f_list) #None 반환하고 원본 수정됨
```

**List v.s. Array 적합한 사용법**

- 리스트 : 융통성, 다양한 자료형, 범용적 사용
- Array : 숫자 기반일때 *좋은점: 리스트와 거의 호환된다는 것

## 해시 테이블

- 해시테이블이란 key에 value를 저장하는 구조
- 적은 리소스로 많은 데이터를 효율적으로 정리하기 위한 구조
- 파이썬 자체가 강력한 해시테이블 엔진으로 만들어져있다고 보면 됨 (**dir** 이런거)
- key는 당연히 중복으로 하면 안됨 - 인터뷰 단골질문: 해시값 중복됐을 때 어떻게 처리하는가?
- 해시를 쓰는이유 - 키값의 연산 결과에 따라 직접 접근이 가능한 구조

```python
#Dict 구조
print(__builtins__.__dict__)
#Hash 값 확인
t1 = (10,20,(30,40,50))
t2 = (10,20, [30,40,50])
print(hash(t1)) #튜블은 불변이고, 해쉬는 고유하다. 이 값으로 이 t1을 찾을 수 있다.
print(hash(t2)) #리스트는 mutable이라서 unhashable 이다!
```

## Dict 생성 고급 예제, Setdefault 사용법

튜플 → 딕셔너리, 키를 하나로 통합하면서 만들기!

```python
source = (('k1', 'v1'),
					('k1', 'v2'),
					('k2', 'v3'),
					('k2', 'v4'),
					('k2', 'v5'))
```

k1, k2는 중복인데 키는 유일해야 하는데 어떻게 딕셔너리로 만들까?

```python
new_dict1 = {}
new_dict2 = {}

#Setdefault 안사용
for k, v in source:
	if k in new_dict1:
		new_dict1[k].append(v)
	else:
		new_dict1[k] = [v]
print(new_dict)
#{'k1':['v1', 'v2'], 'k2':['v3','v4','v5']}

#Setdefault 사용
for k, v in source:
	new_dict2.setdefault(k, []).append(v)
#리스트로 담을거고 키는 k고 값은 v야.

#주의사항
new_dict3 = {k:v for k, v in source} 
#이런식으로 만들면 키가 중복되니까 나중 값만 나와버림
```

해시테이블 Dict와 Set의 경우 Key 중복 허용X

## Immutable Dict

- 수정이 안 되는 읽기 전용 딕셔너리 만들기

```python
from types import MappingProxyType
d = {'k1': 'v1'}
d_frozen = MappingProxyType(d)
```

set 선언

```python
s1 = {'Apple', 'Orange', 'Apple', 'Orange', 'Kiwi'}
#중복 허용하지 않으니까 apple, orange, kiwi만 들어감
s2 =set(['Apple', 'Orange', 'Apple', 'Orange', 'Kiwi']) 
s3 = {3}
s4= set() #Not{}
s5 = frozenset({'Apple', 'Orange', 'Apple', 'Orange', 'Kiwi'}) #읽기전용

#추가가능
s1.add('Melon')
s5.add('Melon') #frozenset은 안됨!
```

## Set 선언 최적화

```python
from dis import dis
#파이썬은 바이트코드를 실행
#dis 사용하면 바이트코드가 어떻게 실행되는지 과정을 볼수있음
#set이라는 함수를 사용하는 게 빠를까 {}로 하는게 빠를까?!
print('------')
print(dis('{10}')) #과정이 3개
rpint('------')
print(dis('set([10]')) #뭔진모르겠지ㅏ만 과정이 더 여러개네
#set을 안쓰는게 미세하게나마 더 빠를거같다!
```

### 지능형 Set (Comprehending Set)

```python
from unicodedata import name
print({name(chr(i), '') for i in range(0,256)})
```

