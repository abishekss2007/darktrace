# Stage 3 — Testnet & Demo Data Labeling Specification

**Stage**: 3 (Fix Blocker 3)  
**Objective**: Ensure every user and hackathon judge can immediately distinguish live on-chain/Arkiv telemetry from seeded demo records at a glance.

---

## 1. Summary of Changes

1. **Global `<NetworkBadge>` (`apps/web/src/components/ui/NetworkBadge.tsx` & `apps/web/src/components/layout/Header.tsx`)**:
   - Added a dedicated `<NetworkBadge>` component rendering `BASE SEPOLIA · ARC TESTNET` in small monospace uppercase type (`text-[11px] font-mono`), always visible in the top header bar.
2. **Standardized `[DEMO]` Pill (`apps/web/src/components/ui/DemoData.tsx`)**:
   - Updated `<DemoData>` and `<DemoDataBadge>` to default to the compact `[DEMO]` inline badge across all seeded numbers in `/`, `/dashboard`, `/pool/[id]`, `/receipt/[hash]`, `/lp/[address]`, `/searcher/[address]`, and `/demo`.
3. **Dashboard Disclaimer & Live `/api/stats` Route (`apps/web/src/app/api/stats/route.ts` & `apps/web/src/app/dashboard/page.tsx`)**:
   - Added `/api/stats` (cached 10s, `<450ms` timeout per upstream RPC) querying the live Arc Testnet `RebateVault` USDC balance (`eth_call` on `0x3600...0000` for `0x2ab7...28CD`) and Arkiv `darktrace.v1` `ExtractionReceipt` records.
   - Added the explicit muted disclaimer `"Illustrative data. Live counters reflect only on-chain activity."` on `/dashboard` and `/`.
4. **UI/UX Spec Policy (`specs/05-ui-ux.md` §4)**:
   - Added Section 4 `"Testnet & Demo Data Policy"` codifying the network badge, inline `[DEMO]` pills, and `/api/stats` live aggregation behavior.
5. **AI Attribution (`AI_ATTRIBUTION.md`)**:
   - Added attribution rows for `NetworkBadge.tsx`, `Header.tsx`, and `api/stats/route.ts`, and updated `specs/05-ui-ux.md`.

---

## 2. UI Screenshot Placeholders
- Header `<NetworkBadge>` (`BASE SEPOLIA · ARC TESTNET`): `![screenshot](screenshots/03-header-network-badge.png)`
- Dashboard `[DEMO]` Pills & Disclaimer: `![screenshot](screenshots/03-dashboard-demo-pills.png)`

