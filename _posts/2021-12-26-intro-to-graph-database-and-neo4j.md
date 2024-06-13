---
title: 그래프 데이터베이스 소개와 Neo4j
date: 2021-12-26 11:33:00 +09:00
categories:
  - Posts
  - Data
tags:
  - graph
math: false
toc: true
comments: true
image: /assets/img/posts/2021-12-26-intro-to-graph-database-and-neo4j_neo4j-logo.png
---
> 그래프 데이터베이스의 기본 개념들과 Neo4j를 간단히 소개하고, 샌드박스 DB를 만들어 Python으로 연결해봅니다.
{: .prompt-info }


## 그래프 데이터베이스란?

그래프 이론에 토대를 둔 일종의 NoSQL 데이터베이스입니다. 데이터의 연결관계 저장에 있어 RDBMS 대비 가장 큰 장점은 인덱스 없이도 빠르게 연결된 노드를 찾을 수 있다는 점입니다(**index-free adjacency**). RDBMS에서는 관계 질의를 위해 여러 개의 테이블을 복잡하게 조인해야 하며 가능한 모든 결합의 수가 늘어날수록 들어가는 리소스가 증가하게 됩니다. 반면 Graph DB에서는 훨씬 빠르고 직관적인 관계 표현과 질의가 가능합니다. 또 고정된 스키마가 없이 어플리케이션이 발달하면서 적응적으로 스키마를 변경하는 것이 가능합니다.

Neo4j가 가장 대표적인 Graph DB이며, 그 외에도 Arango DB 등이 있습니다. Neo4j는 기본적으로 **Property graph** 기반인데, 이는 Graph DB의 가장 핵심적인 요소인 노드와 관계에 각각 성질을 넣음으로써 그래프 모델에 대한 풍부한 정보를 저장할 수 있다는 뜻입니다. 아래에서 Graph DB의 핵심 개념들을 소개하면서 함께 정리하도록 하겠습니다.

