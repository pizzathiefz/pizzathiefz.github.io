---
title: 스파크 3.0의 새로워진 Pandas UDF
date: 2020-07-19 11:33:00 +09:00
categories:
  - Posts
  - Data
tags:
  - spark
math: true
toc: true
comments: true
---
![](/assets/img/posts/2020-07-19-spark3-new-pandas-udf-main.png)

지난달(6월 18일)에 Spark 3.0 이 릴리즈되었습니다. 어떤 변화와 기능 추가가 있는지 살펴보다가, 업무에서 자주 사용하게 되는 Pandas UDF 관련 내용이 있어 우선적으로 파악해야겠다 싶었습니다. 이 글은 [데이터브릭스 엔지니어링 블로그에 권혁진님께서 작성해주신 포스팅](https://databricks.com/blog/2020/05/20/new-pandas-udfs-and-python-type-hints-in-the-upcoming-release-of-apache-spark-3-0.html)을 참고하여 익힌 내용을 간단하게 정리한 글입니다.  그 외의 Spark 3.0의 다른 티켓들은 [여기](https://spark.apache.org/releases/spark-release-3-0-0.html)에서 확인하실 수 있습니다.

## Pandas UDF란?

Pandas UDF(user-defined function; 사용자 정의 함수)는 Spark 사용자들이 매우 편리하게 Pandas API를 사용할 수 있도록 해 줍니다. [Apache Arrow](https://arrow.apache.org/) 를 통해 실행되어, vectorized된 연산으로 그냥 한번에 row마다 실행되는 Python UDF를 사용하는 것에 비해 100배 이상 빠른 성능을 보장합니다. 다음은 인풋에 1을 더한 결과를 내놓는 Pandas UDF의 예시입니다.

```python
from pyspark.sql.functions import pandas_udf, PandasUDFType

@pandas_udf('double', PandasUDFType.SCALAR)
def pandas_plus_one(v):
    # `v` is a pandas Series
    return v.add(1)  # outputs a pandas Series

spark.range(10).select(pandas_plus_one("id")).show()
```

자세한 내용과 사용 예제들은 여기 [또다른 데이터브릭스 블로그 글](https://databricks.com/blog/2017/10/30/introducing-vectorized-udfs-for-pyspark.html)을 참고하실 수 있습니다.

## 기존 Pandas UDF의 문제점

Spark 2.3 이후로 여러 Pandas UDF 형태들이 등장했고, 시간이 지나자 사용자 입장에서는 각기 다른 케이스들을 명확히 배우고 구분하기가 어려워졌습니다. 다음은 똑같은 결과를 가져오도록 작성된 세 가지 다른 Pandas UDF입니다.

```python
from pyspark.sql.functions import pandas_udf, PandasUDFType
@pandas_udf('long', PandasUDFType.SCALAR)
def pandas_plus_one(v):
    # 인풋, 아웃풋 모두 판다스 시리즈
    return v + 1  
```

```python
from pyspark.sql.functions import pandas_udf, PandasUDFType

@pandas_udf('long', PandasUDFType.SCALAR_ITER)
def pandas_plus_one(itr):
    # 인풋, 아웃풋 모두 판다스 시리즈의 이터레이터
    return map(lambda v: v + 1, itr) 
```

```python
from pyspark.sql.functions import pandas_udf, PandasUDFType

@pandas_udf("id long", PandasUDFType.GROUPED_MAP)
def pandas_plus_one(pdf):
    # 인풋, 아웃풋 모두 판다스 데이터프레임
    return pdf + 1  
```

결과나 사용 용도는 똑같은데 각 UDF 가 다른 인풋과 아웃풋 타입을 요구하고, 퍼포먼스나 작동 방식도 다릅니다. 1번과 2번 같은 경우에는 그냥 일반적인 pyspark 칼럼과 함께 쓰일 수 있는 반면, 즉 예를 들면  `withColumn` 으로 칼럼을 추가하는 데 쓰거나, 다른 expression과 섞어서 `pandas_plus_one('A') + 1` 이런 식의 사용이 가능한 반면, 3번은  `groupby('A').apply(pandas_plus_one)` 처럼만 쓰일 수 있습니다.

이러한 측면의 불일치성과 혼란을 해결하기 위해 Spark 3.0에서 Pandas UDF는 Python 타입 힌트(Type Hint)와 연동되었습니다. 

## Type Hint란?

Python은 동적인 언어로서 변수들의 타입을 알아서 추론하고, 미리 지정해주지 않아도 유연하게 값에 따라 작동합니다. 이러한 방식은 나름의 이점이 있지만, 코드가 길어질수록 예상치 못한 오류의 발생 원인이 될 수도 있습니다.

타입 힌트는 함수를 작성할 때 인자와 리턴값, 변수들에 정적으로 타입을 지정하는 것입니다. `typing` 모듈을 통해 작성할 수 있습니다. 예시는 다음과 같습니다.

```python
from typing import *
def greeting(name: str) -> str:
    s: str = 'Hello ' + name
    return s
```

 `name: str` 은 `name`이라는 인자를 `str` 을 받고, `-> str` 은 이 함수의 리턴값도 `str` 이라는 사실을 표기해 놓은 것입니다. 물론 필요에 따라 모든 타입을 다 지정하거나, `Union` 을 통해 제한된 몇 가지 종류 내의 타입을 고를 수도 있습니다. 

주의할 점은 타입 힌트는 '지정'이 아니라 말그대로 '힌트'라는 것입니다. 이 기능 자체로는 선언 외의 기능은 없습니다. 그러나 Pycharm이나 VS Code 같은 IDE를 사용한다면 자동 완성이나 오류 체크가 매우 편리해지며, mypy 타입 체커를 이용해도 됩니다. 또 타입 힌트를 사용하면 함수가 뭘 하고 싶은 건지 명확히 정의할 수 있고, 다른 사람이나 미래의 내가 이해하기도 쉽다는 이점이 있습니다.

## Pandas UDF + Type Hint = ?

다시 Spark 3.0의 Pandas UDF로 돌아옵시다. 여서도 타입 힌트를 적용한다면, 위의 3가지 케이스를 다음과 같이 헷갈리지 않고 깔끔하게 작성할 수 있습니다.

```python
def pandas_plus_one(v: pd.Series) -> pd.Series:
    return v + 1
```

```python
def pandas_plus_one(itr: Iterator[pd.Series]) -> Iterator[pd.Series]:
    return map(lambda v: v + 1, itr)
```

```python
def pandas_plus_one(pdf: pd.DataFrame) -> pd.DataFrame:
    return pdf + 1
```

일반적으로 Python 코드를 작성할 때 타입 힌팅은 옵션이지만, **새로운 Pandas Udf는 타입 힌팅이 필수입니다**. 원한다면 타입을 세부적으로 지정해 줘야 하는 기존의 Pandas UDF 방식으로 사용할 수도 있지만요.

다음은 새로운 Pandas UDF가 지원하는 4가지 케이스의 예시입니다.

### 1. **Series → Series**

```python
import pandas as pd
from pyspark.sql.functions import pandas_udf       

@pandas_udf('long')
def pandas_plus_one(s: pd.Series) -> pd.Series:
	return s + 1
```
### 2. **Iterator of Series → Iterator of Series**
- Spark 3.0에 처음 등장하는 형식 

```python
from typing import Iterator
import pandas as pd
from pyspark.sql.functions import pandas_udf       

@pandas_udf('long')
def pandas_plus_one(iterator: Iterator[pd.Series]) -> Iterator[pd.Series]:
	return map(lambda s: s + 1, iterator)
```

### 3. **Iterator of Multiple Series → Iterator of Series**
- Spark 3.0에 처음 등장하는 형식    

```python
from typing import Iterator, Tuple
import pandas as pd
from pyspark.sql.functions import pandas_udf       

@pandas_udf("long")
def multiply_two(iterator: Iterator[Tuple[pd.Series, pd.Series]]) -> Iterator[pd.Series]:
	return (a * b for a, b in iterator)
```
 
### 4. **Series → Scalar** 
- 기존의 grouped aggregate Pandas UDF에 대응
- 리턴인 하나의 scalar 는  `int`, `float`, `numpy.int64`, `numpy.float64` 등으로 지정 가능

```python
import pandas as pd
from pyspark.sql.functions import pandas_udf
from pyspark.sql import Window

df = spark.createDataFrame(
	[(1, 1.0), (1, 2.0), (2, 3.0), (2, 5.0), (2, 10.0)], ("id", "v"))

@pandas_udf("double")
def pandas_mean(v: pd.Series) -> float:
	return v.sum()

df.select(pandas_mean(df['v'])).show()
df.groupby("id").agg(pandas_mean(df['v'])).show()
df.select(pandas_mean(df['v']).over(Window.partitionBy('id'))).show()
```
**+)** 주의해야 할 점:  타입 힌트는 모든 케이스에서 `pandas.Series` 를 사용해야 합니다. 단 인풋이나 아웃풋 중  `StructType` 이 있을 때는 다음과 같이  `pandas.DataFrame` 로 힌트를 지정합니다.

```python
import pandas as pd
from pyspark.sql.functions import pandas_udf

df = spark.createDataFrame(
    [[1, "a string", ("a nested string",)]],
    "long_col long, string_col string, struct_col struct<col1:string>")

@pandas_udf("col1 string, col2 long")
def pandas_plus_len(
        s1: pd.Series, s2: pd.Series, pdf: pd.DataFrame) -> pd.DataFrame: 
    pdf['col2'] = s1 + s2.str.len() 
    return pdf  
```