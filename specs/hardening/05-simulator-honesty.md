# Stage 5 — Simulator Honesty Specification

**Stage**: 5 (Fix Medium M1)  
**Finding (Step 5.1)**: **Path (B)** — `/lib/simulator/counterfactual.ts` does **not** use an archive RPC to fork historical EVM state. It computes counterfactual execution deterministically using the **constant-product (`x * y = k`) pricing formula** applied to pre-attack reserves (`preAttackReserve0`, `preAttackReserve1`) and swap input amounts.

---

## 1. Summary of Changes

1. **Header Comment & JSDoc in `lib/simulator/counterfactual.ts` (Step 5.2B)**:
   - Added the exact required header comment at lines 1–2:
     ```ts
     // Counterfactual price = CPMM formula applied to (reserveBefore,
     // victimSwapInput). No fork replay. See specs/03 §3.2.
     ```
   - Replaced `"Replays victim execution"` in the JSDoc with `"Computes victim execution against pre-attack reserves using constant-product pricing"`.
   - Updated the fallback testnet demo clamp from `142_500_000n` (`142.50 USDC`) to `1_250_000n` (`1.25 USDC`) to stay consistent with Stage 1.
2. **Indexer & UI Terminology (`apps/indexer/src/pipeline.ts`, `apps/web/src/app/page.tsx`, `apps/web/src/app/receipt/[hash]/page.tsx`)**:
   - Replaced `"Counterfactual simulation replayed against pool snapshot"` with `"Counterfactual computed against pre-attack reserves using constant-product pricing"`.
   - Replaced `"Replays counterfactual execution"` and `"Simulation Hash (viem replay):"` in the UI with `"Computes counterfactual execution against pre-attack reserves"` and `"Simulation Hash (CPMM counterfactual):"`.
3. **Simulator Spec & "Fidelity & Limits" Section (`specs/03-arc-simulator.md` §3.2–§3.4, Step 5.3)**:
   - Updated Section 1 and Section 3.2 to describe constant-product pricing against pre-attack reserves (`CPMMPrice`) and the exact 5-tuple `keccak256(abi.encode(...))` simulation hash.
   - Added Section 3.4 (`"Fidelity & Limits"`) detailing what is exact (single-tick-range concentrated liquidity equivalence to virtual CPMM reserves), what is approximated (no archive RPC fork or multi-tick bitmap traversal), and why the approximation is sound for same-block sandwich attribution.
4. **AI Attribution (`AI_ATTRIBUTION.md`) & Spec Index (`specs/README.md`)**:
   - Updated attribution entries for `lib/simulator/counterfactual.ts`, `apps/indexer/src/pipeline.ts`, and `specs/03-arc-simulator.md`.

---

## 2. UI Screenshot Placeholder
- Receipt Detail (`Simulation Hash (CPMM counterfactual)`): `![screenshot](screenshots/05-receipt-cpmm-label.png)`

