# BACKEND PLAN

## Override Resolution

No MeDo backend services will be enabled for this run. Gabriel explicitly scoped this as an OKX/X Layer Build X style workflow. Backend planning therefore maps to contracts, local services, OnchainOS integrations, and proof persistence.

## Data Storage

Primary storage:

- `ReceiptRegistry.sol`: onchain receipt anchor with receipt hash, actor, digest, and URI.
- `outputs/demo-proof.json`: reproducible local proof bundle for AI judges.
- `public/demo-proof.json`: copied proof bundle for the UI.

Logical entities:

- `TransactionIntent`: target, value, calldata, chainId, nonce, deadline, metadata.
- `CoSignerApproval`: signer, signer role, verdict, reason codes, digest, signature.
- `Receipt`: hash, parent hash, event type, digest, approval refs, execution tx hash.
- `Incident`: malicious prompt attempt, policy disagreement, blocked reason.

## User Management

No app login is needed for the judge demo. Identity is proven through:

- EIP-712 co-signer signatures.
- Gateway owner/co-signer addresses.
- Gabriel's Agentic Wallet address for submission identity: `0x4150bc36f6c8f7fb5dd129cf3b88dc1babe06a61`.

## Backend Functions

- Canonical digest builder.
- Vulnerable co-signer policy for the adversarial demo.
- Sentinel co-signer policy for independent verification.
- Gateway execution and receipt anchoring.
- Optional OnchainOS adapters for Security scan, Gateway simulation/broadcast, and Agent Payments Protocol payment requests.

## Secrets

No secrets are committed.

Runtime placeholders:

- `XLAYER_RPC_URL`
- `DEPLOYER_PRIVATE_KEY`
- `OKX_API_KEY`
- `OKX_SECRET_KEY`
- `OKX_PASSPHRASE`
- `VITE_PUBLIC_EXPLORER_BASE_URL`

## Live Chain Status

- `onchainos` v3.3.6 installed from the official OKX release and checksum-verified on 2026-05-21.
- Agentic Wallet login succeeded for Gabriel; account was new.
- X Layer balance is empty. Live deployment is blocked until a deployer key/funds path is approved.
