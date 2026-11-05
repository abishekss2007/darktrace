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
| `specs/02-hook-design.md` | Yes | Drafted transient storage slots and detection condition. | Verified bitmask calculation (`0x00C0`) and inversion thresholds. |
| `specs/03-arc-simulator.md` | Yes | Documented counterfactual simulation math and Arc USDC dual interface. | Formulated slippage breakdown formula, simulation hash generation, and Section 4.3 (5.00 USDC live vault funding & 2.00 USDC per-receipt cap). |
| `specs/04-arkiv-schema.md` | Yes | Documented Arkiv JSON schemas and indexing attributes. | Structured canonical receipt hash ordering and LP claim linkage. |
| `specs/05-ui-ux.md` | Yes | Authored UI design tokens, color palette, and anti-slop rules. | Enforced Geist Sans/Mono typography, border-only structure, and tabular numbers. |
| `apps/web/src/components/ui/HashDisplay.tsx` | Yes | Scaffolded hash shortener with clipboard copy button. | Added copy state feedback and monospace formatting. |
| `apps/web/src/components/ui/StatusPill.tsx` | Yes | Generated color-coded status pills for forensic pipeline states. | Configured border-only badges for DETECTED, SIMULATED, ARCHIVED, REBATED. |
| `apps/web/src/components/ui/DemoData.tsx` | Yes | Drafted inline `[DEMO DATA]` and `[DEMO]` badge wrapper component. | Enforced default-visible muted monospace styling for all seeded figures. |
| `apps/web/src/data/mockData.ts` | Partial | Generated mock data structures for pools and receipts. | Rescaled all seeded receipts ($1.25, $0.85, $1.65 = $3.75) and pool totals ($2.10, $1.65, $0.00) to match the 5.00 USDC live RebateVault balance to the cent. |
| `apps/web/src/app/page.tsx` | Partial | Scaffolded home page hero banner and 4-column metric cards. | Replaced unbacked hero numbers with 3 extractions, $3.75 extracted volume, and live $5.00 USDC RebateVault reserve wrapped in `<DemoData>`. |
| `apps/web/src/app/dashboard/page.tsx` | Yes | Scaffolded monitored pools and receipts surveillance tables. | Implemented right-aligned tabular numbers, live $5.00 USDC vault reserve pill, and `<DemoData>` wrappers on seeded rows. |
| `apps/web/src/app/pool/[id]/page.tsx` | Yes | Scaffolded pool inspector with TVL and volume metrics. | Rescaled fallback pool metrics ($500.00 TVL, $120.00 volume) and wrapped seeded figures in `<DemoData>`. |
| `apps/web/src/app/receipt/[hash]/page.tsx` | Partial | Scaffolded forensic receipt detail card layout. | Rescaled fallback receipt ($1.25 / -$1.21), built toxic vs legit slippage decomposition box, and added `<DemoData>` pills. |
| `apps/web/src/app/searcher/[address]/page.tsx` | Yes | Scaffolded searcher profile and historical extractions view. | Rescaled collateral bond ($25.00 USDC) and slashed amount ($2.10 USDC) to match seeded extractions and added `<DemoData>`. |
| `apps/web/src/app/lp/[address]/page.tsx` | Yes | Scaffolded LP restitution view and claim statistics. | Wrapped seeded LP extraction and claim totals in `<DemoData>` and linked Arc Testnet settlement balances. |
| `apps/web/src/app/demo/page.tsx` | Partial | Scaffolded two-column terminal layout. | Wired live on-chain `RebateVault` balanceOf read via wagmi (`$5.00 USDC`), rescaled demo attack to `$1.25 USDC` (`$15.00 -> $16.25 USDC`), removed fake claim tx hashes, and added `<DemoData>` badges. |
| `contracts/src/RebateVault.sol` | Partial | Scaffolded ERC-20 USDC custody vault. | Designed replay nullifier checks, SimulationRegistry attestation verification, and self-payout guards. |
| `contracts/src/SimulationRegistry.sol` | Yes | Scaffolded attestation storage mapping. | Implemented immutable simulation record storage and unauthorized write protections. |
| `contracts/test/mocks/MockUSDC.sol` | Yes | Generated standard 6-decimal ERC20 test mock. | Verified transfer and allowance behavior for vault testing. |
| `contracts/test/RebateVault.t.sol` | Partial | Scaffolded claim and revert test cases. | Implemented attestation checks, replay verification, and reentrancy test cases. |
| `lib/simulator/counterfactual.ts` | Partial | Generated viem call structure and type interfaces. | Implemented exact constant-product counterfactual replay, legit vs injected slippage math, and deterministic simulation hash. |
| `lib/simulator/counterfactual.test.ts` | Yes | Scaffolded test suite using node:test. | Tested deterministic hash repeatability and positive injected slippage assertions. |
| `apps/indexer/package.json` | Yes | Defined indexer package dependencies and workspace links. | Configured run scripts and viem peer configurations. |
| `apps/indexer/src/pipeline.ts` | Partial | Scaffolded pipeline event router. | Implemented deduplication cache, demo fast fallback mode, structured log schema, and Arc attestation calls. |
| `apps/indexer/src/watcher.ts` | Yes | Scaffolded viem contract event listener on Base Sepolia. | Handled event log filtering, payload normalization, and watcher error handling. |
| `apps/indexer/src/index.ts` | Yes | Drafted service entry point and graceful SIGINT handling. | Configured environment bootstrapping and pipeline lifecycle. |
| `apps/indexer/src/pipeline.test.ts` | Yes | Scaffolded integration test cases. | Validated end-to-end receipt writing, profile updating, and event deduplication. |
| `apps/indexer/Dockerfile` | Yes | Drafted multi-stage Dockerfile for indexer service. | Pinned Node.js 20 Alpine builder and runner environments. |
| `docker-compose.yml` | Yes | Drafted local worker composition for indexer and simulator. | Pinned environment variables and container profiles. |
| `lib/arkiv/schemas.ts` | Yes | Scaffolded TypeScript interfaces and computeReceiptHash utility. | Enforced deterministic key ordering and viem keccak256 encoding. |
| `lib/arkiv/client.ts` | Partial | Generated client adapter boilerplate with TODO annotations for Arkiv RPC methods. | Implemented offline fallback memory registries, profile auto-incrementation, and indexing methods. |
| `lib/arkiv/client.test.ts` | Yes | Scaffolded round-trip test harness using node:test. | Configured full cycle assertion suite across receipts, profiles, and claims. |
| `pnpm-workspace.yaml` | Yes | Defined workspace package structure. | Verified package inclusion and module boundaries. |
| `package.json` | Yes | Drafted monorepo root scripts. | Configured workspace target script pipeline. |
| `contracts/foundry.toml` | Yes | Generated standard Foundry configuration profile. | Tuned EVM version to Cancun, enabled via_ir, and configured remappings. |
| `contracts/src/DarkTraceHook.sol` | Partial | Generated beforeSwap/afterSwap transient-storage skeleton. | Optimized packed transient state struct to prevent stack depth; designed sandwich footprint heuristic preserving frontrun push delta. |
| `contracts/src/SearcherRegistry.sol` | Yes | Scaffolded searcher bond deposit and slashing logic. | Added recipient validations and emergency administration protections. |
| `contracts/test/mocks/MockPoolManager.sol` | Partial | Provided minimal extsload mock for StateLibrary integration. | Formatted bit-packed slot0 data representation matching v4 core layout. |
| `contracts/test/DarkTraceHook.t.sol` | Partial | Generated unit test scaffolding. | Implemented sandwich frontrun/victim/backrun sequences, clean swap assertions, and cross-block defensive fallbacks. |
| `contracts/test/SearcherRegistry.t.sol` | Yes | Generated happy path and revert test cases for staking and slashing. | Verified unauthorized slash reverts and balance accounting. |
| `apps/web/package.json` | Yes | Listed dependencies for Next.js 14, wagmi v2, RainbowKit. | Pinned dependency versions and workspace aliases. |
| `apps/web/src/config/wagmi.ts` | Partial | Generated chain configuration template for Base Sepolia and Arc Testnet. | Configured RPC fallbacks and custom chain metadata for Arc. |
| `.github/workflows/ci.yml` | Yes | Drafted GitHub Actions workflow for Foundry and Next.js. | Configured matrix and pnpm caching steps. |
| `specs/06-demo-script.md` | Yes | Scaffolded 3-minute video presentation script and narrative arc. | Aligned all spoken and visual numbers ($3.75 24h extracted, $5.00 USDC vault reserve, $1.25 rebate claim, $15.00 -> $16.25 LP balance) with funded Arc vault. |
| `specs/07-deployment.md` | Yes | Drafted deployment runbook and parameter matrix. | Verified Base Sepolia and Arc Testnet addresses and verification steps. |
| `contracts/script/DeployBaseSepolia.s.sol` | Partial | Scaffolded Forge Script deployment boilerplate. | Implemented 0x00C0 CREATE2 salt-mining search loop and verification checks. |
| `contracts/script/DeployArcTestnet.s.sol` | Yes | Drafted Forge Script deployment for SimulationRegistry and RebateVault. | Verified native USDC ERC-20 contract target and deployment parameters. |
| `README.md` | Partial | Scaffolded Markdown documentation layout and architecture diagram. | Authored honest boundary guarantees, terminal walkthrough, and verified contract addresses. |

