# EXECUTION PACKET

## Project

Standoff Co-Signer: a guarded transaction gateway where two independent agent co-signers must approve the exact same canonical digest before funds move.

## One-Liner

Autonomous agents can spend on X Layer only after two independent co-signers agree on the same transaction digest.

## README Skeleton

### What It Does

Standoff Co-Signer converts a proposed transaction into a canonical digest, runs two independent policy agents, verifies both EIP-712 approvals, and executes only on quorum. A prompt-injection demo shows one co-signer approving a malicious transaction while the second blocks it.

### Why X Layer / OKX

The project is built for the Build X agent-commerce thesis: autonomous agents need wallet execution, risk checks, payment proofs, and auditability. It aligns with Agentic Wallet, OnchainOS Gateway, OKX Security, and the OKX Agent Payments Protocol.

### Run Locally

```bash
pnpm install
pnpm test
pnpm demo
pnpm dev
```

### Deploy To X Layer

```bash
cp .env.example .env
# fill XLAYER_RPC_URL and DEPLOYER_PRIVATE_KEY
pnpm deploy:xlayer
```

## Demo Script

1. Open the app and show the canonical digest panel.
2. Run malicious intent: recipient is swapped after a prompt-injection instruction.
3. Co-signer A approves; co-signer B blocks; gateway refuses execution.
4. Run normal intent: both co-signers approve; gateway executes locally and anchors a receipt.
5. Show proof JSON, contract events, and X Layer deployment status.

## Video Script

"Most agent wallets trust one model to decide when money moves. Standoff Co-Signer assumes one model can be compromised. Every transaction becomes a canonical digest. Two independent co-signers evaluate it. If either one sees prompt injection, recipient drift, amount drift, or policy mismatch, the gateway cannot execute. Here the first model is fooled. The second blocks the exact same digest. On the normal path, both sign, the gateway verifies signatures onchain, executes, and anchors a receipt. This is a small safety primitive for autonomous commerce on X Layer."

## Judging Criteria Mapping

- Technical novelty: canonical digest plus two independent signed approvals.
- Protocol-native depth: Solidity gateway, receipt anchors, X Layer deployment path, OnchainOS CLI/tool evidence.
- Creativity: adversarial live standoff, not a generic AI trading bot.
- Practicality: reusable safety layer for agentic wallets and payment skills.
- AI-judge auditability: tests, reproducible demo, proof JSON, contract code, command sequence.

## Links

- Repo: pending creation.
- Demo app: local first, public deploy pending.
- Agentic Wallet address: `0x4150bc36f6c8f7fb5dd129cf3b88dc1babe06a61`.
- Submission portal: public form discovered but disabled on 2026-05-21.

## Final Checklist

- [ ] Contracts compile.
- [ ] Signature verification tests pass.
- [ ] Malicious path blocks.
- [ ] Normal path executes locally.
- [ ] Proof bundle generated.
- [ ] UI builds and renders proof.
- [ ] Public repo exists.
- [ ] Builder report written.
- [ ] No final submit/social/legal action without approval.
