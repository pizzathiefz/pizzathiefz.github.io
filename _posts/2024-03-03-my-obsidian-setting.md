---
title: 옵시디언 사용기 (필수 플러그인, 블로그 글 쓰기, 해빗 트래커, 디지털 서재)
date: 2024-03-03 10:34:00 +09:00
categories:
  - Posts
  - Personal
tags:
  - obsidian
math: true
toc: true
comments: true
---
## 들어가기 전에

이 글은 옵시디언이 무엇인지나 왜 옵시디언을 써야 하는지에 대한 글은 아닙니다(찾아보면 그런 글들도 많이 있습니다). 이 글은 옵시디언을 쓰기로 결정했을 때 처음에 어떤 플러그인을 추천하는지와 제가 어떤 목적으로 주로 활용하고 있는지를 공유하기 위한 목적으로 작성하였습니다. 다만 간단하게만 적어보자면, 옵시디언을 사용하게 된 개인적인 이유는 다음과 같습니다. 참고로 옵시디언으로 옮기기 전 가장 최근에는 노션과 크래프트를 사용했었어요.

- **노션이 너무 느려서**
	- 노트가 많아지고 데이터베이스 등 복잡하게 쓰기 시작할수록 점점 더 느려지는 듯..
- **기본적으로 내가 생산하는 노트는 내 로컬에 보관하고 싶어서**
	- 특정 서비스에 의존하는 게 불안하고 혹시나 나중에 다른 툴로 이사가더라도 그냥 노트(.md)만 들고 쓱 가고 싶다 🚛
- **플러그인이 많아서 웬만한 건 다 되길래**
	- 마찬가지로, **테마가 많아서** 적당히 깔끔하게 예쁜 걸 고를 수 있을 듯해서
