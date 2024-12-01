---
title: Variational Autoencoder 이해하기
date: 2024-11-30 12:39:00 +09:00
categories:
  - Posts
  - Data
tags:
  - ml
  - recsys
math: true
toc: true
comments: true
image:
---
> Autoencoder와 비슷한 듯 다른 Variational Autoencoder(VAE)의 구조와 손실함수를 이해해 봅니다.
{: .prompt-info }



## 일단 Autoencoder는 뭐였더라

이름에 오토인코더가 들어가니까 VAE를 알려면 기본 오토인코더를 일단 알아야만 할 것 같습니다. 간단하게 개념을 되살려 보겠습니다.

![](/assets/img/posts/variational-autoencoder-3.jpg)_[그림 출처](https://hugrypiggykim.com/2018/01/16/fds-fraud-detection-system-with-autoencoder/)_

Autoencoder란 **인코더와 디코더**라는 두 개의 신경망 네트워크로 이루어져 있으며, 두 구조 사이에 데이터의 차원이 크게 줄어드는 병목 구간이 존재합니다. 이 구조를 통해 입력을 받아서 **입력과 똑같은 출력을 만들어내는 것**을 목표로 합니다. 더 자세히는, 우선 인코더가 입력 데이터를 받아서 몇 개의 층을 통과시킨 다음, 원래 입력보다 훨씬 적은 차원의 압축된 데이터(latent vector)를 얻습니다. 디코더는 이 잠재 벡터를 받아서 처음 얻은 입력과 같은 크기의 데이터를 뱉어내야 하는데, 이 출력과 입력의 차이를 줄이는 것을 목표로 네트워크가 학습되는 것입니다.

이걸 왜 하는데? 라고 물어보면 라벨이 없는 채로 가능한 representation learning에 핵심 목적이 있다고 할 수 있습니다. 특히 우리가 인코더를 통해서 얻은 latent vector는 원래 데이터의 핵심적인 특성을 잘 가지고 있지만 입력보다 훨씬 사이즈가 줄어든 데이터이기 때문에 이를 통해서 일종의 차원 축소 효과를 얻을 수 있죠. 활용 방식은 여러 가지인데 결과물을 다른 레이어랑 붙여서 분류 등의 과제에 사용할 수도 있고, 학습된 오토인코더 자체를 이상 탐지에도 사용하기도 합니다.

![](/assets/img/posts/variational-autoencoder-6.png)_이상한 입력이 들어오면 정상 데이터 기반으로 학습된 오토인코더에서 복원이 잘 안 되기 때문! ([그림 출처](https://peanut159357.tistory.com/128))_

<br>

## 그럼 Variational Autoencoder는

### 목표

본 글의 주제인 VAE(Variational Autoencoder)는 생긴 것은 오토인코더와 매우 흡사한 인코더-디코더 구조로 이루어져 있지만, 목적이나 수식은 다릅니다. VAE는 기본적으로 생성 모델(Generative Model)입니다. 따라서 **VAE의 목표는 기본 AE와는 달리 입력을 그대로 복원하는 것이 아니라 입력과 비슷하지만 새로운 데이터를 생성하는 것**입니다.

- AE: 입력 데이터를 잘 압축시킨 하나의 저차원 잠재 벡터를 얻겠다 = 특성 추출
- VAE: 입력 데이터와 비슷하지만 다른 새로운 데이터를 얻겠다 = 생성

목표는 이해했는데, VAE는 어떻게 우리가 가진 데이터랑 비슷하면서 새로운 데이터를 만들어낼까요?



![](/assets/img/posts/variational-autoencoder-2.png)_[그림 출처](https://data-science-blog.com/blog/2022/04/19/variational-autoencoders/)_

![](/assets/img/posts/variational-autoencoder-1.png){:w="450"}
_[그림 출처](https://vitalflux.com/autoencoder-vs-variational-autoencoder-vae-difference/)_

그 답은 인코더와 디코더의 사이에 있는 병목 구간에서 잠재 벡터가 아닌 **잠재 공간이 어떻게 생겼는지를 규정하는 확률 분포를 추정**하겠다는 것입니다. 즉 AE는 중간 단계에서 하나의 고정된 값을 얻는다면, VAE는 어떤 분포를 결정하는 파라미터를 얻습니다. 그리고 이 분포에서 샘플링을 해서 벡터를 얻고 디코더가 이 벡터를 받습니다. 따라서 AE는 입력이 같으면 출력이 같을 수밖에 없는 구조이지만, VAE는 입력이 같아도 이 샘플링 때문에 다른 출력이 나올 수 있습니다. 사실 AE도 디코더가 달려 있고 입력과 출력이 완전히 동일하지 않으니 어떻게 보면 생성에 쓰는 게 불가능하다곤 할 수 없지만, 이런 차이점이 VAE를 생성 모델로 만드는 거죠.


그러면 자연스럽게 궁금해지는 것은 이 분포를 어떻게 결정할 거냐는 것입니다. 이 잠재 공간이란 게 어떻게 생긴 공간인지 알 도리가 없기 때문에 밑바닥에서부터 시작하면 너무 막막한 난제가 되어버립니다. 그래서 그냥 우리가 잘 알고 만만한 어떤 분포를 따른다고 가정하자! 라는 접근을 취하는데, 그게 바로 **정규 분포**입니다. 파라미터도 많이 없고 평균($\mu$)과 분산($\sigma^2$)만 정하면 되니 얼마나 좋게요. 

![](/assets/img/posts/variational-autoencoder-7.png){:w="400"}
_정규분포는 평균과 분산 값에 따라서 생긴 게 달라진다 ([그림 출처](https://en.wikipedia.org/wiki/Normal_distribution))_


이렇게 어렵고 잘 모르는 분포를 쉬운 분포로 근사해서 처리하는 방식의 추론을 **변분 추론(Variational Inference)** 라고 합니다. VAE의 이름이 VAE인 이유입니다.




![](/assets/img/posts/variational-autoencoder-8.png)_[그림 출처](https://lcyking.tistory.com/entry/논문리뷰-VAEVariational-Auto-Encoder)_

다음 단계에서는 수식이 조금! 나올 것이므로 다시 노테이션 보면서 정리하면,

- 인코더
	- 사실 우리가 알고 싶은 것은 잠재 공간의 진짜 사후 분포 (데이터 $x$가 주어졌을 때 $z$의 분포) - $p(z \vert x)$ 
	- 하지만 그걸 알아내는 건 너무 어려우니까 정규분포로 근사해서 랜덤 샘플링함- $q_{\Phi}(z \vert x)$ 
		- 이때 $\Phi$는 알아내야 하는 파라미터인 $\mu$, $\sigma$ 를 의미함
- 디코더
	- 샘플링한 $z$로부터 출력을 생성 - $g(x \vert z)$


<br>

### 손실함수

$\Phi$ 를 어떻게 정할 것이냐면, 일반적인 MLE(Maximum Likelihood Estimation)의 약간 꼬인 접근입니다. 우선은 우리가 결정해야 하는 모든 파라미터를 두고 봤을 때 우리의 관찰된 데이터 $x$ 가 발생할 (Log) Likelihood를 가장 높도록 하고 싶다고 생각해봅시다. 그래서 $\log(p(x))$ 를 최대화해줘야 하는데 수식으로 전개해보면 다음과 같습니다.


$$\begin{align} \log(p(x)) & = \int \log(p(x))q_{\Phi}(z \vert x) dz & \because \int q_{\Phi} (z \vert x) dz = 1 \\ & = \int \log (\frac{p(x,z)}{p(z \vert x)}) q_{\Phi}(z \vert x)dz  & \because p(x) = \frac{p(x,z)}{p(z \vert x)} \\ & = \int \log ( \frac{p(x,z)}{q_{\Phi}(z \vert x)} \cdot \frac{q_{\Phi}(z \vert x)}{p(z \vert x)}) q_{\Phi}(z \vert x) dz &  \\ & = \int \log ( \frac{p(x,z)}{q_{\Phi}(z \vert x)}) q_{\Phi}(z \vert x) dz + \int \log (\frac{q_{\Phi}(z \vert x)}{p(z \vert x)}) q_{\Phi}(z \vert x) dz &  \end{align} $$


마지막 줄에서 앞의 term과 뒤의 term은 각자 다른 의미를 지니는데요.

- 첫번째 term : $\int \log ( \frac{p(x,z)}{q_{\Phi}(z \vert x)}) q_{\Phi}(z \vert x) dz$ **= Evidence Lower Bound**
- 두번째 term : $\int \log (\frac{q_{\Phi}(z \vert x)}{p(z \vert x)}) q_{\Phi}(z \vert x) dz$  = **KL Divergence**


첫번째 Evidence Lower Bound는 줄여서 ELBO라고도 부릅니다. 하지만 이게 왜 이런 이름인지를 이해하려면 두번째 KL Divergence term부터 설명해야 합니다.

KLD는 서로 다른 확률 분포의 차이를 수치화하여 나타내는 값으로, (예를 들어 두 확률 분포 P와 Q가 있을 때) P가 아니라 Q의 분포 함수를 통해 P의 데이터 샘플들을 이해한다면 얼마나 큰 차이가 발생하느냐에 대한 답입니다. P와 Q가 많이 비슷하다면 Q로 P를 근사해도 별 차이가 없을 것이다 라는 가정이죠. 

$$KL(p \Vert q) = \int p(x) \log \frac{p(x)}{q(x)} dx$$KLD는 그 정의 상 $p$와 $q$가 완전히 동일한 분포일 때 0이 되며 그렇지 않은 경우 0 이상입니다.

다시 돌아가면 우리가 최대화해야 하는 $\log (p(x))$ 식에서 KL Divergence term은 $p(z \vert x)$ 와 $q_{\Phi} (z \vert x)$의 차이를 의미합니다. 인코더에서 우리가 진짜 $p$ 를 몰라서 정규분포인 $q$ 로 근사를 했다는 것을 기억하면, 가장 가깝게 근사가 되도록 $\Phi$ 를 정하면 된다고 했던 문제와 일맥상통합니다.


![](/assets/img/posts/variational-autoencoder-9.png)_[그림 출처](https://blog.evjang.com/2016/08/variational-bayes.html)_

문제는 우리가 진짜 $p(z \vert x)$ 를 전혀 모르고, 주어진 고정된 데이터셋만 가지고 있다는 것이죠. 따라서 위 KL Divergence 값의 경우 최적화할 수 있는 영역이 아니게 됩니다. 우리 아는 것은 해당 부분이 0 이상이라는 것이므로, 결국 $\log (p(x))$ = ELBO + KLD 를 최대화하는 것은 **ELBO를 최대화하는 문제**가 됩니다. ELBO term은 우리가 가진 데이터(증거)의 likelihood의 하한선이 되므로, 이를 Evidence Lower Bound라고 부르는 것입니다.


ELBO는 다음과 같이 한번 더 쪼개집니다.

$$\begin{align} \int \log ( \frac{p(x,z)}{q_{\Phi}(z \vert x)}) q_{\Phi}(z \vert x) dz & = \int \log ( \frac{p(x \vert z) p(z)}{q_{\Phi}(z \vert x)}) q_{\Phi}(z \vert x) dz \\  & = \int q_{\Phi}(z \vert x) \log(p(x \vert z)) dz - \int q_{\Phi}(z \vert x) \log( \frac{q_{\Phi}(z \vert x)}{p( z)}) dz \\ & = E_{q_{\Phi}} \log(p(x \vert z)) - KL(q_{\Phi}(z \vert x ) \Vert p(z)) \end{align}$$

- 첫번째 term : $E_{q_{\Phi}} \log(p(x \vert z))$
	- $q$를 써서 $x$에서 $z$를 얻고, $z$로부터 생성된 $x$를 얻는데 이게 원래 입력인 $x$와 최대한 비슷하도록 (negative 크로스엔트로피임) 
	- 즉 오토인코더의 Reconstruction Loss 가 최대한 적도록!
- 두번째 term: $KL(q_{\Phi}(z \vert x ) \Vert p(z))$ 
	- 실제 $z$의 분포와 우리가 가정한 정규분포가 최대한 비슷하도록! (위에 한번 등장한 KLD와는 대상이 다른 점 주의)
	- 두 개의 분포 차이가 작아지도록 하여 Regularization으로 작용

![](/assets/img/posts/variational-autoencoder-5.png)_[그림 출처](https://www.jeremyjordan.me/variational-autoencoders/)_


<br>

### 재파라미터화 

다시 돌아가보면 인코더는 분포를 추정하고, 이 분포에서 랜덤하게 어떤 포인트(벡터)를 샘플링한 다음 이걸 디코더가 가져다가 최종적인 출력을 생성한다고 했습니다. 문제는 **랜덤 샘플링은 역전파(backpropagation)이 안 된다**는 것입니다.


![](/assets/img/posts/variational-autoencoder-4.png)_[그림 출처](https://dilithjay.com/blog/the-reparameterization-trick-clearly-explained)_

이걸 해결해주는 방법이 바로 재파라미터화(reparameterization) 트릭입니다. 샘플링한 벡터를 다음과 같이 표현하는 것인데요.

$$z = \mu + \sigma \cdot \epsilon$$
- 여기서 $\epsilon$은 표준정규분포(평균이 0, 분산이 1인 정규분포)에서 샘플링한 노이즈 변수

이렇게 하는 것이나 처음부터 평균이 $\mu$이고 분산이 $\sigma^2$인 분포에서 샘플링을 하는 것이나 사실 같은 소리입니다. 다만 이렇게 하면 랜덤성이 존재해서 기울기 계산이 안 되는 부분을 모델 학습과 무관한 고정된 분포를 따르는 $\epsilon$에 제한함으로써 역전파가 가능하게 됩니다!


<br>


## 참고
- 오토인코더의 모든 것 - [강의](https://www.youtube.com/watch?v=o_peo6U7IRM), [슬라이드](https://www.slideshare.net/NaverEngineering/ss-96581209)
- [VAE 논문](https://arxiv.org/abs/1312.6114)
- [VAE 설명 (Variational autoencoder란? VAE ELBO 증명)](https://process-mining.tistory.com/161)
- [변분추론(Variational Inference)](https://ratsgo.github.io/generative%20model/2017/12/19/vi/)