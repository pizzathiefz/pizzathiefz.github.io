---
title: 자료구조 - 트리, 이진 트리, 이진 탐색 트리
date: 2019-07-28 11:50:00 +09:00
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

- 트리의 정의: 사이클이 없는 연결된 그래프

## 이진 트리

- 이진 트리란?
   - 한 노드가 자식 노드를 두 개 이하만 갖는 트리
      - 연결 리스트와 비슷함, 단 왼쪽 자식 노드와 오른쪽 자식 노드 2개를 참조해야 함
   - 부모 노드와 자식 노드
   - 루프 노드와 리프 노드
   - 서브 트리
   - 트리의 레벨

### 이진 트리의 종류

- 포화 이진 트리(full binary tree)
   - 모든 레벨이 꽉 차 있는 트리
- 완전 이진 트리(complete binary tree)
   - 트리의 노드가 위에서 아래로, 왼쪽에서 오른쪽으로 채워지는 트리

### 트리의 순회

- 전위 순회(preorder traversal)
   - 노드 → 왼쪽 서브 트리 → 오른쪽 서브 트리 (재귀적으로 모든 서브 트리에 적용)
- 중위 순회(inorder traversal)
   - 왼쪽 서브 트리 → 노드 → 오른쪽 서브 트리 (재귀적으로 모든 서브 트리에 적용)
- 후위 순회(postorder traversal)
   - 왼쪽 서브 트리 → 오른쪽 서브 트리 → 노드 (재귀적으로 모든 서브 트리에 적용)

### 이진 트리 구현

- 트리 노드 구현
   - 트리의 세 멤버 data, left, right를 캡슐화

```python
class TreeNode:
	def __init__(self):
		self.__data = None
		self.__left = None
		self.__right = None
	#노드 삭제를 확인하기 위한 소멸자
	#객체가 삭제되기 전에 호출됨
	def __del__(self):
		print("TreeNode of {} is deleted".format(self.data))

	@property
	def data(self):
		return self.__data

	@left.setter
	def left(self):
		return self.__left

	@right.setter
	def right(self):
		return self.__right

	@right.setter
	def right(self, right):
		slef.__right = right
```

- 노드 관련 메서드 구현

```python
class BinaryTree:
	def __init__(self):
		#멤버: 루트 노드를 가리키는 root 하나
		self.root = None

	def get_root(self):
		return self.root

	def set_root(self, r):
		self.root = r

	#새로우 노드를 만들어 반환
	def make_node(self):
		new_node = TreeNode()
		return new_node

	#노드 데이터 반환
	def get_node_data(self, cur):
		return cur.get_data()

	#노드 데이터 설정
	def set_node_data(self, cur, data):
		cur.set_data(data)

	###서브트리 관련 메서드

	def get_left_sub_tree(self, cur):
		return cur.left

	def get_right_sub_tree(self,cur):
		return cur.right

	def make_left_sub_tree(self, cur, left):
		cur.left = left

	def make_right_sub_tree(slef, cur, right):
		cur.right = right

	### 순회

	def preorder_traverse(self, cur, func):
		#탈출조건: 방문한 노드가 빈 노드일 때
		if not cur:
			return
		func(cur.data)
		self.preorder_traverse(cur.left, func)
		self.preporder_traverse(cur.right, func)

	def inorder_traverse(self, cur, func):
		#탈출조건: 방문한 노드가 빈 노드일 때
		if not cur:
			return
		#먼저 왼쪽 서브트리 순회
		self.inorder_traverse(cur.left, func)
		func(cur.data)
		self.inorder_traverse(cur.right, func)

	def postorder_traverse(self, cur, func):
		#탈출조건: 방문한 노드가 빈 노드일 때
		if not cur:
			return
		self.postorder_traverse(cur.left, func)
		self.postorder_traverse(cur.right, func)
		#왼쪽 서브트리와 오른쪽 서브트리 순회 후 마지막으로 방문 노드의 데이터를 인자로 함수 호출
		func(cur.data)
```

## 이진 탐색 트리

- 이진 탐색 트리(Bianry search tree)의 특징
   - 어떤 특정 노드를 선택했을 때 그 노드를 기준으로 왼쪽 서브 트리에 존재하는 노드의 모든 데이터는 기준 노드의 값보다 작고, 오른쪽 서브 트리에 있는 노드의 모든 데이터는 기준 노드의 값보다 크다.
   - 중복되는 값이 존재할 수 없다.(1번 조건으로 인해 당연)

### 이진 탐색 트리 구현

