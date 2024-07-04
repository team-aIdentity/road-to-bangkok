# Scaffold-ETH 2로 간단한 주사위 게임 만들기

## 🚩 Step 0. 무작위성?

다들 알다시피 컴퓨터는 난수를 만들 수 없다. 컴퓨터는 사람과 달리 무의식적인 선택을 할 수 없기 때문이다. 그래서 기존의 입력값을 통해 결과를 출력하는 '결정론적'으로 동작한다.

이는 블록체인에도 똑같이 적용된다. 하지만 로컬 데이터를 활용하여 난수를 생성할 수 없다. 노드가 블록을 받아 실행했을 때, 모든 노드는 같은 결과값을 출력해야 하기 때문이다. 이러한 이유로 블록체인에는 입력 값을 확보하기 어렵다.

블록체인 난수 생성 방식은 여러가지가 있다. 블록 상태값을 조합하여 난수 생성의 입력 값으로 사용하기도 하고, Commit and Reveal이라 불리는 방식을 사용하기도 한다. 이 외에도 VDF, Signidice 등 과 같은 여러 방법을 통해 블록체인은 난수를 생성한다.

그럼 이 난수는 왜 필요할까? 여러가지 이유 중 예시로 하나를 들자면, 밸리데이터를 선출할 때 난수를 사용하기 때문이다. 이 밸리데이터의 선출 과정을 모든 노드가 받아들일 수 있어야 하고 누구도 조작할 수 없기 때문에, 탈중앙화를 지키면서 지속적으로 난수를 생성해야 한다. 이처럼 여러 이유때문에 블록체인에서 무작위성은 중요한 문제이다.

> 🔥 이번 미션에서는 블록 해시를 사용하여 난수를 생성하고, 이를 이용한 주사위 게임 프론트엔드를 제작한다.

---

## 🚩 Step 1. 환경

Scaffod-ETH 2 프로젝트 생성 및 의존성 설치

=> 새로운 프로젝트를 생성할지 만들어놓은 프로젝트를 clone해갈지 추후 결정

```sh
git clone https://github.com/scaffold-eth/se-2-challenges.git challenge-3-dice-game
cd challenge-3-dice-game
git checkout challenge-3-dice-game
yarn install
```

> 첫 번째 터미널에서 로컬 블록체인 초기화 하기

```sh
yarn chain
```

> 두 번째 터미널에서 스마트 계약 배포하기

```sh
cd challenge-3-dice-game
yarn deploy
```

> 세 번째 터미널에서 프론트엔드 시작하기

```sh
cd challenge-3-dice-game
yarn start
```

📱 http://localhost:3000 으로 접속해서 애플리케이션 열기

---

## 🚩 Step 2. 가스 & 지갑

> ⛽️ 주사위 롤을 하기 전에, 가스비를 지불하기 위한 자금이 필요할 것이다.

