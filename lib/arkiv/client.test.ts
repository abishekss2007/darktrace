import test from "node:test";
import assert from "node:assert/strict";
import { ArkivClient } from "./client";
import { ExtractionReceipt, LPClaim, SearcherProfile } from "./schemas";

test("ArkivClient round-trip verification", async (t) => {
  const client = new ArkivClient({ namespace: "darktrace.test" });

  const sampleReceipt: ExtractionReceipt = {
    v: "1.0.0",
    poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
    searcher: "0x1111111111111111111111111111111111111111",
    victim: "0x2222222222222222222222222222222222222222",
    lp: "0x3333333333333333333333333333333333333333",
    blockNumber: 12489201,
    extractedUSDC: "142.50",
    injectedSlippageBps: 185,
    legitSlippageBps: 12,
    simulationHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    txHashes: [
      "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
      "0xbbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222",
      "0xcccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333",
    ],
    createdAt: 1730840000000,
  };

  await t.test("writeExtractionReceipt -> getReceipt round-trip", async () => {
    const { receiptHash, entityId } = await client.writeExtractionReceipt(sampleReceipt);
    assert.ok(receiptHash.startsWith("0x"));
    assert.ok(entityId.includes(receiptHash));

    const retrieved = await client.getReceipt(receiptHash);
    assert.ok(retrieved !== null);
    assert.deepEqual(retrieved, sampleReceipt);
  });

  await t.test("getByPool retrieves receipts for poolId", async () => {
    const poolReceipts = await client.getByPool(sampleReceipt.poolId);
    assert.equal(poolReceipts.length, 1);
    assert.deepEqual(poolReceipts[0], sampleReceipt);

    // Query non-existent pool returns empty array
    const emptyPool = await client.getByPool("0x0000000000000000000000000000000000000000000000000000000000000000");
    assert.equal(emptyPool.length, 0);
  });

  await t.test("searcherProfile auto-increments extractions", async () => {
    const profile = await client.searcherProfile(sampleReceipt.searcher);
    assert.ok(profile !== null);
    assert.equal(profile.extractions, 1);
    assert.equal(profile.lastSeenBlock, sampleReceipt.blockNumber);

    // Test explicit update
    const updated: SearcherProfile = {
      ...profile,
      bondedUSDC: "5000.00",
      slashedUSDC: "5000.00",
    };
    await client.updateSearcherProfile(updated);

    const reloaded = await client.searcherProfile(sampleReceipt.searcher);
    assert.deepEqual(reloaded, updated);
  });

  await t.test("writeLPClaim -> lpClaims round-trip", async () => {
    const claim: LPClaim = {
      v: "1.0.0",
      receiptHash: "0xreceipt_hash_1234",
      lp: "0x3333333333333333333333333333333333333333",
      claimTx: "0xarc_tx_5678",
      createdAt: 1730840100000,
    };

    await client.writeLPClaim(claim);
    const claims = await client.lpClaims(claim.lp);
    assert.equal(claims.length, 1);
    assert.deepEqual(claims[0], claim);

    // Unrelated LP has no claims
    const emptyClaims = await client.lpClaims("0x9999999999999999999999999999999999999999");
    assert.equal(emptyClaims.length, 0);
  });
});
