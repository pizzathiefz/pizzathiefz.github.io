---
title: 데이터로 한국의 2030년 탄소 배출량 목표를 제안한다면
date: 2021-06-01 11:33:00 +09:00
categories:
  - Posts
  - Data
tags: 
math: true
toc: true
comments: true
image: /assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_preview.png
---
> 쏘프라이즈에 제출한 글이며, 데이터를 기반으로 한국 탄소배출량의 2030년 감축 목표를 제안할 수 있을까? 라는 질문에 대한 답입니다. [여기](https://alook.so/posts/g8Wt3K) 에서도 볼 수 있습니다.
{: .prompt-info }

한국의 2030년 탄소배출량 감축 목표를 제안하기 위해 데이터를 살펴봤습니다. 

- [상태 점검] 우선 전반적인 탄소배출량 지표와 인구/경제 성장 면에서 한국과 가장 비슷한 위치에 있는 다른 국가들은 어디인지 찾아보고, 그들과 한국의 감축 목표를 비교해 봅니다.
- [목표 제안] 탄소배출량 감축이라는 공동의 과제에서 국가별 의무를 수치화하여 이 수치에 적합한 한국의 감축 목표를 제안합니다.

최종 제안은 2030년에는 2017년 대비 탄소 배출량의 33.6% 감축하는 것으로 감축률을 상향하는 것입니다! (현재 목표 24.4%)

> **들어가기 전, 사용한 데이터 출처** : 모든 데이터는 동일 출처입니다. **월드뱅크의 데이터뱅크**( [World Bank Open Data](https://data.worldbank.org/))에서 각 주제별로 전세계 각 국가의 1960년 이후 연도별 데이터를 다운받았습니다. 탄소배출량이나 GDP 등은 매우 중요한 주제이니 만큼 데이터가 여기저기 많지만, 많은 수의 국가의 전체 데이터를 한번에 받을 수 있어서 월드뱅크가 편했습니다.
{ .promt-warning }

---

## **한국과 비슷한 나라들은 어떤 목표를 설정했을까?**

전세계 배출량의 대다수(95.7%)를 차지하는 189개 국가들 모두가 2015년 말에서 2016년 상반기 사이에 각 국가의 자발적 기여(NDC), 즉 각자의 감축 목표를 제출했기 때문에, 우선 2015년 기준으로 한번 살펴보겠습니다. 물론 일부 국가들은 그 이후로 목표를 업데이트하긴 했습니다.

우선 가장 간단하게 탄소배출량과 GDP라는 지표에서 한국이 어느 정도의 위치에 있는지 봅니다.


![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_1.png)
_2015년, (x) GDP (USD), (y) 탄소배출량 (MtCO2)_

앗! 미국과 중국이 너무 어마어마한 나머지 다른 국가들이 아래 귀퉁이에 몰려서 보이질 않습니다. 미안하지만 잠시 상위 5개의 국가(미국, 중국, 러시아, 인도, 일본)을 제외해 보겠습니다.

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_2.png)
_2015년, (x) GDP (USD), (y) 탄소배출량 (MtCO2) - 미국/중국/러시아/인도/일본 제외_

이제 한국이 어디 있는지 보입니다. 이 두가지 지표 기준으로만 봤을 때 한국은 캐나다와 멕시코 같은 나라와 가까워 보이는군요.

이 두 가지 그림에서 우리는 (너무나 당연하게도) **국가의 생산력과 탄소배출량은 상관이 있다**는 사실도 알 수 있습니다. 하지만 어떤 나라들은 GDP 순위에 비해 탄소배출량 순위가 상당히 높습니다. 배출량 감축은 일반적으로 산업 발전과 상충되는 목표로 보이기 마련입니다. 막 성장하고 있는 개발도상국의 입장에서는 소득이 더 높고, 소득이 더 높은 상태까지 오는 과정에서 지금까지 더 많이 배출해왔을 것이 분명한 선진국들이 더 많은 감축 부담을 져야 한다고 주장할 수 있습니다.

그렇다면 이번에는 한번 누적 탄소배출량과 탄소배출량 2가지 지표에서 한국의 위치를 보겠습니다.

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_3.png)
_(x) 1960~2015 누적 탄소배출량 (MtCO2), (y) 2015 탄소배출량 (MtCO2) - 미국/중국/러시아/인도/일본 제외_

한국은 이란, 사우디아라비아, 브라질과 가깝게 누적 배출량에 비해 현 시점 배출량이 높은 나라입니다. 반면 일부 유럽 국가들(영국, 프랑스, 이탈리아, 폴란드)는 누적 배출량은 상위권이지만 현 시점 배출량은 비교적 낮은 편이죠. 전자의 국가들이 후자의 국가들을 보면 *너네가 지금까지 지구 막 써놓고 왜 우리한테 더 줄이래?* 할 수도 있는 문제인 것입니다.

어쨌든 어떤 데이터를 조합하여 사용하느냐에 따라 **한국과 가장 가까운 나라는 어디인가?** 라는 질문에 대한 대답이 달라질 수 있다는 것을 알겠습니다.

이번엔 3가지에 덧붙여 몇 가지 데이터를 더 써 보겠습니다.

1. 탄소배출량 (MtCO2)
2. 누적 탄소배출량 (MtCO2)
3. 인구당 탄소집약도 (MtCO2 per cap)
4. GDP당 탄소집약도 (MtCO2 per $)
5. 화석 연료 소비 비중 (%)
6. 재생 에너지 소비 비중 (%)
7. GDP (USD)
8. 인구 (명)
9. GDP 중 2차 산업의 비중(%)
10. GDP 중 제조업의 비중(%)
11. GDP 중 농림수산업의 비중(%)
12. GDP 중 서비스업의 비중(%)

우선 1번부터 6번까지는 직접적으로 탄소배출과 환경과 관련된 데이터입니다. 그리고 7번부터 12번까지는 국가의 전반적인 경제 성장 규모와 산업 구조를 반영하는 데이터입니다. '비슷함'의 여부를 따질 때 단순히 탄소배출을 얼마나 하는지만 보기보다는 해당 국가가 처한 상황을 반영하고자 하는 취지에서 추가하였습니다.

이제 위 데이터를 기반으로 국가 간 유사도를 계산해보겠습니다. 두 가지 버전으로 계산해보았고, (A. 1~6번만 사용 / B. 1~12번 모두 사용) [코사인 유사도(Cosine Similarity)](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwj-we3l-LHwAhXUAYgKHZxyDE4QFjAHegQIBBAD&url=https%3A%2F%2Fko.wikipedia.org%2Fwiki%2F%25EC%25BD%2594%25EC%2582%25AC%25EC%259D%25B8_%25EC%259C%25A0%25EC%2582%25AC%25EB%258F%2584&usg=AOvVaw11EgYXaemQdhXDbW7QrE-w) 를 사용했습니다. 코사인 유사도는 벡터 간의 코사인 각도를 통해 유사도를 구하는 방식이며, 두 벡터가 완전히 동일한 경우 1의 값을 가집니다.

전체 데이터를 다 사용한 B버전의 코사인 유사도로 그룹화되는지 시각화하면 아래와 같습니다.

- 실제로 군집화를 하자는 것은 아니고, 상식적으로 비슷해 보이거나 지리적으로 가까운 국가들이 실제 이 데이터 상으로 비슷한지 체크하기 위해 살짝 들여다 봤습니다. 따라서 아래 그림을 보실 때 2가지만 생각하면 됩니다.
- **1) 색깔이 밝을수록 유사도가 높습니다. 2) 유사한 친구들끼리 붙어 있습니다.**

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_4.png)
_국가 간 유사도_

