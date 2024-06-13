---
title: "[Python] 일급함수, 클로저, 데코레이터"
date: 2020-10-07 11:31:00 +09:00
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

## 일급함수 특징

→ 함수형 프로그래밍을 가능하게 해주는 기본! 파이썬의 함수 특징을 배워보자.

1. 런타임 초기화
2. 변수 할당 가능
3. 함수를 다른 함수로 전달 가능
4. 함수를 결과로 반환 가능

```python
def factorial(n):
	'''Factorial Function -> n:int'''
	if n == 1:
		return 1
	return n * factorial(n-1) #재귀함수!

class A:
	pass

print(factorial(5)) 
print(type(factorial), type(A))
 #class는 안가지고 있고 함수만 가지고 있는 속성들! 클로저, 콜러블,..
print(set(sorted(dir(factorial)))-set(sorted(dir(A))))
```

- 변수 할당 가능한가?

```python
var_func = factorial

print(var_func)
print(var_func(10))
print(map(var_func, range(1,11))) #map 의 인수로 전달
print(list(map(var_func, range(1,6))))
```

- 함수를 결과로 반환 가능한가?

```python
# 함수 인수 전달 및 함수로 결과 반환 -> 고위 함수(Higher-order function)
# map, filter, reduce 등
print(list(map(var_func, filter(lambda x: x % 2, range(1,6))))) 
print([var_func(i) for i in range(1,6) if i % 2])
#홀수만 팩토리

# reduce()
from functools import reduce
from operator import add

print(reduce(add, range(1,11))) # 누적
print(sum(range(1,11)))

# 익명함수(lambda)
# 가급적 주석 작성
# 가급적 함수 사용
# 일반 함수 형태로 리팩토링 권장
print(reduce(lambda x, t: x + t, range(1,11)))
```

- callable: 호출 연산자 -> 메소드 형태로 호출 가능한지 확인, 가능시 true 반환
- partial: 인수 고정 -> 콜백 함수에 사용

```python
print(callable(str), callable(list), callable(var_func), callable(3.14))

from inspect import signature

sg = signature(var_func)

print(sg)
print(sg.parameters)

from operator import mul
from functools import partial

print(mul(10,10))

# 인수 고정
five = partial(mul, 5) #5*?? 뭘곱해야돼?

print(five(10) #5는 고정되어 있고, 10을 넣었다. 5*10 = 50 나옴

#고정 추가
six = partial(five, 6)

print(six()) #30 나옴. 이미 5 고정된 상태에서 6 추가했기 때문에.
print(six(10)) #2개 인수가 들어와야 되는데 3개 들어왔다고 함

print([five(i) for i in range(1,11)]) #5의 배수 구하기
print(list(map(five, range(1,11))))
```

## 클로저

### 클로저 기초

- 파이썬 변수 범위(Scope) : Global 선언

```python
def func_v1(a):
    print(a)
    print(b)

# 예외
# func_v1(10)

b = 20 #글로벌 변수

def func_v2(a):
    print(a)
    print(b)

func_v2(10)

# Ex3

c = 30
def func_v3(a):
    global c
    print(a)
    print(c)
    c = 40
    
func_v3(10) 
#만약 global c를 안하면 로컬 변수 c를 할당하기 전에 참조했다고 에러가 뜸
#함수 안에 c가 있기 때문에 c를 로컬 변수로 일단 인식했는데, c=40이 뒤에 있기 때문
print('>>>',c)
#global c로 할 경우 c=40으로 바뀜

from dis import dis
print(dis(func_v3))
```

- 클로저 사용 이유
   - 서버 프로그래밍 → 동시성(Concurrency)제어 → 메모리 공간에 여러 자원이 접근 →  교착상태(Dead Lock)
   - 메모리를 공유하지 않고 메시지 전달로 처리하기 위한 여러 언어들이 있음, 파이썬 말고도 Erlang
      - 함수가 끝났어도 스코프 안에 있는 변수의 값 기억, 각 진행 상태나 어디까지 했는지를 알고 있다가 동시에 처리할 때 관리 가능
   - 파이썬에서 클로저는 **공유하되 변경되지 않는(Immutable, Read Only) 구조**를 적극적으로 사용 → 함수형 프로그래밍
   - 클로저는 불변자료구조 및 atom, STM → 멀티스레드(Coroutine) 프로그래밍(병행성)에 강점

```python
a = 100

print(a + 100)
print(a + 1000) #누적합을 원하면 계속 이전 값을 저장해주면서 더해가야함

# 결과 누적(함수 사용)
print(sum(range(1,51)))

# 클래스 이용
class Averager():
    def __init__(self):
        self._series = []

    def __call__(self, v):
        self._series.append(v)
        print('inner >>> {} / {}'.format(self._series, len(self._series)))
        return sum(self._series) / len(self._series)

# 인스턴스 생성
averager_cls = Averager()

#한번 호출할 때마다 저장해놓고 누적합
#call 을 구현했기 때문에 클래스 인스턴스도 함수로 호출할 수 있음!
print(averager_cls(15)) 
print(averager_cls(35)) 
print(averager_cls(40))
```

