# UI TEMPLATE PLAN

## Chosen Inspiration

- Primary template direction: `enterprise-security` / Shift5-style cybersecurity template from `templates/INDEX.md`.
- Motion/detail reference: `cybersecurity-hero` prompt under `templates/.motionsites-prompts`.

## Visual System

- Deep black operational background with restrained graphite surfaces.
- Security-state palette: blocked red, approval green, digest cyan, witness amber.
- Dense, inspectable panels rather than generic marketing cards.
- Animated but controlled transaction pipeline: intent -> two co-signers -> gateway -> receipt.

## First-Screen Judge Moment

The first viewport must show the standoff:

1. A malicious transaction intent enters the gateway.
2. Co-signer A approves after prompt injection.
3. Co-signer B blocks the same digest.
4. Gateway status reads `EXECUTION DENIED`.
5. Normal intent is visible as the contrasting approved path.

The judge should understand the product before scrolling.

## Design Pattern To Copy

From the cybersecurity hero template:

- Centered dark security surface with high-contrast focal pipeline.
- Neumorphic/polished circular nodes translated into co-signer/gateway/status nodes.
- Subtle grid/scanline texture to make the surface feel technical without becoming a generic blue-purple AI gradient.

## Rules

- No plain CRUD dashboard.
- No fake metrics hero.
- No one-note purple/blue gradient.
- Every status chip must map to real proof data from `demo-proof.json`.
- Mobile view keeps the standoff story intact, not hidden behind desktop-only panels.
