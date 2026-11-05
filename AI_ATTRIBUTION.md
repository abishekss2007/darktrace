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
| `specs/03-arc-simulator.md` | Yes | Documented counterfactual simulation math and Arc USDC dual interface. | Formulated slippage breakdown formula and simulation hash generation. |
| `specs/04-arkiv-schema.md` | Yes | Documented Arkiv JSON schemas and indexing attributes. | Structured canonical receipt hash ordering and LP claim linkage. |
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

