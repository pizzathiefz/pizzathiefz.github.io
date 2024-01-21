---
title: 스파크 UDTF(User-Defined Table Function)
date: 2024-01-21 13:55:00 +09:00
categories:
  - Posts
  - Data
tags:
  - spark
math: true
toc: true
comments: true
---
> 스파크 3.5에 새로 추가된 UDTF의 사용법을 예시와 함께 작성한 글입니다.
{: .prompt-info }

## UDTF (User-Defined Table Function)

**사용자 정의 테이블 함수**는 스파크 3.5.0에서 새로 생긴 피쳐입니다. 빌트인 함수로는 뭔가 한계가 있을 때 사용한다는 목적에 있어서는 UDF(User-Defined Function)와 같지만, 스칼라 값을 뱉어주는 UDF와는 달리(row-level transformation), **UDTF는 여러 행 (=즉 테이블)을 뱉어준다**는 것이 핵심입니다.

### UDF는 뭐더라

스파크는 여러 가지 내장 함수를 제공하고 있습니다. 다만 사용을 하다 보면 *내장 함수만 써서는 구현이 좀 어려운데? 그냥 python으로 한다면 이렇게 할 텐데..!* 라는 생각이 드는 경우가 많죠. UDF는 이럴 때 사용자 각자가 정의해서 사용할 수 있는 함수입니다. 보통은 다음과 같이 사용을 합니다.

```python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType

sample_func = lambda x: x.replace('Pizza', '')
sample_udf = udf(sample_func, StringType())

df.withColumn('pizza_new',sample_udf('pizza')).show()
# +-----------------+------------+ 
# |           pizza |  pizza_new | 
# +-----------------+------------+ 
# |  Hawaiian Pizza |   Hawaiian | 
# |Super Papas Pizza|Super Papas | 
# |Iris Potato Pizza|Iris Potato | 
# |  All Meat Pizza |   All Meat | 
# | Pepperoni Pizza |  Pepperoni | 
# +-----------------+------------+
```

특정 문자열을 없애주는 함수를 정의하고, 그 함수를 통해 새로운 칼럼을 추가해 봤습니다. 사실 가능하면 빌트인 쓰는 게 제일 나은데요. 위의 것도 예시일 뿐 사실 내장함수로 할 수 있는 작업이죠. 어쨌거나 내가 원하는 작업에 딱 맞는 내장함수가 없다는 상황이면(e.g. 특정 python 라이브러리에서 제공하는 알고리즘인데 스파크 구현은 아직 안 되어 있다든지) UDF를 쓰게 됩니다. 

이 때 그냥 UDF가 있고, pandas UDF가 있는데, 전자는 한번에 한 행씩 실행해서 (de)serialization이 다수 발생하며 상대적으로 느리다고 합니다. (물론 스파크의 네이티브 언어인 스칼라로 작성한 UDF가 제일 빠르지만 스칼라를 모른다면 접근성이 현저히 떨어지므로 이쪽은 굳이 언급하지 않겠습니다.)

