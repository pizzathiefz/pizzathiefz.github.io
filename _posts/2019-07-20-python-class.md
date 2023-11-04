---
title: "[Python] 클래스"
date: 2019-07-20 11:40:00 +09:00
categories:
  - Notes
tags:
  - python
math: true
toc: true
comments: true
---
> [컴퓨터 사이언스 부트캠프 with 파이썬](https://thebook.io/006950/)을 보고 정리한 내용입니다.
{: .prompt-info }

## 클래스 관계

### IS-A: 상속

- ‘~은 ~의 한 종류다’ 라는 뜻  ex. A laptop IS A computer
- 한 객체가 다른 객체의 모든 특성(멤버)와 기능(메서드)를 가진 상태에서 그 외의 다른 특성이나 기능을 갖도록 만들고 싶다면
- 상속을 하는 클래스를 기본 클래스/부모 클래스/슈퍼 클래스라고 함
- 상속을 받는 클래스를 파생 클래스/자식 클래스/서브 클래스라고 함

```python
#기본 클래스인 Computer 클래스
class Computer:
	def __init__(self, cpu, ram):
		self.CPU = cpu
		self.RAM = ram

	def browse(self):
		print('browse')

	def work(self):
		print('work')

class Laptop(Computer): #Computer를 상속
	def __init__(self, cpu, ram, battery):
		super().__init__(cpu, ram) #슈퍼클래스인 Computer의 생성자를 이용해 cpu, ram 초기화
		self.battery = battery

	def move(self, to):
		print('move to {}'.format(to))

#따로 지정하지 않아도 browse(), work() 메서드는 이미 가지고 있음
```

### HAS-A: 합성/통합

- ‘~이 ~을 가진다, 포함한다’ ex. A Computer HAS A CPU

### 합성

```python
class CPU:
	pass

class RAM:
	pass

class Computer:
	def __init__(self):
		self.cpu = CPU()
		self.ram = RAM()
```

- Computer 객체가 생성될 때 CPU 객체도 같이 만들어졌다가 Computer 객체가 사라질 때 CPU 객체도 함께 사라짐
- 객체의 생명주기가 같고 컴퓨터가 CPU를 소유하고 있는 모양새일 때

### 통합

```python
class Gun:
	def __init__(self,kind):
		self.kind = kind
	def bang(self):
		print('bang bang!')

class Police:
	def __init__(self):
		self.gun = None
	def acquire_gun(self, gone):
		self.gun = gun
	def relase_gun(self)
		gun = self.gun
		self.gun = None
		return gun
	def shoot(self):
		if self.gun:
			self.gun.bang()
		else:
			print('Unable to shoot')
```

- Police 객체는 만들어질 때 아직 Gun 객체를 가지고 있지 않음, 이후 acquire_gun() 메서드를 통해 Gun 객체를 멤버로 가지게 됨, 또 release_gun()을 통해 가지고 있던 총을 반납 가능
- 두 객체는 생명주기를 함께하지 않는 상대적으로 약한 관계

## 메서드 오버라이딩과 다형성

### 메서드 오버라이딩

- 파생 클래스 안에서 상속받은 메서드를 다시 구현하는 것

```python
class CarOwner:
	def __init__(self, name):
		self.name = name
	def concentrate(self):
		print('{} can not do anything else'.format(self.name))
	#나머지 메서드...

class Car:
	def __init(self, owner_name):
		self.owner = CarOwner(owner_name)
	def drive(self):
		self.owner.concentrate()
		print('{} is driving now.'.format(self.owner.name))
	#나머지 메서드...

class SelfDrivingCar(Car): #Car 클래스 상속
	def drvie(self):
		print('Car is driving by itself')
```

- 슈퍼클래스인 Car 의 경우 drive() 를 호출하자마자 차 주인의 concentrate()을 호출하여 차 주인이 다른 걸 하면 안 된다는 말을 출력함
- 그러나 Car를 상속받은 SelfDrivingCar의 경우 같은 drive() 를 다시 정의해서(→ 메서드 오버라이딩), 차가 자율주행을 하고 있다는 말을 출력함

→ 이렇게 같은 이름의 메서드를 호출해도 호출한 객체에 따라 다른 결과를 내는 것을 ‘다형성’(polymorphism)이라고 함

### 다형성

```python
class Animal:
	def eat(self):
		print('eat something')

class Lion(Animal):
	def eat(self):
		print('eat meat')

class Deer(Animal):
	def eat(self):
		print('eat grass')

class Human(Animal):
	def eat(self):
		print('eat meat and grass')
```

- 모든 파생 클래스가 공통으로 가질 메서드인 eat()은 기본 클래스에 두고,
   - 이 기본 클래스를 상속한 파생 클래스들의 식성에 따라 eat() 을 다시 정의함
- 만약 Animal 클래스의 인스턴스는 못 만들게 하고 싶다면?
   - Animal 클래스를 추상 클래스로 만들면 됨
   - 추상 클래스
      - 독자적으로 인스턴스를 만들 수 없고 함수의 몸체가 없는 추상 메서드를 하나 이상 가지고 있어야 함
      - 추상 클래스를 상속받는 파생 클래스는 추상 클래스를 반드시 오버라이딩 해야 함(그렇지 않으면 파생 클래스도 추상 클래스가 되어 인스턴스를 만들 수 없음)

```python
from abc import *
#abc 는 abstract base class의 약자

class Animal(metaclass = ABCMeta):
	@abstractmethod
	def eat(self):
		pass 
#이렇게 데코레이터 + 메서드 구현부를 비워놓으면 eat()은 추상 메서드가 됨
```

## 클래스 설계 예제

클래스 설계 시에는 2가지를 고려

1. 공통 부분을 기본 클래스로 묶어 코드를 재사용할 수 있도록 한다.
2. 부모가 추상 클래스인 경우를 제외하고, 파생 클래스에서 기본 클래스의 여러 메서드를 오버라이딩한다면 파생 클래스는 만들지 않는 것이 좋다.

### Character 클래스 만들기 (추상 클래스)

- 게임 캐릭터에는 몬스터와 플레이어가 있다.
- 모든 캐릭터(추상 클래스)는 다음과 같은 특성을 가짐
   - 인스턴스 멤버: 이름, 체력, 공격력을 가짐
   - 인스턴스 메서드: 공격할 수 있고 공격당하면 피해를 입음(모두 추상 메서드로 구현)

```python
from abc import *

#추상클래스
class Character(metaclass = ABCMeta):
	def __init__(self, name, hp, power):
		self.name = name
		self.HP = hp
		self.power = power

	#추상메서드
	@abstractmethod
	def attack(self, other, attack_kind):
		pass

	@abstractmethod
	def get_damamge(slef.power, attack_kind):
		pass

	def __str__(self):
		return '{} : {}'.format(slef.name, self.HP)
```

### Player 클래스 만들기

- 플레이어의 특성
   - 추가되는 멤버: 다양한 공격 목록을 담을 수 있는 기술 목록
   - attack: 공격 종류가 기술 목록 안에 있다면 상대 몬스터에게 피해를 입힐 수 있음
   - get_damage: 플레이어가 피해를 입을 때 몬스터의 공격 종류가 플레이어의 기술 목록에 있다면 몬스터의 공격력이 반감되어 hp가 공격력의 반절만 깎임

```python
class Player(Character): #상속
	def __init__(slef, name = 'player', hp =100, power = 10, *attack_kinds):
		super().__init__(name, hp, power)

		self.skills = []
		for attack_kind in attack_kinds:
			slef.skills.append(attack_kind)

	#추상 메서드는 반드시 재정의해야 함

	def attack(self, other, attack_kind):
		if attack_kind in self.skills:
			other.get_damage(self.power, attack_kind)

	def get_damage(self, power, attack_kind):
		if attack_kind in slef.skills:
			self.HP -= (power//2)
		else:
			self.HP -= power
```

### Monster 클래스 만들기

- 몬스터의 특성
   - 불 몬스터와 얼음 몬스터가 있음
   - 추가되는 멤버: 공격 종류를 가진다(불 몬스터는 FIRE, 얼음 몬스터는 ICE)
   - 공통 메서드(두 몬스터는 같은 행동을 함)
      - 공격 종류가 몬스터의 속성과 같다면 공격
      - 자신과 속성이 같은 공격을 당하면 오히려 체력이 증가하고, 그렇지 않으면 감소 (공격력만큼)
   - 서로 다른 메서드
      - 불 몬스터는 얼음 몬스터는 하지 않는 특별한 행동을 한다(fireball)

→ fireball을 제외한 나머지 메서드도 겹치고 추가되는 멤버도 겹치므로 기본 Monster 클래스를 만들고 이를 각각 상속하는 것이 좋을 것 같다.

```python
class Monster(Character):
	def __init__(self, name, hp, power):
		super().__init__(name, hp, power)
		self.attack_kind = 'None'

	def attack(self, other, attack_kind):
		if self.attack_kind == attack_kind:
			other.get_damage(self.power, attack_kind)

	def get_damage(self, power, attack_kind):
		if self.attack_kind == attack_kind:
			self.HP += power
		else:
			self.HP -= power

	def get_attack_kind(self):
		return self.attack_kind

class IceMonster(Monster):
	def __init__(self, name = 'Ice monster', hp = 50, power = 10):
		super().__init__(name, hp, power)
		self.attack_kind = 'ICE'

class FireMonster(Monster):
	def __init__(self, name = 'Fire monster', hp = 50, power = 10):
		super().__init__(name, hp, power)
		self.attack_kind = 'FIRE'
	#추가 메서드
	def fireball(self):
		print('fireball')
```

## 연산자 오버로딩

- 연산자 오버로딩(operator overloading)이란 클래스 안에서 메서드로 연산자를 새롭게 구현하는 것 (다형성의 특별한 형태)
- 다른 객체나 일반적인 피연산자와 연산을 할 수 있음

```python
class Point:
	def __init__(self, x = 0, y = 0):
		self.x = x
		self.y = y

	def set_point(self, x, y):
		self.x = x
		self.y = y

	def get_point(self):
		return self.x, self.y

	def __str__(self):
		return'({x}, {y})'.format(x=self.x, y=self.y)
```

- x좌표, y좌표에 숫자를 더해서 새로운 좌표객체를 만들고 싶다.

```python
if __name__ == "__main__":
	p1 = Point(2,2)
	p2 = p1 + 3

print(p2)
```

   - 이렇게 하면 Point 객체와 int 객체는 더할 수 없다고 오류가 남
- 다음과 같이 연산자 오버로딩을 써서 더하기를 다시 정의해주면 정상적으로 동작

```python
#(class 정의 내에)
	def __add__(self, n):
		x = self.x + n
		y = self.y + n
		return Point(x,y)
```

   - 하지만 3+p1 하면 똑같이 오류가 남, 순서 무관 덧셈을 할 수 있으려면 다른 연산자도 오버로딩 필요: `__radd__`
   - 산술 연산자 오버로딩 메서드
      - `__add__`
      - `__sub__`
      - `__mul__`
      - `__truediv__`
      - `__floordiv__`

