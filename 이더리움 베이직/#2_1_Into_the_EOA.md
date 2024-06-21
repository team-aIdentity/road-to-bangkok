# Into the EOA!

1. 이더리움 계정 챕터에서 살펴봤듯이, 이더리움 계정은 ‘이더리움 잔액이 있는 엔티티’입니다. 

이런 이더리움 잔액이 있는 엔티티인 이더리움 계정에 대해 본 미션에서는 실습을 통해 EOA에 대해 더 자세히 알아보고자 합니다.

들어가기 앞서 EOA는 개인이 관리하는 이더리움 계정을 의미하며, private key를 통해 이더리움 주소를 생성하는데 사용됩니다. 이더리움 주소를 만드는 과정을 요약해보면 다음과 같습니다. 

1.private key 생성 

2.private key를 사용하여 public key 생성 BY ECDSA(타원 곡선 디지털 서명 알고리즘) 

서명 알고리즘을 출력하기 전에 메시지 해시 필요 

3.생성된 public key를 통한 Keccack-256 해시함수에 입력하여 32 byte의 해시값 출력 

4.32byte 중에서 마지막 20byte가 이더리움 주소로 사용 

private key 생성, 랜덤 난수 뽑아보기 

메시지 해싱 → 3단계에서 필요 

[https://docs.web3js.org/api/web3-utils/function/utf8ToBytes/](https://docs.web3js.org/api/web3-utils/function/utf8ToBytes/)

[https://docs.web3js.org/api/web3-utils/function/utf8ToBytes/](https://docs.web3js.org/api/web3-utils/function/utf8ToBytes/)[https://www.quicknode.com/guides/ethereum-development/smart-contracts/how-to-use-keccak256-with-solidity](https://www.quicknode.com/guides/ethereum-development/smart-contracts/how-to-use-keccak256-with-solidity)

메시지 서명하기 → 트랜잭션 처리과정 

퍼블릭키 리커버리 → 트랜잭션 처리과정 

주소 만들기 → 4단계 

npm install elliptic keccak 

```jsx
const elliptic = require('elliptic');
const keccak256 = require('keccak');

// secp256k1 타원 곡선 알고리즘 사용
const ec = new elliptic.ec('secp256k1');

// 256비트 크기의 무작위 개인 키 생성
const privateKey = ec.genKeyPair().getPrivate('hex');
console.log(`Private Key: ${privateKey}`);

// 개인 키로부터 공개 키 생성 (압축되지 않은 형태로 생성)
const keyPair = ec.keyFromPrivate(privateKey);
const publicKey = keyPair.getPublic().encode('hex').substring(2); // '04' 접두사를 제거
console.log(`Public Key: ${publicKey}`);

// 공개 키를 Keccak-256 해시
const address = keccak256('keccak256').update(Buffer.from(publicKey, 'hex')).digest('hex').slice(-40);
console.log(`Ethereum Address: 0x${address}`);

```
