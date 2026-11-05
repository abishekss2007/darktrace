# DarkTrace — Project Master Plan & Roadmap

**Hackathon**: ETHGlobal Mumbai 2026 (Deadline: Nov 7, 2026 09:00 IST)  
**Track**: Classic "From Scratch" (Clean git history, incremental conventional commits)  
**Target Partner Prizes**: Uniswap Foundation, Arc, Arkiv  
**License**: MIT  

---

## 1. Executive Summary & One-Liner

> **"DarkTrace is MEV forensics for Uniswap v4 LPs: hooks detect extraction, Arkiv seals the receipt, and LPs get USDC rebates on Arc."**

- **The Problem**: Liquidity providers (LPs) suffer silent, uncompensated Losses-Versus-Rebalancing (LVR) and sandwiching extraction exceeding $1.2B annually. Existing hook patterns either try to block swaps (killing routing flow) or lack cross-chain economic restitution.
- **The Solution**: DarkTrace operates as a lightweight, non-intrusive v4 hook that fingerprints toxic extraction via transient storage deltas. It generates verifiable forensic evidence published to Arkiv and authorizes USDC restitution claims on Arc Testnet via counterfactual simulation.

---

## 2. The Three-Building Mental Model

```
┌────────────────────────────────┐     ┌────────────────────────────────┐     ┌────────────────────────────────┐
│   Building 1: Uniswap v4 Hook  │     │       Building 2: Arc L1       │     │       Building 3: Arkiv        │
│        (Base Sepolia)          │     │          (USDC Native)         │     │         (Proof Ledger)         │
├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤
│ • beforeSwap / afterSwap hooks │     │ • Counterfactual Simulator     │     │ • Immutable ExtractionReceipts │
│ • Transient storage metrics    │     │ • SimulationRegistry.sol       │     │ • SearcherProfile reputations  │
│ • ExtractionDetected event     │     │ • RebateVault.sol (USDC claims)│     │ • LPClaim audit trail          │
│ • SearcherRegistry (bonds)     │     │ • Searcher bond slashing       │     │ • Queryable forensic ledger    │
└────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘
```

### Honest Boundaries & Anti-Claims
1. **NO Atomic Same-Tx Restitution**: Cross-chain callbacks in a single EVM transaction do not exist. Restitution is asynchronous.
2. **NO Same-Block Rebate**: Rebate claims occur on subsequent blocks after verification and indexer proof-sealing.
3. **NO Hook Execution Interception**: The v4 hook does not revert or censor user swaps. It fingerprints and logs extraction.
4. **NO Imaginary Sequencer Slashing**: Slashing applies strictly to registered searcher bonds committed to `SearcherRegistry`.

---

## 3. Partner Prize Alignment

| Partner | Technical Role | Integration Details |
| :--- | :--- | :--- |
| **Uniswap Foundation** | v4 Hook (`DarkTraceHook.sol`) | Uses `beforeSwap`/`afterSwap` hooks with transient storage (`tstore`/`tload`), computes price impact variance and adjacent sandwich transaction fingerprints, and emits `ExtractionDetected`. |
| **Arc** | Settlement & Simulation L1 | Houses `RebateVault.sol` (holding native/ERC-20 test USDC) and `SimulationRegistry.sol`. Receives counterfactual simulation hashes and executes LP restitution. |
| **Arkiv** | Forensic Proof Ledger | Stores immutable, decentralized `ExtractionReceipt`, `SearcherProfile`, and `LPClaim` schemas, providing verifiable evidence for claims and searcher auditability. |

---

## 4. Staged Execution Plan

### Stage 1: Foundation & Specs (Current)
- Monorepo structure (`pnpm` workspaces, Foundry, Next.js App Router).
- `/specs/00-plan.md` and `/specs/01-architecture.md`.
- Tooling, linters, TypeScript configs, Foundry profiles, CI workflow (`forge test` + `pnpm build`).
- Git commit: `chore: scaffold monorepo, foundry, next.js, rainbowkit`.