글씨가 잘 안 보이므로 말로 좀 설명을 하자면, 맨 좌상단 작은 사각형에는 콩고, 가봉, 나이지리아와 같은 국가들이 모여 있고, 맨 우하단 작은 사각형에는 오만, 사우디아라비아, 아랍에미리트, 쿠웨이트 같은 국가들이 모여 있습니다. 아프리카와 중동에서는 비교적 이 유사도가 잘 표현된 것 같죠.

중앙의 큰 사각형으로 가면 비교적 대륙의 경계가 불분명해집니다. 체코, 헝가리, 슬로바키아 등 동유럽 국가들이 모여있어서 상식상 납득할 수 있는 부분과, 이 나라들이 대체 왜 비슷하지? 싶은 부분이 섞여 있습니다.

이상하게 비슷한 나라들의 경우 제 상식이 부족한 것이거나(사실 부족하긴 합니다. 학교 다닐 때 세계지리 공부를 안 했거든요), 의외로 진짜 배출량이나 GDP 비중이 비슷할 수도 있고요. 무엇보다 12가지라는 제한적인 수의 변수를 썼기 때문일 가능성이 큽니다.

그래도 이 데이터를 기반으로 한국과 가장 가까운 10개의 국가들을 확인해 보겠습니다.

**A. 탄소배출 & 환경 관련 데이터만 사용한 경우 (1~6)**
![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_5.png)