Neo4j에서 저장과 호출을 할 때는 Cyper라는 그래프 특화된 질의 언어를 사용합니다. [여기](https://neo4j.com/docs/getting-started/current/cypher-intro/)에서 Cypher에 대한 간단한 소개와 입문을 접할 수 있습니다. 설명에 보면 SQL-inspired라고 되어 있는데요, 얼핏 보기에도 SQL과 제법 비슷해 보입니다. Cypher 예시 또한 아래 내용과 함께 확인해보겠습니다.

오늘 다루는 대부분의 내용은 [Neo4j 공식 문서](https://neo4j.com/docs/)를 참고하였습니다.


## 그래프 데이터베이스 기본 개념들

가장 중요한 요소들을 다음 예시로 살펴보겠습니다.

![](/assets/img/posts/2021-12-26-intro-to-graph-database-and-neo4j_g0.png)


- **노드(Node)**: 각각 구분된 엔티티 = vertices라고도 하는
    - 노드는 라벨이 없을 수도 있고 각각을 분류할 수 있도록 여러 개의 라벨을 지니고 있을 수 있다.
    - 예를 들어, 가장 좌측의 노드는 `Person` 이고 `Actor`라는 라벨을 가진다.
- **관계(Relationship)**: source node와 target node 간의 연결을 설명하는 요소 = edges 또는 links 라고도 하는
    - 관계는 항상 방향을 가진다.
        - 예를 들어, 좌측의 관계는 톰 행크스(source 노드)로부터 포레스트 검프(target 노드)로 간다.
        - 무방향 그래프도 쓰잖아? 싶은데, 방향이 안 중요하면 그냥 무시하면 된다고 한다. 즉 원하는 데이터 모델에 관계 방향이 필수가 아닌데 이걸 무방향으로 만들겠다고 반대방향의 중복되는 관계를 넣을 필요는 없겠다.
    - 관계는 항상 어떤 종류의 관계를 나타내는 건지 알려주는 type 정보를 가진다.
        - 예를 들어, 좌측의 관계는 톰 행크스가 포레스트 검프에 출연하는 배우라는 정보를 표현한다. 이때 저 관계는 '배우로서 출연'이라는 관계이며, 이를 `ACTED_IN` 이라는 type으로 저장한다.
- **노드와 관계는 각 요소를 더 자세히 설명하는 property (키와 값 쌍으로 된)를 가질 수 있다**.
    - 좌측의 노드는 name이라는 속성이 Tom Hanks라는 값을 가지고, born이라는 속성이 1956이다.
    - 좌측의 관계는 roles이라는 속성이 [Forrest]라는 값을 가진다(배우로서 출연할 때 어떤 배역으로 출연했는지 표현한다).

위 예시 그래프의 데이터를 생성하는 Cypher 구문은 이렇습니다. source → target 관계를 화살표로 연결하는 게 나름 직관적인 것 같긴 한데 길게 쓸 경우 보기 쉬운지는 아직 잘 모르겠네요.

```sql
CREATE (:Person:Actor {name: 'Tom Hanks', born: 1956})-[:ACTED_IN {roles: ['Forrest']}]->(:Movie {title: 'Forrest Gump'})<-[:DIRECTED]-(:Person {name: 'Robert Zemeckis', born: 1951})
```



## 샌드박스 Neo4j Python에서 연결하기

Neo4j Sandbox는 임시로 사용 가능한 클라우드 DB입니다. 저처럼 그래프 DB가 뭔지 잘 모르지만 궁금해서 찍먹해보고 싶은 사람들에게 간편한 선택지 같습니다. 임시로 사용가능하다는 말은 한번 생성하면 최대 3일까지만 유지되기 때문입니다. 실제로 DB를 지속 사용하고 싶다면 샌드박스가 아닌 Neo4j 데스크탑을 다운받아야 합니다.

![](/assets/img/posts/2021-12-26-intro-to-graph-database-and-neo4j_g1.png)
![](/assets/img/posts/2021-12-26-intro-to-graph-database-and-neo4j_g2.png)

샌드박스 DB를 만들려고 들어가면 고를 수 있는 선택지들입니다. Blank Sandbox는 비워진 DB로, 각자 원하는 데이터를 써서 사용하면 됩니다. Pre-built Data는 특정 그래프 데이터가 저장되어 있는 DB입니다. 이 중에서 저는 Fraud Detection을 골라 봤습니다.

![](/assets/img/posts/2021-12-26-intro-to-graph-database-and-neo4j_g3.png)

생성된 DB 정보입니다. `Expires in about 3 days`라는 문구를 확인할 수 있습니다. 이제 이 만들어진 DB에 접속을 해보겠습니다. BOLT라는 통신 프로토콜을 사용해야 하기 때문에, 저 Bolt Port값이 중요합니다. DB 주소와 Bolt Port를 합쳐 Bolt URL이 되는데요, 이것과 유저네임/패스워드를 사용해 연결하게 됩니다.

파이썬에서 Neo4j DB에 연결할 때 드라이버에는 크게 2가지 선택지가 있는 것 같습니다. Neo4j의 오피셜한 파이썬 드라이버와 `py2neo`라는 라이브러리입니다. 둘이 뭐가 다른지, 뭐가 더 나은지 검색해봤습니다. Neo4j official driver vs py2neo가 자동완성이 되더라고요?

[py2neo 측에 따르면](https://py2neo.org/2020.0/#releases-versioning), 2가지 방식의 차이는 다음과 같다고 합니다. 

> *When considering whether to use py2neo or the [official Python Driver for Neo4j 22](https://github.com/neo4j/neo4j-python-driver), there is a trade-off to be made. Py2neo offers a larger surface, with both a higher level API and an OGM, but the official driver provides mechanisms to work with clusters, such as automatic retries. If you are new to Neo4j, need an OGM, do not want to learn Cypher immediately, or require data science integrations, py2neo may be the better choice. If you are building a high-availability Enterprise application, or are using a cluster, you likely need the official driver*
> 

(참고로 OGM은 Object Graph Mapping Library라고 합니다.)

```python
#필요한 정보
BOLTPORT  = "bolt://35.175.150.89:7687"
USERNAME = "neo4j"
PASSWORD = "inlet-firearm-curve"
```

### Neo4j 공식 Python driver

```python
# pip3 install neo4j-driver

from neo4j import GraphDatabase, basic_auth

driver = GraphDatabase.driver(BOLTPORT,
auth=basic_auth(USERNAME, PASSWORD))

### 간단한 cypher query
cypher_query = '''
MATCH (m:Merchant{name:$name})<-[:TO]-(:Transaction)<-[:PERFORMED]-(c:Client)
RETURN c.name as client
'''

with driver.session(database="neo4j") as session:
  results = session.read_transaction(
    lambda tx: tx.run(cypher_query,
                      name="MYrsa").data())
  for record in results:
    print(record['client'])

driver.close()
```

### Py2neo

```python
# pip3 install py2neo

from py2neo import Graph
 
graph = Graph(BORTURL, auth=(USERNAME, PASSWORD))
```

## 참고한 글들

- [Neo4j 공식 문서](https://neo4j.com/docs/)
- [neo4j - data science - part 1](https://frhyme.github.io/others/neo4j_ds_part1/)
- [Graph DB? 그래프 데이터베이스](https://rastalion.me/graph-db-그래프-데이터베이스/)