![Faucet](https://github.com/scaffold-eth/se-2-challenges/assets/55535804/e82e3100-20fb-4886-a6bf-4113c3729f53)

> 🦊 우선 Metamask와 연결하지 않는다. 만약 연결했다면 연결을 끊고 로컬호스트에 있는 burner 지갑(테스트용 토큰을 가진 일회용 지갑)을 사용한다.

<p>
  <img src="./images/nft_wallet.png" width="33%" />
  <img src='./images/nft_copy_address.png' width='33%' />
  <img src="./images/nft_faucet.png" width="33% />
</p>

---

## 🚩 Step 3. 주사위 롤

<!-- > 주사위를 굴리기 전에 `RiggedRoll.sol`의 `receive()` 함수를 통해 Eth를 받는다.

<p>
  <img src='./images/nft_wallet_receive_function.png' width="600px" />
</p> -->

> 탭에서 **Dice Game** 버튼을 클릭한다. 그 후, **Roll the dice!** 버튼을 통해 주사위를 굴린다.

플레이어가 주사위를 굴릴 때, `0,1,2,3,4,5`가 나오면 현재 상금 금액을 획득 한다. 플레이어가 보낸 0.002 Eth 중 40%는 현재 상금에 추가되고, 나머지 60%는 미래 상금을 마련하기 위해 `Contract`에 남아있다.

![RiggedRollAddress](https://github.com/scaffold-eth/se-2-challenges/assets/55535804/e9b9d164-2fb1-416a-9c5e-198d15bca0c6)

> 0.002 Eth 보다 작으면 `RollTheDice()` 함수가 실행되지 않는다.

---

## 🚩 Step 4. 인출 및 배포

지금까지 주사위 롤을 통한 Eth를 인출해보자.

> RigedRoll contract를 `deploy`하려면 `packages/hardhat/deploy`의 `01_deploy_riggedRoll.ts` 에서 소유자를 프론트 엔드 주소로 바꿔야 한다.

```typescript
const riggedRoll: RiggedRoll = await ethers.getContract("RiggedRoll", deployer);

// Please replace the text "Your Address" with your own address.
try {
  await riggedRoll.transferOwnership("Your Address");
} catch (err) {
  console.log(err);
}
```

소유자로 설정 함으로써, 인출 기능을 호출할 수 있다.

![WithdrawOnlyOwner](https://github.com/scaffold-eth/se-2-challenges/assets/55535804/e8397b1e-a077-4009-b518-30a6d8deb6e7)

📡 `packages/hardhat/hardhat.config.ts`에 있는 `defaultNetwork`에서 [원하는 public EVM networks](https://ethereum.org/en/developers/docs/networks/) 를 수정할 수 있다.

🔐 `yarn generate`를 이용하여, **deployer address**를 생성할 수 있다.

👩‍🚀 `yarn account`를 이용하여, **deloyer account**의 잔액을 볼 수 있다.

⛽️ `yarn deploy`를 이용하여, 스마트 컨드랙트를 **public Network**에 배포 합니다.

> hardhat.config.ts에서 defaultNetwork를 sepolia로 설정하거나 yarn deploy --network sepolia 명령을 사용할 수 있다.

---

## Checkpoint 5: 🚢 Ship your frontend! 🚁

```json
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
        runs: 200,
      },
    },
  },
  defaultNetwork: "localhost",
```

✏️ Edit your frontend config in `packages/nextjs/scaffold.config.ts` to change the `targetNetwork` to `chains.sepolia` or any other public network.

💻 View your frontend at http://localhost:3000 and verify you see the correct network.

📡 When you are ready to ship the frontend app...

📦 Run `yarn vercel` to package up your frontend and deploy.

> Follow the steps to deploy to Vercel. Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

> If you want to redeploy to the same production URL you can run `yarn vercel --prod`. If you omit the `--prod` flag it will deploy it to a preview/test URL.

> 🦊 Since we have deployed to a public testnet, you will now need to connect using a wallet you own or use a burner wallet. By default 🔥 `burner wallets` are only available on `hardhat` . You can enable them on every chain by setting `onlyLocalBurnerWallet: false` in your frontend config (`scaffold.config.ts` in `packages/nextjs/`)

#### Configuration of Third-Party Services for Production-Grade Apps.

By default, 🏗 Scaffold-ETH 2 provides predefined API keys for popular services such as Alchemy and Etherscan. This allows you to begin developing and testing your applications more easily, avoiding the need to register for these services.
This is great to complete your **SpeedRunEthereum**.

For production-grade applications, it's recommended to obtain your own API keys (to prevent rate limiting issues). You can configure these at:

- 🔷`ALCHEMY_API_KEY` variable in `packages/hardhat/.env` and `packages/nextjs/.env.local`. You can create API keys from the [Alchemy dashboard](https://dashboard.alchemy.com/).

- 📃`ETHERSCAN_API_KEY` variable in `packages/hardhat/.env` with your generated API key. You can get your key [here](https://etherscan.io/myapikey).

> 💬 Hint: It's recommended to store env's for nextjs in Vercel/system env config for live apps and use .env.local for local testing.

---

## Checkpoint 6: 📜 Contract Verification

Run the `yarn verify --network your_network` command to verify your contracts on etherscan 🛰

👉 Search this address on Etherscan to get the URL you submit to 🏃‍♀️[SpeedRunEthereum.com](https://speedrunethereum.com).

---

> 🏃 Head to your next challenge [here](https://speedrunethereum.com).

> 💬 Problems, questions, comments on the stack? Post them to the [🏗 scaffold-eth developers chat](https://t.me/joinchat/F7nCRK3kI93PoCOk)

---

chapter 2 {

### 🥅 Goals

- [ ] Track the solidity code to find out how the DiceGame contract is generating random numbers.
- [ ] Is it possible to predict the random number for any given roll?
      }

```

```
