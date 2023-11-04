---
title: "[SQL] GROUP BY COUNT 시 없는 시간대도 나오게 하려면?"
date: 2019-06-03 11:31:00 +09:00
categories:
  - Notes
tags:
  - sql
math: true
toc: true
comments: true
---

> 입양 시간대별로 입양 몇 건? 그룹바이 카운트 0시부터 23시까지, 그 중 0건인 시간대는 0으로 표시해야줘야 한다.
{: .prompt-info }


### **방법1. UNION 사용**

- 0~23 모든 시간을 가진 테이블 생성 후 LEFT JOIN, IFNULL

```sql
SELECT H1.HR, IFNULL(OUTS.CNT, 0) AS 'CNT'
FROM (
			SELECT 0 AS HOUR
			UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 --...
			) H_LIST
	LEFT JOIN (
			SELECT HOUR(DATETIME) AS 'HR', COUNT(*) AS 'CNT'
			FROM ANIMAL_OUTS
			GROUP BY HOUR) AS 'OUTS' ON H_LIST.HR = OUTS.HR
```

### **방법2. 변수 설정**

```sql
SET @hour := -1;

SELECT (@hour := @hour + 1) as 'H',
(SELECT COUNT(*) FROM ANIMAL_OUTS WHERE HOUR(DATETIME) = @hour) AS 'CNT'
FROM ANIMAL_OUTS
WHERE @hour < 23;
```

- **SET 옆에 변수명과 초기값을 설정하자!**
   - @가 붙은 변수는 프로시저가 종료되어도 **유지**
   - 이를 통해 값을 누적하여 0부터 23까지 표현
- @hour은 초기값을 -1로 설정. **:=**은 비교 연산자 =과 혼동을 피하기 위한 **대입 연산자**
   - 쿼리문 내에서는 무조건 = 는 비교연산자이기 때문에 := 사용해야됨
- SELECT (@hour := @hour +1) 은 @hour의 값에 1씩 증가시키면서 SELECT 문 전체를 실행하게 됨
- 이 때 **처음에 @hour 값이 -1 인데, 이 식에 의해 +1 이 되어 0**이 저장
   - HOUR 값이 0부터 시작할 수 있음
   - WHERE @hour < 23일 때까지, @hour 값이 **계속 + 1씩 증가**

###   [출처](https://chanhuiseok.github.io/posts/db-6/)

