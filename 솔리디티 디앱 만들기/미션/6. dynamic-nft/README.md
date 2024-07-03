# Scaffold-ETH 2로 온체인 SVG 기반 다이나믹 NFT 만들기

## 🚩 Step 0. 다이나믹 NFT (feat. 온체인 메타데이터)

NFT를 생성할 때, 메타데이터를 중앙화된 객체 저장소나 IPFS와 같은 탈중앙화 저장소에 저장하는 것이 좋은 방법이다. 이는 이미지나 JSON 객체와 같은 대용량 데이터를 온체인에 직접 저장할 때 발생하는 막대한 가스 비용을 피하기 위함이다다.

하지만 여기에는 문제가 있는데,

메타데이터를 블록체인에 저장하지 않으면 스마트 계약에서 해당 메타데이터와 상호작용하는 것이 불가능하다는 것이다. 블록체인은 "외부 세계"와 통신할 수 없기 때문이다.

메타데이터를 스마트 계약에서 직접 업데이트하려면 온체인에 저장해야 하지만, 매번 발생하는 가스 비용은 어떻게 해야할?

다행히도, Polygon과 같은 L2 체인들이 가스 비용을 대폭 줄여주는 여러 가지 장점을 제공하여 개발자들이 애플리케이션의 기능을 확장할 수 있도록 도와주고있다.

**⏩️ L2 (Layer2)란?** <br/>
L2는 기존 블록체인 위에 구축된 2차 프레임워크 또는 프로토콜을 의미한다. 이러한 프로토콜의 주요 목표는 주요 암호화폐 네트워크가 직면하고 있는 거래 속도와 확장성 문제를 해결하는 것이다.

> 🔥 이번 미션에서는 블록체인과의 상호작용에 따라 메타데이터가 변경되는 완전 동적 NFT를 온체인 메타데이터와 함께 만드는 방법을 배우고, 가스 비용을 낮추기 위해 이를 Polygon Amoy에 배포하는 방법을 배운다.

---

## 🚩 Step 1. 환경

프로젝트 클론해가기

```sh
git clone https://github.com/scaffold-eth/scaffold-eth-2.git dynamic-nft
cd dynamic-nft
yarn install
```

<br/>

**🪪 배포자 (Deployer) 설정**

`packages/hardhat/.env` 및 `packages/nextjs/.env.local`을 수정한다.