**B. 전체 데이터를 사용한 경우 (1~12)**
![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_6.png)


그렇다면 이 나라들은, 그리고 우리나라는 현재 어떤 감축 목표를 설정하고 있을까요?


우선 한국은 **2015년 당시 2030년 BAU 대비 37% 감소[BAU 유형]**를 목표로 제출했습니다. 그러나 최근 들어 **2017년 배출량 대비 24.4%[절대량 유형]로 수정**하겠다고 했죠.

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_7.png)
_국가 별 탄소 감축 유형_

파리 협약은 국가별로 자율적으로 목표를 설정하도록 하였기 때문에, 국가마다 절대량 기준, GDP나 인구당 배출량을 계산하는 배출 집약도 기준, 그리고 미래의 BAU(Business-As-Usual) 전망치 기준 등 다양한 기준으로 목표를 설정했습니다. [조사된 INDC 현황](https://www.kei.re.kr/mislibList.es?mid=a10201090000&proj_div=&act=view&proj_rqst_no=PROJ20160119&rn=4642&nPage=465&keyField=&keyWord=) (*그림 출처*)에 따르면 전체 NDC 제출 국가 중 약 45%가 BAU 목표로 설정했다고 하는데요. BAU는 일반적으로 이후 성장 가능성이 큰 개도국에서 많이 택하는 방식입니다. 유럽과 북미권 국가들, 일본은 절대량을 택하고 있으며 중국과 인도는 집약도를 이용하고 있습니다.

한국은 [BAU의 경우 국가의 경제성장에 따라 예측 정확도가 보장되지 않기 때문에 선진국에서 많이 사용하는 절대량 기준으로 변경하겠다](https://www.hankyung.com/economy/article/202012151042i)고 한 것입니다. 그러나 이는 기준을 변경한 것일 뿐이지 2030년 절대적 배출량은 536 MtCo2로 동일하여, **실질적으로 감축 목표량을 늘린 것은 아닙니다**. 그래서 아무것도 안 한다, 제자리걸음이다 등의 비판을 듣고 있는 것이죠.

이제 계산된 유사도 기반으로 한국과 비슷한 나라들의 목표를 확인해 보았습니다.

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_8.png)

20개 나라들 중 절반이 넘는 11개국이 EU 국가들이어서(*전체 데이터를 사용한 B 버전의 경우 동유럽 국가들이 다수 포함되었네요.*) EU 공통 목표인 1990년 배출량 대비 55% 감축이라는 절대량 유형의 목표를 택하고 있습니다. EU는 2015년 당시 90년 대비 40%로 제출하였다가 최근 55%로 상향한 바 있습니다. 일본도 마찬가지로 초기 제출한 13년 대비 26%에서 46%로 최근 대폭 상향 계획을 밝혔고요.

정부에서 *우리도 선진국들처럼 절대량 목표로 가겠다!* 고 한 만큼 절대량 목표를 설정한 국가들과 비교를 해보겠습니다.

여기서 잠깐, 절대량 유형을 선택한 국가들은 각자 기준으로 삼은 연도가 다릅니다. EU는 1990년, 호주는 2005년, 일본은 2013년, 한국은 최근 수정한 기준으로 2017년을 선택하고 있죠. 따라서 이를 비교하기 위해 2015년 기준으로 통일을 해보겠습니다. 즉 각자의 기준에 기반하여 2030년 절대적인 배출량 목표치를 계산하고, 이를 각 국가의 2015년 배출치에 비교하여 얼마나 감축한 것인지를 계산해보겠다는 것입니다.

그 결과는 다음과 같습니다.

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_9.png)
_국가 별 2015년 대비 2030년 탄소 감축 비율 추산_

