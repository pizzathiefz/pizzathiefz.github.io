---
title: "[SQL] Subquery 문제들"
date: 2019-06-03 11:33:00 +09:00
categories:
  - Notes
tags:
  - sql
math: true
toc: true
comments: true
---

- SELECT - cumulative sum
- FROM
   - **가상의 테이블을 만든다**고 생각하자.

      ex. 각주의 평균 범죄 발생 건 구하기 → 일단 일별로 구해야 하는데 이걸 서브쿼리로 작성

```sql
SELECT daily_status.week, AVG(daily_status.incidents_daily)
FROM (
			SELECT week
						, date
						, COUNT(incident_id) AS incidents_daily
			FROM crimes
			GROUP BY week, date
				) daily_status 
GROUP BY daily_status.week
```
주의: 평균 계산시에 만약 어떤 일자에 범죄가 발생을 안했다면, groupby 후 avg를 하면 그걸 빼고 6일로 나누게 됨. → 우리가 원하는 것은 7일로 나눠서 평균을 구하는 것. 주의해서 SUM해서 7로 나누든지 해야 함.

- WHERE

```sql
SELECT *
FROM crimes
WHERE date =  (SELECT MIN(date) FROM crimes)  --오래된것만 가져오기
-- 근데 이렇게 하려면 서브쿼리의 결과문이 딱 하나여야됨
```

```sql
SELECT *
FROM crimes
WHERE date IN (SELECT distinct date FROM crimes ORDER BY date desc LIMIT 5);
-- 최신인것 5개 (1개 이상을 가져올수있음)
```

### 문제1.

제일 많이 버는 사람의 액수와 그 액수를 버는 사람의 수를 뽑아라. (버는 액수는 salary * months)

- WHERE 서브쿼리

```sql
SELECT months * salary AS earnings, COUNT(*)
FROM employee
WHERE months * salary = (SELECT MAX(months*salary) FROM employee)  -- 여기에는 as (earnings) 못씀
GROUP BY earnings
```

- HAVING 서브쿼리

```sql
SELECT months * salary AS earnings, COUNT(*)
FROM employee
GROUP BY earnings
HAVING earnings =(SELECT MAX(months*salary) FROM employee)
```

### 문제2.

각 부서의 가장 많이 버는 사람 출력. 2명 이상이면 다 출력. 부서 이름은 `department` 테이블.

```sql
SELECT d.name AS department
			, e.name AS employee
			, e.salary
FROM employee AS e
		INNER JOIN (SELECT departmentid, MAX(salary) AS max_salary
					FROM employee
					GROUP BY departmentid
					) AS dh ON e.deparmentid = dh.departmentid AND e.salary = dh.max_salary
		INNER JOIN department AS d ON d.id = e.departmentid
```

### 문제3. 해커랭크 Challenges

- 그 사람의 챌린지 수가 큰 순서대로 sort, 수가 같으면 hacker_id 순대로
- 수가 같은 경우가 있는데 그 카운팅이 maximum이 아니면 제외하기.

```sql
SELECT hackers.hacker_id
			, hackers.name
			, COUNT(*) AS challenges_created
FROM Challenges
		INNER JOIN Hackers ON Challenges.hacker_id = Hackers.hacker_id
GROUP BY hackers.hacker_id, hackers.name
--조건문, 중복 & 최대값이면 keep, 중복 & 최대값 아니면 둘다 삭제!-- 
--즉 최대값이거나 중복이 아니면 keep --
HAVING challenges_created = (SELECT MAX(hallenges_created)
							 FROM (SELECT hacker_id, COUNT(*) AS challenges_created
								   FROM Challenges
								   GROUP BY hacker_id) sub)
OR challenges_created IN (SELECT challengs_created
						  FROM (SELECT hacker_id, COUNT(*) AS challenges_created
								FROM Challenges
								GROUP BY hacker_id
								) sub
						  GROUP BY challenges_created
						  HAVING COUNT(*) = 1 )
ORDER BY chalenges_created DESC, hacker_id
```

- 위 커리는 같은 연산(챌린지 수로 사람 카운팅)을 너무 여러번 하고 있음 (비효율적)
- `WITH` 를 사용해서 재사용할 수 있도록 하자.

```sql
WITH counter AS (
			SELECT hackers.hacker_id
						, hackers.name
						, COUNT(*) AS challenges_created
			FROM Challenge
						INNER JOIN Hackers ON Challenges.hacker_id = Hackers.hacker_id
			GROUP BY hackers.hacker_id, hackers.name

SELECT counters.hacker_id
			, counter.name
			, counter.challenges_created
FROM counter
WHERE challneges_created = (SELECT MAX(challeges_create) FROM counter)
OR challenges_created IN (SELECT challenges_created
						  FROM counter
						  GROUP BY challenges_created
						  HAVING COUNT(*) =1 _
ORDER BY counter.chalenges_created DESC, counter.hacker_id
```