### Stage 2: Uniswap v4 Hook (`contracts/src/DarkTraceHook.sol`)
- Read current Uniswap v4 hooks specification and Base Sepolia deployments.
- Mine valid hook CREATE2 salt matching hook flags (`BEFORE_SWAP_FLAG | AFTER_SWAP_FLAG`).
- Implement transient storage accounting in `beforeSwap` and delta inspection in `afterSwap`.
- Implement `SearcherRegistry.sol` for bond staking and governance slashing.
- Unit testing with mocked `PoolManager`: clean swaps (no event) vs sandwich pairs (event emitted).
- Commit: `feat(hook): darktracehook with transient-storage swap footprint` & `test(hook): sandwich detection unit tests`.

### Stage 3: Arkiv Adapter & Schemas (`lib/arkiv/`)
- TypeScript Arkiv adapter supporting CRUD for receipts, profiles, and claims.
- Strict schema validation: `ExtractionReceipt`, `SearcherProfile`, `LPClaim`.
- Integration round-trip test (write -> read -> verify).
- Commit: `feat(arkiv): adapter + schemas + round-trip test`.

### Stage 4: Arc Simulator & Rebate Vault (`lib/simulator/` + `contracts/src/`)
- Deterministic counterfactual simulation logic using `viem`.
- Compares real swap execution against pre-attack reserve state: computes `extractedUSDC`, `injectedSlippageBps`, `legitSlippageBps`, `simulationHash`.
- `RebateVault.sol` on Arc with nonces, reentrancy guards, and proof verification.
- `SimulationRegistry.sol` for attestation recording.
- Foundry tests: valid claims, replay rejection, invalid receipt reverts.
- Commit: `feat(sim): counterfactual LVR computation`, `feat(arc): rebatevault + simulationregistry`, `test(arc): rebate claim integrity`.

### Stage 5: Off-Chain Indexer & Pipeline (`apps/indexer/`)
- Node.js / viem service watching Base Sepolia `ExtractionDetected` events.
- Orchestrates: Event -> Simulator -> Arkiv publish -> Arc `SimulationRegistry.recordSimulation()`.
- Supports `DEMO_FAST=1` flag for instant deterministic testnet verification.
- Commit: `feat(indexer): extraction -> simulation -> arkiv pipeline`.

### Stage 6: UI / UX Terminal Frontend (`apps/web/`)
- Dark, terminal-forensic aesthetic (Palette: `#0A0B0D`, `#121418`, `#1F2328`, `#E6E8EB`, Amber `#F0B429`, Crimson `#E5484D`, Mint `#3DD68C`).
- Geist Sans + JetBrains Mono, right-aligned tabular numerals, borders only (zero glassmorphism, zero purple gradients, zero emojis).
- Pages: `/dashboard`, `/pool/[id]`, `/receipt/[hash]`, `/searcher/[address]`, `/lp/[address]`, `/demo`.
- Commits per page: `feat(web): dashboard`, `feat(web): pool view`, etc.

### Stage 7: End-to-End Demo Flow Polish (`/demo`)
- Two-column Bloomberg terminal style view:
  - Left: Real-time event stream (`DETECTED` -> `SIMULATED` -> `ARCHIVED` -> `REBATED`).
  - Right: Detailed forensic receipt inspector + one-click "Claim Rebate" on Arc.
- Commit: `feat(web): end-to-end demo flow`.

### Stage 8: Documentation, Deployment & Attribution
- Deployment scripts for Base Sepolia and Arc Testnet.
- Fill-in-the-blanks deployment tables in `README.md`.
- Complete 3-minute video recording script in `/specs/06-demo-script.md`.
- Complete `AI_ATTRIBUTION.md` covering all generated files.
- Commit: `docs: readme + demo script + deployment addresses`.

---

## 5. Verification Checklist

- [ ] All commits are granular, conventional (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
- [ ] No commit touches >8 files after Stage 1.
- [ ] No `any` types in contract/sdk wrappers.
- [ ] All contracts covered by Foundry test suites.
- [ ] All hook permission flag bits verified via CREATE2 salt miner.
- [ ] Strict adherence to forensic UI palette and styling guidelines.

