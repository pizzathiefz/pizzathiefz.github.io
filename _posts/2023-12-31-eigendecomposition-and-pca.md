---
title: 수학을 까먹은 사람을 위한 고유값분해와 주성분분석(PCA)
date: 2023-12-31 09:31:00 +09:00
categories:
  - Posts
  - Data
tags:
  - linear-algebra
  - ml
math: true
toc: true
comments: true
---
> 고유값분해가 무엇인지, 주성분분석이라는 차원축소 기법과 어떤 관계인지 설명한 글입니다. [개발자를 위한 실전 선형대수학](https://m.hanbit.co.kr/store/books/book_view.html?p_code=B4279863215)의 12장을 주로 참고하였고, 선형대수를 거의 모르거나 잘 기억나지 않아도 이해할 수 있도록 필요한 개념들을 포함하여 작성하였습니다. 다만 읽기 전에 행렬과 벡터가 무엇인지와 곱하는 법 정도는 아셔야 합니다.
{: .prompt-info }


## 고유값분해 이해하기

### 기본 개념

우선 고유값분해를 이해하려면 당연히 **고유값(eigenvalue)** 와 **고유벡터(eigenvector)** 를 개념적으로 알아야 합니다.
이 두 가지 개념은 다음과 같은 엄청나게 간단한 식으로 표현됩니다.

$$ A\mathbf{v} = \lambda \mathbf{v} $$

$**$ $A$: 행렬, $\mathbf{v}$: 벡터, $\lambda$ : 스칼라(상수)

이 식은 물론 $A$가 $\lambda$와 같다는 말이 아니고 같은 벡터에 대해 이 행렬이 미치는 영향과 스칼라 값이 미치는 효과가 동일하다는 뜻인데요.
기하학적으로는(그림으로 보자는 뜻) 행렬이 **벡터를 늘리거나 줄이긴 하지만 회전시키지 않는 경우**를 의미합니다.

잠깐 기억을 되살려 보면, 벡터에는 방향과 크기가 있죠.

![](/assets/img/eigenvalue-decomposition-1.png){:w="400"}_'방향'이 다른 벡터들 ([그림 출처](https://www.coranac.com/documents/geomatrix/))_

![](/assets/img/eigenvalue-decomposition-2.png){:w="400"}_2u는 u에다가 상수값을 곱한 것으로 u와 방향은 같으나 '크기'가 다르다 ([그림 출처](https://www.coranac.com/documents/geomatrix/))_


많은 경우, 벡터에 행렬을 곱하면 다음과 같이 방향이 바뀝니다.


![](/assets/img/eigenvalue-decomposition-3.png)_([그림 출처](https://vitalflux.com/why-when-use-eigenvalue-eigenvector/))_


근데 어떤 특별한 행렬과 특별한 벡터가 만나면, 신기하게도 방향은 안 바뀌고 크기만 변할 수도 있습니다!

![](/assets/img/eigenvalue-decomposition-4.png)_([그림 출처](https://vitalflux.com/why-when-use-eigenvalue-eigenvector/))_

이때 이 벡터가 이 행렬의 고유벡터이며, 벡터가 늘어나거나 줄어드는 양이 고유값입니다.
예를 들면,

$$ \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \end{bmatrix} = 3 \begin{bmatrix} 1 \\ 1 \end{bmatrix}  $$

- 즉 이 행렬의 고유벡터는 $\begin{bmatrix} 1 & 1 \end{bmatrix}$ 이고 고유값은 3

여기까지 보고 알 수 있는 것은 고유값과 고유벡터는 특정 행렬에 따라오는 존재라는 것입니다. 특별한 매칭 관계랄까요. 단 1:1 매칭은 아닙니다. 왜인지는 더 아래에서 설명하겠습니다.

한 가지 더 알 수 있는 것은 **정의 상 고유값과 고유벡터를 얻으려면 행렬 $A$ 가 정방행렬(행과 열의 수가 같은 정사각형 행렬)이어야 한다**는 것입니다. 위 식을 다시 들여다보면 알 수 있는데, 벡터 $\mathbf{v}$ 가 $N$ 차원이라고 쳤을 때 $A$가 $N \times N$ 이어야 $A \mathbf{v}$ 와 $\lambda \mathbf{v}$가 같은 차원이 되지, $A$ 가 $M \times N (M \neq N)$ 이면 $A \mathbf{v}$ 는 $M$ 차원이 되어버려서 애초에 저 식이 성립할 수 없으니까요.

<br>

### 하는 법

고유값분해를 하는 방법은 주어진 행렬에 대해 고유값과 고유벡터를 찾는 것입니다. 순서는 고유값이 먼저입니다.

위 식을 다시 고쳐보겠습니다.

$$ A\mathbf{v} - \lambda \mathbf{v} = (A- \lambda I) \mathbf{v} =  0 $$ 

행렬에서 스칼라를 빼줄 수는 없으니까 $A$랑 사이즈가 같은 단위행렬이라는 애를 불러와서 빼줬습니다. 단위 행렬이 뭐였더라? 대각 원소만 1이고 나머지는 0인 정방행렬입니다. 이 행렬은 어떤 행렬을 곱해도 동일한 행렬이 된다는 점에서 상수 계산의 숫자 1이랑 비슷한 친구입니다. 이렇게 하게 되면 사실상 대각 성분에 스칼라 값만큼을 더하거나 빼주는 것인데, 이걸 행렬 이동이라고도 불러요. 간단한 예시는 이렇습니다. 행렬을 3만큼 이동한 것이죠.


$$ \begin{bmatrix} 2 & 2 \\ 1 & 3 \end{bmatrix} + 3 \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 5 & 2 \\ 1 & 6 \end{bmatrix} $$



다시 돌아와서, 이동시킨 $A- \lambda I$ 를 $A'$ 라는 새로운 행렬로 생각합시다. 즉 $A ' \mathbf{v} = 0$  입니다. 이런 일이 벌어지려면 어떤 조건이 필요할까요?
물론 아주 쉬운 답은 $\mathbf{v}$ 가 영벡터(0으로만 이루어진 벡터)이면 됩니다. 하지만 이 답은 너무 쉬워요. 수학은 이런 답을 뻔하다, 자명하다(trivial)고 하며 의미 있는 답으로 쳐주지 않습니다.
이 식을 가능하게 하는 자명하지 않은 답은, **벡터 $\mathbf{v}$ 가 영벡터가 아니면서 행렬 $A'$의 영공간에 있다** 는 것입니다.

이 부분을 이해하려면 몇 가지 개념들이 필요합니다.

- 벡터의 선형독립
- 행렬의 공간, 영공간
- 행렬의 계수(rank)

순서대로 간단히 짚어 보겠습니다.

- **벡터의 선형독립**
	- 다음과 같이 여러 개의 벡터에 각각 다른 스칼라 값을 곱해서 더하는 것을 선형가중결합이라고 한다.
		- $\mathbf{w} = \lambda_1\mathbf{v}_1 + \cdots \lambda_m\mathbf{v}_m$
	- 주어진 벡터 집합 중 한 개의 벡터에 대해, 만약 다른 벡터들을 어떻게든 선형가중결합해서 이 벡터를 만들 수 있다면 이 벡터 집합은 서로 선형종속(linearly dependent)이며, 그렇지 못하면 선형독립(linearly independent)이다.
		- 예를 들어 $\{ \begin{bmatrix} 1 \\ 0  \end{bmatrix} \,  \begin{bmatrix} 0 \\ 1  \end{bmatrix}, \begin{bmatrix} 1 \\ 1  \end{bmatrix} \ \}$ 은 선형종속이다. 첫번째랑 두번째를 더하면 세번째가 됨.
		- 예를 들어 $\{ \begin{bmatrix} 1 \\ 0  \end{bmatrix} \,  \begin{bmatrix} 1 \\ -1  \end{bmatrix}, \begin{bmatrix} 1 \\ 1  \end{bmatrix} \ \}$ 은 선형독립이다. 다른 두 개에 무슨 짓을 해도 나머지 하나를 만들 수 없음.
		- 선형종속의 정의를 쓰면 $\lambda_1\mathbf{v}_1 = \lambda_2\mathbf{v}_2 + \cdots \lambda_m\mathbf{v}_m$ 인데 이건 사실 다시 쓰면 $0 = \lambda_1\mathbf{v}_1 + \cdots \lambda_m\mathbf{v}_m$
		- 물론 모든 람다값이 0이면 다 되지만 역시 자명한 답은 안 쳐준다.
- **행렬의 공간**
	- 행렬을 열벡터의 집합으로 간주하고(세로로 자른다는 소리), 이 열벡터를 가지고 무한하게 선형가중결합을 한다고 생각하자. 그러면 무한 개의 벡터를 만들 수 있을 텐데, 만들어지는 무한한 집합을 이 행렬의 공간(열공간)이라고 한다.
	- $$ C (\begin{bmatrix} 1& 1 \\ 3 & 2  \end{bmatrix}) = \lambda_1   \begin{bmatrix} 1 \\ 3  \end{bmatrix} +  \lambda_2   \begin{bmatrix} 1 \\ 2  \end{bmatrix} , \lambda \in \mathbb{R}$$
	- 즉 $\lambda_1$ 과 $\lambda_2$에  어떤 실수값이든 넣어서 만들 수 있는 모든 벡터들이 이 행렬의 열공간이다. 예를 들어서 $\lambda_1 = 11$, $\lambda_2=-15$ 이면 우리는  $\begin{bmatrix} -4 & 3 \end{bmatrix}$ 를 얻을 수 있으며, 이 벡터는 이 행렬의 열공간에 포함된다고 할 수 있음. 즉 가중치 $\lambda$ 의 조합 $\mathbf{x} = \begin{bmatrix} 11 & -15 \end{bmatrix}$ 가 존재해서, $A\mathbf{x} = \mathbf{b}$ 가 가능하다면, 벡터 $\mathbf{b}$ 는 행렬 $A$ 의 열공간 안에 포함된다는 것이다.
	- 그런데 재미있는 사실: 이 행렬의 열공간은 $\mathbb{R}^2$ 이다! 즉 모든 실수값 2개로 이루어진 벡터를 저 2개의 열벡터를 선형결합해서 만들 수 있다. 
	- 물론 모든 행렬의 열공간이 이렇지는 않다. 
		- $$C (\begin{bmatrix} 2& 4 \\ 1 & 2  \end{bmatrix}) = \lambda_1   \begin{bmatrix} 2 \\ 4  \end{bmatrix} +  \lambda_2   \begin{bmatrix} 1 \\ 2  \end{bmatrix} , \lambda \in \mathbb{R}$$ 
		- 이 경우 두 벡터를 아무리 선형결합 시켜도 $\mathbb{R}^2$ 의 무한한 영역을 커버할 수 없는데, 두 개의 열벡터가 선형독립이 아니기 때문임. 이 벡터들로 만들 수 있는 공간은 2차원이 아니라 1차원인 것이다.
		- ![](/assets/img/eigenvalue-decomposition-5.png){:w="300"}_[(그림 출처)](https://angeloyeo.github.io/2020/11/17/four_fundamental_subspaces.html)_
- **행렬의 계수(rank)**
	- 열 공간의 차원의 수, 선형독립 집합을 형성할 수 있는 최대 열의 수를 뜻한다.
		- 즉 위 행렬의 공간 예시 중 첫번째 행렬은 rank가 2고, 두번째 행렬은 rank가 1이다.
	- 가능한 최대값은 행의 수랑 열의 수 중 더 작은 값이며 (즉 $3 \times 4$ 행렬의 가능한 최대 계수는 3임) 열과 행의 계수는 동일하므로 한쪽만 보면 된다.
	- 물론 행렬에 따라서 최대 계수를 계수로 가질 수도 안 가질 수도 있다.
		- 위 행렬의 공간 예시 중 두번째 행렬은 $2 \times 2$ 행렬로 최대 계수는 2이지만 실제 계수가 1인 행렬이었다.
		- 이 행렬처럼 최대 계수를 가지지 않는 행렬은 행렬을 이루고 있는 $N$개의 벡터가 선형독립이 아니라는 뜻이다(선형독립인 애들 개수가 $N$개보다 작다는 뜻이다). 이런 특징을 최대계수보다 모자라 rank-deficient하다고 부르며, 이러한 행렬은 특이(singular) 행렬이라고도 한다. 다른 이름으로는 비가역(non-invertible) 행렬인데, 행렬식 값이 0으로서 역행렬(상수 계산에서 역수와 동일하게 곱해서 단위행렬이 되는 행렬, $AA^{-1}=I$)을 구할 수 없다.
-  **행렬의 영공간**
	- 영공간은  $A\mathbf{y} = 0$ 이 되는 모든 벡터 $\mathbf{y}$  (이번에도 영벡터는 빼고..!)
	- 영공간은 비어 있을 수도 있고 비어있지 않을 수도 있다. 영공간이 비어 있지 않으려면, 행렬의 열벡터들이 선형종속이어야 한다. 선형종속의 정의 $0 = \lambda_1\mathbf{v}_1 + \cdots \lambda_m\mathbf{v}_m$ 를 다시 떠올려 보면 당연하다.

<br>

살짝 멀리 갔다 돌아왔는데요, 우리는 $A'$ 의 영공간의 벡터 $\mathbf{v}$를 찾아야 한다는 것을 기억합시다. $A'$의 영공간이 비어있지 않으려면, $A'$는 선형종속 벡터 집합, 즉 rank-deficient한 singular 행렬이어야 하며, 행렬식의 값은 0입니다. 이게 바로 우리가 고유값을 구하게 해주는 가장 큰 힌트입니다.


2X2 행렬을 예시로 들면 다음과 같습니다. ($\vert A \vert$ 요건 행렬식의 표기예요)

$$ \vert A' \vert = \vert A - \lambda I \vert = \vert \begin{bmatrix} a & b \\ c & d \end{bmatrix} - \lambda \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \vert = \vert \begin{bmatrix} a-\lambda & b \\ c & d- \lambda \end{bmatrix} \vert = 0 $$

행렬식 공식을 대입하면,


$$ (a-\lambda)(d-\lambda)-bc = \lambda^2 - (a+d)\lambda + (ad-bc) =0$$


이 이차 방정식을 풀면 2개의 $\lambda$ 값이 나오겠죠. 즉 $2 \times 2$ 행렬에서 우리가 찾는 $\lambda$ 는  2개이며, 이는 행렬 크기가 올라가도 일반화될 수 있습니다. 결론적으로 **$M \times M$ 행렬에 대해서는 $M$ 개의 고유값이 존재합니다**.


제법 긴 과정을 거쳐 고유값을 구했습니다. 고유벡터는 어떻게 정해질까요?

맨 처음 예시로 돌아가서, 다음 행렬의 고유값 2개 중 하나는 3이었습니다.

$$ \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \end{bmatrix} = 3 \begin{bmatrix} 1 \\ 1 \end{bmatrix}  $$

그렇다는 건 요 행렬을 -3 이동시킨 $A'$ 의 영공간의  벡터가 고유벡터라는 건데요,

$$\begin{bmatrix} -2 & 2 \\ 2 & -2 \end{bmatrix} \mathbf{v} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}  $$

고유벡터를 찾는 일반화된 방법은 더 어렵지만요, 이 예시에서는 $\mathbf{v}$ 에 뭐가 들어가야 하는지는 눈으로 봐도 알 수 있네요. $\begin{bmatrix} 1 & 1 \end{bmatrix}$ 도 되고, $\begin{bmatrix} -3.1 & -3.1 \end{bmatrix}$ 도 되고, $\begin{bmatrix} 526 & 526 \end{bmatrix}$ 도 됩니다! 
모든 실수값 $\alpha$ 에 대해 $\alpha \begin{bmatrix} 1 & 1 \end{bmatrix}$ 가 고유벡터가 될 수 있습니다.

즉 여기서 우리가 알 수 있는 것은 고유값의 개수는 정해져 있지만 **고유벡터는 무한 개가 존재할 수 있다는 것입니다**. 벡터의 크기가 아니라 방향이 중요합니다.

보통 라이브러리 등을 사용해서 고유벡터를 구해달라고 하면 노름이 1인 정규화된 고유벡터를 구해주곤 합니다. 그냥 대표 친구를 하나 알려주는 거죠. 여기서 노름은 벡터의 크기를 뜻하며, 벡터의 모든 원소를 제곱해서 더한 것에 제곱근을 취해준 결과입니다. 일반적인 유클리디언 거리 공식 떠올리시면 됩니다. 

$$ \Vert \mathbf{v} \Vert = \sqrt{\sum^n_i v_i^2} $$

이 값이 1인 걸 단위벡터라고 하는데, 모든 벡터는 노름으로 모든 원소를 나눠줌으로써 단위벡터로 만들 수 있습니다.

<br>

###  필수 조건과 행렬 대각화

다시 돌아가서, $M \times M$ 행렬에 대해서는 $M$ 개의 고유값이 존재합니다.

즉

$$ \begin{matrix} A\mathbf{v_1} = \lambda_1 \mathbf{v_1} \\ \vdots \\ A\mathbf{v_M} = \lambda_M \mathbf{v_M} \end{matrix} $$

이 여러 개의 식은 행렬화하여 간단하게 표현할 수 있습니다. 2차원으로 예시를 들면, 어떤 행렬 A에 대해 2개의 고유값과 각각에 해당하는 고유벡터가 있을 때, 이 2개의 고유벡터를 열 단위로 합친 행렬 $V$와 고유값을 대각 원소로 사용하는 행렬 $\Lambda$를 다음과 같이 적어주는 것입니다.

$$\begin{bmatrix} v_{11} & v_{21} \\ v_{12} & v_{22} \end{bmatrix} \begin{bmatrix} \lambda_1 & 0 \\ 0 & \lambda_2 \end{bmatrix} = \begin{bmatrix} \lambda_1v_{11} & \lambda_2v_{21} \\ \lambda_1v_{12} & \lambda_2v_{22} \end{bmatrix}  $$

그러면 저 쩜쩜쩜( $\vdots$ ) 을 쓰지 않고 식을 다시 쓸 수 있습니다.

$$ A V = V \Lambda $$

다르게 쓰면 이렇죠.


$$ A = V\Lambda V^{-1}$$ 

여기서 어떤 정방행렬이 고유값분해될 수 있는가 없는가? 를 판가름하는 중요한 조건이 나옵니다. 이 식이 성립하려면 $V$ 은 역행렬을 가질 수 있어야 하는데요. 역행렬을 가질 수 있는 조건은, 행렬식의 값이 0이 아니어야 한다는 것입니다. 


$$ V^{-1} = \frac{1}{\vert V \vert} \begin{bmatrix} v_{22} & -v_{21} \\ -v_{12} & v_{11} \end{bmatrix} = \frac{1}{v_{11}v_{22}-v_{21}v_{12}} \begin{bmatrix} v_{22} & -v_{21} \\ -v_{12} & v_{11} \end{bmatrix} $$

*$** 2 \times 2$ 행렬의 역행렬 공식. 0으로 나눌 수는 없으니까!*


즉 그 행렬의 열벡터들이 선형 독립이 아닌 경우를 의미합니다. **결론적으로 $A$는 맨 처음 언급한 것처럼 정방행렬일 뿐만 아니라 $M$개의 고유 벡터들이 선형 독립이어야 고유값분해될 수 있습니다**.

아무튼 저렇게 두번째 식처럼 A를 다시 쓰는 것을 멋진 말로 대각화(**Diagonalization**)라고 부릅니다. 대각화는 여러 가지로 유용한 수법인데요, (행렬의 거듭제곱이나 행렬식 계산을 쉽게 할 수 있다든지) 고유값분해를 이해하는 데 반드시 필요한 내용은 아니므로 이번 글에서는 생략합니다. 다음 페이지에 잘 정리되어 있어 첨부하겠습니다.
- [행렬의 고유값과 고유벡터](https://velog.io/@lighthouse97/행렬의-고유값과-고유벡터)

<br>

## PCA와 고유값분해가 뭔 상관인지 이해하기

주성분분석(PCA; Principal Component Analysis)이란, 잘 알려진 차원 축소 기법입니다. 차원을 축소할 때 가장 중요한 것은 차원이 작아지는 것의 이점은 충분히 누리면서, **원 데이터의 정보는 최대한 날아가지 않도록** 보존하는 것입니다. 

일단 이 축소라는 걸 어떻게 할까요? 우리에게 변수가 10개인, 즉 10개 차원의 데이터가 있고, 이를 1차원으로 줄이고 싶다고 칩시다. PCA의 축소는 간단히 말하면 선형변환입니다. 우리는 10차원의 벡터 1개를 임의로 정해서 (이걸 축이라고 부릅니다) 각 데이터포인트와 이 벡터를 내적해서 선형변환을 할 수 있습니다. 

$$ X' = z_1x_1 + z_2x_2 + \cdots + z_{10}x_{10}  $$

$**$ 기존 데이터포인트 $X = x_1, \cdots, x_{10}$ 는 우리의 축 $\mathbf{z} = z_1, \cdots, z_{10}$ 을 통해 새로운 1차원짜리 데이터 $X'$가 된다.


그림으로 보면 다음과 같이 축을 정해서 투영(projection)시키는 건데요, 10차원은 못 그리니까 2차원에서 1차원으로 줄이는 예시를 봅시다. 


![](/assets/img/eigenvalue-decomposition-6.png)_파란색 원이 원래의 데이터고, 까만 x 표시가 z라는 축(선)을 기준으로 1차원으로 투영된 데이터임 [(그림 출처)](https://bookdown.org/tpinto_home/Unsupervised-learning/principal-components-analysis.html)_



중요한 문제는 이 축 벡터 $\mathbf{z}$를 어떻게 구해야 차원 축소를 잘한 것이냐는 것입니다. 위 그림에서 왼쪽과 오른쪽 중 어떤 게 더 나은 축소인 것 같나요? 원 데이터의 정보가 최대한 날아가지 않도록 하는 게 목적이라는 걸 기억하면, 왼쪽 그림의 까만 점(투영 후 데이터)가 더 몰려 있는 것으로 보아 정보가 더 많이 손실되었다고 볼 수 있습니다. 그러니까 우리가 찾고 싶은 축은 오른쪽 그림처럼 차원 축소한 결과물의 **분산이 최대한 커지도록** 하는 축입니다.

$$ \text{Var}(X\mathbf{z}) = \Vert X \mathbf{z} \Vert ^2 = \mathbf{z}^T X^TX\mathbf{z}$$


주어진 $X$ 에 대해 위 식을 최대로 하는 $\mathbf{z}$ 는 뭘까요? 사실 저걸 최대로 만들려면 $\mathbf{z}$의 크기 자체를 엄청나게 키우면 됩니다. 하지만 그건 또 너무 쉬운 답이죠. 그래서 이 문제에는 단위벡터( $\mathbf{z}^T\mathbf{z} = 1$)이라는 추가적인 제약 조건이 붙습니다. 또 $X^TX$ 요 부분을 살펴보면, 이 행렬은 원 데이터의 공분산행렬이라는 걸 알 수 있습니다. 이걸 $C$라 부르겠습니다. 즉 $\mathbf{z}^T\mathbf{z} = 1$이면서 $\mathbf{z}^TC\mathbf{z}$가 최대인 $\mathbf{z}$ 를 찾는 문제입니다.

이 제약 조건 하에서 라그랑주 승수법을 쓰면 다음과 같이 풀 수 있습니다.


$$ \begin{matrix} L (\mathbf{z}, \lambda) = \mathbf{z}^T C \mathbf{z} - \lambda (\mathbf{z}^T \mathbf{z}-1) \\
0 = \frac{d}{d\mathbf{z}} (\mathbf{z}^TC\mathbf{z} - \lambda (\mathbf{z}^T\mathbf{z}-1)) \\
0 = C\mathbf{z} - \lambda\mathbf{z} \\
C\mathbf{z}= \lambda\mathbf{z}
\end{matrix}
$$

결론적으로 **우리가 찾는 축은 $X$의 공분산행렬 $C$의 고유벡터**임을 알 수 있습니다. 10개의 고유값과 그에 따른 단위벡터인 고유벡터가 나올 텐데요, $C$가 대칭행렬이기 때문에 이 고유벡터들은 모두 직교합니다(orthogonal). 

- **대칭행렬이 뭐였더라**
	- $C=C^T$ 전치행렬과 본 행렬이 같은, 즉 행렬의 모든 원소를 뒤집어도(대각선을 기준으로 접어도) 똑같은 대칭인 행렬
	- 공분산행렬은 대칭행렬임
		- $$ \begin{bmatrix}\text{Var}(x_1) & \text{Cov}(x_1, x_2) & \cdots & \text{Cov}(x_1, x_{10}) \\ \text{Cov}(x_2, x_1) & \text{Var}(x_2) & \cdots & \text{Cov}(x_2, x_{10}) \\ \vdots & \vdots & \vdots & \vdots \\\text{Cov}(x_{10}, x_1) & \text{Cov}(x_{10}, x_2) & \cdots &  \text{Var}(x_{10})   \end{bmatrix}$$
- **벡터의 직교가 뭐였더라**
	- 두 벡터의 내적이 0이면 두 벡터가 직교함
	- $$ \mathbf{v}^T \mathbf{w} = 0$$
- **왜 대칭 행렬의 고유벡터는 직교할까?**
	- $$\begin{matrix}
\lambda_1 \mathbf{z}^T_1 \mathbf{z}_2 = (C\mathbf{z}_1)^T \mathbf{z}_2 = \mathbf{z}_1^TC^T\mathbf{z}_2 = \mathbf{z}_1^TC\mathbf{z}_2 = \mathbf{z}^T_1\lambda_2\mathbf{z}_2 = \lambda_2\mathbf{z}^T_1 \mathbf{z}_2 \\
\lambda_1\mathbf{z}^T_1\mathbf{z}_2 - \lambda_2 \mathbf{z}^T_1 \mathbf{z}_2 = (\lambda_1 - \lambda_2) \mathbf{z}^T_1 \mathbf{z}_2 = 0
\end{matrix}
$$
	-  대칭 행렬의 특성인 $C^T = C$  때문에 C의 서로 다른 고유값 $\lambda_1$, $\lambda_2$와 상응하는 고유벡터 $\mathbf{z}_1$,$\mathbf{z}_2$ 에 대해 이런 식이 도출되는데 
	- $\lambda_1$, $\lambda_2$ 는 서로 다른 값이어서 그 차이가 0이 될 수 없으므로 $\mathbf{z}_1^T\mathbf{z}_2 = 0$ 라는 직교의 정의를 얻을 수 있다!



![](/assets/img/eigenvalue-decomposition-7.png)_다시 제일 만만한 2차원 그림을 보자. PC1과 PC2가 2개의 직교하는 축이며, PC1이 더 큰 고유값 = 더 많은 분산을 보존한다! [(그림 출처)](https://wikidocs.net/214112)_



다시 돌아와서, 얻은 축들을 고유값이 큰 순서에 따라 내림차순으로 정렬합니다(처음 문제를 풀었던 식을 들여다보면 고유값이 클수록 분산이 더 크게 보존될 거라는 걸 알 수 있습니다). 우리는 1차원으로 축소하고 싶으므로 이 값이 가장 큰 고유벡터를 사용하면 됩니다.


