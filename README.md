# X Cup SafeBet Co-Signer

A World Cup trading and prediction safety gateway for autonomous agents on X Layer. Two independent co-signer agents must approve the exact same canonical digest before a match bet, swap, or payout can move funds.

## Demo Shape

- Malicious path: one fan/trading agent is prompt-injected into approving a bad match bet or recipient swap; the sentinel co-signer blocks; gateway execution is denied.
- Normal path: both co-signers approve an Argentina-France hedge; the Solidity gateway verifies both EIP-712 signatures and executes on the local chain.
- Receipt path: the decision and execution receipts are anchored by hash in `ReceiptRegistry`.

## X Cup Fit

- Theme: World Cup match betting / trading safety.
- Tracks: trading, prediction markets, AI Agent, X Layer on-chain execution.
- Market potential: football fan traffic can create fast, emotional trading flows; SafeBet gives those flows a guardrail before money moves.
- Completion proof: Hardhat tests, EIP-712 signatures, deterministic proof JSON, and a public dashboard.

## Run

```bash
pnpm install
pnpm test
pnpm demo
pnpm dev
```

The demo writes:

- `outputs/demo-proof.json`
- `public/demo-proof.json`

## X Layer Deployment

```bash
cp .env.example .env
pnpm deploy:xlayer
```

Required env:

- `XLAYER_RPC_URL`
- `DEPLOYER_PRIVATE_KEY`

Live deployment is not claimed until a contract address, transaction hash, and explorer link are produced.

## OKX / OnchainOS Evidence

- `onchainos` v3.3.6 installed from the official OKX release and checksum-verified.
- Gabriel Agentic Wallet X Layer address: `0x4150bc36f6c8f7fb5dd129cf3b88dc1babe06a61`.
- Current wallet balance at setup: `0.00` USD, so live deployment requires a funded deployer path.

## Submission Status

Public repo: `https://github.com/BonneyMantra/standoff-cosigner-xlayer`
Public demo: `https://bonneymantra.github.io/standoff-cosigner-xlayer/`

X Cup form fields are mapped in `X_CUP_SUBMISSION_PACKET.md`. No final form submit, project X post, wallet connection, or legal attestation has been performed.
