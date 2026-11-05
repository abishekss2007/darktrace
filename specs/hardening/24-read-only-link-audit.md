# Stage 0: Baseline & Clickable Link Audit Report

**Date:** 2026-11-06  
**Auditor:** Senior Release Engineer & Submission-Evidence Auditor  
**Project:** DarkTrace (ETHGlobal Mumbai 2026)  
**Status:** COMPLETE (READ-ONLY AUDIT)

---

## 1. Git and Project Baseline State

```bash
$ git status --short --branch
## main...origin/main
?? scripts/check-links.ts

$ git rev-parse HEAD
6072c1ad27c0df7e560d4006fd160aad7957d07a

$ git rev-parse origin/main
6072c1ad27c0df7e560d4006fd160aad7957d07a

$ git log -8 --oneline --decorate
6072c1a (HEAD -> main, origin/main) fix(web): replace demo placeholders with real addresses and align slippage math
50de691 chore(specs): final submission freeze checklist
ece8ecd fix(arkiv): client strict-mode typescript build typings
cd943ad docs(demo): add arc studio + arkiv rabdi verification beats
d1175a1 chore(arc-studio): prompt + checklist + report template
7cef132 docs(readme): arkiv rabdi integration section + reproducible query
96a8543 docs(arkiv): README index for submission artifacts
512eae3 docs(arkiv): five submission files at required paths

$ git log --oneline origin/main..HEAD
# (empty - perfectly in sync)
```

### Vercel Deployment Verification
- **Live URL:** `https://darktrace-lovat.vercel.app/`
- **HTTP Status:** 200 OK (`X-Vercel-Cache: HIT`, `X-Vercel-Id: bom1::llthd-1793920785036-932067ce60a5`).
- **Rendered Addresses on `/demo`:**
  - `0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408` (Base Sepolia PoolManager — matches commit `6072c1a`).
  - `0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0` (DarkTraceHook — matches commit `6072c1a`).
  - `0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD` (Foundry RebateVault — funded with 5.00 USDC).
  - Placeholder `0x05FF...` is **absent** from rendered DOM, confirming Vercel has built and deployed commit `6072c1a` changes.
  - Studio RebateVault address (`0x676065eb7c72ddf2048f21e6cb2ca6721827c1de`) is **not** present in the deployed Vercel bundle. The live app strictly targets the Foundry vault.

---

## 2. Arkiv Candidate Identifiers Forensic Verification

Two candidate identifiers were audited on live Arkiv Rabdi testnet (Chain ID `7794095`, RPC `https://rpc.rabdi.db-chain.testnet.arkiv.network`):
- **Candidate A:** `0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce`
- **Candidate B:** `0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca`

### Live Query Proof via `@arkiv-network/sdk`

```typescript
// Query 1: Query by $key = Candidate B (0xc327...)
const resKey = await client.select({...}).from(ReceiptsSchema)
  .where(eq("$key", key("0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca"))).fetch();
// RESULT: 1 entity found.
// $owner: "0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5"
// receiptHash: "0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce"

// Query 2: Query by $key = Candidate A (0xe9e5...)
const resKey2 = await client.select({...}).from(ReceiptsSchema)
  .where(eq("$key", key("0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce"))).fetch();
// RESULT: 0 entities found. (Candidate A is NOT an entity key).

// Query 3: Query by attribute receiptHash = Candidate A (0xe9e5...)
const resHash = await client.select({...}).from(ReceiptsSchema)
  .where(eq("receiptHash", "0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce")).fetch();
// RESULT: 1 entity found! Matched entity $key is "0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca".
```

### Identifier Classification & Boundary Rules

| Identifier | Hex Value | Exact Biological & Architectural Identity | Where Used |
| :--- | :--- | :--- | :--- |
| **`arkivEntityKey`** | `0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca` | Arkiv internal database primary key (`$key`). Created upon on-chain transaction broadcast. | Arkiv Explorer URL: `https://rabdi.explorer.arkiv.network/entity/0xc327...` |
| **`receiptHash`** | `0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce` | Keccak256 canonical hash of the JSON-encoded `ExtractionReceipt` payload. | App route: `/receipt/0xe9e5...`, Arc `SimulationRegistry.attest()`, query filter `where(eq("receiptHash", ...))` |
| **`arkivWriteTxHash`** | `0x544ee730bb736cdbafcd837bad62f857c8ed0e0eaedf7afce807ffb060c6e0f6` | EVM transaction hash on Rabdi testnet for the entity creation. | Transaction proof ledger record |
| **`arkivURI`** | `arkiv://darktrace.v1/receipt/0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce` | Custom DarkTrace URI scheme referencing the receipt within the namespace. | UI metadata label |