- (참고) UDF 성능 비교 관련 글 [Spark UDF — Deep Insights in Performance](https://medium.com/quantumblack/spark-udf-deep-insights-in-performance-f0a95a4d8c62)
- (참고) 제가 쓴 pandas UDF 관련 글  [스파크 3.0의 새로워진 Pandas UDF](https://pizzathiefz.github.io/posts/spark3-new-pandas-udf/)

이렇게 UDF는 기본적으로 각 행의 각 값에 대한 처리를 하기 위해 사용하기 때문에 row-level로 작용한다는 것만 짚고 넘어가겠습니다. 즉 하나의 행의 값에 어떤 작업을 해서 새로운 행을 만들거나, grouped Map 을 사용하여 groupBy aggregation을 통해 여러 행을 하나의 값으로 축약하는 등의 목적으로 주로 사용을 할 수 있는 옵션이었습니다. 반면 오늘 다룰 UDTF는 앞서 언급한 대로 주어진 값 또는 테이블로부터 여러 행의 테이블을 만들어내는 데 사용할 수 있습니다.

<br>

### 써보자 UDTF -  기본적인 사용법

- `eval` 메소드(필수)가 있는 클래스를 정의함 
- `eval` 메소드 안에서는 원하는 작업을 작성하되 마지막에 튜플을 `yield` 
	- yield 이기 때문에 개념적으로는 이터레이션을 통해 여러 행들을 생성하도록 내부 동작할 것으로 이해됨
	- 즉 **UDTF를 통해 생성하고자 하는 테이블의 한 행을 튜플로** yield 해주면 됨
	- 다만 이때 꼭 한 행만 리턴하게 할 필요는 없음 (여러 행을 yield 해도 됨)
- 구현된 UDTF 기능들을 사용할 수 있도록 데코레이터를 붙여줌
	- 이때 `returnType` 파라미터로 스키마를 정의!
	- eval 에서 yield 하는 튜플은 이 스키마에 맞아야 함

조금 더 상세한 내용은 공식문서 [Python User-defined Table Functions (UDTFs)](https://spark.apache.org/docs/latest/api/python/user_guide/sql/python_udtf.html)를 참고해도 좋겠습니다.

가장 간단한 예시부터 먼저 봅시다.

```python
from pyspark.sql.functions import lit, udtf

@udtf(returnType="sum: int, diff: int")
class SimpleUDTF:
    def eval(self, x: int, y: int):
        yield x + y, x - y

#데코레이터 없이 정의한 다음 아래처럼 해도 됨
#simple_udtf = udtf(SimpleUDTF, returnType="sum: int, diff: int")

SimpleUDTF(lit(1), lit(2)).show()
# +----+-----+
# | sum| diff|
# +----+-----+
# |   3|   -1|
# +----+-----+

```

다음은 꼭 1개의 행만 yield하지 않는 예시입니다. 주어진 텍스트를 공백 기준으로 쪼갠 다음, 각 단어를 한 행으로 만들고 있습니다.

```python
@udtf(returnType="word: string")
class WordSplitter:
    def eval(self, text: str):
        for word in text.split(" "):
            yield (word.strip(),)

WordSplitter(lit('Wisconsin Cheese Potato')).show()
# +---------+ 
# |   word  | 
# +---------+ 
# |Wisconsin| 
# |  Cheese |  
# |  Potato | 
# +---------+
```

<br>
### 등록해서 SQL 쿼리에서 사용하기

UDF와 마찬가지로, UDTF도 register를 사용해서 Spark SQL 쿼리로 작성할 수 있습니다.

```python
#split_words 라는 이름으로 등록!
spark.udtf.register("split_words", WordSplitter)

spark.sql("SELECT * FROM split_words('Irish Potato')").show()

# +------+ 
# | word |  
# +------+ 
# | Irish| 
# |Potato| 
# +------+

```

`VALUES`와 `LATERAL`을 다음과 같이 사용해서, 여러 값들의 결과를 얻고 원래의 텍스트와 같이 볼 수도 있습니다.

```python
spark.sql( "SELECT * FROM VALUES ('Wisconsin Cheese Potato'), ('Super Papas'), ('Johns Favourite'), ('All Meat') t(text), "
"LATERAL split_words(text)"
).show()

# +--------------------+---------+ 
# |               text |    word | 
# +--------------------+---------+ 
# |Wisconsin Cheese ...|Wisconsin| 
# |Wisconsin Cheese ...|  Cheese | 
# |Wisconsin Cheese ...|  Potato | 
# |        Super Papas |   Super | 
# |        Super Papas |   Papas | 
# |    Johns Favourite |   Johns | 
# |    Johns Favourite |Favourite| 
# |           All Meat |     All | 
# |           All Meat |    Meat | 
# +--------------------+---------+
```

<br>

### 테이블을 인풋으로 넣으려면?


위의 예시들은 모두 UDTF의 인풋이 특정 값(literal value)인 경우였습니다. 개인적으로 여기까지 배웠을 때는 특정 값으로 테이블 만들 일이 그렇게 많진 않은데? 라는 생각이 들었습니다. 좀 더 많이 쓰는 경우는 **테이블로 테이블 만들기** 가 아닐까 싶네요. 이제 UDTF의 인풋이 테이블인 경우를 다뤄보겠습니다.

인풋이 테이블일 때는, 인풋의 각 행을 Row type으로 취급한 뒤 각 행의 칼럼명을 사용해서 작성하면 됩니다. 또 테이블 외에도 다른 인자를 넣어줄 수 있는데요. 다음 예시는 메뉴판에서 내가 사먹을 수 있는, 즉 내가 가진 돈(N원) 미만인 메뉴만 필터하여 돌려주는 함수입니다. 물론 이 목적은 스파크 내장함수로 아주 편리하게 수행할 수 있으므로 어디까지나 기능을 익히기 위한 예시입니다.

```python
from pyspark.sql.types import Row

@udtf(returnType= "pizza: string, price: int")
class HungryButBrokeUDTF:
	def eval(self, row: Row, balance: int):
		if row["price"] < balance:
			yield row["pizza"], row["price"]

spark.udtf.register("hbb_udtf", HungryButBrokeUDTF)


#input인 메뉴판 테이블의 경우 pizza와 price 2개의 칼럼으로 이루어져 있다고 가정
my_balance = 30000
spark.sql(f"SELECT * FROM hbb_udtf(SELECT * FROM menu_table, {my_balance})").show()
```

만약 인풋이 원래 테이블이 아니고 spark DataFrame이면 어떻게 할까요? 다음과 같이 `createOrReplaceTempView` 를 사용해서 임시 테이블 뷰를 만들어주면 됩니다. 

```python
#DataFrame
menu_df.show()
# +---------------+-----+ 
# |         pizza |price| 
# +---------------+-----+ 
# |      Hawaiian |27500| 
# |   Super Papas |29500| 
# |  Irish Potato |28500| 
# |Johns Favourite|30500| 
# |      All Meat |30500| 
# |     Pepperoni |26500| 
# +---------------+-----+

menu_df.createOrReplaceTempView('menu')
spark.sql(f"SELECT * FROM hbb_udtf(TABLE(menu),{my_balance})").show()

# +---------------+-----+ 
# |         pizza |price| 
# +---------------+-----+ 
# |      Hawaiian |27500| 
# |   Super Papas |29500| 
# |  Irish Potato |28500| 
# |     Pepperoni |26500| 
# +---------------+-----+

```


## 참고한 글들

- [What are Python user-defined table functions?](https://docs.databricks.com/en/udf/python-udtf.html#pass-a-table-argument-to-a-udtf)
- [Python User-defined Table Functions (UDTFs)](https://spark.apache.org/docs/latest/api/python/user_guide/sql/python_udtf.html)