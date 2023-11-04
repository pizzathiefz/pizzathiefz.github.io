---
title: "[SQL] Window 함수 문제"
date: 2019-06-03 11:32:00 +09:00
categories:
  - Notes
tags:
  - sql
math: true
toc: true
comments: true
---

### Consecutive Numbers

3번 연속하는 숫자 찾기

**Window 함수 안쓰고(SELF JOIN) :**

```sql
SELECT DISTINCT l.Num AS ConsecutiveNums
FROM logs AS l
		INNER JOIN logs AS l_next ON l.id + 1 = l_next.id
		INNER JOIN logs AS l_next2 ON l.id + 2 = l_next.id

WHEN l.Num = l_next.Num AND l.Num = l_next2.Num
```

**Window 함수 쓰고**:

`LEAD` 나 `LAG` 사용

```sql
SELECT DISTINCT l.Num AS ConsecutiveNums
FROM(
		SELECT Num
			, LEAD(Num, 1) OVER (ORDER BY Id) AS next_num
			, LEAD(Num, 2) OVER (ORDER BY Id) AS after_next_num
		FROM logs
) l
WHERE l.Num = l.next_num AND l.Num = l.after_next_num
```

### Department Highest / TOP 3 Salaries

1. 제일 많이 버는 사람과 사람의 액수

`MAX` 말고도 `RANK`나 `DENSE_RANK` 사용할 수 있음

```sql
SELECT ms.department, ms.name AS Employee, ms.salary
FROM (
	SELECT employee.name
			, employee.salary
			, department.name AS department
			, MAX(salary) OVER (PARTITION BY departmentid) max_salary
	FROM employee
			INNER JOIN department ON employee.departmentid = department.id
		) ms
WHERE ms.salary = ms.max_salary
```

2. 3위까지

값이 같은 사람이 있을 땐

- `RANK` 1,2,2,4
- `DENSE_RANK` 1,2,2,3

이 문제는 같으면 다 출력하라고 했으므로 `DENSE_RANK` 써야함

```sql
SELECT t.department, t.employee, t.salary
FROM ( 
	SELECT department.name AS department
				, employee.name AS employee
				, employee.salary
				, DENSE_RANK() OVER (PARTITION BY departmentid ORDER BY salary DESC) AS dr
	FROM employee
			INNER JOIN department ON employee.departmentid = department.id
		) t
WHERE t.dr <= 3
```

