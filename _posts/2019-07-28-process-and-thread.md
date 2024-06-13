---
title: 프로세스와 스레드
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

## 프로세스

- 프로그램: 하드디스크에 저장된 실행 파일
   - 더블클릭해서 실행하지 않는 이상 하드디스크에 계속 남아있으며 같은 경로에 같은 이름으로 동시에 존재할 수 없음
- 프로세스: 프로그램을 실행한 상태 (= 하드디스크에서 메인 메모리로 코드와 데이터를 가져와 현재 실행되고 있는 상태)
   - 동시에 여러 개가 존재할 수 있음 (같은 프로그램을 동시에 여러 번 클릭하면 창이 여러개 뜸 → 독립적 프로세스, 서로 다른 메모리 공간을 사용)
   - 이름이 같은 두 프로세스에 대해서 운영체제는 프로세스마다 ID를 부여함

### 프로세스 상태

1. 생성: 프로그램 더블클릭 시 프로세스가 생성되면서 실행가능 상태가 됨
2. 실행가능: 언제든 실행될 준비가 되어 있는 상태
   - dispatch: 다음으로 실행될 프로세스에 CPU를 할당하는 것
   - preemption: 실행중이던 프로세스에서 CPU를 해제하는 것
3. 실행: 프로세스가 운영체제로부터 CPU를 할당받아 실행되고 있는 상태
4. 보류: I/O(입출력) 작업을 하면 CPU를 해제하고 보류 상태로 변경(→ 이때 실행 가능 상태의 프로세스 중 하나가 CPU를 할당받음), I/O 작업이 끝날 때까지는 실행이 불가능한 상태이며 I/O가 완료되면 실행가능 상태로 변경됨
5. 소멸 : 실행 완료 후 메인 메모리에서 사라짐

### 스케줄링

- 스케줄러: 운영체제가 여러 프로세스의 CPU 할당 순서를 결정
   - 선점형 스케줄링: 어떤 프로세스가 실행중에 있어도 스케줄러가 강제로 실행을 중지하고 다른 프로세스에 CPU를 할당할 수 있음
   - 비선점형 스케줄링: 실행중인 프로세스가 종료되거나 I/O 작업에 들어가거나 명시적으로 CPU를 반환하기 전까지 계속 실행됨
- 대부분 멀티태스킹을 위해 선점형 스케줄링을 함
- 스케줄링 알고리즘
   - 우선순위 알고리즘: 우선순위 높은 프로세스가 생성되면 실행중인 프로세스를 실행가능으로 만들고 우선순위 높은 프로세스를 실행
      - 우선순위 낮은 프로세스는 계속 CPU를 할당받지 못해서 starvation 상태: 일정 시간동안 할당받지 못하면 우선순위를 높여주도록 해야 (aging)
   - 라운드 로빈(Round-Robin) 알고리즘:  모든 프로세스들을 순서대로 가져와 일정 시간동안 CPU를 할당, 그 일정 시간을 타임 슬라이스 혹은 퀀텀이라고 하며 마치 모든 프로세스가 동시에 실행되는 것처럼 보임
      - 타임슬라이스를 얼마로 정하는지가 중요한데 너무 짧으면 컨텍스트 스위칭이 너무 자주 일어나 시스템에 부담이 되고 너무 길면 멀티태스킹 X
   - FCSF(First Come First Served) → 실행가능으로 먼저 들어온 프로세스 실행, 비선점 스케줄링
   - SJF (Shortest Job First) → CPU 할당 시간이 가장 짧은 프로세스 먼저 실행 (예측에 의존)

### 컨텍스트 스위칭

- 프로세스 제어 블록(Process Control Block): 프로세스의 CPU 상태와 프로세스 상태를 저장해둔 메모리 블록 (프로세스가 실행 상태에서 실행가능으로 바뀔 때, 반대에도 필요)
- 컨텍스트 스위칭 하나의 프로세스에서 CPU를 해제하고 실행 가능 상태에 할당하려면 실행중인 프로세스의 CPU 상태정보를 그 프로세스의 PCB에 저장하고 실행가능 상태의 프로세스의 PCB에서 이전 CPU 상태 정보를 CPU로 가져와야 함
   - 컨텍스트 = CPU 상태(현재 CPU의 레지스터 값들)
- 스위칭은 시스템에 부담을 주므로 너무 자주 하면 성능을 떨어뜨림

## 스레드

- 스레드: 프로세스 안의 실행 흐름의 단위로, 스케줄러에 의해 CPU를 할당받을 수 있는 인스트럭션의 나열
   - 프로세스는 하나 이상의 스레드로 구성
