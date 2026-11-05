# Stage 2 — Cross-Chain Slashing Honesty Specification

**Stage**: 2 (Fix Blocker 2)  
**Decision**: Option A — Declare cross-chain slashing out of scope for the hackathon and explicitly separate Base Sepolia bond reduction from Arc Testnet pre-funded LP restitution.

---

## 1. Canonical Scope Statement (Preserved Verbatim in `specs/03-arc-simulator.md` §5)

> "Searcher bond slashing executes on Base Sepolia and does not settle USDC on Arc within this hackathon build. LP restitution on Arc draws from a pre-funded vault against verifiable receipts. Coordinating the two flows requires a production bridge and is on the roadmap, not in this demo."

---

## 2. Two Independent On-Chain Flows

| Flow | Network | Contract | Action | Value Movement |
| :--- | :--- | :--- | :--- | :--- |
| **Flow 1** | Base Sepolia (`84532`) | `SearcherRegistry.sol` (`0x24A2…3551`) | Records local forensic bond decrement (`slashBond`). | **None across chains** — no USDC leaves Base Sepolia. |
| **Flow 2** | Arc Testnet (`5042002`) | `RebateVault.sol` (`0x2ab7…28CD`) | Releases pre-funded USDC (`5.00 USDC` reserve) against verified `SimulationRegistry` + Arkiv receipt. | **Local to Arc Testnet** — no USDC arrives from Base Sepolia. |

---

## 3. Files Modified & Rationale
1. `specs/03-arc-simulator.md`: Added Section 5 `"Cross-Chain Restitution: Out of Scope for Hackathon"` with the exact three required sentences.
2. `specs/01-architecture.md`: Updated the Mermaid sequence diagram so `Flow 1 — Base Sepolia Local Bond Decrement` (`Indexer->>Registry: slashBond`) and `Flow 2 — Arc Testnet Pre-Funded LP Restitution` (`Victim->>ArcVault: claimRebate`) are visually separated as independent notes/blocks; removed `"via searcher bonds"` from `RebateVault.sol` description.
3. `specs/02-hook-design.md`: Removed claim that slashed bond capital replenishes `RebateVault` on Arc; documented that bond reduction is a Base Sepolia forensic attestation.
4. `specs/00-plan.md` & `specs/04-arkiv-schema.md`: Replaced `"Searcher bond slashing"` under Building 2 (Arc) with `"Pre-funded USDC restitution"` and updated `slashedUSDC` comment to `// Cumulative bond reduced on Base Sepolia (forensic only)`.
5. `contracts/src/SearcherRegistry.sol`: Replaced NatSpec comments implying funds route to `RebateVault` with explicit `// NOTE: does not settle across chains; see specs/03` annotations. Zero bytecode change; no contract redeployment required.
6. `apps/web/src/app/searcher/[address]/page.tsx`: Relabeled card to `"bond reduced (Base Sepolia, forensic only)"` with explicit local attestation note.
7. `apps/web/src/app/receipt/[hash]/page.tsx`: Split the bottom banner into two distinct chain cards (`Flow 1 · Base Sepolia (SearcherRegistry)` with `"bond reduced (Base Sepolia, forensic only)"` and `Flow 2 · Arc Testnet (Pre-Funded RebateVault)`).
8. `apps/web/src/app/demo/page.tsx` & `specs/06-demo-script.md`: Updated post-claim box and demo script to label `"bond reduced (Base Sepolia, forensic only)"` as independent of Flow 2 on Arc Testnet.
9. `AI_ATTRIBUTION.md`: Updated attribution entries for all touched files.

---

## 4. UI Screenshot Placeholders
- Searcher Profile (`bond reduced (Base Sepolia, forensic only)`): `![screenshot](screenshots/02-searcher.png)`
- Receipt Two-Chain Flow Cards (`Flow 1 Base Sepolia` vs `Flow 2 Arc Testnet`): `![screenshot](screenshots/02-receipt.png)`
- Demo Post-Claim Box: `![screenshot](screenshots/02-demo.png)`