**Rule:** `0xe9…` MUST NOT be blindly replaced with `0xc327…`. The app route `/receipt/<receiptHash>` uses `0xe9…`, and the Arkiv block explorer entity URL uses `0xc327…`.

---

## 3. Comprehensive Clickable Link Audit

All links from `README.md`, `FEEDBACK.md`, `/arkiv/`, `/arc-studio/`, `/specs/submission/`, and the public web app routes (`/`, `/demo`, `/dashboard`, `/receipt/[hash]`, `/searcher/[addr]`, `/lp/[addr]`) were inspected via automated HTTP GET requests with custom User-Agent headers, evaluating redirects, timeouts, bot challenges, and DNS lookups.

### Link Results Table

| Source Location | Target URL | Result | HTTP Code / Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `App Route: /` | `https://darktrace-lovat.vercel.app/` | `PASS` | 200 | App Landing Page |
| `App Route: /demo` | `https://darktrace-lovat.vercel.app/demo` | `PASS` | 200 | Interactive MEV Demo Page |
| `App Route: /dashboard` | `https://darktrace-lovat.vercel.app/dashboard` | `PASS` | 200 | Forensics Dashboard |
| `App Route: /receipt/[hash]` | `https://darktrace-lovat.vercel.app/receipt/0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce` | `PASS` | 200 | Canonical Receipt View |
| `App Route: /searcher/[addr]` | `https://darktrace-lovat.vercel.app/searcher/0x1111111111111111111111111111111111111111` | `PASS` | 200 | Searcher Dossier View |
| `App Route: /lp/[addr]` | `https://darktrace-lovat.vercel.app/lp/0x3333333333333333333333333333333333333333` | `PASS` | 200 | LP Impact View |
| `apps/web/Footer.tsx` | `https://explorer.testnet.arc.network/address/0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD` | `FAIL` | DNS ERR (11001) | **Domain invalid**. Correct URL: `https://explorer.testnet.arc.io/address/0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD` (returns 200) |
| `apps/web/Footer.tsx` | `https://sepolia.basescan.org/address/0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408` | `AUTH_REQUIRED` | 403 | BaseScan Cloudflare anti-bot gate on headless GET; verified 200 in browser |
| `apps/web/Footer.tsx` | `https://sepolia.basescan.org/address/0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0` | `AUTH_REQUIRED` | 403 | BaseScan Cloudflare anti-bot gate on headless GET; verified 200 in browser |
| `README.md` | `https://rabdi.explorer.arkiv.network/entity/0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca` | `PASS` | 200 | Rabdi Explorer single-page app view |
| `README.md` | `https://rpc.rabdi.db-chain.testnet.arkiv.network` | `PASS (JSON-RPC)` | 405 (GET) / 200 (POST) | JSON-RPC endpoint. POST `eth_blockNumber` returns 200 with current block `0x4158a` |
| `arkiv/README.md` | `https://rabdi.explorer.arkiv.network/entity/0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca` | `PASS` | 200 | Verified entity link |
| `arkiv/friction.md` | `https://rpc.arkiv.network` | `FAIL` | DNS ERR (11001) | Documented in `friction.md` as developer friction narrative |
| `arc-studio/README.md` | `https://studio.arc.io` | `PASS` | 200 | Arc Studio Web Platform |
| `arc-studio/report.md` | `https://explorer.testnet.arc.io/address/0x52794Da13E573c9e73D32248a286843418Ba2983` | `PASS` | 200 | Studio SimulationRegistry deployment |
| `arc-studio/report.md` | `https://explorer.testnet.arc.io/address/0x676065eb7c72ddf2048f21e6cb2ca6721827c1de` | `PASS` | 200 | Studio RebateVault deployment |
| `FINAL-SUBMISSION-CHECKLIST.md` | `https://github.com/samudragupto/darktrace/blob/main/FEEDBACK.md` | `PASS` | 200 | Public Uniswap Feedback file link |
| `FINAL-SUBMISSION-CHECKLIST.md` | `https://developers.uniswap.org/hackathon-feedback` | `PASS` | 200 | Uniswap Foundation Hackathon Feedback Portal |
| `specs/submission/demo-checklist.md` | `http://localhost:3000` | `FAIL` | Connection refused | Local development port; expected offline in production audit |
| `specs/submission/demo-checklist.md` | `https://rpc.testnet.arc.network` | `FAIL` | 404 | Obsolete URL in checklist notes. Active RPC: `https://rpc.testnet.arc.io` |
| `specs/submission/booth-strategy.md` | `https://darktrace-lovat.vercel.app/api/stats` | `PASS` | 200 | Web stats API endpoint |

