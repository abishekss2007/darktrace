# How DarkTrace Uses Arkiv

**Protocol:** DarkTrace  
**Namespace:** `darktrace.v1`  
**Network:** Arkiv Rabdi Testnet (Chain ID `7794095`)  

---

## 1. Query Filters & Access Patterns

DarkTrace schemas are structured to support specific operational access patterns:
- `where(eq("poolId", poolId))`: Fetches all sandwich extraction receipts recorded for a specific Uniswap v4 pool.
- `where(eq("searcher", searcherAddress))`: Aggregates an attacker's cross-pool extraction history to generate reputation scores and bond status.
- `where(eq("victim", victimAddress))` or `where(eq("lp", lpAddress))`: Retrieves compensable MEV loss receipts for an affected user.
- `where(eq("receiptHash", receiptHash))`: Resolves single-receipt lookups matching on-chain `SimulationRegistry` attestations.

---

## 2. Permissions, Ownership & Expiration

- **Entity Permissions:** Only the authorized DarkTrace indexer worker wallet (`0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5`) holds the access key to create or patch entities under `darktrace.v1`.
- **Entity Expiration:** All entities are created with a 30-day lifetime (`ExpirationTime.fromDays(30)`).
  - *Rationale:* Forensic sandwich receipts have an active 30-day restitution claim period. After 30 days, historical claim settlement is permanently governed by the canonical `bytes32 receiptHash` recorded in `SimulationRegistry.sol` on Arc Testnet, preventing long-term state bloat on Arkiv.

---

## 3. Which User-Facing Features Depend on Arkiv Reads?

The DarkTrace web application ([`apps/web`](../apps/web)) relies directly on Arkiv for the following views:
1. **Searcher Dossier (`/searcher/[address]`):**  
   The extraction history and reputation table on [`apps/web/src/app/searcher/[address]/page.tsx`](../apps/web/src/app/searcher/[address]/page.tsx) is rendered entirely from `darktrace.v1` Arkiv queries—not from a local database or cached API.
2. **Forensic Receipt Explorer (`/receipt/[hash]`):**  
   The "Arkiv Proof Record" panel on [`apps/web/src/app/receipt/[hash]/page.tsx`](../apps/web/src/app/receipt/[hash]/page.tsx) reads the full entity from Arkiv by its canonical `receiptHash`. If the entity cannot be fetched, the UI renders an explicit error indicator rather than falling back to unverified synthetic data.
3. **LP Claim Ledger (`/lp/[address]`):**  
   Historical claims and compensable losses are aggregated from Arkiv query results.

---

## 4. What DarkTrace Does NOT Read from Arkiv (Honest Architecture)

To maintain clarity and audit integrity, the following components do **not** originate from Arkiv:
- **On-Chain Transaction Hashes & Gas Metrics:** Direct transaction receipts and block confirmations are queried directly from Base Sepolia and Arc Testnet RPCs.
- **Counterfactual Simulation Engine:** CPMM formula execution and slippage decomposition are computed locally by our off-chain simulator ([`lib/simulator/counterfactual.ts`](../lib/simulator/counterfactual.ts)); Arkiv serves as the verifiable storage layer for the resulting receipts.