- 추상 자료형 (ADT)
   - `BST.insert(data) -> None`
      - 데이터를 삽입
   - `BST.search(target) -> node`
      - 대상 데이터를 가진 노드를 찾아서 반환, 없으면 None
   - `BST.remove(target) -> node`
      - 대상 데이터가 있다면 삭제하면서 반환, 없으면 None
   - `BST.insert_node(node) - > None`
      - 데이터가 아니라 노드를 삽입 (remove에서 반환받은 노드의 데이터를 수정한 후 다시 삽입할 때 사용)
- 이진 트리 관련 메서드

```python
from binary_tree import *

class BST:
	def __init__(self):
		self.root = None

	def get_root(self):
		return self.root

	def preorder_traverse(self, cur, f):
		if not cur:
			return
		f(cur.data)
		self.preorder_traverse(cur.left, f)
		self.preorder_traverse(cur.right, f)
```

- insert
   - 삽입 데이터가 노드의 데이터보다 작으면 왼쪽 자식 노드로 이동, 노드의 데이터보다 크면 오른쪽 자식 노드로 이동 → 빈 노드를 만나면 삽입한다!

```python
def insert(self, data):
	new_node = TreeNode()
	new_node.data = data

	cur = self.root
	#루트 노드가 없을 때
	if cur == None:
		slef.root = new_node
		return

	while True:
		#parent: 현재 순회 중인 노드의 부모 노드를 가리킴
		parent = cur
		if data < cur.data:
			cur = cur.left
			#왼쪽 서브트리가 없으면 거기에 새 노드를
			if not cur:
				parent.left = new_node
				return
		else:
			cur = cur.right
			#오른쪽 서브트리가 없으면 거기에 새 노드를
			if not cur:
				parent.right = new_node
				return
```

- search

```python
def search(self, target):
	cur = self.root
	while cur:
		if target == cur.data:
			return cur
		#대상 데이터가 노드 데이터보다 적으면 왼쪽 자식 노드로 이동, 크면 오른쪽
		elif target < cur.data:
			cur = cur.left
		elif target > cur.data:
			cur = cur.right

	return cur
```

- remove
   - 유저 프로그래머가 사용하는 코드

```python
def remove(self, target):
	#루트 노드의 변경 가능성이 있으므로 루트를 업데이트해야 함
	self.root, removed_node = self.__remove_recursion(self.root, target)
	#삭제된 노드의 자식 노드를 None으로 만든다
	removed_node.left = removed_node.right = None

	#노드 데이터를 수정한 뒤 다시 삽입하기 위해서 삭제된 노드를 반환함
	return removed_node
```

   - 재귀함수를 사용해 구현, 세개의 경우로 나눠서 지움
      - 삭제 노드가 리프 노드일 때
      - 삭제 노드의 자식 노드가 하나일 때
      - 삭제 노드의 자식 노드가 두개일 때

```python
def __remove_recursion(self, cur, target):
	#탈출 조건 1: 대상 데이터가 트리 안에 없을 때
	if cur == None:
		return None, None
	#대상 데이터가 노드 데이터보다 작으면, 노드의 왼쪽 자식에서 대상 데이터를 가진 노드를 지운다(재귀)
	elif target < cur.data:
		cur.left, rem_node = self.__remove_recursion(cur.left, target)
	#대상 데이터가 노드 데이터보다 크면, 노드의 오른쪽 자식에서 대상 데이터를 가진 노드를 지운다(재귀)
	elif target > cur.data:
		cur.right, rem_node = self.__remove_recursion(cur.right, target)
	#탈출 조건 2: target == cur.data
	else:
		#리프 노드일 때
		if not cur.left and not cur.right:
			rem_node = cur
			cur = None
		#자식 노드가 하나(왼쪽 자식)
		elif not cur.right:
			rem_node = cur
			cur = cur.left
		#자식 노드가 하나(오른쪽 자식)
		elif not cur.left:
			rem_node = cur
			cur = cur.right
		#자식 노드가 2개일때
		else:
			replace = cur.left #대체 노드
			while replace.right:
				replace = replace.right 
			#삭제 노드와 대체 노드의 값을 교환, 대체 노드를 삭제하면서 삭제된 노드를 받아옴
			cur.data, replace.data = replace.data, cur.data
			cur.left, rem_node = self.__remove_recursion(cur.left, replace.data)
	return cur, rem_node
```

- insert_node

```python
def insert_node(self, node):
	#노드 생성 코드 없음 (노드 생성에 따른 부담을 덜 수 있다)
	cur = self.root
	if cur == None:
		self.root = node
		return
	while True:
		parent = cur
		if node.data < cur.data:
			cur = cur.left
		if not cur:
			parent.left = node
			return
	else:
		cur = cur.right
		if not cur:
			parent.right = node
			return
```

