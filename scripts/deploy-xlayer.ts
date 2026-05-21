import { ethers, network } from "hardhat";

async function main() {
  const [deployer, signerA, signerB] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer available. Set DEPLOYER_PRIVATE_KEY before deploying to X Layer.");
  }

  const signerAAddress = signerA ? await signerA.getAddress() : await deployer.getAddress();
  const signerBAddress = signerB ? await signerB.getAddress() : await deployer.getAddress();

  const Gateway = await ethers.getContractFactory("StandoffGateway");
  const gateway = await Gateway.deploy([signerAAddress, signerBAddress], 2);
  await gateway.waitForDeployment();

  const Registry = await ethers.getContractFactory("ReceiptRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  console.log(
    JSON.stringify(
      {
        network: network.name,
        gateway: await gateway.getAddress(),
        receiptRegistry: await registry.getAddress(),
        deployer: await deployer.getAddress(),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
