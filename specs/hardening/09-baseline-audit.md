# Stage 0 — Baseline Audit (Submission Qualification)

**Timestamp:** 2026-11-06T02:13:30+05:30  
**Current Commit:** `0323057`  
**Total Commits:** 39  
**Tracked Files:** 178  

---

## Diagnostics Results

### a) Git Log Status
- `git log --oneline | wc -l`: **39 commits**
- Top 5 commits (`git log --oneline -5`):
  1. `0323057 chore(specs): final hardening checklist`
  2. `4b4287e docs(submission): qa prep + demo checklist + booth strategy`
  3. `9892f98 docs(submission): partner feedback paragraphs with real friction`
  4. `6bbfa42 docs: soften MEV loss claim to conservative floor with citation`
  5. `bf645f8 docs(sim): fidelity + limits section`

### b) File Existence Checks
- `/FEEDBACK.md`: **Does NOT exist** at repository root.
- `/arkiv/`: **Does NOT exist** at repository root (only `lib/arkiv/` exists).

### c) Arkiv Client Endpoint & Fallback Grep (`lib/arkiv/client.ts`)
- `lib/arkiv/client.ts:16`: `* Connects to Arkiv DB-Chain endpoints with fallback to local state for deterministic testing.`
- `lib/arkiv/client.ts:23`: `// Local fallback storage for offline operation and deterministic testing`
- `lib/arkiv/client.ts:24`: `private memoryReceipts: Map<string, ExtractionReceipt> = new Map();`
- `lib/arkiv/client.ts:29`: `this.rpcUrl = config.rpcUrl || process.env.ARKIV_RPC_URL || "https://rpc.arkiv.network";` (stale testnet endpoint)
- `lib/arkiv/client.ts:59`: `this.memoryReceipts.set(hash.toLowerCase(), receipt);`
- `lib/arkiv/client.ts:83`: `for (const receipt of this.memoryReceipts.values()) {`
- `lib/arkiv/client.ts:96`: `const found = this.memoryReceipts.get(normalized);`

### d) Environment Variables Grep (`.env.example`)
- Root `.env.example` does not exist. (A `.env` exists in `contracts/lib/v4-core/.env`). Root `.env.example` must be created with `ARKIV_*` variables.

### e) Frontend Environment Consumption
- `apps/web/src/config/chains.ts`: uses `NEXT_PUBLIC_ARC_RPC_URL` (fallback `https://rpc.testnet.arc.network`).
- `apps/web/src/config/wagmi.ts`: uses `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.
- `apps/web/src/app/demo/page.tsx`: currently hardcodes `ARC_USDC_ADDRESS` and `REBATE_VAULT_ADDRESS` (`0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD`).

### f) Partner Feedback Section (`specs/submission/partner-feedback.md`)
- Uniswap section is verified at ~224 words, detailing `DarkTraceHook.sol` CREATE2 salt `0x139d`, `0x00C0` flag bitmask, `beforeSwap`, `afterSwap`, and transient storage.

### g) Total Tracked Files
- `git ls-files | wc -l`: **178 files**.

---

## Baseline Assessment & 3 P0 Gaps

- **Baseline:** Commit `0323057`, 39 commits, clean tree, deployed contracts on Base Sepolia and Arc Testnet.
- **Three P0 Gaps:**
  1. **Uniswap Qualifying Requirement:** Missing `/FEEDBACK.md` at repository root for the Uniswap Developer Feedback Form submission.
  2. **Arkiv Qualifying Requirement:** `lib/arkiv/client.ts` points to stale `rpc.arkiv.network` with silent fallback to `memoryReceipts`, rather than live `rabdi` testnet (`rpc.rabdi.db-chain.testnet.arkiv.network`, chain 7794095) with fail-loud semantics; missing the five required root files in `/arkiv/`.
  3. **Arc Studio Qualifying Requirement:** Missing Arc Studio prompt, checklist, and report package in `/arc-studio/` to satisfy the Arc Studio prize criteria.

