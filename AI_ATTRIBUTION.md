# AI Attribution Ledger

This document tracks all AI-assisted versus human engineering contributions across the DarkTrace repository in compliance with ETHGlobal Mumbai 2026 hackathon criteria.

## Policy & Transparency
- All architecture, protocol design decisions, and system verification are reviewed and validated by the lead engineer.
- Every commit is reviewed line-by-line prior to staging.

---

## Attribution Matrix

| File Path | AI-Assisted | What AI Did | What I Did |
| :--- | :--- | :--- | :--- |
| `specs/00-plan.md` | Yes | Scaffolded implementation stage breakdown and partner alignments. | Defined honest boundary criteria and prize eligibility focus. |
| `specs/01-architecture.md` | Yes | Generated initial sequence flow diagram and data models. | Formulated transient storage layout and counterfactual slippage math. |
| `pnpm-workspace.yaml` | Yes | Defined workspace package structure. | Verified package inclusion and module boundaries. |
| `package.json` | Yes | Drafted monorepo root scripts. | Configured workspace target script pipeline. |
| `contracts/foundry.toml` | Yes | Generated standard Foundry configuration profile. | Tuned EVM version to Cancun for transient storage `tstore`/`tload` support. |
| `apps/web/package.json` | Yes | Listed dependencies for Next.js 14, wagmi v2, RainbowKit. | Pinned dependency versions and workspace aliases. |
| `apps/web/src/config/wagmi.ts` | Partial | Generated chain configuration template for Base Sepolia and Arc Testnet. | Configured RPC fallbacks and custom chain metadata for Arc. |
| `.github/workflows/ci.yml` | Yes | Drafted GitHub Actions workflow for Foundry and Next.js. | Configured matrix and pnpm caching steps. |

