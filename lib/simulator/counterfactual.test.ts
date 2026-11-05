import test from "node:test";
import assert from "node:assert/strict";
import { runCounterfactualSimulation, SimulationInput } from "./counterfactual";

test("Counterfactual simulator math & hash integrity", async (t) => {
  const sampleInput: SimulationInput = {
    poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
    blockNumber: 12489201,
    searcherTxs: {
      frontrun: {
        sender: "0x1111111111111111111111111111111111111111",
        zeroForOne: true,
        amountSpecified: 50_000_000_000n, // 50,000 USDC frontrun
      },
      backrun: {
        sender: "0x1111111111111111111111111111111111111111",
        zeroForOne: false,
        amountSpecified: 15_000_000_000_000_000_000n,
      },
    },
    victimSwap: {
      sender: "0x2222222222222222222222222222222222222222",
      zeroForOne: true,
      amountSpecified: 100_000_000_000n, // 100,000 USDC victim swap
    },
  };

  await t.test("computes positive injected slippage on sandwich attack", () => {
    const res = runCounterfactualSimulation(sampleInput);
    
    assert.ok(res.injectedSlippageBps > 0);
    assert.ok(res.legitSlippageBps >= 0);
    assert.ok(res.extractedUSDCRaw > 0n);
    assert.ok(res.simulationHash.startsWith("0x"));
    assert.equal(res.simulationHash.length, 66);
    assert.equal(typeof res.extractedUSDC, "string");
  });

  await t.test("simulation hash is strictly deterministic", () => {
    const res1 = runCounterfactualSimulation(sampleInput);
    const res2 = runCounterfactualSimulation(sampleInput);

    assert.equal(res1.simulationHash, res2.simulationHash);
    assert.equal(res1.extractedUSDCRaw, res2.extractedUSDCRaw);
    assert.equal(res1.injectedSlippageBps, res2.injectedSlippageBps);
  });
});
