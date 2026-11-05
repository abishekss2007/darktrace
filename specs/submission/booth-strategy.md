# DarkTrace — Partner Booth Strategy (Uniswap → Arc → Arkiv)

Visit the three partner booths in this exact sequence: **1. Uniswap Foundation → 2. Arc → 3. Arkiv**. Before starting each conversation, set the browser URL bar on your laptop to the designated live page.

---

## 1. Uniswap Foundation Booth

- **Pre-Load URL Bar Before Approaching**:
  `https://darktrace-lovat.vercel.app/receipt/0x9c8d1f2b3e4a5061728394a5b6c7d8e9f01234567890abcdef1234567890abcd`
  *(Also keep [`contracts/src/DarkTraceHook.sol`](../../contracts/src/DarkTraceHook.sol) open at lines `125–205` in a second tab).*
- **30-Second Pitch**:
  *"We built DarkTrace (`0xBCC9…80c0` on Base Sepolia, mined for `0x00C0` flags). Instead of adding latency or reverting swaps in `beforeSwap`, our hook uses `tstore` to measure intra-block tick inversions across 3-tx sandwiches and emits `ExtractionDetected` for post-block LP restitution."*
- **Specific Question to Ask at the Booth**:
  > *"Because EIP-1153 `tstore` clears at the end of each transaction, a 3-transaction sandwich (frontrun Tx A, victim Tx B, backrun Tx C) forced us to mirror our bit-packed `PoolTransientState` across `tstore` and `sstore` slots (`stateA`, `stateB`). Is the Foundation exploring block-scoped checkpoints on `PoolManager` or an `afterBlock` callback pattern for multi-tx MEV hooks?"*
- **Specific Feedback Snippet to Deliver**:
  > *"In `DarkTraceHook.sol` (`lines 257–301`), we had to store `frontrunTickDelta` separately from `lastTickDelta` and fall back from `tload` to `sload` across separate transactions in the same block. A canonical v4 transient-checkpoint pattern in the hook docs would save every MEV hook developer hours."*

---

## 2. Arc Booth

- **Pre-Load URL Bar Before Approaching**:
  `https://darktrace-lovat.vercel.app/demo`
  *(Point to `VAULT RESERVE (ARC): $5.00 USDC` read live from `0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD` on Arc Testnet).*
- **30-Second Pitch**:
  *"We deployed `SimulationRegistry` (`0xb841…5CF8`) and `RebateVault` (`0x2ab7…28CD`, pre-funded with `5.00 USDC`) on Arc Testnet. When our off-chain constant-product counterfactual engine proves injected sandwich slippage, affected LPs claim `$1.25 USDC` rebates directly on Arc with sub-cent gas."*
- **Specific Question to Ask at the Booth**:
  > *"We kept Base Sepolia searcher bond reduction and Arc pre-funded vault payouts as two independent, asynchronous flows rather than faking a bridge. For production, what is the recommended Circle CCTP / Arc pattern for streaming slashed collateral from an L2 into an Arc `RebateVault`?"*
- **Specific Feedback Snippet to Deliver**:
  > *"When deploying `DeployArcTestnet.s.sol` via Foundry, we hit `-32003: insufficient funds for gas * price + value` because `forge script` estimates native gas in 18-decimal wei (`43.5 gwei`), whereas `IERC20(0x3600...).transfer()` inside `RebateVault.sol` uses 6-decimal USDC units. Adding a '18-decimal gas vs. 6-decimal `0x3600...` ERC-20' table to the Arc docs would immediately unblock Foundry developers."*

---

## 3. Arkiv Booth

- **Pre-Load URL Bar Before Approaching**:
  `https://darktrace-lovat.vercel.app/dashboard`
  *(Also keep [`https://darktrace-lovat.vercel.app/api/stats`](https://darktrace-lovat.vercel.app/api/stats) and [`lib/arkiv/schemas.ts`](../../lib/arkiv/schemas.ts) open in adjacent tabs).*
- **30-Second Pitch**:
  *"We use Arkiv (`darktrace.v1` namespace) as our queryable forensic proof ledger across three schemas: `ExtractionReceipt`, `SearcherProfile`, and `LPClaim`. While `RebateVault.sol` only checks a 32-byte `receiptHash` nullifier on-chain, Arkiv makes extraction history queryable by `poolId`, `searcher`, and `victim` without scanning Base Sepolia blocks."*
- **Specific Question to Ask at the Booth**:
  > *"In `lib/arkiv/schemas.ts`, we hash a deterministically ordered JSON payload (`computeReceiptHash`) so the Arkiv entity ID (`darktrace.v1:receipt:<hash>`) matches the `bytes32 receiptHash` attested on-chain in `SimulationRegistry.sol`. Does Arkiv plan to support native content-addressed entity IDs or EIP-712 digest indexing at the RPC layer?"*
- **Specific Feedback Snippet to Deliver**:
  > *"The trickiest part of `lib/arkiv/schemas.ts` (`line 51`) was enforcing deterministic key ordering and lowercase normalization (`txHashes.map(h => h.toLowerCase())`) so off-chain Arkiv queries and on-chain `keccak256` nullifiers never diverged—and building an in-memory fixture fallback in `lib/arkiv/client.ts` for offline CI tests. A typed `@arkiv/sdk` package with canonical hashing and local test fixtures would be a huge DX win."*

