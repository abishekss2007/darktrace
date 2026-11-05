# Stage 0 — Read-Only Hardening Audit

**Audit Timestamp**: 2026-11-06  
**Branch**: `main` (`HEAD` at `ec73cd7`)  
**Status**: Read-only diagnostic pass complete. Zero code, contract, or existing spec files modified.

---

## Diagnostic Results (`a` – `j`)

### a) Total Commits (`git log --oneline | wc -l`)
- **Total Commits**: `22`
- **Note**: Because `22 < 25`, per Stage 4.1 rules we will NOT rebase, amend, or split past commits; instead we will break Stages 1–8 into small, atomic conventional commits (bringing the total well above 35+ commits) and add `RESTRUCTURE_NOTES.md` at the repo root explaining the initial Stage 1 monorepo/Foundry/Next.js scaffold commit (`77074c6`).

---

### b) Last 50 Commits with Dates (`git log -n 50 --pretty=format:"%h %ad %s" --date=iso`)
```text
ec73cd7 2026-11-06 00:55:13 +0530 fix(vercel): make indexer container self-contained for vercel build context
fa0a528 2026-11-06 00:46:00 +0530 feat(vercel): multi-service deployment configuration and internal bindings
1e01c48 2026-11-05 23:49:23 +0530 chore(deploy): record verified Arc Testnet contract addresses and funding
f10f121 2026-11-05 23:33:16 +0530 chore(deploy): record verified Base Sepolia contract addresses
1de0871 2026-11-05 23:20:54 +0530 fix(hook): persist cross-tx intra-block footprint state across call boundaries
36a7d80 2026-11-05 23:09:42 +0530 chore: format trailing newlines
df9efbc 2026-11-05 23:06:42 +0530 docs: readme + demo script + deployment addresses
dcd5bd6 2026-11-05 22:57:39 +0530 feat(web): end-to-end demo flow
02d2cc7 2026-11-05 22:54:15 +0530 feat(web): searcher, lp, and demo terminal views
3d63fc4 2026-11-05 22:53:56 +0530 feat(web): pool and receipt forensic views
b068f72 2026-11-05 22:53:41 +0530 feat(web): ui primitives and dashboard view
a3e5212 2026-11-05 22:47:28 +0530 feat(indexer): extraction -> simulation -> arkiv pipeline
6c1ded5 2026-11-05 22:47:15 +0530 feat(indexer): pipeline core and watcher service
5f23b6e 2026-11-05 22:42:11 +0530 fix(arc): restore proofBundle parameter in NatSpec definition
47e3aea 2026-11-05 22:41:02 +0530 test(arc): rebate claim integrity
ccbfada 2026-11-05 22:40:45 +0530 feat(arc): rebatevault + simulationregistry
6148239 2026-11-05 22:40:17 +0530 feat(sim): counterfactual LVR computation
594a740 2026-11-05 22:34:12 +0530 feat(arkiv): adapter + schemas + round-trip test
21af7e4 2026-11-05 22:33:57 +0530 feat(arkiv): schemas and storage specification
a7b1430 2026-11-05 22:25:48 +0530 test(hook): sandwich detection unit tests
8392e1b 2026-11-05 22:25:33 +0530 feat(hook): darktracehook with transient-storage swap footprint
77074c6 2026-11-05 22:12:53 +0530 chore: scaffold monorepo, foundry, next.js, rainbowkit
```

---

