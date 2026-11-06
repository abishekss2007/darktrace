# Stage 6 Audit: Visual Evidence & Screenshot Verification

## 1. Overview & Objectives
Stage 6 catalogs and standardizes the un-mocked visual evidence, user interface views, and on-chain explorer proofs supporting the DarkTrace submission.

## 2. Evidence Classification & Boundaries

1. **Live User Interface Evidence**:
   - Hosted at `https://darktrace-lovat.vercel.app/`.
   - Verified that all demo metrics, historical attack rows, and interactive buttons carry clear `[DEMO]` badges or simulated settlement notices.
   - Pinned real on-chain balance display reading directly from Arc Testnet (`5.00 USDC`).

2. **On-Chain Explorer Evidence**:
   - Base Sepolia Hook: `0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0` on Basescan.
   - Arc Testnet RebateVault: `0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD` on Arc Explorer.
   - Arkiv Rabdi Entity: `0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca` on Rabdi Explorer.

3. **Arc Studio IDE Evidence**:
   - Contract test suite report documented in [`arc-studio/report.md`](../../arc-studio/report.md) with 60 passing tests.

## 3. Deliverables
- Visual catalog documented in [`docs/screenshots/README.md`](../../docs/screenshots/README.md).

