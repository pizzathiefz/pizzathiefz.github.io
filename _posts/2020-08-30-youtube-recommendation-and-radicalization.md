---
title: 유튜브 추천 알고리즘과 극단주의 논쟁
date: 2020-08-30 11:33:00 +09:00
categories:
  - Posts
  - Data
tags:
  - ai-in-society
math: true
toc: true
comments: true
---

지난 수 년 간 학계와 언론에서 **유튜브의 추천 알고리즘이 사용자들을 온라인 상에서 점점 더 극단적인 정보와 의견을 접하도록 만든다**는 주장이 등장했습니다. 사용자들의 이용 기록을 바탕으로 아직 사용자가 접하지는 않았으나 흥미를 가질 법한 컨텐츠를 노출시키는 것을 목표로 하는 알고리즘이 결국 점점 더 극단의 컨텐츠를 추천하게 되고, 사용자의 의견 또한 이를 따라 급진화될 수 있다는 것입니다. 

현재 유튜브가 정보 습득부터 의견 표현까지 여러 면에서 지배적인 역할을 하는 플랫폼인 만큼, 이는 매우 심각한 영향력을 지닌 문제 제기입니다. 이 주장이 자세히 어떤 내용인지, 관련된 연구는 또 어떤 반박을 하는지, 그 연구는 어떤 한계는 있는지 등을 입장 별로 간략히 정리해 보았습니다.

## 🗣: 유튜브 급진주의자의 탄생을 보라.

![](/assets/img/posts/2020-08-30-youtube-recommendation-and-radicalization_1.png)

![](/assets/img/posts/2020-08-30-youtube-recommendation-and-radicalization_2.png)

