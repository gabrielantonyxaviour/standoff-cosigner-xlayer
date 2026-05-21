# PLUGIN PLAN

## Override Resolution

The execution contract's MeDo reconnaissance requirement is superseded by Gabriel's override for this run: this is an OKX/X Layer Build X workflow, not Build with MeDo. I did not generate a MeDo app or treat MeDo managed/custom plugins as the product surface.

## Live / Official Plugin And Skill Recon

- OKX Build X public page: event ended; current season listed as April 1-April 15, 2026 UTC. The page explicitly allows two arenas: X Layer Arena for full-stack agentic apps and Skills Arena for reusable skills.
- OKX plugin store command from Build X page references `okx-buildx-hackathon-agent-track`.
- Official `okx/onchainos-skills` repository exposes relevant skills:
  - `okx-agentic-wallet`: wallet lifecycle, balances, sends, contract calls, signing.
  - `okx-onchain-gateway`: gas, simulation, broadcast, transaction status.
  - `okx-security`: token, DApp, transaction, and signature safety checks.
  - `okx-agent-payments-protocol`: payment dispatcher across x402, MPP, and a2a-pay.
  - `okx-dex-swap`: DEX aggregation path if a swap demo becomes available.
- Live discovery via `npx --yes skills find "OKX OnchainOS X Layer x402 agent co-signer gateway"` found:
  - `okx/onchainos-skills@okx-agent-payments-protocol` - use.
  - `affaan-m/everything-claude-code@agent-payment-x402` - reference only; weaker sponsor fit.

## Local Skill Mapping

- `ui-ux-launch-workflow`: used to route the demo UI build and proof requirements.
- `agent-browser`: used for Gmail OTP and submission portal inspection.
- `solidity-security`: relevant for final contract review if time allows.
- Installed workspace-local official OKX skills under `.agents/skills/okx-*`.

## Concrete Integration Path

The product will ship a reusable local skill/package named `standoff-cosigner` that other agents can invoke before a high-risk transaction:

1. Accept a transaction intent JSON.
2. Canonicalize and hash the digest.
3. Run two independent policy co-signers.
4. Optionally call OKX Security / Gateway preflight when credentials and target transaction data are available.
5. Emit signed approvals and a receipt.
6. Execute through the gateway only if both signatures approve the exact same digest.

This is not decorative: the gateway cannot execute without the two signatures.

## Blockers

- OnchainOS CLI is installed and logged in, but Gabriel's new Agentic Wallet has `totalValueUsd: "0.00"` on X Layer.
- `onchainos wallet contract-call` can call an existing contract, but it does not provide a contract deployment path. Live deployment needs a funded deployer private key or another approved deployment route.
