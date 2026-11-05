import * as fs from "fs";
import * as path from "path";
import { ArkivClient } from "../lib/arkiv/client";
import { ExtractionReceipt, computeReceiptHash } from "../lib/arkiv/schemas";

function loadEnvFile() {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

async function main() {
  loadEnvFile();
  console.log("=== DarkTrace — Arkiv rabdi Testnet Write/Read Verification ===");

  const rpcUrl = process.env.ARKIV_RPC_URL || "https://rpc.rabdi.db-chain.testnet.arkiv.network";
  const accessKey = process.env.ARKIV_ACCESS_KEY;
  const writerAddress = process.env.ARKIV_WRITER_ADDRESS || "0x0000000000000000000000000000000000000000";

  console.log(`RPC URL:        ${rpcUrl}`);
  console.log(`Writer Address: ${writerAddress}`);
  console.log(`Access Key:     ${accessKey ? accessKey.slice(0, 6) + "..." : "[NOT SET]"}`);

  if (!accessKey) {
    console.error("FAILED Missing ARKIV_ACCESS_KEY. Obtain one at https://hub.arkiv.network/access-keys");
    process.exit(1);
  }

  const client = new ArkivClient({
    rpcUrl,
    accessKey,
    writerAddress,
    namespace: "darktrace.v1",
  });

  const testReceipt: ExtractionReceipt = {
    v: "1.0.0",
    poolId: "0xTEST_POOL_ID_00000000000000000000000000000000",
    searcher: "0x0000000000000000000000000000000000000001",
    victim: "0x0000000000000000000000000000000000000002",
    lp: "0x0000000000000000000000000000000000000003",
    blockNumber: 0,
    extractedUSDC: "0.00",
    injectedSlippageBps: 0,
    legitSlippageBps: 0,
    simulationHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    txHashes: [],
    createdAt: Date.now(),
  };

  const expectedHash = computeReceiptHash(testReceipt);
  console.log(`Computed receiptHash: ${expectedHash}`);

  try {
    console.log("Writing ExtractionReceipt to Arkiv rabdi testnet...");
    const writeRes = await client.writeExtractionReceipt(testReceipt);
    console.log(`WRITE_OK ${writeRes.entityKey || writeRes.receiptHash}`);

    console.log(`Querying back receipt by hash: ${writeRes.receiptHash}...`);
    const readRes = await client.getReceipt(writeRes.receiptHash);

    if (!readRes) {
      console.error(`FAILED Could not retrieve entity for receiptHash: ${writeRes.receiptHash}`);
      process.exit(1);
    }

    const retrievedHash = computeReceiptHash(readRes);
    if (retrievedHash.toLowerCase() === expectedHash.toLowerCase()) {
      console.log(`READ_OK ${retrievedHash}`);
      console.log("SUCCESS Verified live roundtrip on Arkiv rabdi testnet.");
    } else {
      console.error(`FAILED Hash mismatch. Expected ${expectedHash}, got ${retrievedHash}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`FAILED ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main();