### c) Commit Diff Sizes (`git log --shortstat --oneline`)
```text
ec73cd7 fix(vercel): make indexer container self-contained for vercel build context
 14 files changed, 23053 insertions(+), 14 deletions(-)
fa0a528 feat(vercel): multi-service deployment configuration and internal bindings
 3 files changed, 77 insertions(+), 1 deletion(-)
1e01c48 chore(deploy): record verified Arc Testnet contract addresses and funding
 2 files changed, 5 insertions(+), 5 deletions(-)
f10f121 chore(deploy): record verified Base Sepolia contract addresses
 4 files changed, 10 insertions(+), 11 deletions(-)
1de0871 fix(hook): persist cross-tx intra-block footprint state across call boundaries
 1 file changed, 17 insertions(+), 3 deletions(-)
36a7d80 chore: format trailing newlines
 3 files changed, 3 insertions(+)
df9efbc docs: readme + demo script + deployment addresses
 6 files changed, 372 insertions(+), 16 deletions(-)
dcd5bd6 feat(web): end-to-end demo flow
 1 file changed, 160 insertions(+), 73 deletions(-)
02d2cc7 feat(web): searcher, lp, and demo terminal views
 4 files changed, 589 insertions(+), 20 deletions(-)
3d63fc4 feat(web): pool and receipt forensic views
 2 files changed, 365 insertions(+)
b068f72 feat(web): ui primitives and dashboard view
 5 files changed, 424 insertions(+), 10 deletions(-)
a3e5212 feat(indexer): extraction -> simulation -> arkiv pipeline
 3 files changed, 72 insertions(+)
6c1ded5 feat(indexer): pipeline core and watcher service
 6 files changed, 433 insertions(+)
5f23b6e fix(arc): restore proofBundle parameter in NatSpec definition
 1 file changed, 4 insertions(+), 1 deletion(-)
47e3aea test(arc): rebate claim integrity
 2 files changed, 93 insertions(+)
ccbfada feat(arc): rebatevault + simulationregistry
 3 files changed, 250 insertions(+)
6148239 feat(sim): counterfactual LVR computation
 8 files changed, 347 insertions(+)
594a740 feat(arkiv): adapter + schemas + round-trip test
 3 files changed, 256 insertions(+)
21af7e4 feat(arkiv): schemas and storage specification
 7 files changed, 480 insertions(+), 4 deletions(-)
a7b1430 test(hook): sandwich detection unit tests
 6 files changed, 279 insertions(+), 57 deletions(-)
8392e1b feat(hook): darktracehook with transient-storage swap footprint
 8 files changed, 527 insertions(+), 2 deletions(-)
77074c6 chore: scaffold monorepo, foundry, next.js, rainbowkit
 107 files changed, 38257 insertions(+)
```

---

### d) Hardcoded Numbers in `/apps/web`
1. **Direct grep matches (`2,450|2,624|148,920|112,450|482`)**:
   - `apps/web/src/app/page.tsx:39`: `482` (Detected Extractions)
   - `apps/web/src/app/page.tsx:44`: `$148,920.40` (Total Value Extracted)
   - `apps/web/src/app/page.tsx:49`: `$112,450.00` (USDC Rebates Settled)
   - `apps/web/src/app/demo/page.tsx:77`: `const [lpBalance, setLpBalance] = useState(2450.0);` (renders `$2,450.00`, ticking up to `$2,624.80` after a `$174.80` claim)
2. **Additional hardcoded dollar / extraction figures across `/apps/web`**:
   - `apps/web/src/app/page.tsx:15`: `"LPs are losing $1.2B to MEV."`
   - `apps/web/src/app/page.tsx:54`: `100.0%` (Arkiv Sealed Proofs)
   - `apps/web/src/app/demo/page.tsx:43,46`: `extractedUSDC: "142.50"`, `lpLvrDelta: "-$138.90"` (`INITIAL_FEED[0]`)
   - `apps/web/src/app/demo/page.tsx:59,62`: `extractedUSDC: "310.20"`, `lpLvrDelta: "-$295.40"` (`INITIAL_FEED[1]`)
   - `apps/web/src/app/demo/page.tsx:93,115,118`: `const targetLoss = 174.8;`, `extractedUSDC: targetLoss.toFixed(2)`, `lpLvrDelta: "-$169.50"`
   - `apps/web/src/data/mockData.ts:38-40`: WETH/USDC pool (`tvl: "$14,290,400"`, `volume24h: "$3,812,090"`, `extracted24h: "$1,842.50"`)
   - `apps/web/src/data/mockData.ts:49-51`: cbBTC/USDC pool (`tvl: "$8,910,200"`, `volume24h: "$1,450,200"`, `extracted24h: "$890.10"`)
   - `apps/web/src/data/mockData.ts:60-62`: WETH/DEGEN pool (`tvl: "$2,100,500"`, `volume24h: "$680,120"`, `extracted24h: "$0.00"`)
   - `apps/web/src/data/mockData.ts:79,82`: Receipt 1 (`extractedUSDC: "142.50"`, `lpLvrDelta: "-$138.90"`)
   - `apps/web/src/data/mockData.ts:101,104`: Receipt 2 (`extractedUSDC: "310.20"`, `lpLvrDelta: "-$295.40"`)
   - `apps/web/src/data/mockData.ts:123,126`: Receipt 3 (`extractedUSDC: "890.10"`, `lpLvrDelta: "-$860.00"`)
   - `apps/web/src/app/receipt/[hash]/page.tsx:24,27`: Fallback receipt (`extractedUSDC: "142.50"`, `lpLvrDelta: "-$138.90"`)
   - `apps/web/src/app/pool/[id]/page.tsx:19-21`: Fallback pool (`tvl: "$4,200,000"`, `volume24h: "$890,000"`, `extracted24h: "$0.00"`)
   - `apps/web/src/app/searcher/[address]/page.tsx:67,71`: Collateral Bond `$10,000.00 USDC`, Slashed by Protocol `$5,000.00 USDC`