- 스레드도 프로세스처럼 스레드 제어 블록(Thread Control Block)를 가짐
   - 그 안에 스레드 ID, 각종 레지스터 정보, 스레드 상태 정보, 스레드가 속한 프로세스의 PCB 주소 등 저장
- 프로세스가 단일 스레드로 작동하면 프로세스와 스레드는 차이가 없음

### 멀티프로세스와 멀티스레드

- 단일 코어 CPU에서 여러 개의 실행 흐름이 필요한 경우는 아주 많음
   - 예를 들어 대용량 데이터를 분석하는 프로그램을 만든다면 UI를 담당해서 사용자가 읽어들인 데이터를 가져오는 실행 흐름, 데이터를 받았는지 시각적으로 화면에 보여주는 실행 흐름, 네트워크에서 데이터를 수신해 저장하는 흐름, 데이터를 이용해 사용자의 명령을 수행하는 흐름 등
   - 이 흐름끼리는 서로 데이터를 공유해야 함 (하나가 변경하면 다른 흐름도 이를 업데이트 해야 함)
   - 멀티프로세스 또는 멀티스레드로 구현해야 함
- 멀티프로세스의 메모리 구조
   - 모든 프로세스가 서로 다른 메모리 공간을 가짐
- 멀티스레드의 메모리 구조
   - 각 스레드는 독립적인 스택 세그먼트를 갖지만 코드, 데이터, 힙은 다른 스레드와 공유하기 때문에 이 세그먼트에 공유 데이터를 두면 모든 스레드가 이용할 수 있음
   - 이처럼 동시에 여러 실행 흐름이 필요한 프로그래밍을 동시성(concurrency) 프로그래밍이라고 함

### 멀티스레딩 구현 예제

- 0부터 1000까지 정수가 담긴 리스트에서 모든 요소의 값을 두배로 만들자.
- 단일스레드

```python
li = [i for i in range(1001)]
for idx in range(1001):
	li[idx] *= 2
```

- 멀티스레드

```python
import threading

def thread_main(li, i):
	for i in range(offset * i, offset * (i+1)):
		li[i] *= 2

num_elm = 1000
num_thread = 4 #스레드 개수

# 오프셋 = 리스트 요소 개수 // 스레드 개수 = 250
offset = num_elem // num_thread

li = [i+1 for i in range(num_elem)]

threads = []
for i in range(num_thread):
	#스레드 객체를 생성, target: 실행할 스레드 함수, args: 전달할 인자 목록
	th = threading.Thread(target = thread_main, args = (li, i))
	threads.append(th)

for th in threads:
	th.start()
for th in thrades:
	th.join() #스레드 실행 완료 대기
```

### 경쟁 조건

```python
import threading

#모든 스레드가 공유할 데이터
g_count = 0

def thread_main():
	global g_count
	for i in range(100000):
		g_count += 1 

threads = []
for i in range(50):
	#스레드 객체를 생성, target: 실행할 스레드 함수, args: 전달할 인자 목록
	th = threading.Thread(target = thread_main)
	threads.append(th)

for th in threads:
	th.start()
for th in thrades:
	th.join() #스레드 실행 완료 대기

print(g_count)
```

- 스레드 50개가 동시에 g_count 값에 접근하여 값을 수정하려고 시도할 것 (공유 자원)
- 실행할 때마다 매번 다른 값이 나옴 → 컨텍스트 스위칭이 언제 일어나느냐에 따라!
- 이렇게 공유 자원에 접근해 변경을 시도하는 코드를 임계 영역(critical section)이라고 하는데 이처럼 문제가 발생
   - 해결방법: 상호 배제(mutual exclusion)

### 상호 배제

- 스레드 하나가 공유자원을 이동하는 동안에 다른 스레드가 접근하지 못하도록 하는 것
- 파이썬의 전역 인터프리터 락 (Global Interpreter Lock, GIL) : 멀티코어에서도 싱글코어를 사용하는 것과 같은 효과

```python
import threading

#모든 스레드가 공유할 데이터
g_count = 0

def thread_main():
	global g_count
	lock.acquire() #한 스레드가 락을 획득하면 나머지 스레드는 대기
	for i in range(100000):
		g_count += 1 
	lock.relase() #락을 반환, 대기하던 스레드 중 하나가 획득 

threads = []
for i in range(50):
	#스레드 객체를 생성, target: 실행할 스레드 함수, args: 전달할 인자 목록
	th = threading.Thread(target = thread_main)
	threads.append(th)

for th in threads:
	th.start()
for th in thrades:
	th.join() #스레드 실행 완료 대기

print(g_count) #예상한 대로 5000000이 나옴
```

