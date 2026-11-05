# Stage 7 — Partner Feedback Paragraphs Specification

**Stage**: 7 (Fix Medium M3)  
**Deliverable**: `/specs/submission/partner-feedback.md`  
**Constraint Check**: 3 first-person engineering feedback paragraphs (200–250 words each), citing concrete codebase lines, real friction points, and actionable feature requests.

---

## 1. Word Count & Coverage Verification

| Section | Partner | Word Count | Codebase Friction Cited | Actionable Feature Request |
| :--- | :--- | :--- | :--- | :--- |
| **7.1** | **Uniswap Foundation** | **224 words** | EIP-1153 `tstore` clears at transaction boundaries (`DarkTraceHook.sol:29–36, 257–301`), requiring bit-packed `PoolTransientState` (`stateA`, `stateB`) with `tload` -> `sload` fallback and separate `frontrunTickDelta` preservation across 3-tx sandwiches. | Optional `afterBlock` checkpoint callback on `PoolManager` or canonical v4 block-scoped transient checkpoint pattern. |
| **7.2** | **Arc** | **230 words** | Dual-interface distinction at deploy time (`DeployArcTestnet.s.sol`) between 18-decimal EVM gas-wei estimation (`-32003` insufficient funds at `43.5 gwei`) and 6-decimal `IERC20(0x3600...)` USDC units in `RebateVault.sol`. | Canonical *"Gas-Token vs. `0x3600...` ERC-20 Interface"* doc snippet and typed viem/Foundry helper. |
| **7.3** | **Arkiv** | **212 words** | Keeping off-chain entity IDs (`lib/arkiv/client.ts:42`) identical to on-chain `bytes32 receiptHash` in `SimulationRegistry.sol` via canonical JSON key ordering and lowercase normalization (`lib/arkiv/schemas.ts:38–56`), plus building in-memory mock fixtures (`memoryReceipts`) for `arkiv_putEntity`/`arkiv_queryEntities`. | Typed `@arkiv/sdk` helper with canonical JSON/EIP-712 hashing and multi-index query examples (`searcher` across `poolId`s). |

