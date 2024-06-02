# Etherscan 뜯어보기

이번 장에서는 Etherscan 사이트에 대해 알아보고자 한다. Etherscan은 block explorer로, 이더리움 네트워크에서 일어나는 모든 활동들을 탐색할 수 있는 사이트이다.

홈페이지 : [https://etherscan.io/](https://etherscan.io/) 


페이지의 구성을 천천히 살펴보도록 한다.</br>
<img width="826" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-06-01_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_8 59 04" src="https://github.com/seungmiKim1/road-to-bangkok/assets/89903766/82d44807-9156-463d-a00d-23061360f20a">



상단의 검색 부분에서는 Adress, Txn Hash, Block, Token, Domain Name 등 내가 찾고자 하는 특정 분야를 한 번에 찾을 수 있다. 특정 주소, 특정 서비스 등이 이더리움 네트워크에서 어떤 활동을 하고 있는지 검색해서 한 번에 볼 수 있다. <br/>
<img width="1332" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-06-01_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_8 57 47" src="https://github.com/seungmiKim1/road-to-bangkok/assets/89903766/9da1d41e-9f92-4104-be7c-183cfdfba03e">


ETHER PRICES - 현재 이더리움의 가격을 나타낸다. 

TRANSACTIONS - 전체적으로 이더리움 네트워크에서 발생한 트랜잭션의 총 수를 나타내고, MED GAS PRICE는 이더리움 가스비의 중앙값이다. 

MARKET CAP - Market CAP은 Market Capitalization의 약자로, 이더리움의 시가총액이다. 이더리움의 현재 시장 가격과 유통 중인 이더리움의 총 개수를 곱한 값이다. 

LAST FINALIZED BLOCK - 최근에 확정된 블록을 나타낸다. 블록은 바로바로 합쳐지는 것이 아닌 네트워크에서 여러 Validator들에 의해 해당 블록의 유효성을 검증하는 과정을 거치게 되는데 이 과정이 통과되어야만 블록에 합쳐지기 때문이다. 즉 이 과정을 통해 블록의 보안성과 안정성을 나타낼 수 있다. 

LAST SAFE BLOCK - 이더리움 블록체인 상에서 안전하게 사용될 수 있는 블록을 가리킨다. 블록체인 네트워크 상에서는 동일한 블록에 대해 서로 다른 의견을 가지고 나뉠 수 있는 ‘분기’가 발생할 수 있다. 이로써 2개 이상의 분기점을 가질 수도 있는데, 이는 블록체인의 일관된 상태를 해칠 수 있다. LAST SAFE BLOCK을 통해 분기 현상 이후의 어떤 분기점의 블록을 사용해야 하는지에 대한 지표가 된다. 

<h2>Latest Blocks</h2>
<img width="665" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-06-01_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_9 16 49" src="https://github.com/seungmiKim1/road-to-bangkok/assets/89903766/7f516eed-7a95-480b-a1ed-b996bf20416a">



이더리움 네트워크에서 발생되는 실시간 블록을 보여주는 곳이다. 실시간으로 갱신되니 페이지를 새로고침 할때마다 새로운 블록들이 줄줄이 이어진다. 

위에서 Fee Recipient beaverbuild,Titan Builder 등등이 적혀있는데, Fee Recipient <주체>는 수수료를 받는 주체가 되는 것이다. 사용자가 트랜잭션을 실행할 때 해당 거래를 처리하는 노드나 서비스 제공자에게 제공되는 수수료이다. 또한 우측에는 얼마의 거래 수수료를 받았는지까지 적혀있다. 

<h2>Latest Transactions</h2>



특정 주소나 계정에서 발생한 최신 트랜잭션들을 보여주는 곳이다. 이것도 Latest Blocks와 마찬가지로 페이지를 새로고침하면 새로운 트랜잭션 리스트들을 볼 수 있다. 

From 주소 > To 주소에게로 나타나있는데, From의 주체가 To 목적지에게 얼마만큼의 Eth를 보냈는지에 대해 간략하게 나와 있다. 

거래 하나를 눌러 어떤 식으로 보냈는지에 대해 상세정보를 보자. 

Transaction Detail 페이지에서는 아래와 같이 트랜잭션의 세부적인 정보를 볼 수 있다. 
<img width="630" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-06-01_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_9 22 08" src="https://github.com/seungmiKim1/road-to-bangkok/assets/89903766/a79b19e9-865f-493e-a41b-92d430a7a157">

(주소는 모자이크가 필요할까?)

Transaction Hash는 이 트랜잭션의 고유한 해시값이다. 이 트랜잭션에 대해 특정 번호가 붙었다고 생각하면 된다. 

19996919번째의 블록에 이 트랜잭션이 포함되어 있으며, Timestamp를 통해 6분 전에 이 블록이 생성되었다는 것을 확인할 수 있다. 

Transaction Action의 경우 이 트랜잭션이 어떤 행동을 했느냐를 나타내는데 Transfer(이더리움 송금)을 했다는 것을 확인했다. 송금한 가격은 0.393731~ ETH로 Value에서 확인할 수 있다. 

Transaction Fee는 이 트랜잭션을 블록체인 네트워크에 제출할 때 지불해야 하는 수수료를 의미하며, 이 트랜잭션을 처리하여 블록을 포함시키는 Minor에게 그 보상이 지급된다. 

Gass Price는 이 트랜잭션을 처리하는데 지불된 이더리움 Gas의 가격을 의미한다. Gwei라는 단위로 표현되며Gas Price가 높을수록 더 빠른 트랜잭션 처리가 되며 더 높은 수수료를 지불해야 한다. 

<h2>Customizing</h2></br>
<img width="480" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-06-01_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_9 22 42" src="https://github.com/seungmiKim1/road-to-bangkok/assets/89903766/85986125-6a54-4ffd-97ae-dcecaf6073f4">