2019년 뉴욕타임즈의 케빈 루스가 작성한 특집 기사([The Making of a Youtube Radical](https://www.nytimes.com/interactive/2019/06/08/technology/youtube-radical.html)) 는 이러한 논의 중 하나입니다. 이 기사의 도입부에서 인터뷰이는 몇 년 간 꼬리에 꼬리를 무는 유튜브 영상들을 시청하면서 백인 우월주의, 무슬림 이민자에 대한 적개심, 음모론과 여성 혐오에 세뇌되었다고 고백하며, 이 경험에 대해 이렇게 말합니다. "**저는 *(유튜브에서)* 대안 우파(alternative right)의 토끼굴에 떨어졌어요**." 이어서 기사는 이 인터뷰이의 2015년부터의 영상 시청 기록과 검색어들을 분석한 내용을 통해, 리버럴에 가까웠던 한 젊은 백인 남성이 우익 성향으로 바뀌기까지 유튜브의 영향력을 보여 줍니다.

> 젊은 층의 급진화는 많은 정치적, 경제적, 감정적 요소들에 의해 이루어지고 그 요소들은 대부분의 경우 유튜브 같은 소셜 미디어와는 관련이 없다. 그러나 비평가들과 연구자들은 유튜브가 선정적인 비디오일수록 더 많은 노출이나 광고 수익이라는 보상을 얻는 비즈니스 모델과 유저들을 스크린에 붙들어두기 위해 개인화된 추천을 제공하는 알고리즘, 이 두 가지를 통해 의도치 않게 극단주의를 향한 위험한 진입로를 마련했다고 주장한다.
> 

> 구글의 디자인 윤리학자로 일했던 트리스탄 해리스는 말한다. "유튜브 영상들은 월터 크롱카이트(저널리스트)나 칼 세이건(천문학자) 같은 차분한 영역부터 매우 극단적인 내용이 있는 제정신 아닌 영역까지 다양한 스펙트럼 위에 존재합니다. 만약에 유튜브나 제가 당신이 더 많은 영상을 보길 원한다면, 무조건 당신을 제정신 아닌 영역으로 이끌 거예요."
> 

이 기사에 따르면 유튜브는 (기본 정책으로 혐오 발언이나 괴롭힘을 금지하긴 했지만) 지난 몇 년 동안 상당히 자유방임주의에 가까운 입장을 취해 왔고, 유튜브 영상이 극단주의의 원인이라는 주장은 부인해 왔습니다. 내부적 테스트 결과 오히려 극단적인 내용을 보는 시청자들에게는 추천 알고리즘이 조금 더 온건한 내용을 추천하기까지 한다고 주장하기도 했고요. 그러나 동시에 [2019년 6월에는 네오나치즘 등의 극단적 컨텐츠를 금지하고, 잘못된 정치적 정보와 음모론의 확산을 방지하는 방향으로 추천 알고리즘을 수정하였다](https://blog.youtube/news-and-events/our-ongoing-work-to-tackle-hate)고 공지했다고 합니다.


## 🗣: 유튜브의 알고리즘에게는 시청자들을 급진화시키는 영향력이 없다.

반면 지금부터 소개하는 연구는 조금 다른 이야기를 합니다. [Algorithmic Extremism: Examining YouTube’s Rabbit Hole of Radicalization](https://arxiv.org/abs/1912.11211) 의 저자들은 유튜브 상에서 1만 명 이상의 구독자를 지니고 있고, 컨텐츠 중 상당 부분 이상이 정치적 내용을 다루고 있는 800개의 정치 채널들을 분석했습니다.

이 연구는 이 우선 이 채널들을 음모론, 자유지상주의, 백인우월주의, 좌파, 우파, 사회주의, 종교적 보수주의 등 여러 카테고리로 나누고, 크롤링을 통해 각 채널의 영상들에 대한 정보(제목, 좋아요 수, 캡션, 조회수) 그리고 사이드바에 뜨는 추천 영상 목록을 수집했습니다. 이때 계정이 없는 상태로, **로그인하지 않은 상태에서** 수집을 했다고 합니다.

![](/assets/img/posts/2020-08-30-youtube-recommendation-and-radicalization_3.png){:w="500"}

![](/assets/img/posts/2020-08-30-youtube-recommendation-and-radicalization_4.png){:w="400"}

각 채널 그룹에서 내부로, 혹은 다른 그룹으로 이어지는 추천의 방향을 보기 위해 Impression이라는 값을 정의하는데요. 영상 A와 B가 있을 때 A→ B impression을 영상 A에서 발생하는 전체 추천의 수 중 B를 추천하는 경우의 비율에 A의 조회수를 곱한 것으로 정의합니다. 이 수치를 통해 위와 같은 플로우 차트를 그릴 수 있습니다. 

이 연구가 확인한 바에 따르면, 많은 추천이 각 채널 카테고리 내부 방향으로 이루어지고 있습니다. 즉 추천 알고리즘이 비슷한 영상들을 계속 추천해준다는 것이죠. 그러나 카테고리별로 나누어서 본다면, 메인스트림에 가까운 채널 카테고리가 주로 그렇고, 흔히 문제가 될 수 있다고 여겨지는 음모론이나 백인 우월주의 카테고리에서는 카테고리 내부를 향한 추천의 비율이 낮았다고 합니다.

더 자세한 내용은 다루지 않겠지만, 이처럼 해당 연구는 최근 제기된 주장들(유튜브 추천 알고리즘이 사용자에게 점점 더 극단적인 컨텐츠를 노출한다거나 자극적 우익 영상을 다른 영상들보다 선호한다는 주장들)이 위 데이터에 따르면 전혀 뒷받침되지 않았다는 결론을 내렸습니다.

## 🗣: 로그인을 안 하고 추천 데이터를 수집하는 게 의미가 있나?

제가 파악하기로는 현 시점에서 이 주제에 대한 학계 접근은 이게 최신인데, 읽으면서 위 연구의 가장 심각한 한계는 **추천 데이터를 수집할 때 로그인을 안 했다**는 것이라는 생각이 들었습니다(*검색하면서 보니 저만의 생각은 아닌 게, 해당 논문이 이 문제로 많이 까였던 것 같더군요*).

이 논문도 이 부분을 언급하기는 합니다.

> 누군가는 계정이 있어서 로그인한 유저에게 보여지는 추천 리스트가 익명 계정과 다르다고 주장할지 모른다. 그러나 우리는 두가지 경우에 알고리즘의 행동에 큰 차이가 없다고 생각한다. 유튜브가 로그인한 유저와 익명의 유저에게 완전히 다른 기준을 적용해 추천한다는 것은 직관적이지 않으며, 그러한 추천 알고리즘을 만드는 것이 매우 복잡할 것이기 때문이다.
> 

개인적으로는 동의하기 어려운 주장입니다. 어느 정도 기록이 쌓인 유저에게 개인화된 추천을 제공하는 게 추천 시스템의 일반적인 목표이고, 지금 이 순간에도 유튜브의 알고리즘 또한 또한 그런 목표를 가지고 동영상을 추천해주고 있을 것입니다. 만약 어떤 유저가 로그인해서 실수로 극단적인 컨텐츠를 접하고, 흥미를 느껴서 조금 더 찾아보는 상황이라고 가정할 때, 이 순간에 과거 몇 건의 시청 기록을 바탕으로 추천되는 컨텐츠가 그 유저에게 진짜 영향을 주는 영상입니다. 로그인하지 않은 익명의 접속자에게 제공되는 추천이 아니라요. 

프린스턴 대학의 컴퓨터 과학자 아빈드 나레이야난은 심지어 "[이 연구가 틀렸다고 말하고 싶지만 그 말조차 너무 과분하며, 이 연구는 (아예 잘못된 대상을 연구하였으므로) 틀린 것조차 아니다](https://twitter.com/random_walker/status/1211262124724510721)(!)"라고 자신의 개인 SNS에 적기도 했습니다. 사실상 이 연구는 유튜브의 "유저들"을 분석한 게 아닙니다. 이 연구에는 유저가 없습니다.  연구 질문은 "유튜브의 알고리즘이 유튜브 **유저들에게** 미치는 영향 - 급진화를 시키는가?"인데도요.

그러면 대체 이 질문에 대한 답은 어떤 방식으로 얻을 수 있을까요? 사실 유튜브 밖의 연구자가 이런 주제의 연구를 실질적으로 진행할 방법은 존재하지 않을지도 모르겠습니다. 🤔 위 특집 기사를 작성한 케빈 루스는 이 연구를 수행할 수 있는 적절한 데이터에 대한 접근권을 가진 사람은 유튜브에서 일하는 사람들뿐이고, 그 사람들은 이미 작년에 위험한 경계에 있는 컨텐츠의 추천을 70%까지 줄였다고 밝혔으며, 이 사실이 말해주는 부분이 있다고 주장합니다. 만약 그런 (잘못된 영향력을 가진) 추천이 일어나고 있지 않았다면 그들이 왜 그랬겠느냐? 라는 것이죠. 

## 참고

- [The Making of a Yutube Radical](https://www.nytimes.com/interactive/2019/06/08/technology/youtube-radical.html)
- [Does YouTube's Algorithm Lead to Radicalization?](https://www.pcmag.com/news/does-youtubes-algorithm-lead-to-radicalization)
- [Algorithmic Extremism: Examining YouTube’s Rabbit Hole of Radicalization](https://arxiv.org/abs/1912.11211)
- [There’s A Fatal Flaw In The New Study Claiming YouTube’s Recommendation Algorithm Doesn’t Radicalize Viewers](https://www.tubefilter.com/2019/12/30/youtube-radicalization-study-extremist-content-wormhole-rabbit-hole/)
- [Response to further critique on our paper “Algorithmic Extremism: Examining YouTube’s Rabbit Hole of Radicalization”](https://medium.com/@anna.zaitsev/response-to-further-critique-on-our-paper-algorithmic-extremism-examining-youtubes-rabbit-hole-af3226896203)