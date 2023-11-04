---
title: "[Python] 22가지 코드 지름길"
date: 2022-01-21 11:33:00 +09:00
categories:
  - Notes
tags:
  - python
math: false
toc: true
comments: true
---
> [파이썬 스킬 업](https://www.gilbut.co.kr/book/view?bookcode=BN003100)을 보고 정리한 내용입니다.
{: .prompt-info } 


1 - **필요하다면 코드를 여러 줄에 걸쳐서 작성한다.**
   - 물리적으로 1줄보다 더 긴 문장을 작성하려면?

```python
#줄-연장 문자인 역슬래시 기호 사용
my_str = 'I am Hen-er-y the Eigth,' \
' I am!'

#괄호를 사용해서 물리적으로 다음 줄을 자동으로 연결
my_str = ('I am Hen-er-y the Eigth, ' 
' I am!')
```

2 - **for 루프는 현명하게 사용한다.**
   - range 사용 자제

```python
#이거보단
for i in range(len(my_list)):
	print(my_list[i])

#이거
for guy in my_list:
	print(guy)
```

3 - **대입 연산자 조합을 이해한다.**
   - 대입 연산자는 피연산자의 가변 유무에 따라 객체 값 변경 유무를 결정함
  - 불변일 경우: 같은 변수에 완전히 새로운 객체를 생성하여 대입

```python
s1 = s2 = 'A String.'
s1 += '...with more stuff!'
print(s1) #A String...with more stuff! -> 새로운 객체
print(s2) #A String. -> 기존 건 그대로
```

  - 가변일 경우: 이미 메모리에 존재하는 데이터를 변경

```python
a_list = b_list = [1,2]
a_list += [3,4]
print(a_list) #[1,2,3,4]
print(b_list) #[1,2,3,4] #변경된 그 데이터를 참조하기 때문에 같이 추가됨
```

- 값을 직접 변경하는 연산 대부분이 항상 더 효율적임
 - 큰 문자열을 만들 때 처리 속도가 중요하다면 +=보다 join이 더 효율적

4 - **다중 대입을 사용한다.**
   - `a = b = c= d = e = 0`

5- **튜플 대입을 사용한다.**
   - `a, b = 1, 0`
   - `a = 4,8, 12` 이렇게 하면 a 는 3개의 값을 지닌 튜플이 됨
   - 임시 변수 없이 두개 변수를 동시에 설정하는 것도 가능

```python
#이렇게 안하고
temp = a
a = a+b
b = temp
#이렇게
a, b = a+b, a

#서로 값을 바꿀 때도
a, b = b, a
```

6 -  **고급 튜플 대입을 사용한다.**
   - 튜플 언팩

```python
tup = 10, 20, 30
a, b, c = tup
#개수 안 맞으면 런타임 에러
```

   - 하나의 항목만 가진 튜플 생성하기

```python
my_tup = (3) #이렇게 하면 class int
my_tup = (3,) #이렇게 해야 튜플
```

   - 별표 기호 사용하기

```python
a, *b = 2,4,5,6 #a 가 2 고 b가 나머지 항목 리스트
a, *b, c = 10, 20, 30, 40, 50 #a가 10, c가 50, b가 가운데 항목 리스트
```

7 -  **리스트와 문자열 ‘곱하기’를 사용한다.**
   - 매우 큰 리스트를 특정 값으로 초기화하기

      `my_list = [0]*100000`

   - 단 곱하기는 유일한 키를 가지는 딕셔너리와 세트에서는 사용할 수 없음
   - 문자열에서는 사용할 수 있음


8 - **다중 값을 반환한다.**
   - 함수의 출력변수는 여러 개를 반환할 수 있음

```python
def quad(a, b, c):
	#...
	return x1, x2
```

9 - **루프와 else 키워드를 사용한다.**
   - 루프에서 사용하는 try-except 문법으로 else를 사용
   - 루프가 break 문을 만나서 일찍 빠져나오지 않는 한 루프 종료시 실행함

```python
def find_divisor(n, m):
	for i in range(2, m+1):
		if n%i ==0:
			print(i, 'divides evenly into', n)
			break
	else: #약수를 못찾고 루프가 종료되는 경우
		print('No divisor found')
```

10 - **불리언과 not의 이점을 활용한다.**
   - 파이썬은 모든 객체를 True 혹은 False로 평가함
   - 예를 들어 파이썬의 모든 빈 컬렉션이나 None인 컬렉션은 불리언 테스트하면 False임
      - `if len(my_str)==0` 해도 되지만 `if not my_str` 해도 됨
   - 값이 0인 숫자나 None 도 False임

11 - **문자열은 문자의 나열로 다룬다.**
   - 각각의 문자들로 복잡한 연산 처리를 한 후 문자열을 만든다면 문자(길이가 1인 문자열)로 이루어진 리스트를 생성하여 join과 함께 리스트 함축을 하는 것이 더 효율적
   - 회문인지 테스트하기

```python
a_list = [c.upper() for c in test_str if c.isalnum()]
print(a_list == a_list[::-1]_
```

12 -  **replace를 사용하여 문자를 제거한다.**
   - `s = s.replace(' ', '')`
   - 만약 한번에 많이 삭제하고 싶다면 리스트 함축 사용

```python
a_list = [c for c in s if c not in 'aeiou']
s = ''.join(a_list)
```

13 -  **필요 없는 루프는 사용하지 않는다.**
   - sum, len 등의 내장 함수를 사용할 수 있다면 굳이 루프를 쓰지 않는다.

14 -  **연결된(chained) 비교 연산자를 사용한다.**
   - 일반적인 if 문 조건 작성 방식이 `if 0 <x and x <100` 이라면, 연결된 비교 연산자는 `if 0 < x <100` 이런 식으로 작성
   - 비교 개수는 제한이 없으며 모든 표준 비교 연산자를 사용가능. 동일한 방향을 바라볼 필요도 없음
      - `0<a<=c>b>1` 이렇게도 됨

15 -  **함수 테이블(리스트, 딕셔너리)로 switch 문을 모방한다.**
   - 사용자 입력에 따라 서로 다른 함수를 호출한다고 치면

```python
if n=1:
	num_1(df)
elif n=2:
	num_2(df)
#...
#이런식으로 쓰면 너무 장황하다.
```

   - 파이썬 함수는 객체이기 때문에 다른 객체와 같이 리스트의 항목이 될 수 있다.

```python
fn = [num_1, num_2, num_e, num_4][n-1]
fn(df)
```

 - 만약 n=2 이면 fn[1]인 num_2 실행
- 딕셔너리를 사용해서 더 유연하게 제어할 수 있다.

```python
menu_dict = {'load': load_fn, 'same':save_fn, 'exit', exit_fn}
(menu_dict[selector])() #함수 호출
```

16 -  **is 연산자는 정확하게 사용한다.**
   - 동등비교 연산자`(==)`와 is 연산자는 결과가 같을 때도 있고 다를 때도 있다.
   - `==`는 값이 같은지를 보고 is 는 메모리 상 같은 객체를 참조하고 있는지를 보기 때문
   - None, True, False와 같은 독특한 객체는 is 를 통해 비교할 수 있고, is 가 더 효율적이다.

17 - **단일 행 for 루프를 사용한다.**
   - 루프 안에 1줄만 있을 정도로 충분하면 그냥 1줄로 한다.
      - `for in in range(10): print(i)`

18 - **여러 문장을 하나의 행으로 줄인다.**
   - 세미콜론을 사용해 물리적 줄을 나누는 기준으로 쓴다.
      - `for i in range(5): n = i*2; m=5; print(n+m)`

19 -  **단일 행 if/then/else 문을 작성한다.**
   - `cell = 'X' if turn %2 else '0'`

20 -  **range와 함께 Enum을 생성한다.**
   - red, green, blue, green, white, black을 인디케이터 값을 1~5로 지정하고 싶다고 치자
      - `red, blue, green, black, white = range(1,6)`

21 - **IDLE 안에서 비효율적인 print 함수 사용을 줄인다.**
   - IDLE 안에서 호출한 print 문은 속도가 너무 느리다.
   - 별표`(*)`로 40x20 블록을 만들고 싶다고 할 때 800번 출력하면 안됨
   - 그냥 여러 줄의 문자를 만들어 한번만 프린트하도록 하자.
      - `print('\n'.join(['*'*40]*20))`

22 - **큰 번호 안에 언더스코어`(_)`를 넣는다.**
   - 큰 리터럴 숫자는 읽기 힘드므로 콤마 대신 언더스코어를 사용한다.
      - 예: `CEO_salary = 1_500_000`
   - 언더스코어는
      - 한번에 2개 사용할 수 없고, 맨앞/맨뒤에 사용할 수 없다. 맨앞에 사용하면 변수 이름으로 여긴다.
      - 실수의 정수나 소수점 양쪽에 모두 사용할 수 있다.

