"use client";

import React, { useState } from "react";
import EventsMultiDice from "../components/assets/EventsMultiDice";
import { ALCHEMY_KEY } from "../constants";
import { Button, Divider, Spin } from "antd";
import { ethers } from "ethers";
import { parseEther, parseGwei } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";

export default function ExampleUI() {
  const address = useAccount();
  // Improvement 1: use subgraph

  // Improvement 2:
  // Side quest! (nerdy/advanced) see if you can inject the latest DiceRolls deployment block number into your frontend
  // whenever a new hardhat deployment happens.
  // It can be done in a similar way to how the contract abis are injected.
  // You need to look in the hardhat/deployments/DiceRolls.sol file for the transactionReceipt.

  // ======= MULTI DICE ROLLS INIT ======= //

  const { targetNetwork } = useTargetNetwork();

  const [pendingDiceRoll, setPendingDiceRoll] = useState(false);

  const providers = [
    "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
    `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    "https://rpc.scaffoldeth.io:48544",
  ];

  // const mainnetProvider = useStaticJsonRPC(providers);
  const mainnetProvider = new ethers.providers.JsonRpcProvider(providers);
  // const localProvider = useStaticJsonRPC(targetNetwork.rpcUrls.default.http[0]);
  const localProvider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrls.default.http[0]);

  // const { data: hasRequested } = useScaffoldReadContract({
  //   contractName: "MultiDiceRolls",
  //   functionName: "getHasRequested",
  //   args: [address],
  // });
  const { data: hasRequested } = useScaffoldReadContract("MultiDiceRolls", "getHasRequested", [address]);
  const { data: hasRollResult } = useScaffoldReadContract("MultiDiceRolls", "getHasRollResult", [address]);
  const { data: rollResult } = useScaffoldReadContract("MultiDiceRolls", "getRollSet", [address]);

  // const { writeContract } = useWriteContract("MultiDiceRolls");
  const { writeContractAsync: writeContract } = useScaffoldWriteContract("MultiDiceRolls");
  // const { data: hasRollResult } = useScaffoldReadContract({
  //   contractName: "MultiDiceRolls",
  //   functionName: "getHasRollResult",
  //   args: [address],
  // });

  // const { data: rollResult } = useScaffoldReadContract({
  //   contractName: "MultihDiceRolls",
  //   functionName: "getRollSet",
  //   args: [address],
  // });

  const rollResultDisplay = !hasRequested ? (
    "Not rolled yet"
  ) : !hasRollResult ? (
    <React.Fragment>
      <span style={{ marginRight: "1rem" }}>Waiting for oracle response</span>
      <Spin></Spin>
    </React.Fragment>
  ) : rollResult ? (
    rollResult.toString()
  ) : (
    ""
  );
  // useEffect(() => {
  //   async function getAddress() {
  //     if (userSigner) {
  //       const newAddress = await userSigner.getAddress();
  //       setAddress(newAddress);
  //     }
  //   }
  //   getAddress();
  // }, [userSigner]);

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "1rem auto", marginTop: 64 }}>
        <h2 style={{ backgroundColor: "#eeffff" }}>Multi Dice Rolls</h2>
        <h4>
          Your Roll Result: <br />
          {rollResultDisplay}
        </h4>
        <div style={{ margin: 8 }}>
          <Button
            loading={pendingDiceRoll}
            onClick={async () => {
              setPendingDiceRoll(true);
              try {
                await writeContract({
                  functionName: "requestRandomRoll",
                });

                setPendingDiceRoll(false);
              } catch (e) {
                console.log("Error Write Contract >>>>> ", e);
              }
              // const result = tx(writeContracts.writeContract(), update => {
              //   console.log("📡 Transaction Update:", update);
              //   if (update && update.data === "Reverted") {
              //     setPendingDiceRoll(false);
              //   }
              //   if (update && (update.status === "confirmed" || update.status === 1)) {
              //     setPendingDiceRoll(false);
              //     console.log(" 🍾 Transaction " + update.hash + " finished!");
              //     console.log(
              //       " ⛽️ " +
              //         update.gasUsed +
              //         "/" +
              //         (update.gasLimit || update.gas) +
              //         " @ " +
              //         parseFloat(update.gasPrice) / 1000000000 +
              //         " gwei",
              //     );
              //   }
              // });
              // console.log("awaiting metamask/web3 confirm result...", result);
              // console.log(await result);
            }}
          >
            Do Your Roll!
          </Button>
        </div>
        <Divider />
        <EventsMultiDice />
      </div>
    </div>
  );
}
