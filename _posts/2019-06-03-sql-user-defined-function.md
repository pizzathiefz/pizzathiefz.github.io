---
title: "[SQL] User-Defined Function"
date: 2019-06-03 11:34:00 +09:00
categories:
  - Notes
tags:
  - sql
math: true
toc: true
comments: true
---

## 기본구조

- `CREATE FUNCTION` 함수 이름 (파라미터 이름, 데이터 타입)
- `RETURNS` 데이터타입 (출력 결과)
- `BEGIN` ~  `END`
   - `DECLARE` 데이터타입과 `SET` 뒤에 꼭 세미콜론

$*$ 데이터타입 `DETERMINISTIC` : 인풋값에 따라 정해진 데이터타입, 만약 계속 바뀔 수 있다면 디폴트는 Non-deterministic이므로 따로 지정 안하면 됨

### 예시:

```sql
CREATE FUNCTION CustomerLevel(credit DECIMAL(10,2)) 
RETURNS VARCHAR(20) DETERMINISTIC
BEGIN
	DECLARE Level VARCHAR(20); 
	IF credit > 50000 THEN
		SET Level = 'PLATINUM';
	ELSEIF (credit <= 50000 AND credit >= 10000) THEN
		SET Level = 'GOLD'; 
	ELSEIF credit < 10000 THEN
		SET Level = 'SILVER'; 
	END IF;
-- return the customer level 
	RETURN (Level);
END
```

### 사용법:

```sql
SELECT customerName, CustomerLevel(creditLimit)
FROM customers
ORDER BY customerName;
```

[CASE vs IF Statement vs IF function](https://stackoverflow.com/questions/30047983/mysql-case-vs-if-statement-vs-if-function)


## 문제
### N번째로 높은 연봉을 돌려주는 함수를 만들자. 없으면 Null 리턴.

풀이1.

```sql
CREATE FUNCTION getNthHighestSalary (N INT)
RETURNS INT
BEGIN
	RETURN (
			SELECT CASE WHEN COUNT(sub.Salary) < N THEN NULL 
									ELSE MIN(sub.Salary) 
						END
			FROM(
					SELECT DISTINCT Salary
					FROM Employee
					ORDER BY Salary DESC
						LIMIT N
					) sub
	);
END
```

풀이2. `IF Function`

IF(condition, value_if_true, value_if_false)

만약 조건이 여러개고 순차적으로 실행되어야 한다면 CASE문이 더 좋을것!

```sql
CREATE FUNCTION getNthHighestSalary (N INT)
RETURNS INT
BEGIN
	RETURN (
			SELECT IF(COUNT(sub.Salary) < N, NULL, MIN(sub.Salary))
			FROM(
					SELECT DISTINCT Salary
					FROM Employee
					ORDER BY Salary DESC
							LIMIT N
					) sub
	);
END
```

풀이3. 서브쿼리 없이 `LIMIT` 와 `OFFSET` 을 이용해 풀어보자.

사실 `LIMIT` 는 인자를 2개씩 받을 수 있다.

- `SELECT * FROM table LIMIT 5, 10` → 6번부터 15번까지 (10개)
- `SELECT * FROM table LIMIT N,1` → N+1번 가져오기
   - `SELECT * FROM table LIMIT 1 OFFSET N` 앞에서 N개는 지우고 그 다음거 1개 가져오기 (바로 위 쿼리와 동일한 결과)

```sql
CREATE FUNCTION getNthHighestSalary (N INT)
RETURNS INT
BEGIN
	-- DECLARE A INT;
	SET N = N-1;
	RETURN (
				SELECT DISTINCT Salary
				FROM Employee
				ORDER BY Salary DESC
				LIMIT 1 OFFSET N 
	);
END
```

