# 이더리움 가상머신(EVM)

## EVM 이란?

이더리움 가상 머신(Ethereum Virtual Machine)은 모든 이더리움 노드에서 일관되고 안전하게 코드를 실행할 수 있게 하는 탈중앙화된 가상 환경을 말합니다. 어떤 OS에서든지 독립적인 환경을 만들어 이더리움 플랫폼 위에 프로그램을 실행시킬 수 있는 환경을 의미한다고 할 수 있습니다. 노드는 EVM을 실행하여 스마트 계약을 실행하고 트랜잭션을 처리하며, 계정 잔고를 업데이트 합니다.

모든 EVM 계산에는 가스가 필요하며, 가스를 통해 연산에 필요한 비용을 측정하여 효율적인 자원 할당과 네트워크 남용을 방지합니다.

## EVM 의 구성요소

EVM은 크게 스택(stack), 메모리(memory), 저장소(storage)로 구성됩니다.

- 스택

EVM은 스택 기반 의 아키텍처를 가지고 있습니다. 스택은 한쪽 끝에서만 자료를 넣고 뺄 수 있는 후 입 선출 자료구조를 말합니다. 컴퓨터가 코드를 실행하는 다양한 방법 중 하나라고 볼 수 있습니다. 이 곳에서 컴파일된 스마트 계약 코드가 실행됩니다.

- 메모리

우리가 사용하는 컴퓨터 메모리와 유사한 개념을 가지고 있습니다. 프로그램의 실행을 위해 필요한 임시 공간 입니다. 휘발성이기 때문에 프로그램이 종료되면 메모리 내 데이터는 사라집니다.

- 스토리지

저장소(storage)는 메모리와 다르게 비휘발성으로, 블록체인에 기록할 데이터들을 저장하는 공간을 의미합니다.

메모리 공간은 스마트 계약 실행에 활용하고 원장에 기록할 영구적인 데이터들은 저장소에 기록합니다.

## EVM **INSTRUCTIONS**

EVM은 1024개의 항목을 쌓을 수 있는 스택 머신처럼 실행됩니다. 각 항목은 256비트(32바이트)워드로 구성되어 있습니다.

트랜잭션이 실행되는 동안 EVM은 임시 메모리를 유지합니다. 새로운 트랜잭션이 실행되기 시작하면 임시 메모리는 재설정 됩니다.

하지만 스마트 계약은 블록체인에서 고유한 상태를 유지합니다. 트랜잭션이 실행되는 동안 이 상태를 EVM Storage 라고 합니다. 즉, 스토리지는 스마트 계약의 장기 메모리이고, 메모리는 EMV내의 단기 메모리 입니다.

EVM에서는 다양한 작업을 수행할 수 있는 명령어의 집합인 opcode를 사용합니다. opcode는 EVM에서 실행할 수 있는 개별 명령어 또는 연산코드를 말합니다.  대표적으로 push, pop, jump, call 등이 있고 잔액 조회, 블록 해시값 조회같은 블록체인 전용 스택 연산도 존재 합니다.

솔리디티 라는 언어로 작성한 스마트 계약 코드를 컴파일하면 이진 형식의 바이트 코드 형태가 되는데 EVM은 이를 opcode단위로 해석하여 실행하게 됩니다.

