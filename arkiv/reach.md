# Arkiv Reach & User Audiences — DarkTrace

**Namespace:** `darktrace.v1`  
**Network:** Arkiv Rabdi Testnet (Chain ID `7794095`)  

---

## 1. Who Uses DarkTrace's Arkiv Data Today?

### 1.1 Affected Liquidity Providers & Victims
Uniswap v4 liquidity providers and swappers interact with DarkTrace through the Receipt Explorer ([`apps/web/src/app/receipt/[hash]/page.tsx`](../apps/web/src/app/receipt/[hash]/page.tsx)) and LP restitution dashboard ([`apps/web/src/app/lp/[address]/page.tsx`](../apps/web/src/app/lp/[address]/page.tsx)). When an LP connects their wallet, the app queries Arkiv by `where(eq("victim", lpAddress))` or `where(eq("lp", lpAddress))` to present their historical MEV loss ledger and generate verifiable claims against Arc's `RebateVault`. Without Arkiv, an LP would have to parse thousands of raw Base Sepolia execution receipts or trust a closed-source off-chain database.

### 1.2 MEV Researchers & Protocol Risk Analysts
Researchers investigating toxic order flow query Arkiv by `where(eq("searcher", searcherAddress))` via the Searcher Dossier ([`apps/web/src/app/searcher/[address]/page.tsx`](../apps/web/src/app/searcher/[address]/page.tsx)). Because Arkiv stores the three-transaction sandwich footprint alongside decomposed legitimate vs. injected slippage basis points, analysts can audit searcher extraction behavior across pools and time without downloading raw node archives.

### 1.3 Pool Deployers & Hook Operators
Uniswap v4 pool creators use Arkiv telemetry to monitor sandwich frequency and realized LVR on their pools by querying `where(eq("poolId", poolId))`. This provides empirical data on whether a pool needs higher swap fees, tighter hook thresholds, or searcher bond requirements.

---

## 2. Post-Mumbai Expansion Plan

Following the hackathon, we have a concrete engineering roadmap to expand DarkTrace's Arkiv data ecosystem:
1. **Open-Source Uniswap v4 Subgraph Adapter:** Release an open-source indexer worker that automatically ingests Uniswap v4 `Swap` and `DarkTraceHook` events on Base mainnet and commits `ExtractionReceipt` entities to Arkiv.
2. **Monthly Indexer Rehydration Service:** Deploy a scheduled reconciliation worker that scans Base event logs and rehydrates any missing or unindexed receipts into Arkiv to guarantee complete coverage.
3. **Multi-DEX Schema Support:** Generalize the `ExtractionReceipt` schema to support other AMMs (e.g. Uniswap v3 and Curve pools) using the same queryable attribute conventions.

