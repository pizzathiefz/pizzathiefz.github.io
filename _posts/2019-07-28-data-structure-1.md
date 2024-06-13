---
title: 자료구조 - 연결 리스트, 스택, 큐
date: 2019-07-29 11:50:00 +09:00
categories:
  - Notes
tags:
  - cs
math: true
toc: true
comments: true
---
> [컴퓨터 사이언스 부트캠프 with 파이썬](https://thebook.io/006950/)을 보고 정리한 내용입니다.
{: .prompt-info }

## 자료구조란

- 자료구조(data structure)
   - 데이터를 효율적으로 검색/변경/삭제할 수 있도록 저장/관리하는 방법
- 상황에 따라 적절한 자료구조가 달라질 수 있음
   - 데이터 검색은 빈번하게 일어나는데 반해 새로운 데이터 삽입이 없다면 → 배열을 쓰는 것이 합리적
      - 배열: 메모리에 순서대로 할당되므로 캐시 히트가 일어날 확률이 높고, 배열 안에 있는 변수 위치(인덱스)를 통해 변수에 매우 빠르게 접근할 수 있음
   - 검색에 비해 삽입이나 기존 데이터 삭제가 자주 일어난다면 연결 리스트를 사용하는 것이 효율적
- 추상 자료형
   - ADT (Abstract Data Type)
      - 자료 구조에서 삽입/탐색/삭제를 담당하는 함수들의 사용 설명서
      - 추상화한다는 것은 인터페이스와 구현을 분리한다는 것
         - 인터페이스란? `L.append(object) → None` : 함수의 이름, 인자, 반환형을 알 수 있음
         - 하지만 append 라는 함수가 어떻게 구현되어 있는지는 알 수 없고 알 필요도 없음

## 연결 리스트(linked list)

- 데이터와 참조로 구성된 노드가 한 방향 혹은 양방향으로 쭉 이어져 있는 자료 구조
   - 참조는 다음 노드 또는 이전 노드를 가리킴
   - 양방향으로 이어져 있는 것은 이중 연결 리스트라고 하며, 힙 세그먼트를 구현하는 큰 틀을 제공함
- 단일 연결 리스트의 노드 구현

```python
class Node:
	def __init__(self, data = None):
		#노드의 구조: 데이터 부분과 참조 부분
		self.__data = data
		self.__next = None

	def __del__(self):
			print("data of {} is deleted".format(self.data))

	@property
	def data(self):
		return self.__data

	@data.setter
	def data(self, data):
			self.__data = data

	@property
	def next(self):
		return self.__next

	@next.setter
	def next(self, n):
		self.__next = n
```

   - 정보 은닉 기법(언더바 및 프로퍼티 기법) 사용했음
- 단일 연결 리스트 클래스의 멤버
   - head: 첫번째 데이터
   - tail: 마지막 데이터
   - d_size: 데이터의 개수
- 단일 연결 리스트의 ADT
   - `S.append(data) -> None`
      - 데이터를 삽입
   - `S.search_target(target, start = 0) -> (data, pos)`
      - 데이터를 검색 (순회하면서 대상 데이터를 찾아 위치와 함께 반환)
      - `pos`: 리스트에서 몇번째 데이터인지, 인덱스처럼 0처럼 시작하지만 인덱스처럼 인덱싱이 불가능하다는 것이 차이점 (원하는 데이터를 찾으려면 처음부터 모두 순회해야 함)
      - 찾는 데이터가 없으면 `(None, None)` 반환
      - `start`는 검색을 시작하는 위치로, 그 전까지는 단순히 순회를 통해 이동만
   - `S.search_pos(pos) -> data`
      - 데이터를 검색 (위치를 인자로 받아서 해당 위치의 데이터를 반환)
      - 이것도 마찬가지로 처음부터 모두 순회가 필요
   - `S.remove(target) -> data`
      - 데이터를 삭제
         - 데이터가 있으면, 첫번째 데이터를 지움
         - 대상 데이터가 없으면 None 반환
   - `S.empty() -> bool`
      - 비어있으면 참, 비어있지 않다면 거짓 반환
   - `S.size() -> integer`
      - 데이터의 개수를 반환
- 구현

```python
class Linked_list:

	#생성자
	def __init__(self):
		self.head = None #첫번째 노드
		self.tail = None #마지막 노드 
		self.d_size = 0 #데이터의 개수

	def empty(self):
		if self.d_size == 0:
			return True
		else:
			return False

	def size(self):
		return self.d_size

	#삽입
	def append(self, data):
		new_node = Node(data)
		#비어있을 때
		if self.empty():
			self.head = new_node
			self.tail = new_node
			self.d_size += 1
		#이미 데이터가 있을 때
		else:
			self.tail.next = new_node
			self.tail = new_node #tail을 새로운 노드로 옮기는 과정
			self.d_size +=1

	def search_target(self, target, start = 0):
		if self.empty():
			return None
		#첫번째 노드에서 시작
		pos = 0 
		cur = self.head

		#start 위치 이상이어야만 탐색을 하고 아니면 그냥 지나감
		if pos >= start and target == cur.data:
			return cur.data, pos

		while cur.next:
			pos += 1
			cur = cur.next
			if pos >= start and target == cur.data:
				return cur.data, pos

		#끝까지 못찾으면
		return None, None

	def search_pos(self, pos):
		#범위를 벗어나면 None
		if pos > self.size() -1:
			return None
		
		cnt = 0
		cur = self.head
		if cnt ==pos:
			return cur.data

		while cnt < pos:
			cur = cur.next
			cnt += 1

		return cur.data

	# del을 이용해 명시적으로 삭제하지 않고, 레퍼런스 카운팅을 이용해 0으로 만듦
	def remove(self, target):
		if self.empty():
			return None

		bef = self.head
		cur = self.head

		#삭제 노드가 첫번째 노드일 때
		if target == cur.data:
			#데이터가 하나일 때, head 와 tail 을 없애줌
			if self.size() ==1:
				self.head = None
				self.tail = None
			#데이터가 하나 이상일 때
			else:
				self.head = self.head.next #head를 옮겨줌
			self.d_size -= 1 #데이터 크기를 하나 줄여줌
			return cur.data

	
		while cur.next:
			bef = cur
			cur = cur.next
			#삭제 노드가 첫번째 노드가 아닐 때
			if target == cur.data:
				#마지막 노드일 때
				if cur == self.tail:
					self.tail = bef #tail을 옮겨줌
				bef.next = cur.next #없애줌
				self.d_size -= 1 #데이터 크기를 하나 줄여줌
				return cur.data
			
		#끝까지 찾지 못하면 None 
		return None
```

## 스택

- 데이터를 차곡차곡 쌓아올림
   - LIFO(Last In, First Out) / 후입선출
- 스택의 ADT
   - `S.push(data) -> None`
      - 맨 위에 새로운 데이터를 삽입
   - `S.pop() -> data`
      - 맨 위의 데이터를 삭제하면서 반환
   - `S.empty() -> bool`
      - 스택이 비었으면 참, 비어 있지 않다면 거짓
   - `S.peek() - > data`
      - 맨 위의 데이터를 반환하되 삭제하지 않음
- 구현
   - 파이썬 리스트의 append와 pop을 사용하지만, 객체지향 관점에서 정의할 때 상속이 아닌 합성을 사용

```python
class Stack:
	def __init__(self):
		self.container = list()
	def push(self, data):
		self.container.append(data)
	def pop(self):
		return self.container.pop()
	def empty(self):
		if not self.container:
			return True
		else:
			return False
	def peek(self):
		return self.container[-1]
```

## 큐

- 스택이 접시 쌓기라면 큐는 줄서기
   - FIFO(First In, First Out) / 선입선출
- 큐의 ADT
   - `Q.enqueue(data) -> None`
      - 마지막에 새로운 데이터를 삽입
   - `Q.d(equeue) -> data`
      - 가장 먼저 들어온 데이터를 삭제하면서 반환
   - `Q.empty() -> bool`
      - 큐가 비었으면 참, 비어 있지 않다면 거짓
   - `Q.peek() - > data`
      - 가장 먼저 들어온 데이터를 반환하되 삭제하지 않음
- 구현
   - 파이썬 리스트의 append와 pop을 사용하지만, 객체지향 관점에서 정의할 때 상속이 아닌 합성을 사용

```python
class Queue:
	def __init__(self):
		self.container = list()
	def enqueue(self, data):
		self.container.append(data)
	def dequeue(self):
		return self.container.pop(0)
	def empty(self):
		if not self.container:
			return True
		else:
			return False
	def peek(self):
		return self.container[0]
```

