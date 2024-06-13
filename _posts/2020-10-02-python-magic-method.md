---
title: "[Python] 매직 매소드"
date: 2020-10-02 11:33:00 +09:00
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

## 파이썬 핵심 구조

: 시퀀스(Sequence), 반복(Iterator), 함수(Function), 클래스(Class)

## 매직 메소드

메직매소드 = 스페셜 메소드 = 클래스 안에 정의할 수 있는 특별한(Buit-in) 메소드

`__init__` 나 `__str__`

`print(int)` 해보면 클래스임.

`print(dir(int))` 하면 모든 지정된 메소드 출력.

만약 더하는거라면 `__add__` 가 호출되는 것!

`print(n + 100)` 이랑 `print(n.__add__(100))` 은 같음

```python
###클래스 예제
class Fruit:
	def __init__(self,name,price):
		self._name = name
		self._price = price
	def __str__(self):
		return 'Fruit Class Info: {}, {}'.format(self._name, self._price)
	def __add__(self,x):
		return self._price + x_price
#이걸 꼭 정해진 대로 할 필요 없고 만약 80% 세일이다 그러면 그냥 0.8 곱하기 지정하면 됨
#유연하게 마음대로 구현하기!
	def __le__(self,x):
		print('Called >> __le__') #호출 진짜 되는지 확인
		if self._price <= x._price
			return True
		else:
			return False
	def __ge__(self,x):
		if self._price >= x._price
			return True
		else:
			return False

#인스턴스 생성
s1 = Fruit('Orange', 7500)
s2 = Fruit('Banana', 3000)

#매직메소드가 없다면 
print(s1._price + s2._price) #코드 양도 늘어나고 가독성도 떨어짐
#매직메소드로!
print(s1 + s2) #그냥 이렇게 가격을 얻을 수 있다.
print(s1 >= s2)
```

### 구현 예제 (벡터)

- args: 패킹을 해서 넘어온다고 가정하고 언패킹 해주기. x,y로 해줘도 되지만.
- 메소드 단위로 주석 달기
   - `print(Vector.__init__.__doc__)` 로 호출할 수 있다.
- `len(args)==0` 예외처리, 누가 `Vector()` 하면= 제대로 안들어오면 0으로

```python
# Special Method(Magic Method)
# 참조 : https://docs.python.org/3/reference/datamodel.html#special-method-names

class Vector(object):
    def __init__(self, *args): 
        '''Create a vector, example : v = Vector(5,10)'''
        if len(args) == 0: 
            self._x, self._y = 0, 0
        else:
            self._x, self._y = args

    def __repr__(self):
        '''Returns the vector infomations'''
        return 'Vector(%r, %r)' % (self._x, self._y)

    def __add__(self, other):
        '''Returns the vector addition of self and other'''
        return Vector(self._x + other._x, self._y + other._y)
    
    def __mul__(self, y):
        return Vector(self._x * y, self._y * y)

    def __bool__(self): #0,0인지 확인하는
        return bool(max(self._x, self._y))

# Vector 인스턴스 생성
v1 = Vector(5,7)
v2 = Vector(23, 35)
v3 = Vector()

# 매직메소드 출력
print(Vector.__init__.__doc__)
print(v1, v2, v3)
print(v1 + v2)
print(v1 * 3)
print(v2 * 10)
print(bool(v1), bool(v2))
print(bool(v3))

# 참고 : 파이썬 바이트 코드 실행
import dis
dis.dis(v2.__add__)
```

## 데이터 모델 설계

- 객체 = 파이썬의 데이터를 추상화
- 모든 객체는 id값으로 확인할 수 있고, type → value
- **네임드 튜플**
   - 파이썬 서버사이드 프로그래밍에서, `collections` 모듈 아래 있음. 딕셔너리 오브젝트처럼 키가 있고 특정 값이랑 맵핑이 되어 있어서 그 키로 접근이 가능함. 인덱스로도 접근 가능함.

```python
# 일반적인 튜플 사용 - 남이 봤을 땐 이게 뭔지 잘 모르겠음
pt1 = (1.0, 5.0)
pt2 = (2.5, 1.5)

#두점사이의 거리 구하기
from math import sqrt
l_leng1 = sqrt((pt2[0] - pt1[0]) ** 2 + (pt2[1] - pt1[1]) ** 2)
print(l_leng1)

# 네임드 튜플 사용
from collections import namedtuple
Point = namedtuple('Point', 'x y') #이름은 달라도 되고, x, y 값이 두 개 있을 거라는 뜻.

# 두 점 선언
pt3 = Point(1.0, 5.0)
pt4 = Point(2.5, 1.5)
l_leng2 = sqrt((pt4.x - pt3.x) ** 2 + (pt4.y - pt3.y) ** 2) #x,y키로 접근
print(l_leng2)
print(l_leng1 == l_leng2)

# 네임드 튜플 선언 방법
Point1 = namedtuple('Point', ['x', 'y'])
Point2 = namedtuple('Point', 'x, y')
Point3 = namedtuple('Point', 'x y')
Point4 = namedtuple('Point', 'x y x class', rename=True) # Default=False
#rename=True안하면 x는 중복이고 class는 예약어라서 안됨.

# 객체 생성
p1 = Point1(x=10, y=35)
p2 = Point2(20, 40)
p3 = Point3(45, y=20)
p4 = Point4(10, 20, 30, 40) #4개를 받아야 함.
temp_dict = {'x': 75, 'y': 55}
p5 = Point3(**temp_dict)

# 출력
print(p1, p2, p3, p4, p5)

print(p1[0] + p2[1]) # Index Error 주의
print(p1.x + p2.y) # 클래스 변수 접근 방식

# Unpacking
x, y = p3
print(x+y)

# Rename 테스트
print(p4) # 중복, 예약어라서 _2, _3로 자기 마음대로 만들어버렸음.

# 네임드 튜플 메소드
temp = [52, 38] 

# _make() : 새로운 객체 생성
p4 = Point1._make(temp)

# _fields : 필드 네임 확인
print(p1._fields, p2._fields, p3._fields)

# _asdict() : OrderedDict 반환
print(p1._asdict(), p4._asdict())
```

**실습**:

```python
# 반20명 , 4개의 반-> (A,B,C,D) 번호

# 네임드 튜플 선언
Classes = namedtuple('Classes', ['rank', 'number'])

# 그룹 리스트 선언
numbers = [str(n) for n in range(1, 21)]
ranks = 'A B C D'.split()

# List Comprehension
students = [Classes(rank, number) for rank in ranks for number in numbers]
#A1, A2, A3, ... D20까지 80명의 학생들을 만들었다!

print(len(students))
print(students)

# 추천 (가독성) - 결과는 똑같다.
students2 = [Classes(rank, number) 
                    for rank in 'A B C D'.split() 
                        for number in [str(n) 
                            for n in range(1,21)]]
```