---

### e) Claims About Forking or Replay in `/lib/simulator` and `/apps/indexer`
```text
apps/indexer/src/pipeline.ts:147:      this.log("INFO", "SIMULATED", "Counterfactual simulation replayed against pool snapshot", {
lib/simulator/counterfactual.ts:35: * Replays victim execution without frontrun distortion and computes exact injected slippage.
```
- **Additional UI reference**: `apps/web/src/app/receipt/[hash]/page.tsx:141` labels the hash `"Simulation Hash (viem replay):"` and `apps/web/src/app/page.tsx:74` states `"Replays counterfactual execution and issues USDC restitution."`
- **Actual implementation in `lib/simulator/counterfactual.ts`**: Computes the counterfactual price deterministically via the constant-product (`x * y = k`) pricing formula against `reserveInBefore` and `reserveOutBefore` passed in the event payload (with an optional `publicClient.getBlockNumber()` liveness ping when `demoFast` is false). It does **not** fork historical state via an archive RPC node.

---

### f) Claims About Cross-Chain Slashing (`slash|slashed|bridge|relay` in `/specs` and `/contracts/src`)
```text
contracts/src/SearcherRegistry.sol:6: * @notice Manages voluntary MEV searcher collateral bonds and governance slashing.
contracts/src/SearcherRegistry.sol:7: * @dev Slashed searcher bonds are routed directly to the RebateVault to compensate LPs.
contracts/src/SearcherRegistry.sol:13:    mapping(address => uint256) public totalSlashed;
contracts/src/SearcherRegistry.sol:17:    event BondSlashed(address indexed searcher, address indexed recipient, uint256 amount);
contracts/src/SearcherRegistry.sol:44:     * @notice Searcher withdraws un-slashed bond.
contracts/src/SearcherRegistry.sol:57:     * @notice Governance/admin slashes a toxic searcher's bond and forwards it to the Rebate Vault.
contracts/src/SearcherRegistry.sol:60:     * @param amount Slashed bond amount.
contracts/src/SearcherRegistry.sol:62:    function slashBond(address searcher, address recipient, uint256 amount) external onlyOwner {
contracts/src/SearcherRegistry.sol:67:        totalSlashed[searcher] += amount;
contracts/src/SearcherRegistry.sol:72:        emit BondSlashed(searcher, recipient, amount);
specs/00-plan.md:29:│ • SearcherRegistry (bonds)     │     │ • Searcher bond slashing       │     │ • Queryable forensic ledger    │
specs/00-plan.md:37:4. **NO Imaginary Sequencer Slashing**: Slashing applies strictly to registered searcher bonds committed to `SearcherRegistry`.
specs/00-plan.md:63:- Implement `SearcherRegistry.sol` for bond staking and governance slashing.
specs/01-architecture.md:5:DarkTrace bridges three autonomous systems to detect, prove, and settle MEV extraction restitution for Uniswap v4 Liquidity Providers.
specs/01-architecture.md:113:       slashedUSDC: string;
specs/01-architecture.md:139:4. **No Phantom Sequencer Slashing**:
specs/01-architecture.md:140:   - DarkTrace slashes bonded searchers who have committed stake to `SearcherRegistry.sol`. It does not claim to slash L2 sequencers or protocol validators.
specs/02-hook-design.md:96:- Provides `slashBond(address searcher, address recipient, uint256 amount)` callable strictly by governance/admin key.
specs/02-hook-design.md:97:- Slashed bond capital directly replenishes the `RebateVault` on Arc or local vault balance.
specs/04-arkiv-schema.md:44:Tracks cumulative extraction statistics, active bonds, and slashing records to construct an on-chain reputation score.
specs/04-arkiv-schema.md:52:  slashedUSDC: string;         // Cumulative slashed collateral sent to RebateVault
specs/06-demo-script.md:51:### [2:05 – 2:45] USDC Restitution Claim on Arc & Slashing
specs/06-demo-script.md:56:* **Visual**: Click through to `/searcher/0x1111...` showing searcher bonded collateral reduced and slashed by `$174.80`.
specs/06-demo-script.md:58:  > *"Now, the restitution. On Arc, Circle's USDC-native Layer-1, `SimulationRegistry.sol` verifies the simulation hash, and `RebateVault.sol` releases USDC directly to the LP. Watch the balance tick up in real time: $174.80 returned. Meanwhile, the searcher's registered bond in `SearcherRegistry` is slashed, replenishing the vault."*
```

