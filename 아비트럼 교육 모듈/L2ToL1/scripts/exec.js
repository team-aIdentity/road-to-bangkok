const { providers, Wallet } = require('ethers')
const {
  addDefaultLocalNetwork,
  L2TransactionReceipt,
  L2ToL1MessageStatus,
} = require('@arbitrum/sdk')
const { arbLog, requireEnvVariables } = require('arb-shared-dependencies')
require('dotenv').config()
requireEnvVariables(['DEVNET_PRIVKEY', 'L2RPC', 'L1RPC'])

/**
 * 설정: 공급자에 연결된 L1 지갑 인스턴스화
 */

const walletPrivateKey = process.env.DEVNET_PRIVKEY

const l1Provider = new providers.JsonRpcProvider(process.env.L1RPC)
const l2Provider = new providers.JsonRpcProvider(process.env.L2RPC)
const l1Wallet = new Wallet(walletPrivateKey, l1Provider)

module.exports = async txnHash => {
  await arbLog('Outbox Execution')

  /**
   * SDK에 기본 로컬 네트워크 구성 추가
   * 이 스크립트를 로컬 노드에서 실행하려면
   */
  addDefaultLocalNetwork()

  /**
   * txn 해시로 시작합니다. 우리는 이것이 L2에서 L2-L1 메시지(예: ArbSys.sendTxToL1)를 트리거한 트랜잭션이라고 가정합니다.
   */
  if (!txnHash)
    throw new Error(
        'L2에서 L1 메시지로 보내는 L2 트랜잭션의 트랜잭션 해시 제공'
    )
  if (!txnHash.startsWith('0x') || txnHash.trim().length != 66)
    throw new Error(`음, ${txnHash} txn 해시처럼 보이지 않습니다 ...`)

  /**
   * 먼저, 제공된 txn 해시에서 Arbitrum txn을 찾아보겠습니다.
   */
  const receipt = await l2Provider.getTransactionReceipt(txnHash)
  const l2Receipt = new L2TransactionReceipt(receipt)

  /**
   * 원칙적으로 단일 트랜잭션으로 인해 나가는 메시지가 얼마든지 트리거될 수 있습니다. 일반적인 경우는 하나만 있을 것입니다.
   * 이 스크립트를 위해 우리는 하나만 있다고 가정합니다. 첫 번째 스크립트만 졸업하면 됩니다.
   */
  const messages = await l2Receipt.getL2ToL1Messages(l1Wallet)
  const l2ToL1Msg = messages[0]

  /**
   * 이미 실행되었는지 확인
   */
  if ((await l2ToL1Msg.status(l2Provider)) == L2ToL1MessageStatus.EXECUTED) {
    console.log(`메시지가 이미 실행되었습니다! 여기서는 더 이상 할 일이 없습니다`)
    process.exit(1)
  }

  /**
   * 메시지를 실행하기 전에 메시지가 포함된 l2 블록이 확인되었는지 확인해야 합니다! (분쟁 기간이 지나야만 확인할 수 있습니다. 결국 Arbitrum은 낙관적 롤업입니다.)
   * waitUntilReadyToExecute()는 보낼 편지함 항목이 존재할 때까지 기다립니다.
   */
  const timeToWaitMs = 1000 * 60
  console.log(
      "보낼편지함 항목이 생성되기를 기다리는 중입니다. 이는 L2 블록이 생성된 지 약 1주일 후 L1에서 확인된 경우에만 발생합니다."
  )
  await l2ToL1Msg.waitUntilReadyToExecute(l2Provider, timeToWaitMs)
  console.log('보낼 편지함 항목이 존재합니다! 지금 실행하려고 합니다.')

  /**
   * 이제 확인되었으나 실행되지 않았으므로 보낼 편지함 항목에서 메시지를 실행할 수 있습니다.
   */
  const res = await l2ToL1Msg.execute(l2Provider)
  const rec = await res.wait()
  console.log('완료! 귀하의 거래가 실행되었습니다', rec)
}