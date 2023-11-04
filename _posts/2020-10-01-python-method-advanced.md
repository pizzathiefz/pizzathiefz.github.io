---
title: "[Python] 메소드 ADVANCED"
date: 2020-10-01 11:33:00 +09:00
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

## 객체지향 프로그래밍의 장점

- 코드의 재사용, 코드 중복 방지, 유지보수 쉬움
- 클래스 중심 = 데이터 중심, 객체로 관리 → 대형 프로젝트에 적합

↔ **절차지향 프로그래밍**(함수중심); 데이터가 방대해지면 복잡, 협업/개선이 어려움

## 클래스를 쓰기 전에 다른 방식과 비교해보자.

- 일반적 코딩: 차가 많아지거나 변동이 생기면 하나하나 바꿔줘야 함. 불-편

```python
car_company_1 = 'Ferrari'
car_detail_1 = [
    {'color' : 'White'},
    {'horsepower': 400},
    {'price': 8000}
]
```

- 리스트 구조: 인덱스로 접근해야 함. 삭제하려면 추가 함수 필요

```python
car_company_list = ['Ferrari', 'Bmw', 'Audi']
car_detail_list = [
    {'color' : 'White', 'horsepower': 400, 'price': 8000},
    {'color' : 'Black', 'horsepower': 270, 'price': 5000},
    {'color' : 'Silver', 'horsepower': 300, 'price': 6000}
]

#삭제
del car_company_list[1]
```

- 딕셔너리 구조: 코드 반복 지속, 중첩 문제(키), 정렬 어려움

```python
cars_dicts = [
    {'car_company': 'Ferrari', 'car_detail': {'color' : 'White', 'horsepower': 400, 'price': 8000}},
    {'car_company': 'Bmw', 'car_detail': {'color' : 'Black', 'horsepower': 270, 'price': 5000}},
    {'car_company': 'Audi', 'car_detail': {'color' : 'Silver', 'horsepower': 300, 'price': 6000}}
]
```

## 클래스

- 재사용성 증가, 반복 최소화, 메소드 활용

```python
class Car():
    def __init__(self, company, details):
        self._company = company
        self._details = details

    def __str__(self):
        return 'str : {} - {}'.format(self._company, self._details)

    def __repr__(self):
        return 'repr : {} - {}'.format(self._company, self._details)

# Self 의미
car1 = Car('Ferrari', {'color' : 'White', 'horsepower': 400, 'price': 8000})
car2 = Car('Bmw', {'color' : 'Black', 'horsepower': 270, 'price': 5000})
car3 = Car('Audi', {'color' : 'Silver', 'horsepower': 300, 'price': 6000})

# ID 확인 -> 3개마다 고유의 번호가 있다는 사실을 알 수 있다. 그래서 self이다. 
#클래스라는 붕어빵 기계에서 각각 다른 것들을 (구조만 같은) 찍어내는 것이다.
print(id(car1))

print(car1._company == car2._company) #다르다.
print(car1 is car2) #다르다.

# dir & __dict__ 확인
#기본적으로 상속받는 것들 + _company,.. 모든 attribute 리스트 형태로 출력
print(dir(car1))
print(car1.__dict__) #불필요한 것들 빼고 내가 정의한(필요한) attribute만 출력! 
#__dict__ 하면 company 값과 detail 값만 출력

# Doctring
print(Car.__doc__) #주석 안달아놨으면 none 출력
#협업에 있어서 설명서를 작성해놓는 것은 중요하다.
```

- 메소드 `str` 와 `repr` 의 차이
   - `print(car1)` 하면 안에 뭐 있는지 출력해주는 것. 이 메소드 없이 그냥 출력하면 object가 나옴
   - `str` 는 사용자 입장, `repr`는 개발자 입장에서 개체를 공식적 문자로 출력하고 싶을 때 (엄격한 데이터타입 등)
   - 기본은 `str` (있으면 우선 출력)

## 클래스를 제대로 작성해보자.

```python
class Car():
#요거는 기본 형식같은 것. 잘 지키면 좋다. 
    """
    Car Class
    Author : Kim
    Date : 2019.11.08
    """

    # 클래스 변수 = 모든 인스턴스가 공유
    car_count = 0

    def __init__(self, company, details):
        self._company = company
        self._details = details
        Car.car_count += 1 #init 호출될때마다 차 개수를 늘려주겠다.

    def __str__(self):
        return 'str : {} - {}'.format(self._company, self._details)

    def __repr__(self):
        return 'repr : {} - {}'.format(self._company, self._details)

    def detail_info(self):
        print('Current Id : {}'.format(id(self)))
        print('Car Detail Info : {} {}'.format(self._company, self._details.get('price')))

    def __del__(self):
        Car.car_count -= 1 #하나 지우면 하나 줄어든다.
```

- `detailed_info` 라는 새로운 메소드를 추가했다. `ID` 랑 `detail` - 회사와 가격만

```python
car1.detail_info() #print문이 안에서 실행되기 때문에 그냥 실행만 해도 출력
Car.detail_info() #self가 필요해서 에러라고 함.  뭔 차인지 인스턴스 하나를 줘.
Car.detail_info(car1) #이러면 인자=car1를 넘겼기 때문에 잘 출력

# 비교
print(car1.__class__, car2.__class__)
print(id(car1.__class__) == id(car3.__class__)) #2개가 똑같다? 클래스이기 때문. Car라는 클래스의 id.
```

