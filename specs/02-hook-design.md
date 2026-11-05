# DarkTrace — Uniswap v4 Hook Design Specification

## 1. Scope & Objective

The `DarkTraceHook` is a Uniswap v4 hook deployed on Base Sepolia (`PoolManager`: `0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408`).
Its primary objective is **non-intrusive extraction fingerprinting**:
- Observes swaps before and after execution without modifying swap balance deltas or introducing arbitrary reverts.
- Uses Solidity 0.8.26 + Cancun transient storage (`tstore` / `tload`) for zero-storage-overhead intra-transaction/intra-block state tracking.
- Identifies sandwich attack footprints and LVR spikes.
- Emits structured `ExtractionDetected` events for off-chain indexing and Arc simulation.

---

## 2. Hook Permissions & Address Mining

In Uniswap v4, hook contract addresses encode their permissions in the leading address bits:
- `BEFORE_SWAP_FLAG`: `1 << 7`
- `AFTER_SWAP_FLAG`: `1 << 6`

Combined permission bitmask:
$$\text{REQUIRED\_FLAGS} = (1 \ll 7) \mid (1 \ll 6) = 0x00C0$$

Any valid `DarkTraceHook` deployment must use CREATE2 salt mining to ensure `address(hook) & ALL_HOOK_FLAGS_MASK == (BEFORE_SWAP_FLAG | AFTER_SWAP_FLAG)`.

---

## 3. Transient Storage Layout

Cancun transient storage opcodes (`tstore`, `tload`) provide cheap gas (~100 gas vs 20,000 for SSTORE) and automatically wipe at the end of transaction execution, eliminating reentrancy vulnerabilities.

```
Slot Offset Calculation:
SLOT_POOL_STATE   = keccak256("darktrace.hook.poolstate", poolId)
SLOT_LAST_SWAP    = keccak256("darktrace.hook.lastswap", poolId)
SLOT_TX_TRACKER   = keccak256("darktrace.hook.txtracker", poolId, tx.origin)
```

Stored values per swap:
- `lastTick` (int24): Pool tick before the swap executes.
- `lastZeroForOne` (bool): Direction of the swap.
- `lastAmountSpecified` (int256): Size of the preceding swap.
- `lastSender` (address): Originator of the preceding swap.
- `lastBlock` (uint64): Block number of the observed state.
- `swapSequenceCount` (uint32): Intra-block sequence counter.

---

## 4. Detection Heuristics & Defensive Guardrails

### The Sandwich Footprint
A sandwich attack consists of three sequential swaps within the same block:
1. **Frontrun ($S_A$)**: Searcher swaps $Token_0 \to Token_1$ ($zeroForOne = \text{true}$), moving the tick downward by $\Delta T_A$.
2. **Victim ($S_V$)**: User executes $Token_0 \to Token_1$ ($zeroForOne = \text{true}$) at an artificially deflated price, suffering injected slippage $\Delta T_V$.
3. **Backrun ($S_B$)**: Searcher swaps $Token_1 \to Token_0$ ($zeroForOne = \text{false}$), extracting value and reverting tick by $\Delta T_B \approx -\Delta T_A$.

### The Fingerprint Invariant
```
IsSandwich = (
    Block(S_B) == Block(S_V) == Block(S_A)
    AND zeroForOne(S_A) == zeroForOne(S_V)
    AND zeroForOne(S_B) != zeroForOne(S_V)
    AND Sender(S_A) == Sender(S_B)
    AND Sender(S_A) != Sender(S_V)
    AND TickDelta(S_A) * TickDelta(S_B) < 0
    AND |TickDelta(S_A)| >= MIN_TICK_DELTA_THRESHOLD
)
```

### Defensive "Not-a-Sandwich" Fallback
- **Isolated Swaps**: If no opposing swap follows in the same block, the state expires safely with zero emission.
- **Normal Price Discovery**: Multi-user natural trading volume moving in one direction is NOT flagged because $zeroForOne(S_B) == zeroForOne(S_V)$ or $Sender(S_A) \neq Sender(S_B)$.
- **Dynamic Thresholding**: Tick variance must exceed the standard liquidity depth deviation for the fee tier (`MIN_TICK_DELTA`).

---

## 5. Event Specification

```solidity
event ExtractionDetected(
    PoolId indexed poolId,
    address indexed searcher,
    address indexed victim,
    uint256 estimatedExtractedUSDC,
    bytes32 proofHash
);
```
- `proofHash` is computed as:
  $$\text{keccak256}(\text{abi.encodePacked}(poolId, searcher, victim, block.number, tickBefore, tickAfter, block.timestamp))$$

---

## 6. Searcher Bond Registry (`SearcherRegistry.sol`)

- Allows searchers to bond collateral (USDC/ETH).
- Records `mapping(address => uint256) public searcherBonds`.
- Provides `slashBond(address searcher, address recipient, uint256 amount)` callable strictly by governance/admin key.
- Slashed bond capital directly replenishes the `RebateVault` on Arc or local vault balance.