---

### g) Environment Variables & RPC Configuration (`.env.example` / `docker-compose.yml` / codebase)
No `.env.example` file exists at the repository root. Environment variables are configured via `docker-compose.yml` and `process.env` references (all key values redacted):
- `BASE_SEPOLIA_RPC` (default: `https://sepolia.base.org`) — `docker-compose.yml`, `apps/indexer/src/watcher.ts`
- `HOOK_ADDRESS` (default fallback in code: `0x00000000000000000000000000000000000000C0`; live deployed: `0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0`) — `docker-compose.yml`, `apps/indexer/src/index.ts`
- `ARC_RPC_URL` (default: `https://rpc.testnet.arc.network`) — `docker-compose.yml`, `apps/indexer/src/index.ts`, `apps/indexer/src/pipeline.ts`
- `ARC_PRIVATE_KEY` (`<REDACTED>`) — `apps/indexer/src/pipeline.ts`
- `SIMULATION_REGISTRY_ADDRESS` (live deployed: `0xb8416cb4d82BA72b70C3EC55d7AC66b5DB415CF8`) — `docker-compose.yml`, `apps/indexer/src/pipeline.ts`
- `ARKIV_RPC_URL` (default: `https://rpc.arkiv.network`) — `docker-compose.yml`, `lib/arkiv/client.ts`
- `ARKIV_API_KEY` (`<REDACTED>`) — `lib/arkiv/client.ts`
- `DEMO_FAST` (`1` or `0`) — `docker-compose.yml`, `apps/indexer/src/index.ts`, `apps/indexer/src/pipeline.ts`
- `PORT` (default: `8080`) — `apps/indexer/src/index.ts`
- `INDEXER_URL` (Vercel service binding) — `apps/web/src/app/api/status/route.ts`, `vercel.json`
- `NEXT_PUBLIC_ARC_RPC_URL` (default: `https://rpc.testnet.arc.network`) — `apps/web/src/config/chains.ts`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (`<REDACTED_DEFAULT_ID>`) — `apps/web/src/config/wagmi.ts`

---

### h) Verbatim Content of `/AI_ATTRIBUTION.md`
See verbatim quote in the Stage 0 report output. Currently contains a 47-row table (`specs/00-plan.md` through `README.md`), missing recent files added during deployment (`vercel.json`, `apps/web/src/app/api/status/route.ts`, `apps/indexer/dist/*`, and several `apps/web` config/layout files).

---

