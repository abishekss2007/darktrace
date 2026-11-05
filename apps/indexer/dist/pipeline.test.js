"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const pipeline_1 = require("./pipeline");
const arkiv_1 = require("@darktrace/arkiv");
(0, node_test_1.default)("ForensicPipeline end-to-end event processing", async (t) => {
    const arkiv = new arkiv_1.ArkivClient({ namespace: "darktrace.test" });
    const pipeline = new pipeline_1.ForensicPipeline({
        arkivClient: arkiv,
        demoFast: true,
    });
    const sampleEvent = {
        poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
        searcher: "0x1111111111111111111111111111111111111111",
        victim: "0x2222222222222222222222222222222222222222",
        extractedValue: 50000000000n,
        proofHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        blockNumber: 12489201,
        txHash: "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
    };
    await t.test("successfully processes extraction into Arkiv and simulation attestation", async () => {
        const result = await pipeline.processExtraction(sampleEvent);
        strict_1.default.ok(result !== null);
        strict_1.default.ok(result.receiptHash.startsWith("0x"));
        strict_1.default.ok(result.simulationHash.startsWith("0x"));
        strict_1.default.ok(Number(result.receipt.extractedUSDC) > 0);
        strict_1.default.ok(result.receipt.injectedSlippageBps > 0);
        // Verify it exists in Arkiv
        const inArkiv = await arkiv.getReceipt(result.receiptHash);
        strict_1.default.ok(inArkiv !== null);
        strict_1.default.equal(inArkiv.poolId, sampleEvent.poolId);
        strict_1.default.equal(inArkiv.searcher, sampleEvent.searcher);
        // Verify searcher profile was updated
        const profile = await arkiv.searcherProfile(sampleEvent.searcher);
        strict_1.default.ok(profile !== null);
        strict_1.default.equal(profile.extractions, 1);
    });
    await t.test("deduplicates identical proofHash events", async () => {
        // Re-submitting the exact same event must return null
        const duplicateResult = await pipeline.processExtraction(sampleEvent);
        strict_1.default.equal(duplicateResult, null);
    });
});
