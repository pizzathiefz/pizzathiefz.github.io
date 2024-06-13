---
title: 알고리즘
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

## 알고리즘 성능 분석

- 탐색 알고리즘에는 2가지 종류가 있음
   - 선형 탐색 대상 데이터와 저장되어있는 데이터를 순서대로 하나씩 비교
   - 이진 탐색 대상 데이터와 가운데 데이터를 비교해 대상 데이터가 작으면 비교 데이터의 이전 데이터를, 대상 데이터가 크면 비교 데이터의 이후 데이터를 같은 방식으로 반복

### 선형 탐색 알고리즘

- 리스트라면, 처음부터 끝까지 순회하면서 대상 데이터를 찾음
- 선형 탐색 알고리즘의 성능
   - if문 실행 횟수, 즉 비교 연산 횟수를 성능의 기준으로 삼음
   - 첫번째 요소를 찾는 경우는 best case지만 마지막 요소를 찾는 경우는 worst case가 됨
   - 대부분 경우 최악의 케이스를 계산(즉 아무리 많이 해도 몇 번의 연산 안에는 실행이 완료된다는 의미에서)
   - 마지막 요소를 찾는 경우를 가정하면, if문 비교 횟수는 데이터 개수와 비례해서 선형적으로 증가하게 됨

### 이진 탐색 알고리즘

- 이진 탐색 알고리즘의 요약
   - 리스트의 모든 데이터는 정렬된 상태여야 한다.
   - 첫번째 인덱스를 start로 설정하고 마지막 인덱스를 end로 설정한다.
   - 가운데 인덱스를 mid로 설정하고 mid 데이터와 target 데이터를 비교한다.
   - target데이터가 작다면, end를 mid-1로 하고 크다면 start를 mid+1로 한다.
   - 데이터를 찾거나 start와 end가 교차할 때까지 반복한다. 찾지 못하면 None 반환
- 이진 탐색 알고리즘의 성능
   - 한번 비교를 할 때마다 비교해야 하는 데이터 수가 절반으로 줄어듦
   - 데이터 개수를 n, 비교 횟수를 k라 할 때 공식은 다음과 같다

$$
n \times (\frac{1}{2})^k = 1
$$

      - 우리가 구해야 하는 k는 $$k = \log_2n$$
   - 데이터 개수가 늘어날수록 이진 탐색의 비교 횟수가 선형 탐색에 비해 현저하가 줄어든다는 걸 알 수 있음

### 알고리즘 성능 분석

- 빅오(Big-O)
   - 데이터 개수가 증가할 때 연산 횟수가 어떤 경햐을 나타내는지 보여주는 개념, 즉 연산 횟수의 증가 추세를 표현
- 분할 상환 분석(amortized analysis)
   - 특정 상황에서는 좋지 않은 성능을 내지만, 나머지 상황에서는 좋은 성능을 낼 때 모든 연산을 고려해 성능을 분석하는 것
      - 예를 들면 동적 배열(dynamic array)
         - 주어진 메모리 공간이 가득 차면 공간을 두 배로 할당받아 기존 요소를 옮긴 후 더 많은 요소를 추가할 수 있는 동적 배열
         - 배열이 꽉 차기 전까지 새로운 요소를 추가할 때 성능이 O(1) → 꽉 차서 다 옮길 때 O(n) → 다시 삽입하는 동안 O(1)
         - 배열 크기를 늘릴 때는 고비용이 발생하지만 추가로 삽입하는 동안에는 비용이 들지 않으므로, 이 기간 동안에 분산시키면 성능은 상수 시간과 비슷해짐- 이를 분할 상환 상수 시간이라고 함

## 거품 정렬

- 맨 처음에 위치한 데이터와 바로 뒤에 있는 데이터부터 순서대로 두 데이터씩 비교
   - 안맞으면 교체함
   - 첫번째 순회가 끝나면 맨 마지막 데이터가 가장 큰 데이터가 됨
   - 나머지 데이터에 대해 순회 반복
   - 순회를 반복할 때마다 맨 뒤에서부터 차례대로 큰 데이터 순서대로 정렬

```python
def bubble_sort(data):
	data_len = len(data)

	for i in range(data_len - 1):
		for j in range(data_len - 1 - i):
			if data[j] > data[j+1]:
				data[j], data[j+1] = data[j+1], data[j]
```

## 퀵 정렬(Quicksort)

- 분할 정복 알고리즘(divide and concquer algorithm) 중 하나
- pivot은 정렬되지 않은 리스트에서 가운데 위치한 인덱스의 데이터를 말함(*인덱스가 아니라 데이터)
- start, end는 각각 첫번째, 마지막 인덱스고 left, right가 각각 start와 end를 가리킴
- left는 오른족으로, right 은 왼쪽으로 이동하면서 pivot 기준으로 왼쪽은 pivot보다 작은 데이터가 모이고 오른쪽에는 큰 데이터가 모이도록 함 → left는 pivot보다 큰 데이터를 만나면 멈추고, right은 작은 데이터를 만나면 멈춰서 두 데이터를 교환

```python
def quick_sort(data, start, end):
	#탈출 조건
	if start >= end:
		return

	left = start
	right = end
	pivot = data[(start + end) // 2]

	def quick_sort(date, start, end:
	while left <= right:
		while data[left] < pivot:
			left +=1
		while data[right] > pivot:
			right +=1

		#right, left가 교차하지 않았다면 교환
		if left <= right:
			data[left], data[right] = data[right], data[left]
			left += 1
			right += 1

	quick_sort(data, start, right)
	quick_sort(data , left, end)
```

