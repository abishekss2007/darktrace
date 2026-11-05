# Stage 1 — Vault & Numbers Consistency Specification

**Stage**: 1 (Fix Blocker 1)  
**Decision**: Option B — Rescale all UI, mock data, and demo script figures to match the actual on-chain `RebateVault` balance on Arc Testnet to the cent, and label all seeded figures inline with `<DemoData />` (`[DEMO DATA]`).

---

## 1. On-Chain Vault Balance (Verified via Arc Testnet RPC)
- **Contract**: `RebateVault` (`0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD`)
- **Token**: Arc Native USDC ERC-20 (`0x3600000000000000000000000000000000000000`, 6 decimals)
- **Funding Transaction**: `0x4289870dba2b919eac9e654e853ff45f38a03bb9a66e0be3d6da8d8e07deab9d`
- **Live Balance**: **`5.00 USDC`** (`5,000,000` raw units)
- **Per-Receipt Testnet Rebate Cap**: **`2.00 USDC`** per receipt (production caps TBD by pool governance)

---

## 2. Canonical Number Reconciliation (Agrees to the Cent)

| Metric / Entity | Previous (Unbacked) | New (Hardened & Consistent) | Source / Label |
| :--- | :--- | :--- | :--- |
| **`RebateVault` Balance (Arc)** | `$112,450.00` (claimed) | **`$5.00 USDC`** | Live on-chain (`balanceOf(RebateVault)`) |
| **Live Demo Attack (`extractedUSDC`)** | `$174.80` | **`$1.25 USDC`** | Demo flow (`/demo` & `specs/06-demo-script.md`) |
| **Live Demo Attack (`lpLvrDelta`)** | `-$169.50` | **`-$1.21`** | Demo flow (`/demo` & `specs/06-demo-script.md`) |
| **Demo LP USDC Balance (Before → After)** | `$2,450.00 → $2,624.80` | **`$15.00 → $16.25 USDC`** (`+$1.25`) | `/demo` & `specs/06-demo-script.md` (`[DEMO DATA]`) |
| **Seeded Receipt 1 (`WETH / USDC`)** | `$142.50` (`-$138.90`) | **`$1.25`** (`-$1.21`) | `mockData.ts` (`[DEMO DATA]`) |
| **Seeded Receipt 2 (`WETH / USDC`)** | `$310.20` (`-$295.40`) | **`$0.85`** (`-$0.82`) | `mockData.ts` (`[DEMO DATA]`) |
| **Seeded Receipt 3 (`cbBTC / USDC`)** | `$890.10` (`-$860.00`) | **`$1.65`** (`-$1.60`) | `mockData.ts` (`[DEMO DATA]`) |
| **Sum of Seeded Receipts (24h Extracted)** | `$1,342.80` / `$148,920.40` | **`$3.75 USDC`** (`1.25 + 0.85 + 1.65`) | `/`, `/dashboard` (`[DEMO DATA]`) |
| **Seeded + Demo Attack Total** | N/A | **`$5.00 USDC`** (`3.75 + 1.25`) | Exact 100% match to `5.00 USDC` vault reserve |
| **Pool 1 (`WETH / USDC`) 24h Extracted** | `$1,842.50` | **`$2.10`** (`1.25 + 0.85`) | `mockData.ts` (`[DEMO DATA]`) |
| **Pool 2 (`cbBTC / USDC`) 24h Extracted** | `$890.10` | **`$1.65`** | `mockData.ts` (`[DEMO DATA]`) |
| **Pool 3 (`WETH / DEGEN`) 24h Extracted** | `$0.00` | **`$0.00`** | `mockData.ts` (`[DEMO DATA]`) |
| **Searcher `0x1111…1111` Bond / Slashed** | `$10,000.00` / `$5,000.00` | **`$25.00 USDC`** / **`$2.10 USDC`** | `/searcher/[address]` (`[DEMO DATA]`) |

---

## 3. Files Modified & Rationale
1. `apps/web/src/components/ui/DemoData.tsx`: Added `<DemoData>` component rendering a visible inline `[DEMO DATA]` pill (`border-border bg-bg text-muted font-mono text-[10px]`) alongside seeded figures.
2. `apps/web/src/data/mockData.ts`: Rescaled pool TVL, 24h volume, 24h extracted, and receipt `extractedUSDC` / `lpLvrDelta` figures so all receipts sum to `$3.75 USDC` and pool totals equal their constituent receipts.
3. `apps/web/src/app/page.tsx`: Replaced `$148,920.40`, `$112,450.00`, and `482` with `$3.75`, `$5.00 USDC` (live vault balance), and `3`, wrapping seeded values in `<DemoData>`.
4. `apps/web/src/app/dashboard/page.tsx`: Wrapped seeded pool/receipt figures in `<DemoData>` and displayed the `$5.00 USDC` Arc `RebateVault` reserve.
5. `apps/web/src/app/demo/page.tsx`: Rescaled `lpBalance` (`15.00` -> `16.25`), `targetLoss` (`1.25`), `lpLvrDelta` (`-$1.21`), and `INITIAL_FEED` (`$1.25`, `$0.85`), bound live on-chain `RebateVault` USDC balance via `useReadContract` on Arc Testnet, and added `<DemoData>` pills.
6. `apps/web/src/app/receipt/[hash]/page.tsx`, `apps/web/src/app/pool/[id]/page.tsx`, `apps/web/src/app/lp/[address]/page.tsx`, `apps/web/src/app/searcher/[address]/page.tsx`: Rescaled fallback/bond numbers and wrapped seeded figures in `<DemoData>`.
7. `specs/06-demo-script.md`: Updated voiceover and visual cues to match `$3.75` extracted (24h), `$5.00 USDC` vault reserve, `$1.25 USDC` demo attack rebate, and `$15.00 -> $16.25 USDC` LP balance delta.
8. `specs/03-arc-simulator.md`: Added Section 4.3 documenting the `5.00 USDC` live vault funding and `2.00 USDC` per-receipt testnet rebate cap.
9. `AI_ATTRIBUTION.md`: Updated line-level human/AI attribution for all modified files.

---

## 4. UI Screenshot Placeholders
- Dashboard & Hero Metrics: `![screenshot](screenshots/01-dashboard.png)`
- Demo Terminal (`$15.00 -> $16.25 USDC` claim & `$5.00 USDC` vault reserve): `![screenshot](screenshots/01-demo.png)`
- Receipt Detail (`$1.25 USDC` & `[DEMO DATA]` pill): `![screenshot](screenshots/01-receipt.png)`