순서대로 2015년 배출량, 2030년 목표 배출량, 그리고 그 목표가 30년에 실행된다고 했을 때 2015년 대비 감축 비율입니다. 즉 마지막 칼럼이 바로 만약 모두 똑같이 2015년 기준으로 배출량 감축 목표를 정한다면, 각 나라들의 현재 목표가 어떤 차이가 있는지를 보여줍니다.

이 비율을 작은 순서대로 보겠습니다.

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_10.png)
_2030년 탄소 감축 비율 추산_

한국의 현재 목표(2030년에 536 MtCO2만큼 배출하겠다)는 안타깝게도 2015년 대비 감축률이 **10%**에 지나지 않습니다.

같은 목표를 지닌 EU 국가 내에서도 2015년 대비 감축 비율을 계산하면 20%에서 60%까지 차이가 난다는 사실이 흥미롭습니다. 또한 2005년 대비 26%를 감축하겠다고 한 호주가 2015년 기준으로는 75%로 가장 높아집니다. 이건 어쩌면 10년 동안 호주가 목표를 별로 실천하지 못했다는 얘기도 될 것 같습니다만 그것은 이 숫자만으로는 내리기 어려운 결론이므로 넘어가겠습니다.

어쨌든 중요한 것은 한국이 선진국처럼 절대량 목표를 설정하겠다고 했으나, 비교적 최근 연도인 2015년 대비 감축률 목표가 **탄소배출량/GDP/인구/산업구조 등이 비슷한 다른 절대량 목표를 지닌 나라들에 비해 지나치게 낮다**는 점입니다. 한국을 제외한 나머지 12개국의 평균 감축률은 47.4%입니다.


## **감축 의무에 따라 목표를 조정할 수 있을까?**

다시 질문으로 돌아가서, 질문은 2030년 한국의 탄소배출량 목표를 정하는 것이었습니다.

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_11.png)
_탐소 감축 목표를 설정해봅니다_

목표 퍼센테이지를 딱 뽑아내고 싶은데, [이 분](https://www.yna.co.kr/view/AKR20210425061200073)과는 달리 저는 실루엣이 잘 떠오르지가 않네요. 그래서 아래와 같은 흐름으로 한 번 고민을 해봤습니다.

편집자님 코멘트처럼 기후변화 문제는 전세계의 조별과제입니다. 조별과제의 기본은 적절한 수준의 역할 배분입니다. 2도 상승 방지라는 공동의 목표를 이루기 위해 노력해야 하는 100이라는 양이 있다면, 그 양을 각 나라가 알맞게 나눠 가져야 할 것입니다.

문제는 이 상황이 **모두가 0에서 시작하는 동등한 조별과제가 아니라는 것입니다**. 앞서 언급한 것처럼 현재 급속한 성장 단계에 있는 국가들은 지금까지 탄소 배출량이 많았고 경제적으로 여유로운 국가가 더 많은 감축량을 부담해야 한다고 주장할 수 있습니다. 파리 협약도 이를 고려하여 협의된 부분이 있고요. 한국과 앞서 비교한 다른 나라들 사이를 볼 때도, 한국은 유럽 국가들에 비해서 비교적 최근에 성장한 나라입니다. 아무리 2015년에 그 나라들과 비슷하다고 해도, 역사적인 발자국은 완전히 다르죠.

그러나 현재 시점에서 절대적 배출량이 많은 국가들이 감축량을 늘려야 기후 변화라는 거대한 문제에 대응할 수 있다는 것 역시 분명합니다. 한국도 이제는 GDP 기준 전 세계를 10위를 웃돌고 있고, 탄소 배출량도 마찬가지인 만큼 우선적인 노력이 필요한 나라 중 하나라고 할 수 있겠습니다.

결국 각 나라가 얼마나 감축해야 하는가라는 질문을 던지자면 현재 배출량, 누적 배출량, 그리고 생산 능력이 모두 고려되어야 합니다. 이 간단한 아이디어를 가지고 **각 국가의 감축 의무**를 산출해 보겠습니다.

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_12.png)
_국가 별 감축 의무 산출식_