- 클래스 변수 `car_count`
   - 하나의 클래스에서 모든 인스턴스가 공유하는 숫자.
   - car1,2,3 모두 전체 차 개수는 3개라는 걸 공유한다.

```python
# 인스턴스 변수
# 직접 접근(PEP 문법적으로 권장X)
print(car1._company, car2._company)
print(car2._company, car3._company)

# 클래스 변수

# 접근
print(car1.car_count)

# 접근방식
print(dir(car1)) #전체 보기, 언더바를 안 붙여놨으면 공유변수 
print(Car.__dict__) #공유변수니까 Car로 접근해도 나옴
print(car1.__dict__)#공유변수니까 각 인스턴스로 접근해도 나옴
```

- PEP에서 권장하는 네이밍 스타일
   - **앞에 언더바가 붙은 것(`_company`)은 인스턴스 변수, 안 붙은 것(`car_count`)은 공유하는 클래스 변수**
- 인스턴스 네임스페이스에 없으면 상위에서 자동으로 검색한다!
   - 일한 이름으로 변수 생성 가능(인스턴스 검색 후 → 상위(클래스 변수, 부모 클래스 변수))

```python
#만약 self.car_count = 10 이렇게 인스턴스 변수를 해놨으면

print(car1.car_count) #이러면 자기걸 출력하고
# 저걸 안해놨으면 = 나한테 없으면, 클래스 변수를 찾는다. 
#그래도 없으면 에러
# 근데 이렇게 이름 똑같이 하는 건 좋지않지..
print(Car.car_count)
```

## 메소드

- 클래스 메소드 / 인스턴스 메소드 / 스태틱 메소드

```python
class Car(object):
    '''
    Car Class
    Author : Me
    Date : 2019.11.08
    Description : Class, Static, Instance Method
    '''

    
    price_per_raise = 1.0 # Class Variable

    def __init__(self, company, details):
        self._company = company
        self._details = details
        
    def __str__(self):
        return 'str : {} - {}'.format(self._company, self._details)

    def __repr__(self):
        return 'repr : {} - {}'.format(self._company, self._details)

    # Instance Method
    # self : 이 클래스를 사용해서 만든 객체의 고유한 속성 값 사용
    def detail_info(self):
        print('Current Id : {}'.format(id(self)))
        print('Car Detail Info : {} {}'.format(self._company, self._details.get('price')))
        
    # Instance Method: 차의 가격을 알려줌
    def get_price(self):
        return 'Before Car Price -> company : {}, price : {}'.format(self._company, self._details.get('price'))

    # Instance Method: 가격이 오른다음 차의 가격을 알려줌 (인상 비율 = 클래스 변수를 곱해서)
    def get_price_culc(self):
        return 'After Car Price -> company : {}, price : {}'.format(self._company, self._details.get('price') * Car.price_per_raise)

    # Class Method: 인자를 클래스 변수로 받음. 특정 인상률을 통해 차 값을 올리는 걸 설정
    @classmethod #데코레이터 표시
    def raise_price(cls, per): #cls: 클래스 Car
        if per <= 1:
            print('Please Enter 1 o r More') #1 이상이어야 된다
            return
        cls.price_per_raise = per #인상률을 설정해주는 부분
        return 'Succeed! price increased.'

    # Static Method
    @staticmethod
    def is_bmw(inst): #bmw인지 확인하는 메소드
        if inst._company == 'Bmw':
            return 'OK! This car is {}.'.format(inst._company)
        return 'Sorry. This car is not Bmw.'
```

- 가격만 알고 싶으면? 아래처럼 직접 접근하는 건 바람직하지 않음.

`print(car1._details.get('price'))`

`print(car1._details['price'])`

- 내가 원하는 값만 돌려주는 `get_price` 함수(인스턴스 메소드)를 만들었음 `get` 메소드를 사용해서!
- 인스턴스 메소드: 인스턴스를 받는
- 클래스 메소드: 클래스변수를 받는
- 스태틱 메소드: 아무것도 받지않는 (그래서 유연하게 사용할 수 있는!) → 굳이 필요한가?! 라는 의견도 있다

```python
# 자동차 인스턴스    
car1 = Car('Bmw', {'color' : 'Black', 'horsepower': 270, 'price': 5000})
car2 = Car('Audi', {'color' : 'Silver', 'horsepower': 300, 'price': 6000})

# 기본 정보
print(car1)
# 전체 정보
car1.detail_info()

# 가격 정보(인상 전)
print(car1.get_price())

# 가격 인상(클래스 메소드 미사용)
Car.price_per_raise = 1.2
# 가격 정보(인상 후)
print(car1.get_price_culc())

# 가격 인상(클래스 메소드 사용)
Car.raise_price(1.6)
# 가격 정보(인상 후 : 클래스메소드)
print(car1.get_price_culc())

# Bmw 여부(스테이틱 메소드 미사용)
def is_bmw(inst):
    if inst._company == 'Bmw':
        return 'OK! This car is {}.'.format(inst._company)
    return 'Sorry. This car is not Bmw.'

# 별도의 메소드 작성 후 호출
print(is_bmw(car1))
# Bmw 여부(스테이틱 메소드 사용)
print('Static : ', Car.is_bmw(car1)) #이렇게 호출해도 나옴! 유연하다!
```

### 추가로 찾아볼 것

1. `str` 와 `repr` 더 자세한 사용법 차이
2. static method를 어떨 때 사용하면 좋은가?

