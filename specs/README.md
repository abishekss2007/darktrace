# DarkTrace — Specifications Index (Judge Entry Point)

Welcome to the technical specification directory for **DarkTrace** (MEV Forensics for Uniswap v4 Liquidity Providers). Start here to navigate the architecture, mathematical models, on-chain deployments, and pre-submission hardening audits.

---

## Core Protocol Specifications

| Spec File | One-Line Purpose |
| :--- | :--- |
| [`00-plan.md`](./00-plan.md) | Master roadmap, three-building mental model (Uniswap v4, Arc, Arkiv), and honest boundary guarantees. |
| [`01-architecture.md`](./01-architecture.md) | End-to-end system sequence diagram separating Base Sepolia bond reduction (Flow 1) from Arc pre-funded restitution (Flow 2). |
| [`02-hook-design.md`](./02-hook-design.md) | Uniswap v4 `DarkTraceHook.sol` specification covering `0x00C0` CREATE2 flag mining, Cancun transient storage (`tstore`/`tload`), and sandwich inversion heuristics. |
| [`03-arc-simulator.md`](./03-arc-simulator.md) | Constant-product counterfactual slippage decomposition math, Arc USDC dual-interface model, `RebateVault` (`5.00 USDC`) funding cap, and cross-chain scope boundaries. |
| [`04-arkiv-schema.md`](./04-arkiv-schema.md) | Entity schemas (`ExtractionReceipt`, `SearcherProfile`, `LPClaim`) and canonical `keccak256` receipt hashing under the `darktrace.v1` namespace. |
| [`05-ui-ux.md`](./05-ui-ux.md) | Terminal-forensic design system, color tokens, tabular typography rules, and the Testnet & Demo Data Labeling Policy (`<NetworkBadge>`, `[DEMO]` pills, `/api/stats`). |
| [`06-demo-script.md`](./06-demo-script.md) | 3-minute live demo walkthrough and voiceover script aligned to the cent with the `5.00 USDC` funded `RebateVault` on Arc Testnet. |
| [`07-deployment.md`](./07-deployment.md) | Verified contract addresses, constructor parameters, and deployment runbooks for Base Sepolia (`84532`) and Arc Testnet (`5042002`). |

---

## Pre-Submission Hardening Audit Trail (`/specs/hardening/`)

| Audit File | One-Line Purpose |
| :--- | :--- |
| [`hardening/00-audit.md`](./hardening/00-audit.md) | Stage 0 read-only diagnostic audit of commits, hardcoded numbers, simulator terminology, cross-chain claims, and live on-chain vault balance. |
| [`hardening/01-vault-consistency.md`](./hardening/01-vault-consistency.md) | Stage 1 reconciliation binding all UI figures, seeded receipts (`$3.75`), and demo claims (`$1.25`) to the live `5.00 USDC` `RebateVault` balance. |
| [`hardening/02-cross-chain-scope.md`](./hardening/02-cross-chain-scope.md) | Stage 2 declaration keeping cross-chain slashing out of scope and separating Flow 1 (Base Sepolia) from Flow 2 (Arc Testnet). |
| [`hardening/03-demo-data-labeling.md`](./hardening/03-demo-data-labeling.md) | Stage 3 implementation record for `<NetworkBadge>`, inline `[DEMO]` pills, dashboard disclaimers, and `/api/stats`. |
| [`hardening/04-attribution-and-history.md`](./hardening/04-attribution-and-history.md) | Stage 4 commit history diagnosis (`31+` commits), `RESTRUCTURE_NOTES.md`, per-file `/AI_ATTRIBUTION.md` matrix, and spec index. |

