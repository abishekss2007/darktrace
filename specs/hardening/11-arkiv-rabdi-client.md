# Stage 2 — Arkiv Client Rabdi Testnet Binding & Fail-Loud Migration

**Timestamp:** 2026-11-06T02:21:20+05:30  
**Status:** WAITING FOR APPROVAL  
**Proposed Commits:**
1. `fix(arkiv): bind client to rabdi testnet, remove silent fallback`
2. `chore(scripts): arkiv write-test verification script`
3. `chore(env): document arkiv rabdi env vars`

---

## 1. Summary of Changes
- **Refactored `lib/arkiv/client.ts`:**
  - Configured to bind exclusively to `https://rpc.rabdi.db-chain.testnet.arkiv.network` (Chain ID `7794095`).
  - Guards against invalid endpoints by requiring `rabdi.db-chain.testnet.arkiv.network` in `ARKIV_RPC_URL`.
  - Disallows silent in-memory fallback on RPC errors; throws typed `ArkivRpcError`.
  - In-memory store retained ONLY when `ARKIV_DEV_MODE === 'memory'`.
  - Updated `lib/arkiv/client.test.ts` to explicitly set `devMode: 'memory'` for offline deterministic test passing.
- **Added Canonical Header in `lib/arkiv/schemas.ts`:**
  - `// Canonical field order matches SimulationRegistry.attest(receiptHash, ...). Verified at Stage 9.`
- **Added `.env.example`:**
  - Documented `ARKIV_RPC_URL`, `ARKIV_CHAIN_ID`, `ARKIV_ACCESS_KEY`, `ARKIV_WRITER_ADDRESS`, and optional `ARKIV_DEV_MODE`.
  - Documented Arc Testnet and Base Sepolia addresses.
- **Created `scripts/arkiv-write-test.ts` & Root Script:**
  - Writes a single test `ExtractionReceipt` and queries it back by `receiptHash`.
  - Prints `WRITE_OK <entityKey>`, `READ_OK <receiptHash>`, or `FAILED <reason>`.
  - Added `"arkiv:write-test"` in root `package.json`.
- **Updated `AI_ATTRIBUTION.md`:**
  - Logged per-file lines for `client.ts`, `schemas.ts`, `client.test.ts`, `.env.example`, `arkiv-write-test.ts`, and `package.json`.

---

## 2. Diff Summary
- `M lib/arkiv/client.ts` (+160/-80 lines)
- `M lib/arkiv/schemas.ts` (+1 line)
- `M lib/arkiv/client.test.ts` (+1/-1 lines)
- `A .env.example` (+22 lines)
- `A scripts/arkiv-write-test.ts` (+72 lines)
- `M package.json` (+1 line)
- `A specs/hardening/11-arkiv-rabdi-client.md` (+36 lines)
- `M AI_ATTRIBUTION.md` (+7 lines)

