# DarkTrace — Uniswap Foundation Feedback

Submitted to the Uniswap Hackathon Feedback Form on [DATE — I will fill in].

## How we used the Uniswap stack

In [`contracts/src/DarkTraceHook.sol`](./contracts/src/DarkTraceHook.sol), I implemented `IHooks` with `beforeSwap` and `afterSwap` permissions and mined a CREATE2 salt (`0x139d` via Foundry's canonical `CREATE2_DEPLOYER` `0x4e59b44847b379578588920cA78FbF26c0B4956C`) so the deployed hook address (`0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0`) satisfies the `0x00C0` flag bitmask. Inside `beforeSwap`, the hook reads `poolManager.getSlot0(poolId)` and records the pre-swap tick into Cancun transient storage (`tstore` at slot `keccak256(abi.encode(poolId, "darktrace.tstore.pretick"))`), while `afterSwap` computes the realized `tickDelta` without mutating swap deltas or blocking order flow. Because `afterSwap` executes after a single swap and cannot see future swaps in the block, our hook is strictly an attribution engine (`ExtractionDetected`), not a pre-trade prevention filter. The hardest engineering friction in `DarkTraceHook.sol` (`lines 29–36` and `257–301`) was that EIP-1153 transient storage clears at the end of each transaction, whereas a sandwich attack spans three separate transactions (searcher frontrun, victim swap, searcher backrun) within the same block. Relying on `tstore` alone works for multi-swap router batching within one transaction, but cross-transaction intra-block detection required bit-packing `PoolTransientState` (`lastBlock`, `lastDirection`, `lastTickDelta`, `frontrunTickDelta`, `lastSender`, `victimCandidate`) across two 256-bit slots (`stateA`, `stateB`) with a `tload`-to-`sload` fallback (`if iszero(valA) { valA := sload(slotA) }`), plus storing `frontrunTickDelta` separately so the victim swap did not overwrite the searcher's initial push delta. **Feature request**: I would love an optional `afterBlock` checkpoint callback on `PoolManager`—or a canonical v4 transient-checkpoint pattern for block-scoped state—so multi-transaction intra-block MEV hooks do not need `sstore` fallbacks across transaction boundaries.

## Repo pointers
- Hook: `contracts/src/DarkTraceHook.sol`
  - `beforeSwap`: lines 103-120
  - `afterSwap`: lines 125-205
  - transient storage slots: lines 245-301
- Tests: `contracts/test/DarkTraceHook.t.sol` (sandwich detection cases)
- Bond registry: `contracts/src/SearcherRegistry.sol`
- Deployed hook (Base Sepolia): `0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0`

## Feature requests
1. A `TransientRingBuffer` library in v4-periphery for intra-block swap lookback, so hook authors do not re-implement the tstore circular pattern.
2. A `HookMiner` Foundry precompile / cheat-code so hooks can be tested locally with mined addresses without an off-chain salt search.

## Not covered here
Economic and settlement design on Arc and the forensic proof ledger on Arkiv are documented in [`specs/submission/partner-feedback.md`](./specs/submission/partner-feedback.md) and `/arkiv/*.md`.

