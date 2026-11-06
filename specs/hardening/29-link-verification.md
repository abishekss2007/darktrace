# Stage 5 Audit: Link Verification & Evidence Matrix

## 1. Overview & Objectives
The purpose of Stage 5 is to formally compile, verify, and cross-reference all URLs and network endpoints used across the DarkTrace codebase, documentation, and user interfaces. This guarantees that evaluators, judges, and users never encounter dead links, domain typos, or broken explorer queries.

## 2. Key Link Corrections Summary

1. **Arc Explorer Domain Migration**:
   - `explorer.testnet.arc.network` -> `explorer.testnet.arc.io` (EVM Block Explorer).
   - `rpc.testnet.arc.network` -> `rpc.testnet.arc.io` (JSON-RPC Gateway).
   - Corrected across `Footer.tsx`, `chains.ts`, `docker-compose.yml`, and documentation.

2. **Arkiv Identifier Decoupling in Explorer URLs**:
   - Disallowed passing canonical `receiptHash` (`0xe9e5...`) to the Rabdi entity explorer (`https://rabdi.explorer.arkiv.network/entity/`).
   - Pinned valid entity key `$key` (`0xc327...`) for direct block explorer inspection.
   - Retained canonical `receiptHash` (`0xe9e5...`) for application routes (`/receipt/0xe9e5...`) and smart contract attestations.

3. **Contract Deployment Disambiguation**:
   - Formally separated and labeled Foundry deployment (`0x2ab7...28CD`, funded with 5.00 USDC) and Arc Studio deployment (`0x6760...c1de`, provenance contract with 60/60 tests).
   - Both contracts are verified on `https://explorer.testnet.arc.io/address/<addr>`.

## 3. Verification Deliverables
- Complete verification matrix published to [`docs/evidence/link-audit.md`](../../docs/evidence/link-audit.md).
- Automated link check test pass in [`lib/arkiv/identity.test.ts`](../../lib/arkiv/identity.test.ts) enforcing correct explorer link construction.