이제 클래스가 아닌 클로저로 구현해보자.

## 클로저 사용 예제

- **외부에서 호출된 함수의 변수값, 상태(레퍼런스) 복사 후 저장 → 이후에 접근(액세스) 가능!**
- 아우터 펑션/이너펑션

```python
def closure_ex1():
    # Free variable
    series = []
    # 클로저 영역, 안에 함수가 더 있는 형태
    def averager(v):
        series.append(v)
        print('inner >>> {} / {}'.format(series, len(series)))
        return sum(series) / len(series)
    
    return averager #함수를 리턴!
		#단 실행하는 게 아님. 실행은 average()이거고.
		#근데 series라는 변수가 원래는 함수가 실행될 때 scope 상으로 없어져야 하지 않나?
	  #그러나 여기서 series는 내가 원하는 함수 바깥의 자유영역이고,
		#안없어진다!

avg_closure1 = closure_ex1() #실행하는 순간 함수 리턴
print(avg_closure1(15))
print(avg_closure1(35))
print(avg_closure1(40))

# function inspection
print(dir(avg_closure1))
print(dir(avg_closure1.__code__))
print(avg_closure1.__code__.co_freevars) #자유변수
print(dir(avg_closure1.__closure__[0]))
print(avg_closure1.__closure__[0].cell_contents) #15, 35,40
```

- 잘못된 클로저 사용

```python
def closure_ex2():
    cnt = 0
    total = 0

    def averager(v):
        cnt += 1 
        total += v
        return total / cnt
    
    return averager

avg_closure2 = closure_ex2()
print(avg_closer2(30)) #에러!!
#로컬변수cnt가 할당되기 전에 사용되었다고 함.
#averager 영역에서 cnt는 처음나오는건데 그냥 썼잖아?

# Nonlocal -> Free variable
def closure_ex3():
    cnt = 0
    total = 0
    
    def averager(v):
        nonlocal cnt, total #nonlocal이라고 해주기
        cnt += 1
        total += v
        return total / cnt
    
    return averager

avg_closure3 = closure_ex3()

print(avg_closure3(15))
print(avg_closure3(35))
print(avg_closure3(40))
```

함수 내에서 글로벌을 써서 값을 변경하는 건 좋은 코딩은 아니라고 생각함. (위의 `func_v2` ) 함수가 끝나면 그 변수는 끝나도록

클로저→ 데코레이터 관계

데코레이터를 알기위해 이해해야 하는것: 클로저, 함수를 일급인자로 사용하기, 언패킹, 가변함수 ...

## 데코레이터 (Decorator)

### **장점**

1. 중복 제거, 코드 간결, 공통 함수 작성
2. 로깅, 프레임워크, 유효성 체크..... -> 공통 기능

   ex. 예를들면 모든 함수가 실행될 때 실행시간을 알고싶다. 그럼 하나의 데코레이터를 만들어서 모든 함수에 붙여버리기.

3. 조합해서 사용 용이

### **단점**

1. 가독성 감소?
2. 특정 기능에 한정된 함수는 →  단일 함수로 작성하는 것이 유리
3. 디버깅 불편

```python
import time

def perf_clock(func):
	#프리영역이 없음, func을 받으므로 그거에 대해 인자를 갖고있을것
    def perf_clocked(*args):
        # 함수 시작 시간 
        st = time.perf_counter() 
        result = func(*args)
        # 함수 종료 시간 계산
        et = time.perf_counter() - st 
        # 실행 함수명
        name = func.__name__
        # 함수 매개변수 
        arg_str = ', '.join(repr(arg) for arg in args)
        # 결과 출력
        print('[%0.5fs] %s(%s) -> %r' % (et, name, arg_str, result)) 
        return result 
    return perf_clocked

@perf_clock
def time_func(seconds):
    time.sleep(seconds)

@perf_clock
def sum_func(*numbers):
    return sum(numbers)

# 데코레이터 미사용
none_deco1 = perf_clock(time_func)
none_deco2 = perf_clock(sum_func)

print(none_deco1, none_deco1.__code__.co_freevars)
print(none_deco2, none_deco2.__code__.co_freevars)

print('-' * 40, 'Called None Decorator -> time_func')
none_deco1(1.5)
print('-' * 40, 'Called None Decorator -> sum_func')
none_deco2(100, 150, 250, 300, 350)

# 데코레이터 사용
print('*' * 40, 'Called Decorator -> time_func')
time_func(1.5)
print('*' * 40, 'Called Decorator -> sum_func')
sum_func(100, 150, 250, 300, 350)
```