```bash
# .env
ALCHEMY_API_KEY=
DEPLOYER_PRIVATE_KEY=
POLYGONSCAN_API_KEY=
```
본인 계정의 [Alchemy](https://dashboard.alchemy.com/apps) Apps API key와 소유하고 있는 지갑의 프라이빗 키, [Polygonscan](https://polygonscan.com/apis) API Key를 기입한다.

> Metamask 지갑의 경우, 계정 세부 정보로 들어가면 프라이빗 키를 얻을 수 있다.

<br/>

**🪝 컨트랙트 배포하기**

`packages/hardhat/hardhat.config.ts`에서 defaultNetwork를 `polygonAmoy`로 변경한다.

```sh
yarn deploy
```

> ⚠️ Polygon Amoy 네트워크의 MATIC을 가지고 있지 않다면, `🚩 Step 3`를 먼저 선행한다.

<br/>

**🏛️ 프론트엔드 배포하기**

`packages/nextjs/scaffold.config.ts`를 아래처럼 변경한다.

```typescript
const scaffoldConfig = {
  targetNetworks: [chains.polygonAmoy],

  // ...

  onlyLocalBurnerWallet: false,
} as const satisfies ScaffoldConfig;
```

NestJS 애플리케이션을 배포한다. [Vercel](https://vercel.com/) 에서 로그인 후 dashboard로 이동해 `Add New -> Project` 를 클릭한 후 GitHub repository를 임포트해온다.

```shell
yarn vercel
```

📱 Vercel이 제공하는 url 로 접속해서 애플리케이션 열기

---

## 🚩 Step 2. Polygon PoS - 더 낮은 가스 비용과 더 빠른 거래

Polygon은 탈중앙화된 EVM 호환 스케일링 플랫폼으로, 개발자가 보안성을 유지하면서 저렴한 거래 수수료로 확장 가능한 사용자 친화적인 DApp을 구축할 수 있도록 한다.

Polygon은 Layer2 체인(L2)으로 설명되는 체인 그룹에 속하며, 이는 Ethereum 위에 구축되어 그 특성을 해결하는 동시에 Ethereum에 의존하여 기능하는 것을 의미한다.

Ethereum은 속도와 비용적인 면에서 효율적이지 않기 때문에, 이때 Polygon이나 Optimism과 같은 L2 솔루션이 중요한 역할을 한다.

예를 들어, Polygon은 다음과 같은 두 가지 주요 장점이 있다.

1. 더 빠른 거래 속도 (초당 65,000건 거래)
2. Ethereum보다 약 10,000배 낮은 거래당 가스 비용

이 두 번째 이유 때문에 우리는 온체인 메타데이터를 포함한 NFT 스마트 계약을 Polygon에 배포한다. Ethereum에 메타데이터를 저장할 때는 거래당 수백 달러의 비용이 들 수 있지만, Polygon에서는 몇 센트밖에 들지 않는 것이다.

> 🔍 [L2 체인이 거래 비용을 낮추고 거래 속도를 높이는 방법](https://www.one37pm.com/nft/what-are-layer-2-solutions-and-why-are-they-important)

---

## 🚩 Step 3. Metamask 지갑에 Polygon Amoy 추가

1. MetaMask 확장 프로그램 아이콘을 클릭
2. 좌측 상단의 네트워크 드롭다운 메뉴를 클릭하고 `+ 네트워크 추가` 버튼을 클릭
3. 네트워크 세부 정보 입력

    **네트워크 이름** <br/>
    Mumbai <br/>
    **네트워크 URL** <br/>
    https://rpc-amoy.polygon.technology <br/>
    **체인 ID** <br/>
    80002 <br/>
    **통화 기호** <br/>
    MATIC <br/>
    **블록 탐색기 URL** <br/>
    https://mumbai.polygonscan.com

혹은 [Chainlist](https://chainlist.org/chain/80002)에 들어가서 원하는 네트워크를 찾아 쉽게 추가할 수 있다.

네트워크가 추가 되었으면 [Polygon faucet](https://faucet.polygon.technology/)에서 테스트 MATIC을 받는다.

<img src='./images/test_faucet.png' width=300px></img>

---

## 🚩 Step 4. SVG (scalable vector graphic file)

SVG 파일은 확장 가능한 벡터 그래픽 파일의 약자로, 인터넷에서 2차원 이미지를 렌더링하는 데 사용되는 표준 그래픽 파일 유형이다. 다른 인기 있는 이미지 파일 형식과 달리 SVG 형식은 이미지를 벡터로 저장한다.

> ⏩️ **벡터** <br/>
수학 공식에 따라 점, 선, 곡선 및 모양으로 구성된 그래픽 유형

SVG 파일은 디지털 정보를 저장하고 전송하는 데 사용되는 마크업 언어인 XML로 작성된. SVG 파일의 XML 코드는 이미지를 구성하는 모든 모양, 색상 및 텍스트를 지정한다.

```xml
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
   <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
   <rect width="100%" height="100%" fill="black" />
   <text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">Warrior</text>
   <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">Levels: getLevels(tokenId)</text>
 </svg>
```

SVG는 코드를 사용하여 쉽게 수정하고 생성할 수 있으며, Base64 데이터로 쉽게 변환할 수 있는 장점이 있다.

Base64 이미지는 호스팅 제공업체 없이 브라우저에서 표시할 수 있기 때문에 체인 상에 객체 스토리지 없이 이미지를 저장할 수 있게 된다.

---

## 🚩 Step 5. 민팅 (Minting)

> ✏️ 'Home' 탭에서 `Title`과 `Color`를 입력한 후 **MINT NFT** 버튼을 클릭한다.

<img src='./images/mint.png' width=300px></img>

입력한 Title과 초기 레벨 0을 메타데이터로 가진 NFT가 생성된 것을 확인할 수 있다.

---

## 🚩 Step 5. 메타데이터 업데이트

이번에는 NFT를 훈련시켜 레벨을 올려보자.

우측 하단의 `TRAIN NFT` 버튼을 클릭하면, NFT의 레벨이 올라가는 것을 확인할 수 있다.

<img src='./images/train.png' width=300px></img>


**[Mint & Train Sequence]**
<img src='./images/mint_train_sequence.png' width=400px></img>