![출처 : [https://ethereum.org/ko/developers/docs/evm/](https://ethereum.org/ko/developers/docs/evm/)](%E1%84%8B%E1%85%B5%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%AE%E1%86%B7%20%E1%84%80%E1%85%A1%E1%84%89%E1%85%A1%E1%86%BC%E1%84%86%E1%85%A5%E1%84%89%E1%85%B5%E1%86%AB(EVM)%20097892b7d0064473927abad65dbd7e2e/Untitled.png)

출처 : [https://ethereum.org/ko/developers/docs/evm/](https://ethereum.org/ko/developers/docs/evm/)

## 상태 머신

비트코인과 같은 블록체인은 탈중앙화된 암호화폐의 존재를 가능하게 하는 ‘분산원장’으로 설명되기도 합니다. 악의적인 원장 수정을 막고 정상거래를 처리하는 규칙이 정해져 있어 블록체인 기반의 암호화폐는 일반통화처럼 작동할 수 있습니다. 예를 들어, 비트코인 주소에 있는 비트코인보다 더 많은 비트코인을 사용할 수 없습니다. 이러한 규칙은 블록체인에서 발생하는 모든 거래를 뒷받침합니다.

이더리움에도 이와 비슷한 자체 암호화폐(ETH)가 있지만, 훨씬 더 강력한 기능인 스마트 계약이 존재합니다. 그렇기 때문에 이더리움은 단순한 분산 원장이 아니라 다양한 상태로 전환할 수 있는 분산 상태 머신 이라고 정의합니다.

상태머신이란 어떤 의미일까요?

쉽게 말하면 입력값에 기반하여 다른 상태로 전환하는 기계를 말합니다. 예로는 동전이나 카드를 터치해야 들어갈 수 있는 지하철 개찰구를 들 수 있습니다.

이더리움은 개찰구보다 상태가 복잡하지만 일반적인 원리는 동일합니다.

컴퓨터 공학에서 상태(state)는 특정 시점에서 시스템이 가지고 있는 정보의 집합을 말하고 상태 전이(transition)는 이 상태가 다른 상태로 변화하는 과정을 의미합니다.

이더리움의 상태는 네트워크에 존재하는 모든 계정의 상태의 집합입니다. 이를 world state라고 부릅니다.

여기엔 모든 계정의 잔액, 스토리지 상태, 스마트 계약 코드 데이터를 포함합니다.

트랜잭션이 처리될 때마다 각각의 상태가 전이되고, 블록체인에 영구 기록 됩니다.

 전체 네트워크는 모든 상태를 대규모 데이터 구조에 저장합니다. 상태를 변경하는 구체적인 규칙은 EVM에 의해 정의됩니다.

![출처 : [https://ethereum.org/ko/developers/docs/evm/](https://ethereum.org/ko/developers/docs/evm/)](%E1%84%8B%E1%85%B5%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%AE%E1%86%B7%20%E1%84%80%E1%85%A1%E1%84%89%E1%85%A1%E1%86%BC%E1%84%86%E1%85%A5%E1%84%89%E1%85%B5%E1%86%AB(EVM)%20097892b7d0064473927abad65dbd7e2e/Untitled%201.png)

출처 : [https://ethereum.org/ko/developers/docs/evm/](https://ethereum.org/ko/developers/docs/evm/)

EVM은 수학 함수처럼 작동합니다: 입력이 주어지면 새로운 상태로 전환 합니다. 출력은 결정론적이기 때문에 동일한 입력에 대해 항상 동일한 출력이 발생됩니다.

>Y(S, T)= S'

이전 유효한 상태(S)와 새로운 유효한 트랜잭션 세트(T)가 주어졌을 때, 이더리움 상태 전이 함수 Y(S, T)는 새로운 유효한 출력 상태 S'로 전환됩니다.

## EVM 구현

EVM의 모든 구현은 이더리움 황서(Yellowpaper)에 설명된 사양을 준수해야 합니다.

지난 9년 동안 EVM은 여러 번의 개정을 거쳤으며, 다양한 프로그래밍 언어로 구현된 여러 EVM이 존재합니다.

노드가 네트워크에서 트랜잭션을 실행하고 검증할 수 있도록 모든 이더리움 클라이언트에는 EVM이 구현되어야 합니다.

참고

EVM

[https://ethereum.org/ko/developers/docs/evm/](https://ethereum.org/ko/developers/docs/evm/)

[https://contents.premium.naver.com/digitalasset/digitalassetpro/contents/231031104220069dr](https://contents.premium.naver.com/digitalasset/digitalassetpro/contents/231031104220069dr)

[https://www.techopedia.com/kr/definition/ethereum-virtual-machine-evm](https://www.techopedia.com/kr/definition/ethereum-virtual-machine-evm)

[https://upbitcare.com/academy/education/coin/291](https://upbitcare.com/academy/education/coin/291)

[https://learnweb3.io/degrees/ethereum-developer-degree/sophomore/demystifying-the-ethereum-virtual-machine-evm/](https://learnweb3.io/degrees/ethereum-developer-degree/sophomore/demystifying-the-ethereum-virtual-machine-evm/)

메모리

[https://favoriteblockchain.medium.com/evm-memory-9f393ca0d635](https://favoriteblockchain.medium.com/evm-memory-9f393ca0d635)

옵코드

[https://en.wikipedia.org/wiki/Opcode](https://en.wikipedia.org/wiki/Opcode)

[https://ethereum.org/en/developers/docs/evm/opcodes/](https://ethereum.org/en/developers/docs/evm/opcodes/)