- **그래프뷰에 혹해서**
	- 옵시디언 처음 알아볼 때 노트들 간의 연결관계(링크/백링크)를 사용해서 네트워크를 그려주는 이 기능이 매우 멋져보였기 때문에
	
		![](/assets/img/obsidian-setting-github-blog-graph-view.jpg){:w="500"}_[그림 출처](https://chrisbowler.com/how-to-get-started-with-tools-like-obsidian/)_
	- 쓰고 난 지 한 참 지난 지금은... 이 전체 그래프 뷰는 사실 별 의미가 없고, 각 노트를 열어볼 때 그 노트가 속한 작은 그래프(local graph)를 보여주는 게 유용함 (`노트 더보기 > linked view 열기 > 로컬 그래프`) 
		- [참고](https://thesweetsetup.com/the-power-of-obsidians-local-graph/)

<br>

## 필수 커뮤니티 플러그인 3가지

옵시디언에는 기본적으로 제공하는 코어 플러그인이 있고 여러 사람들이 원하는 대로 개발하여 공개해 둔 커뮤니티 플러그인이 있습니다. 커뮤니티 플러그인 사용은 어디까지나 옵션으로, 각자가 원하는 대로 다운받아서 커스텀하게 사용할 수 있다는 것이 옵시디언의 매력인데요. 그 중에서도 개인적으로 사용하면서 이거 3가지는 웬만하면 꼭 써야겠다고 생각하게 된 (커뮤니티) 플러그인 3가지를 소개하겠습니다.

### Templater
- 노트를 어떤 목적으로 작성하느냐에 따라 기본적인 템플릿이 필요한 경우가 많다. 본문에 어떤 양식을 삽입하고 싶을 수도 있고, 노트의 메타정보인 frontmatter/properties의 틀을 만들어주고 싶을 수도 있고, 노트가 만들어진 날짜를 자동으로 삽입하거나 특정 경로로 이동하고 싶을 수도 있다. Templater가 제공하는 기능은 이런 부분들을 포함하여 코어 플러그인 템플릿 기능보다 훨씬 더 다양함.
- 우선 당연히 `커뮤니티 플러그인 > 탐색` 에 가서 Templater를 설치해주자. 또 기본적으로는 템플릿 기능 자체를 활성화해야 하기 때문에 `코어 플러그인 > 템플릿` 을 활성해해주자.
- 템플릿만 따로 보관할 폴더를 만들고, Templater 설정에서 이 폴더를 템플릿 폴더로 지정해주자.
	![](/assets/img/obsidian-setting-template-folder.png)
- 그 다음은 해당 폴더에 원하는 템플릿들을 만들고 원하는 노트에 삽입해서 쓰면 된다.
- 단축키 섹션에서 다음처럼 Templater 템플릿 삽입을 특정 키로 해놓으면, 그 키를 누를 때마다 원하는 템플릿을 골라서 삽입할 수 있어서 편함!
	![](/assets/img/obsidian-setting-template-hotkey.png)
- 단순히 문서 내 양식이나 시간 삽입 정도만 할 거면 기본 템플릿(코어 플러그인)을 써도 무방함. 다양한 Templater 커맨드를 활용하고 싶다면 [공식문서](https://silentvoid13.github.io/Templater/)를 뒤져보자.

### Dataview
- 볼트 내의 노트들에 대한 쿼리를 작성하면 표나 리스트, 체크리스트 형식으로 보여주는 기능이다. Dataview Query Language는 기본적인 문법이 흔히 생각하는 SQL과 크게 다르지 않아서 개인적으로는 익히는 데 거의 비용이 들지 않았음.
- `커뮤니티 플러그인 > 탐색` 에 가서 Dataview를 설치해주자.
- 원하는 대로 쿼리를 작성한다. 예를 들면 다음은 2024년(해당 노트의 properties로 명시되어있음)에 생성된 것 중 내가 가장 최근에 작성한 노트 15개를 notes 라는 폴더에서 생성된 최신순으로 리스트로 보여줘 라는 쿼리이다. FROM문은 폴더나 태그를 참조한다.

	![](/assets/img/obsidian-setting-dataview-query-example.png){:w="450"}
- 형식은 `LIST` / `TABLE` / `TASK` 가 있음
	- 가장 많이 쓰는 테이블은 이렇게 칼럼을 select 할 수 있음
	![](/assets/img/obsidian-setting-dataview-table-example.png){:w="550"}
- 더 많은 예시와 문법은 [공식문서](https://blacksmithgu.github.io/obsidian-dataview/) 참고

### Advanced Tables
- 마크다운에 익숙한 편이지만 아무리 익숙해도 표 작성은 너무 거지같기 때문에 이 플러그인은 필수다. 표 작성 시 입력하기 귀찮은 부분들을 자동으로 입력해주고, 간격을 자동으로 조정해주면서 컨트롤 패널까지 제공해주는 플러그인.
	![](/assets/img/obsidian-setting-dataview-query-example-advanced-tables.png)_컨트롤 패널 예시_
- 문서를 보면 [함수 기능](https://github.com/tgrosinger/md-advanced-tables/blob/main/docs/formulas.md)까지 제공하는데 사실 이렇게까지 써보진 않았음

<br>


## 개인적인 사용기

**가장 주된 사용처는 공부한 내용을 정리**하는 것입니다. 그냥 공부한 주제에 대해 노트 하나를 생성하고 아무렇게나 적습니다. 옵시디언을 검색하면 다양한 정보 관리법(PARA 메소드라든가)들이 정말 많이 나오지만, 저는 노트 작성에 있어서 조금이라도 복잡한 방식은 별로 좋아하지 않아요. 메타 정보는 tag 정도만 쓰고 폴더 관리도 안 합니다. 다만 노트 내에 유사한 개념이 나오면 링크는 잘 삽입해주려고 합니다. 그러면 위에 언급한 그래프 뷰와 같은 연결 구조가 생성되어서, 하나의 개념을 찾아볼 때 같이 공부했던 다른 개념들을 맵핑해서 볼 수 있습니다. 

다음은 공부 외에 옵시디언을 개인적으로 활용하는지에 대한 내용입니다.

### 블로그에 글 쓰기

 현재 저는 github 블로그를 사용하고 있습니다. 보통 기술 블로그를 작성할 때 여러 가지 옵션(티스토리, velog, 네이버 블로그, 노션 등)을 비교해보고 정하게 되는데요. 이때 언급되는 github 블로그의 단점 중 대표적인 것이 바로 **(글을) 쓰는 게 불편해요**입니다. 사실 글 쓰기 위해 블로그를 운영하는데 글 쓰는 게 불편하다니 안 될 말이죠. 그래서 구체적으로 무엇이 불편하냐 하면 보통 1) 마크다운 문법을 익혀야 한다 2) 이미지 삽입이 불편하다는 답변이 지배적일 것입니다. 옵시디언을 에디터로 사용하면 이 2가지를 그럭저럭 극복할 수 있습니다.

- (git에서 클론 뜬) github 블로그 폴더 자체를 옵시디언 볼트로 설정한다.
- 포스팅을 작성하는 경로에 노트를 생성해서 글을 쓴다.
	- 나의 경우 이렇게 생겼음
	
		 ![](/assets/img/obsidian-setting-github-blog-path.png){:w="300"}
- 노트 내에 옵시디언의 properties 기능을 사용해서, 각종 필요한 메타 정보(제목, 날짜, 카테고리, 태그, 수식/TOC/덧글 기능 사용 여부)를 기입하는 템플릿을 만든다.
	- 이건 각자 사용하는 테마마다 다를 테니 자유롭게 설정해서 쓴다. 작년까지만 해도 YAML 규칙에 맞춰서 frontmatter을 써줬어야 했는데 properties 피쳐가 생기면서 훨씬 더 편해졌다!
	- 나의 경우 이렇게 생겼음
		
		![](/assets/img/obsidian-setting-github-blog-properties.png){:w="450"}
		- 필요하면 Templater 기능을 이용해서 제목에 자동으로 현재 날짜 기입하거나 date property에 현재 날짜가 들어가도록 설정해줄 수 있는데(어떻게 하는지는 마지막 디지털 서재 섹션의 tp 명령어 참조) 나는 글을 2주에 한번꼴로 쓰니까 크게 귀찮지는 않아서 안 해놨다.
- 🤯 **마크다운 문법이 안 익숙해요**!
	- 사실 이건 나에게 해당되는 상황은 아닌데 이전에도 나는 마크다운 문법을 편하게 쓰는 편이었다. 다만 티스토리, 네이버 등에서 제공하는 에디터나 노션 같은 툴만 쓰다가 github 블로그를 처음 쓰게 된다면 마크다운은 허들이 될 수 있을 것.
	- 일단 옵시디언은 웬만한 마크다운 에디터들에서 통용되는 단축키 기능 정도는 다 지원하는 편이고, 무엇보다 커뮤니티 플러그인 중 [Make.md](https://www.make.md) 이라는 걸 사용하면 노션과 거의 비슷한 수준으로 마크다운 문법 없이 글을 쓸 수 있음.
		 ![](/assets/img/obsidian-setting-github-blog-makemd.png)_maker mode_
- 🤯 **이미지 삽입이 너무 불편해요**!
	- 옵시디언 에디터는 기본적으로 드래그앤드롭으로 이미지를 넣을 수 있는데, 문제는 이 이미지의 경로를 어디다 지정해줘야 할 것인지다. 내가 쓰고 있는 [github 블로그 테마](https://github.com/cotes2020/jekyll-theme-chirpy)를 포함하여 대부분의 경우 지정된 경로에 이미지를 넣고 그 이미지 경로를 명시하여 포스팅하는 방식이기 때문. 이걸 하나하나 폴더에 맞춰서 넣어주고, 마크다운 문법에 따라 `![](경로)` 를 하나하나 써줘야 한다면 나라도 귀찮아서 글 못 쓴다.
	- `설정 > 파일 및 링크` 에 들어가서 아래와 같이 경로를 설정해주자.
		![](/assets/img/obsidian-setting-github-blog-image-path.png)
		- 디폴트 설정은 아마 지정된 폴더가 아닐 건데, `아래에 지정된 폴더`로 설정을 바꿔준 다음 이미지를 올려야 하는 **볼트 내의 절대 경로**를 입력해준다. 포스팅을 하면서 드래그 앤 드롭으로 이미지를 삽입할 때 자동으로 저 폴더에 파일이 생성되며, 포스팅 내에 경로가 자동으로 입력된다.

<br>

### 해빗 트래커 (잔디심기☘️)

습관을 관리하기 위한 해빗 트래킹 도구에 관심이 많아서 이것저것 시도를 했었는데, 중요한 것 중 하나가 시각화였습니다. 스스로 잘하고 있는지 한눈에 보여주는 효과가 습관 관리에는 꼭 필요하고 동기 부여도 잘 되거든요. 제가 옵시디언에서 이 목적으로 잘 사용하고 있는 커뮤니티 플러그인이 바로 [Heatmap Calender](https://github.com/Richardsl/heatmap-calendar-obsidian)입니다. 

예를 들면, 제가 매일 공부한 시간을 이렇게 히트맵으로 보여줄 수 있습니다.

![](/assets/img/obsidian-setting-github-blog-heatmap-calender.png)_목요일과 금요일은...공부하기 쉽지 않다는 걸 알수있음.._

- 커뮤니티 플러그인이므로 설치가 필요함. Heatmap Calender를 검색해서 설치해주자. 또한 이 플러그인을 사용하기 위해서는 앞서 언급한 필수 플러그인 중 하나인 Dataview가 꼭 필요하므로, 역시 없다면 설치해주자.
	- 또 Dataview JS 쿼리를 이용한 기능이기 때문에 `설정 > Dataview > Enable Javascript Queries` 를 꼭 활성화시켜주자.
- 기본적으로는 `YYYY-MM-DD` 형식의 데일리 노트와 그 노트 안의 properties 중 하나의 값을 읽어와서 히트맵으로 그려주는 구조이다.
	- 즉, 2024년 1월 21일의 습관 달성 여부를 표시할 `2024-01-21`이라는 노트가 있고
		- 여기에 `minutes:144` 이라는 property를 넣어준다. (공부 144분 했다는 뜻..)
		
		 ![](/assets/img/obsidian-setting-github-blog-heatmap-calender-2.png){:w="250"}
	- 저 히트맵을 표시할 메인 페이지에는 다음을 참고해서 Dataview JS 쿼리를 작성해준다.
		- DataviewJS loop 부분을 만져줘야 하는데,  `dv.pages('"daily"').where(p => p.minutes))` daily라는 폴더 내에 저 위의 데일리 노트가 있고, 그 안에 minutes이라는 property를 참조하겠다는 뜻임. `date: page.file.name` 위 예시처럼 파일 이름이 날짜가 될 거고, `intensity: page.minutes minutes` 값이 클수록 색상을 진하게 그려주겠다는 뜻(히트맵)
		- 다른 부분은 크게 만질 거 없고 상단의 calendarData의 연도나 원하면 색상값 등을 조정해줄 수 있음.


```javascript
dv.span("** minutes **") 
const calendarData = {
    year: 2024,  // (optional) defaults to current year
    colors: {    // (optional) defaults to green
        blue:        ["#8cb9ff", "#69a3ff", "#428bff", "#1872ff", "#0058e2"], // first entry is considered default if supplied
        green:       ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
        red:         ["#ff9e82", "#ff7b55", "#ff4d1a", "#e73400", "#bd2a00"],
        orange:      ["#ffa244", "#fd7f00", "#dd6f00", "#bf6000", "#9b4e00"],
        pink:        ["#ff96cb", "#ff70b8", "#ff3a9d", "#ee0077", "#c30062"],
        orangeToRed: ["#ffdf04", "#ffbe04", "#ff9a03", "#ff6d02", "#ff2c01"]
    },
    showCurrentDayBorder: false, // (optional) defaults to true
    defaultEntryIntensity: 4,   // (optional) defaults to 4

    entries: [],                // (required) populated in the DataviewJS loop below
}

//DataviewJS loop
for (let page of dv.pages('"daily"').where(p => p.minutes)) {
    //dv.span("<br>" + page.file.name) // uncomment for troubleshooting
    calendarData.entries.push({
        date: page.file.name,     // (required) Format YYYY-MM-DD
        intensity: page.minutes, // (required) the data you want to track, will map color intensities automatically
        content: await dv.span(`[](${page.file.name})`),
        color: "green",          // (optional) Reference from *calendarData.colors*. If no color is supplied; colors[0] is used
    })
}

renderHeatmapCalendar(this.container, calendarData)
```

<br>

### 디지털 서재 만들기 (노트 퍼블리시하기)

저는 평균적으로 한달에 6~8권의 책을 읽고, 8~10편의 영화를 봅니다. 많이 보는 편인지는 모르겠지만 어쨌든 연 단위로 쌓이면 꽤 많습니다. 휘발되는 게 아까워서 하나를 보더라도 메모를 남기려고 하는 편입니다. 이렇게 메모가 쌓인지는 7~8년 정도 되었고 현 시점 기준 1천 개가 넘는데, 보통 마크다운 파일로 저장해서 노트 앱 이사갈 때마다 들고 다니고 있어요.

옵시디언 넘어오면서도 책/영화 메모용 볼트를 따로 만들어서 나름의 디지털 서재를 관리하는 중입니다. 

- **Templater 활용**
		![](/assets/img/obsidian-setting-library-template.png)
	- 문서 생성 후 지정해둔 단축키만 누르면 위와 같은 템플릿이 노트에 삽입되어, 편하게 책/영화의 정보를 기입할 수 있다. 그리고 본문에는 아무렇게나 메모를 적으면 됨.
	- 참고로 `tp`로 시작하는 명령어는 위에 언급한 필수 플러그인 중 하나인 Templater의 기능이다. 예를 들어 `tp.file.title` 이란, 이 템플릿이 삽입되는 순간 해당 문서의 제목을 그대로 이 property에 입력해준다는 뜻이고, `await tp.file.move` 의 경우 특정 경로로 이동해준다는 뜻이다.
	- 이 볼트에도 책과 영화 외에는 폴더를 구분하고 있지 않고, 명령어 덕분에 직접 폴더 정리를 할 필요도 없이 템플릿 삽입과 동시에 폴더로 이동되기 때문에 매우 편함.
- **Dataview 활용**
	- 별도의 폴더 관리 없이 main 노트만 만들어서 Dataview 기능을 통해 다음을 한꺼번에 볼 수 있도록 한다.
		- 가장 최근에 남긴 메모들 (최근에 본 영화 10개, 읽은 책 10개)
			
			![](/assets/img/obsidian-setting-library-main-query.png){:w="300"}_보통 이런 식으로 dataview 쿼리를 작성한다_ 
		- 연 단위 아카이브 페이지 (2023년에 본 영화들, 2023년에 본 책들 ...)
		
			![](/assets/img/obsidian-setting-library-archive.png){:w="220"}
	- 이 main 페이지가 실제로 어떻게 보이는지는 [여기](https://pizzathief-library.vercel.app)를 통해 확인 가능하다.
- **[Digital Garden](https://dg-docs.ole.dev) 활용**
	- 위처럼 링크가 있는 이유는! 내가 이 볼트를 퍼블리시하고 있기 때문. 옵시디언으로 옮기면서 제일 만족스러웠던 것 중 하나가 바로 Github과 Vercel만 사용해서 쉽게 무료로 퍼블리시가 가능하다는 점이었다. 
	- 우선 Digital Garden이라는 커뮤니티 플러그인 설치해주자. 그리고 [가이드](https://dg-docs.ole.dev/getting-started/01-getting-started/)를 따라한다. 10분도 채 안 걸리며, 아주 쉽다.
	- 무엇보다 볼트의 모든 노트가 자동으로 퍼블리시되지 않는 것이 장점인데, `dg-publish` property를 통해 어떤 노트를 퍼블리시하고 어떤 노트는 나만 볼지 선택할 수 있다. 그래프뷰를 포함한 [웬만한 옵시디언 피쳐들](https://dg-docs.ole.dev/features/)을 모두 잘 표시해주며, 테마도 전부 지원한다. 이 플러그인은 디지털 서재가 아닌 다른 주제라도 **내 노트를 혼자 보지 않고 퍼블리시를 하고 싶다**는 분들이라면 추천. 간단한 블로그를 만들기에도 어려움이 없을 것 같음.


<br>
