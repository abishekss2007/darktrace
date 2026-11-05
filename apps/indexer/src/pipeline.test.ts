import test from "node:test";
import assert from "node:assert/strict";
import { ForensicPipeline, ExtractionEventPayload } from "./pipeline";
import { ArkivClient } from "@darktrace/arkiv";

test("ForensicPipeline end-to-end event processing", async (t) => {
  const arkiv = new ArkivClient({ namespace: "darktrace.test" });
  const pipeline = new ForensicPipeline({
    arkivClient: arkiv,
    demoFast: true,
  });

  const sampleEvent: ExtractionEventPayload = {
    poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
    searcher: "0x1111111111111111111111111111111111111111",
    victim: "0x2222222222222222222222222222222222222222",
    extractedValue: 50_000_000_000n,
    proofHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockNumber: 12489201,
    txHash: "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
  };

  await t.test("successfully processes extraction into Arkiv and simulation attestation", async () => {
    const result = await pipeline.processExtraction(sampleEvent);
    assert.ok(result !== null);
    assert.ok(result.receiptHash.startsWith("0x"));
    assert.ok(result.simulationHash.startsWith("0x"));
    assert.ok(Number(result.receipt.extractedUSDC) > 0);
    assert.ok(result.receipt.injectedSlippageBps > 0);

    // Verify it exists in Arkiv
    const inArkiv = await arkiv.getReceipt(result.receiptHash);
    assert.ok(inArkiv !== null);
    assert.equal(inArkiv.poolId, sampleEvent.poolId);
    assert.equal(inArkiv.searcher, sampleEvent.searcher);

    // Verify searcher profile was updated
    const profile = await arkiv.searcherProfile(sampleEvent.searcher);
    assert.ok(profile !== null);
    assert.equal(profile.extractions, 1);
  });

  await t.test("deduplicates identical proofHash events", async () => {
    // Re-submitting the exact same event must return null
    const duplicateResult = await pipeline.processExtraction(sampleEvent);
    assert.equal(duplicateResult, null);
  });
});
