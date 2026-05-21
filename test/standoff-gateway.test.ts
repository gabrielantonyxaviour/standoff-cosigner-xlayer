import { expect } from "chai";
import { ethers } from "hardhat";

const APPROVAL_TYPES = {
  Approval: [
    { name: "intentHash", type: "bytes32" },
    { name: "verdict", type: "uint8" },
    { name: "evidenceHash", type: "bytes32" },
    { name: "deadline", type: "uint256" },
  ],
};

describe("StandoffGateway", () => {
  async function fixture() {
    const [owner, signerA, signerB, outsider] = await ethers.getSigners();
    const Recipient = await ethers.getContractFactory("TestRecipient");
    const recipient = await Recipient.deploy();
    await recipient.waitForDeployment();

    const Gateway = await ethers.getContractFactory("StandoffGateway");
    const gateway = await Gateway.deploy([await signerA.getAddress(), await signerB.getAddress()], 2);
    await gateway.waitForDeployment();

    const network = await ethers.provider.getNetwork();
    const domain = {
      name: "StandoffGateway",
      version: "1",
      chainId: network.chainId,
      verifyingContract: await gateway.getAddress(),
    };

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
    const intent = {
      target: await recipient.getAddress(),
      value: ethers.parseEther("0.01"),
      data: "0x",
      nonce: 1n,
      deadline,
      policyHash: ethers.id("policy:v1:max-0.05-eth-allowlisted-recipient"),
      metadataHash: ethers.id("normal-payment"),
    };

    async function approval(signer: typeof signerA, verdict = 1, evidence = "clean") {
      const intentHash = await gateway.hashIntent(intent);
      const payload = {
        intentHash,
        verdict,
        evidenceHash: ethers.id(evidence),
        deadline,
      };
      return {
        ...payload,
        signature: await signer.signTypedData(domain, APPROVAL_TYPES, payload),
      };
    }

    return { gateway, recipient, signerA, signerB, outsider, intent, approval };
  }

  it("executes only after both co-signers approve the same digest", async () => {
    const { gateway, recipient, signerA, signerB, intent, approval } = await fixture();
    const before = await ethers.provider.getBalance(await recipient.getAddress());

    await expect(gateway.execute(intent, [await approval(signerA), await approval(signerB)], { value: intent.value }))
      .to.emit(gateway, "IntentExecuted")
      .withArgs(await gateway.hashIntent(intent), await recipient.getAddress(), intent.value, "0x");

    const after = await ethers.provider.getBalance(await recipient.getAddress());
    expect(after - before).to.equal(intent.value);
  });

  it("blocks when a co-signer rejects the digest", async () => {
    const { gateway, signerA, signerB, intent, approval } = await fixture();

    await expect(
      gateway.execute(intent, [await approval(signerA), await approval(signerB, 0, "recipient-drift")], {
        value: intent.value,
      }),
    ).to.be.revertedWithCustomError(gateway, "RejectedByCoSigner");
  });

  it("rejects approvals from unknown signers", async () => {
    const { gateway, signerA, outsider, intent, approval } = await fixture();

    await expect(
      gateway.execute(intent, [await approval(signerA), await approval(outsider)], { value: intent.value }),
    ).to.be.revertedWithCustomError(gateway, "UnknownCoSigner");
  });

  it("rejects replay of an executed digest", async () => {
    const { gateway, signerA, signerB, intent, approval } = await fixture();
    const approvals = [await approval(signerA), await approval(signerB)];

    await gateway.execute(intent, approvals, { value: intent.value });

    await expect(gateway.execute(intent, approvals, { value: intent.value })).to.be.revertedWithCustomError(
      gateway,
      "IntentAlreadyExecuted",
    );
  });
});
