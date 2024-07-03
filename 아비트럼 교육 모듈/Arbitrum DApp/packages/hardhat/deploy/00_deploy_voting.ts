import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const candidates = ["Alice", "Bob", "Charlie"];

  await deploy("Voting", {
    from: deployer,
    args: [candidates],
    log: true,
  });
};

export default func;
func.tags = ["Voting"];