### i) Current On-Chain USDC Balance at `RebateVault` on Arc Testnet
- **Query**: `cast call 0x3600000000000000000000000000000000000000 "balanceOf(address)(uint256)" 0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD --rpc-url https://rpc.testnet.arc.network`
- **Raw Result**: `5000000 [5e6]`
- **Exact Balance**: **5.000000 USDC** (6 decimals)

---

### j) Current Count of `ExtractionReceipt` Records in Arkiv under `darktrace.v1`
- **Exact Count**: **`0` persisted remote records** (`3` static mock receipts in `apps/web/src/data/mockData.ts`; `2` initial feed items in `apps/web/src/app/demo/page.tsx`).
- **Reason**: In `lib/arkiv/client.ts` (lines 44–59 and 76–80), the remote JSON-RPC calls (`arkiv_putEntity` / `arkiv_queryEntities` against `https://rpc.arkiv.network`) are commented out behind `// TODO: confirm SDK method names against Arkiv docs` and the adapter stores records in an in-memory `Map<string, ExtractionReceipt>` (`this.memoryReceipts`) which starts at `0` on process boot.

---

## Prioritized Remediation Order

### The 4 Blockers
1. **Blocker 1 — Vault / Numbers Consistency (Stage 1)**: Live `RebateVault` on Arc Testnet holds `5.00 USDC`, whereas `/demo` claims a `$174.80` rebate (`$2,450.00 -> $2,624.80`), `mockData.ts` lists `$142.50 / $310.20 / $890.10` receipts, and `/` claims `$112,450.00` settled.
2. **Blocker 2 — Cross-Chain Slashing Honesty (Stage 2)**: `SearcherRegistry.sol` comments, `/specs/00-plan.md`, `/specs/02-hook-design.md`, `/specs/04-arkiv-schema.md`, `/specs/06-demo-script.md`, and `/demo` imply that slashing a searcher's bond on Base Sepolia replenishes `RebateVault` on Arc Testnet.
3. **Blocker 3 — Testnet & Demo Data Labeling (Stage 3)**: Header lacks an always-visible `BASE SEPOLIA · ARC TESTNET` badge when disconnected, and seeded numbers across `/`, `/dashboard`, `/pool/[id]`, `/receipt/[hash]`, `/lp/[address]`, and `/searcher/[address]` lack inline `[DEMO]` badges and live Arkiv aggregation (`/api/stats`).
4. **Blocker 4 — Commit History & AI Attribution (Stage 4)**: Repo currently has `22` commits (including initial scaffold commit `77074c6`), `/AI_ATTRIBUTION.md` does not yet cover every file in `git ls-files` with line-level human notes, and `/specs/README.md` is missing.

### The 3 Mediums
1. **Medium M1 — Simulator Honesty (Stage 5)**: Comments in `lib/simulator/counterfactual.ts`, `apps/indexer/src/pipeline.ts`, and UI copy use the word `"replay"`, whereas `computeCounterfactual` applies the constant-product (`x * y = k`) formula to pre-attack reserves from the event payload without an archive-node fork.
2. **Medium M2 — Citation for the "$1.2B" Claim (Stage 6)**: `README.md`, `specs/00-plan.md`, `specs/06-demo-script.md`, and `apps/web/src/app/page.tsx` state an uncited `"$1.2B"` figure instead of a conservative floor (`"$1B+ annually"` / `"over $1 billion annually by conservative estimates"`) with a methodology footnote.
3. **Medium M3 — Partner Feedback Paragraphs (Stage 7)**: Submission requires three honest, 200–250 word first-person engineering feedback paragraphs (Uniswap Foundation, Arc, Arkiv) grounded in actual codebase friction points in `/specs/submission/partner-feedback.md`, followed by Stage 8 Q&A prep, pre-record checklist, booth strategy, and `FINAL-CHECKLIST.md`.

### Recommended Execution Order
Execute strictly sequentially: **Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5 → Stage 6 → Stage 7 → Stage 8**, committing in small, atomic conventional commits at each stage gate so commit count naturally exceeds 30+ while preserving git history intact.

