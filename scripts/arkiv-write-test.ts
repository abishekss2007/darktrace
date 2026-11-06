// Live write → read round-trip on Arkiv Rabdi through the same module the indexer uses.
// Usage: ARKIV_PRIVATE_KEY=0x… pnpm arkiv:write-test
import * as fs from "fs";
import * as path from "path";
import { ArkivSdk } from "../lib/arkiv/sdk";
import { ExtractionReceipt } from "../lib/arkiv/schemas";

function loadEnv() {
  const p = path.resolve(__dirname, "../.env");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf-8").split(/\r?\n/)) {
    const idx = line.indexOf("=");
    if (idx === -1 || line.trimStart().startsWith("#")) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[k]) process.env[k] = v;
  }
}

async function main() {
  loadEnv();
  console.log("=== DarkTrace — Arkiv Rabdi live write/read round-trip ===");

  if (!process.env.ARKIV_PRIVATE_KEY) {
    console.error("FAILED ARKIV_PRIVATE_KEY is not set (the writer wallet's private key).");
    process.exit(1);
  }

  const sdk = new ArkivSdk();
  console.log(`Writer (trusted owner): ${sdk.writerAddress}`);

  const receipt: ExtractionReceipt = {
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
    createdAt: Date.now(),
  };

  const written = await sdk.writeReceipt(receipt);
  console.log(`WRITE_OK $key=${written.entityKey} tx=${written.txHash}`);
  console.log(`  receiptHash ${written.receiptHash}`);

  const read = await sdk.getReceiptByHash(written.receiptHash);
  if (!read || read.arkivEntityKey.toLowerCase() !== written.entityKey.toLowerCase()) {
    console.error("FAILED could not read the entity back by receiptHash");
    process.exit(1);
  }
  console.log(`READ_OK $key=${read.arkivEntityKey} extracted=${read.extractedUSDC} txHashes=${read.txHashes.length}`);
  console.log(`Explorer: ${written.explorerUrl}`);
  console.log(`Web:      /receipt/${written.receiptHash}`);
}

main().catch((err) => {
  console.error("FAILED", err);
  process.exit(1);
});
