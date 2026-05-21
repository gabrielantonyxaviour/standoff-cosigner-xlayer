# BUILD PLAN

## Product

Standoff Co-Signer is a security-oriented X Layer agent app. A proposed payment, contract call, or swap is converted into a canonical transaction digest. Two independent co-signer agents evaluate the same digest and produce signed approvals. The gateway executes only when both signatures match the digest and both verdicts approve.

## Why This Wins

- Clippable demo: prompt injection convinces one co-signer to approve a malicious transaction, while the second blocks it.
- AI-judge-friendly code: digest canonicalization, EIP-712 approvals, onchain signature verification, policy traces, and proof bundle are inspectable.
- Sponsor-native surface: OnchainOS Agentic Wallet, Gateway, Security, and Agent Payments Protocol map directly to the transaction-safety story.

## Stack

- Contracts: Solidity 0.8.24, Hardhat, OpenZeppelin ECDSA/EIP712 helpers where useful.
- Runtime: TypeScript, `viem`, deterministic scripted agent policies.
- UI: Vite React TypeScript with a high-end security operations surface.
- Evidence: `outputs/demo-proof.json`, contract events, local transaction hashes from Hardhat, optional X Layer deployment artifacts.

## Scope

1. `StandoffGateway.sol`: verifies two agent signatures over one canonical intent and executes a native transfer/call only on quorum.
2. `ReceiptRegistry.sol`: anchors decision and execution receipts by hash.
3. TypeScript digest + approval library: canonical JSON, EIP-712 digest, signer wallets, policy verdicts.
4. Demo scripts:
   - malicious prompt path: one vulnerable policy approves, sentinel blocks, no execution.
   - normal payment path: both approve, gateway executes on local chain, receipt is anchored.
5. React UI: first screen shows the standoff timeline, digest, co-signer verdicts, blocked/approved outcomes, and evidence links.
6. README and execution packet: reproducible commands and judging mapping.

## Integration Choices

- Required concrete OKX path: official `okx/onchainos-skills` installed locally; `onchainos` CLI v3.3.6 installed and integrity-checked.
- Agentic Wallet evidence: Gabriel wallet login completed; X Layer address has zero balance on 2026-05-21.
- Live X Layer deployment: blocked until a deployable EOA/private key or funded Agentic Wallet deployment path is available. The repo still includes X Layer network config and deploy scripts.

## Timeboxed Milestones

- M0 Plans and portal reconnaissance: complete by 2026-05-21 06:15 IST.
- M1 Contracts and tests: compile, run local happy-path and blocked-path tests.
- M2 CLI demo: generate reproducible proof JSON and README commands.
- M3 UI: build the operational standoff screen and connect to proof JSON.
- M4 Verification: run tests, build, local browser inspection, and document blockers.
- M5 Repo/report: create public GitHub repo, push code, write builder report.
