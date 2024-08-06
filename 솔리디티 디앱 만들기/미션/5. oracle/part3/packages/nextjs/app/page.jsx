"use client";

import React, { useState } from "react";
import { ALCHEMY_KEY } from "../constants";
// import { tryToDisplay } from "../../components/scaffold-eth/Input/utils";
import {
  useScaffoldReadContract,
  useScaffoldWriteContract,
  useTargetNetwork,
  useWatchBalance,
} from "../hooks/scaffold-eth";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import { formatEther } from "ethers";
import { useAccount } from "wagmi";

export default function ExampleUI() {
  // you can use hooks locally in your component of choice

  //---------------------------------------------------

  const address = useAccount();

  const [pendingVolumeData, setPendingVolumeData] = useState(false);

  const { targetNetwork } = useTargetNetwork();

  const [pendingDiceRoll, setPendingDiceRoll] = useState(false);

  const providers = [
    "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
    `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    "https://rpc.scaffoldeth.io:48544",
  ];

  // const mainnetProvider = useStaticJsonRPC(providers);
  // const mainnetProvider = new ethers.providers.JsonRpcProvider(providers);
  // const localProvider = useStaticJsonRPC(targetNetwork.rpcUrls.default.http[0]);
  // const localProvider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrls.default.http[0]);

  // const { data: hasRequested } = useScaffoldReadContract({
  //   contractName: "MultiDiceRolls",
  //   functionName: "getHasRequested",
  //   args: [address],
  // });

  // const volumeData = useContractReader(readContracts, "APIConsumer", "volume");
  const { data: volumeData } = useScaffoldReadContract({
    contractName: "APIConsumer",
    functionName: "getVolume",
  });

  // const currentReqId = useContractReader(readContracts, "APIConsumer", "requestId");

  // const { writeContract } = useWriteContract("MultiDiceRolls");
  const { writeContractAsync: writeContract } = useScaffoldWriteContract("APIConsumer");

  let volumeDataDisplay;

  if (volumeData == undefined) {
    volumeDataDisplay = (
      <>
        Loading ... <Spin></Spin>
      </>
    );
  } else if (volumeData.toString() === "0") {
    volumeDataDisplay = <span style={{ color: "grey" }}>"None requested yet"</span>;
  } else {
    volumeDataDisplay = <>{volumeData.toString() || ""}</>;
  }

  return (
    <div>
      <h2 style={{ width: 400, margin: "4rem auto 0" }}>Chainlink API examples</h2>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "1rem auto" }}>
        <h2 style={{ backgroundColor: "#ffeeff" }}>APIConsumer</h2>
        <h4>
          24H ETH/USD Volume: <br />
          {volumeDataDisplay}
        </h4>
        <div style={{ margin: 8 }}>
          <Button
            loading={pendingVolumeData}
            onClick={async () => {
              setPendingVolumeData(true);
              // look how you call requestVolumeData on your contract:
              // notice how you pass a call back for tx updates too

              try {
                await writeContract({
                  functionName: "requestVolumeData",
                });

                setPendingVolumeData(false);
              } catch (e) {
                console.log("Error Write Contract >>>>> ", e);
              }

              // const result = tx(writeContracts.APIConsumer.requestVolumeData(), update => {
              //   console.log("📡 Transaction Update:", update);
              //   if (update && update.data === "Reverted") {
              //     setPendingVolumeData(false);
              //   }
              //   if (update && (update.status === "confirmed" || update.status === 1)) {
              //     setPendingVolumeData(false);
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
            Request Volume Data!
          </Button>
        </div>
        <Divider />
      </div>
    </div>
  );
}