---

## 4. Contract Architecture and Web3 Claims Realities

1. **Foundry Settlement Vault (`0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD`)**:
   - Deployed on Arc Testnet.
   - Live on-chain balance: **`5.00 USDC`** (funded via tx `0x4289870dba2b919eac9e654e853ff45f38a03bb9a66e0be3d6da8d8e07deab9d`).
   - The public demo app binds directly to this vault.
2. **Arc Studio Vault (`0x676065eb7c72ddf2048f21e6cb2ca6721827c1de`)**:
   - Generated and compiled in Arc Studio (60/60 passing tests).
   - Owner address: `0x5B12Ce46C7194aD57d143bC22847224047b1Ef42` (generated by in-browser Arc Studio wallet; non-exportable private key).
   - Balance: **`0 USDC`** (0 transactions on Arc Explorer).
   - Serves as proof of Arc Studio toolchain integration, test compliance, and contract provenance.
3. **Demo UI Balance Increment ($15.00 -> $16.25)**:
   - Clicking "Claim Rebate" in the demo changes simulated state from `$15.00` to `$16.25`.
   - **Honesty Guardrail:** There is NO matching on-chain USDC transfer for this demo action. It is a client-side simulated demonstration of the user flow, and must never be represented as a completed on-chain settlement.

---

## 5. Docker, CI/CD, and Test Suite Diagnostics

1. **Foundry Test Suite (`contracts/test/`)**:
   - 15/15 tests passing: `SearcherRegistryTest` (4/4), `RebateVaultTest` (5/5), `DarkTraceHookTest` (6/6).
2. **Unit Tests (`@darktrace/arkiv` & `@darktrace/simulator`)**:
   - 5/5 passing in `client.test.ts`.
   - 3/3 passing in `counterfactual.test.ts`.
3. **Indexer Pipeline Test (`apps/indexer/src/pipeline.test.ts`)**:
   - **Failing**: Throws `RPC Error (-32601): the method arkiv_putEntity does not exist/is not available` against Rabdi testnet.
   - **Root Cause**: `apps/indexer/src/pipeline.ts` instantiates `ArkivClient` without setting `devMode: "memory"`, and the fallback calls raw JSON-RPC `arkiv_putEntity` instead of the SDK.
   - **Fix for Stage 1/4**: Set `ARKIV_DEV_MODE=memory` in `pipeline.test.ts` or route to SDK transaction client.
4. **Docker Configurations**:
   - `docker-compose.yml`: Uses obsolete `version: "3.8"` attribute and outdated placeholders (`HOOK_ADDRESS=0x00...C0`, `ARKIV_RPC_URL=https://rpc.arkiv.network`).
   - `apps/indexer/Dockerfile`: Copies `dist/index.js` assuming host build, which breaks in isolated Docker daemon builds.
5. **CI Workflow (`.github/workflows/ci.yml`)**:
   - Uses `pnpm install --frozen-lockfile=false`.
   - Lacks linting and unit test execution for TypeScript workspace packages.

---

## 6. Action Plan for Stages 1 to 8

- **Stage 1 (Arkiv Identity Model & Fixes)**: Cleanly distinguish `receiptHash`, `arkivEntityKey`, and `txHash` in UI and docs. Provide direct link to Rabdi Explorer entity `0xc327...` while preserving route `/receipt/0xe9...`. Fix `pipeline.test.ts` memory fallback.
- **Stage 2 (Web3 Claims & Contracts)**: Fix `Footer.tsx` URL (`explorer.testnet.arc.io`). Clarify Foundry vs Studio vault roles. Label demo claim payout as simulated animation.
- **Stage 3 (Docker)**: Modernize `docker-compose.yml`, remove obsolete version, update environment addresses, ensure reproducible build.
- **Stage 4 (CI/CD)**: Enforce `--frozen-lockfile`, add lint and test stages to `.github/workflows/ci.yml`.
- **Stage 5 (Link Audit Documentation)**: Publish finalized link verification matrix in `/docs/evidence/link-audit.md`.
- **Stage 6 (Screenshots)**: Capture and catalog un-mocked visual evidence in `/docs/screenshots/`.
- **Stage 7 (README Polish)**: Align all addresses, remove misleading claims, provide copy-paste verified reproduction steps.
- **Stage 8 (Final Release Verification)**: Full automated test suite run, freeze checklist review, GO/NO-GO assessment.