각 국가 i에 대해

- E : 각 국가의 현재 탄소 배출량
- C : 각 국가의 현재까지 누적 탄소 배출량
- G : 각 국가의 현재 GDP

즉 각 국가가 탄소 배출량, 누적 탄소 배출량, GDP에 대해 전 세계에서 차지하는 비중 값을 더하되, 어떤 부분이 가장 중요한가에 따라 가중치를 a, b, c로 설정하여 더하자는 것입니다.

저는 그래도 현재 배출량이 많은 나라가 우선적으로 노력해야 문제 해결에 다가설 수 있다는 주관적 의견 하에 a=0.5, b=0.25, c=0.25의 가중치를 설정하여 계산해보겠습니다.

아래와 같이 각국의 감축 의무를 수치화할 수 있습니다. 한국은 0.017 정도의 값으로 9위를 차지합니다.

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_13.png)
_국가 별 탄소 감축 의무 점수_

가정은 이렇습니다.

1. 이 감축 의무를 나타내는 점수 값에 비례하여 15년 대비 30년까지 절대적 감축량을 정한 것이라고 보자. (즉, 감축 의무 점수 * x = 감축량)
2. 앞서 비교한 <한국과 비슷한 나라들>을 바탕으로 x 값의 평균을 계산하고, 이 평균 x값을 사용하여 한국의 절대적 감축량 목표를 계산하자.

이렇게 하면 **최대한 한국과 비슷한 나라들과 평균적으로 비슷한 수준의 목표를 정하면서, GDP/배출량/누적배출량에 기반한 감축 의무를 반영**할 수 있겠습니다.

x 값은 아래와 같이 계산됩니다. (평균 12501.2)

![](/assets/img/posts/2021-06-01-korea-2030-carbon-emission-goal_14.png)
_탄소 감축 의무를 고려한 국가 별 2015년 대비 2030년 탄소 감축비율 목표_

평균을 한국의 감축 의무 점수인 0.017604에 곱하면 **한국의 2015년 대비 2030 절대적 감축량 목표는 220 MtCO2**입니다.

이는 **2017년 대비 33.6% 감축이라고 할 수 있습니다. 즉 현재 목표인 24.4% 감축보다는 상향 조정**된 것으로, 역시 갈 길이 멀다는 생각이 듭니다. 어쨌든 실제로 정부가 올해 안에 상향 조정안을 내놓기로 하였으니 지켜봐야겠습니다!

---

기후 변화와 환경 문제는 항상 관심을 가져야 한다고 생각만 하고 공부와 실천은 어려웠던 주제였는데, 이번 기회를 통해 우리나라 그리고 전 세계의 상황에 대해 조금 더 알게 되어 좋네요.

아마 티가 났겠지만 저는 이 분야에 대한 지식은 거의 없습니다. 목표 수립이라는 것은 보통 1) 얼만큼 해야 한다 2) 얼만큼 할 수 있다를 둘 다 보고 진행되어야 하는 것인데, 제가 아는 바가 없어 후자는 전혀 반영하지 못했다는 것이 아쉽습니다. 위 모든 수치는 남들 이만큼 하니 우리도 해야 되지 않을까? 정도의 당위적 제안임을 생각해 주시면 좋을 것 같습니다. 보완할 점이 있다면 피드백은 언제든 환영입니다.

- [colab 노트북과 사용한 데이터의 csv 파일](https://drive.google.com/drive/folders/1yoCF7LctlpKS3MCbl55mfcKNjqqKPGbO?usp=sharing)을 공유합니다. 데이터의 경우 월드뱅크에 직접 가셔서 조회하셔도 됩니다.

