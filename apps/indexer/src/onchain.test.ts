import test from "node:test";
import assert from "node:assert/strict";
import { runCounterfactualSimulation } from "@darktrace/simulator";
import { sqrtPriceBefore, type OnchainSwap } from "./onchain";

// Swap events captured from a real E2ESandwich bundle executed against the deployed
// DarkTraceHook + PoolManager on a Base Sepolia fork (pool started at tick 196260).
const L = 2_000_000_000_000_000n;
const swap = (o: Partial<OnchainSwap> & Pick<OnchainSwap, "zeroForOne" | "amountInGross" | "sqrtPriceX96After">): OnchainSwap => ({
  sender: "0x0000000000000000000000000000000000000000",
  liquidity: L,
  tick: 0,
  fee: 3000,
  txHash: "0x00",
  logIndex: 0,
  amountInNet: (o.amountInGross * 997_000n) / 1_000_000n,
  ...o,
});

const frontrun = swap({ zeroForOne: true, amountInGross: 200_000_000n, sqrtPriceX96After: 1444136703318398671528530784802494n, tick: 196223 });
const victim = swap({ zeroForOne: true, amountInGross: 1_000_000_000n, sqrtPriceX96After: 1431132797381226925493802983826653n, tick: 196042 });

const tickOf = (sqrtX96: bigint) => {
  const p = Number(sqrtX96) / 2 ** 96;
  return Math.floor(Math.log(p * p) / Math.log(1.0001));
};

test("pre-attack price is recovered exactly from the frontrun's own Swap event", () => {
  assert.equal(tickOf(sqrtPriceBefore(frontrun)), 196260);
});

test("victim's pre-swap price equals the frontrun's post-swap price", () => {
  const derived = sqrtPriceBefore(victim);
  const diff = derived > frontrun.sqrtPriceX96After ? derived - frontrun.sqrtPriceX96After : frontrun.sqrtPriceX96After - derived;
  // rounding only: < 1e-12 relative
  assert.ok(diff * 1_000_000_000_000n < frontrun.sqrtPriceX96After, `diff ${diff}`);
});

test("counterfactual on the real bundle yields a positive loss below the victim's notional", () => {
  const Q96 = 1n << 96n;
  const pre = sqrtPriceBefore(frontrun);
  const sim = runCounterfactualSimulation({
    poolId: "0xb78726fa11c35fdb1f60f78b58dbb55116a87b53abd0d7babd15102e77e07298",
    blockNumber: 1,
    searcherTxs: {
      frontrun: { sender: "0x1", zeroForOne: true, amountSpecified: -frontrun.amountInNet },
      backrun: { sender: "0x1", zeroForOne: false, amountSpecified: -1n },
    },
    victimSwap: { sender: "0x2", zeroForOne: true, amountSpecified: -victim.amountInNet },
    preAttackReserve0: (L * Q96) / pre,
    preAttackReserve1: (L * pre) / Q96,
  });
  assert.ok(sim.extractedUSDCRaw > 0n);
  assert.ok(sim.extractedUSDCRaw < 1_000_000_000n); // < the 1,000 tUSDC the victim swapped
  assert.equal(sim.extractedUSDC, "3.57");
});
