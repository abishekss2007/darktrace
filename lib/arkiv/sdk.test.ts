import test from "node:test";
import assert from "node:assert/strict";
import { ArkivSdk, normalizePrivateKey } from "./sdk";

// Throwaway, well-known test key (never funded).
const KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

test("normalizePrivateKey tolerates copy-paste artefacts", () => {
  assert.equal(normalizePrivateKey(KEY), KEY);
  assert.equal(normalizePrivateKey(KEY.slice(2)), KEY); // missing 0x
  assert.equal(normalizePrivateKey(`"${KEY}"`), KEY); // wrapped in quotes
  assert.equal(normalizePrivateKey(`  '${KEY}'\n`), KEY); // single quotes + whitespace
  assert.equal(normalizePrivateKey(""), null);
  assert.equal(normalizePrivateKey("0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5"), null); // an address, not a key
  assert.equal(normalizePrivateKey(`${KEY}ff`), null); // too long
});

test("a malformed write key never breaks read-only construction", () => {
  const bad = new ArkivSdk({ privateKey: "not-a-key" });
  assert.equal(bad.writerKeyStatus, "invalid");
  assert.equal(bad.canWrite, false);

  const missing = new ArkivSdk({ privateKey: "" });
  assert.equal(missing.writerKeyStatus, "missing");

  const quoted = new ArkivSdk({ privateKey: `"${KEY}"` });
  assert.equal(quoted.writerKeyStatus, "ok");
  assert.equal(quoted.canWrite, true);
});

test("writes with an invalid key fail with an actionable message", async () => {
  const bad = new ArkivSdk({ privateKey: "0x1234" });
  await assert.rejects(() => bad.writeLPClaim({ v: "1.0.0", lp: KEY.slice(0, 42), receiptHash: KEY, claimTx: KEY, createdAt: 0 }), /not 32 bytes hex/);
});
