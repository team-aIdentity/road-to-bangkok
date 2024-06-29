/**
 *
 * This script demonstrates how to send a message from L1 to L2 using the Arbitrum SDK
 *
 * The script deploys two contracts to L1 and L2, and updates each contract with the the counterparties address.
 * It then sends a message from L1 to L2, and logs the L2 greeting.
 * It uses the Arbitrum SDK method, L1ToL2MessageGasEstimator to estimate the gas params for the message.
 */

// Make sure your hardhat is on 👷
const hre = require("hardhat");

// Ethers imports
const ethers = require("ethers");
const { providers, Wallet } = ethers;
const { BigNumber } = require("@ethersproject/bignumber");
require("dotenv").config();
// Arbitrum SDK imports
const {
  L1ToL2MessageGasEstimator,
  L1TransactionReceipt,
  L1ToL2MessageStatus,
  EthBridger,
  getL2Network,
} = require("@arbitrum/sdk");
const { getBaseFee } = require("@arbitrum/sdk/dist/lib/utils/lib");
const { arbLog, requireEnvVariables } = require("./arb-shared-dependencies");

// You'll need a wallet and RPC URLs, otherwise thou shalt not pass 🧙
requireEnvVariables(["DEVNET_PRIVKEY", "L2RPC", "L1RPC"]);

// Set up L1/L2 wallets from the same key. Make sure to populate .env and have it funded on both Ethereum/Arbitrum Sepolia.
const walletPrivateKey = process.env.DEVNET_PRIVKEY;

const l1Provider = new providers.JsonRpcProvider(process.env.L1RPC);
const l2Provider = new providers.JsonRpcProvider(process.env.L2RPC);

const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

const main = async () => {
  // based A
  await arbLog("Cross-chain Greeter");

  // 1. INITIAL SETUP - DEPLOYING REQUIRED CONTRACTS WITH CORRECT STATE
  // Getting the inbox address using the Arbitrum SDK
  const l2Network = await getL2Network(l2Provider);
  const ethBridger = new EthBridger(l2Network);
  const inboxAddress = ethBridger.l2Network.ethBridge.inbox;

  // DEPLOYING L1/L2 CONTRACTS
  // L1 contract
  const L1Greeter = await (
    await hre.ethers.getContractFactory("GreeterL1")
  ).connect(l1Wallet);

  console.log("Deploying L1 Greeter 👋");
  const l1Greeter = await L1Greeter.deploy(
    "Hello world in L1",
    ethers.constants.AddressZero, // temp l2 addr
    inboxAddress
  );
  await l1Greeter.deployed();
  console.log(`deployed to ${l1Greeter.address}`);

  // L2 contract
  const L2Greeter = await (
    await hre.ethers.getContractFactory("GreeterL2")
  ).connect(l2Wallet);

  console.log("Deploying L2 Greeter 👋👋");
  const l2Greeter = await L2Greeter.deploy(
    "Hello world in L2",
    ethers.constants.AddressZero // temp l1 addr
  );
  await l2Greeter.deployed();
  console.log(`deployed to ${l2Greeter.address}`);

  // Update the counterparties address in both contracts state
  const updateL1Tx = await l1Greeter.updateL2Target(l2Greeter.address);
  await updateL1Tx.wait();

  const updateL2Tx = await l2Greeter.updateL1Target(l1Greeter.address);
  await updateL2Tx.wait();
  console.log("Counterpart contract addresses set in both greeters 👍");

  // Logging the current greeting on L2
  const currentL2Greeting = await l2Greeter.greet();
  console.log(`Current L2 greeting: "${currentL2Greeting}"`);

  // 2. 💌 🔑 L1 to L2 message 🔑 💌
  // ESTIMATING GAS NEEDED TO DEPOSIT ON L1 TO COVER L2 GAS
  console.log("Updating greeting from L1 to L2:");
  const newGreeting = "Greeting from far, far away";

  // To esimate gas correctly, we need to know how many bytes of calldata we need
  const l1ToL2MessageGasEstimate = new L1ToL2MessageGasEstimator(l2Provider);
  const ABI = ["function setGreeting(string _greeting)"];
  const iface = new ethers.utils.Interface(ABI);
  const calldata = iface.encodeFunctionData("setGreeting", [newGreeting]);

  // Calling estimateAll to get the gas params for our messagec
  const L1ToL2MessageGasParams = await l1ToL2MessageGasEstimate.estimateAll(
    {
      from: await l1Greeter.address,
      to: await l2Greeter.address,
      l2CallValue: 0,
      excessFeeRefundAddress: await l2Wallet.address,
      callValueRefundAddress: await l2Wallet.address,
      data: calldata,
    },
    await getBaseFee(l1Provider),
    l1Provider
  );

  console.log(
    `Current retryable base submission price is: ${L1ToL2MessageGasParams.maxSubmissionCost.toString()}`
  );

  // Get L2 gas price
  const gasPriceBid = await l2Provider.getGasPrice();
  console.log(`L2 gas price: ${gasPriceBid.toString()}`);

  // SENDING MESSAGE VIA GreeterL1.sol
  console.log(
    `Sending greeting to L2 with ${L1ToL2MessageGasParams.deposit.toString()} callValue for L2 fees:`
  );
  const setGreetingTx = await l1Greeter.setGreetingInL2(
    newGreeting, // string memory _greeting,
    L1ToL2MessageGasParams.maxSubmissionCost, // Max cost when submitting transaction
    L1ToL2MessageGasParams.gasLimit, // L2 Gas Limit
    gasPriceBid,
    {
      value: L1ToL2MessageGasParams.deposit, // The total amount to deposit on L1 to cover L2 gas & call value
    }
  );
  const setGreetingRec = await setGreetingTx.wait();

  console.log(
    `Greeting txn confirmed on L1! 🙌 ${setGreetingRec.transactionHash}`
  );

  // 3. CHECK IF MESSAGE WAS REDEEMED ON L2
  const l1TxReceipt = new L1TransactionReceipt(setGreetingRec);
  const messages = await l1TxReceipt.getL1ToL2Messages(l2Wallet);
  const message = messages[0];
  console.log(
    "Waiting for the L2 execution of the transaction. This may take up to 10-15 minutes ⏰"
  );

  const messageResult = await message.waitForStatus();
  const status = messageResult.status;
  if (status === L1ToL2MessageStatus.REDEEMED) {
    console.log(
      `L2 retryable ticket is executed 🥳 ${messageResult.l2TxReceipt.transactionHash}`
    );
  } else {
    console.log(
      `L2 retryable ticket is failed with status ${L1ToL2MessageStatus[status]}`
    );
  }

  // Calling greet() on L2 to see the updated greeting.
  const newGreetingL2 = await l2Greeter.greet();
  console.log(`Updated L2 greeting: "${newGreetingL2}" 🥳`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
