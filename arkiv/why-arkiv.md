# Why Arkiv — Architecture & Value Proposition

**Project:** DarkTrace (MEV Forensics for Uniswap v4 LPs)  
**Namespace:** `darktrace.v1`  

---

## 1. Why Arkiv Over a Traditional PostgreSQL Database?

If we replaced Arkiv with a standard PostgreSQL database, DarkTrace would inherit critical centralization failure modes:
1. **Loss of Verifiability:** Liquidity providers and searchers would have to trust our centralized backend server when calculating extracted amounts and bond decrements. With Arkiv, entity records are written directly to a decentralized DB-chain with cryptographic ownership (`$owner`), immutable timestamps, and public queryability.
2. **Censorship Vulnerability:** A centralized API operator could omit specific sandwich attacks, redact searcher addresses, or manipulate historical loss figures. On Arkiv, once an `ExtractionReceipt` is published by the indexer, it cannot be altered or selectively hidden.
3. **Independent Third-Party Verification:** Any external DeFi protocol, DAO, or router can independently verify a searcher's reputation profile or an LP's loss proof without pinging DarkTrace's private infrastructure.

---

## 2. What Arkiv Enables Beyond Raw Base Sepolia Logs

Raw on-chain logs on Base Sepolia record that swaps occurred, but extracting actionable forensic evidence from them is prohibitively complex:
- **No Native Cross-Entity Indexing:** Ethereum event logs are keyed per contract. Querying *"all sandwich extractions executed by searcher X across 50 different Uniswap v4 pools over the last 30 days"* requires downloading gigabytes of receipt logs and running a custom indexer.
- **Arkiv Just Works:** Arkiv provides typed attribute indexing (`poolId`, `searcher`, `victim`, `blockNumber`). Frontend clients and analytical dashboards can execute direct filtered queries (`client.select().where(eq("searcher", ...)).fetch()`) across multiple pools and time windows without maintaining bespoke subgraphs.

---

## 3. Deliberate Storage Trade-Off: What We Kept OFF Arkiv

To maintain cost efficiency and fast query performance on the DB-chain, we made a deliberate architectural choice regarding what is stored versus what is kept off-chain:
- **Off Arkiv:** Full EVM trace calldata, opcode execution dumps, and raw simulation arithmetic steps (which can reach several megabytes per block).
- **On Arkiv:** We condense the simulation proof into a 32-byte cryptographic digest (`simulationHash`), and store only the summary forensic outputs: `extractedUSDC`, `injectedSlippageBps`, `legitSlippageBps`, and the 3-transaction sandwich hash tuple (`txHashes`).

This keeps entity payloads lightweight (well below Arkiv's 128-byte string and 128 KiB bytes limits) while maintaining 100% mathematical verifiability.

