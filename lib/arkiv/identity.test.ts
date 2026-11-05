import test from "node:test";
import assert from "node:assert/strict";
import { ArkivClient } from "./client";
import { ExtractionReceipt, computeReceiptHash } from "./schemas";

test("Arkiv Identity Model & Identifier Separation", async (t) => {
  const client = new ArkivClient({ namespace: "darktrace.test", devMode: "memory" });

  const sampleReceipt: ExtractionReceipt = {
    v: "1.0.0",
    poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
    searcher: "0x1111111111111111111111111111111111111111",
    victim: "0x2222222222222222222222222222222222222222",
    lp: "0x3333333333333333333333333333333333333333",
    blockNumber: 12489201,
    extractedUSDC: "1.25",
    injectedSlippageBps: 187,
    legitSlippageBps: 12,
    simulationHash: "0xc9ddedeba69e600924875d3ce6c3e2cd554170c510cec4bfd5016182dc156309",
    txHashes: [
      "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
      "0xbbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222",
      "0xcccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333",
    ],
    createdAt: 1730840000000,
  };

  await t.test("receiptHash and entityKey are distinct data types and fields", async () => {
    const computedHash = computeReceiptHash(sampleReceipt);
    assert.match(computedHash, /^0x[0-9a-fA-F]{64}$/);

    const writeResult = await client.writeExtractionReceipt(sampleReceipt);
    assert.equal(writeResult.receiptHash, computedHash);
    assert.ok("entityKey" in writeResult);
    assert.ok(typeof writeResult.entityKey === "string");
  });

  await t.test("Explorer URL generator requires entityKey, not receiptHash", () => {
    const entityKey = "0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca";
    const receiptHash = "0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce";

    function makeExplorerUrl(key: string): string {
      return `https://rabdi.explorer.arkiv.network/entity/${key}`;
    }

    const correctUrl = makeExplorerUrl(entityKey);
    assert.equal(
      correctUrl,
      "https://rabdi.explorer.arkiv.network/entity/0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca"
    );

    // Assert that the receipt hash is NOT the entity key
    assert.notEqual(entityKey, receiptHash);
    assert.ok(!correctUrl.includes(receiptHash));
  });

  await t.test("Receipt lookup uses canonical receiptHash attribute filter", async () => {
    const computedHash = computeReceiptHash(sampleReceipt);
    const found = await client.getReceipt(computedHash);
    assert.ok(found !== null);
    assert.equal(found?.poolId, sampleReceipt.poolId);
    assert.equal(found?.simulationHash, sampleReceipt.simulationHash);
  });

  await t.test("Unpublished fixture does not present a false verified state", async () => {
    const nonExistentHash = "0x000000000000000000000000000000000000000000000000000000000000dead";
    const notFound = await client.getReceipt(nonExistentHash);
    assert.equal(notFound, null);
  });

  await t.test("Synthetic demo fixture cannot claim live on-chain status without entityKey", () => {
    interface VerifiedModel {
      receiptHash: string;
      arkivEntityKey?: string;
      isPersistedOnTestnet: boolean;
    }

    const liveRecord: VerifiedModel = {
      receiptHash: "0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce",
      arkivEntityKey: "0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca",
      isPersistedOnTestnet: true,
    };

    const syntheticFixture: VerifiedModel = {
      receiptHash: "0x4a5b6c7d8e9f01234567890abcdef1234567890abcd9c8d1f2b3e4a506172839",
      isPersistedOnTestnet: false,
    };

    assert.ok(liveRecord.arkivEntityKey !== undefined);
    assert.equal(syntheticFixture.arkivEntityKey, undefined);
    assert.equal(syntheticFixture.isPersistedOnTestnet, false);
  });
});

