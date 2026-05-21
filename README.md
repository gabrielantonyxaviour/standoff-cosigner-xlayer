# Standoff Co-Signer

A guarded transaction gateway for autonomous agents on X Layer. Two independent co-signer agents must approve the exact same canonical digest before funds move.

## Demo Shape

- Malicious path: one co-signer is prompt-injected into approving a recipient swap; the sentinel co-signer blocks; gateway execution is denied.
- Normal path: both co-signers approve; the Solidity gateway verifies both EIP-712 signatures and executes on the local chain.
- Receipt path: the decision and execution receipts are anchored by hash in `ReceiptRegistry`.

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
