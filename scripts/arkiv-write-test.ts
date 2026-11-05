import * as fs from "fs";
import * as path from "path";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, createPublicClient, defineSchema, str, addr, u64, dec, bytes, ExpirationTime } from "@arkiv-network/sdk";
import { rabdi } from "@arkiv-network/sdk/chains";
import { eq } from "@arkiv-network/sdk/query";
import { stringToBytes } from "viem";
import { ExtractionReceipt, computeReceiptHash } from "../lib/arkiv/schemas";

function loadEnv() {
  const p = path.resolve(__dirname, "../.env");
  if (fs.existsSync(p)) {
    const raw = fs.readFileSync(p, "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      const idx = line.indexOf("=");
      if (idx !== -1) {
        const k = line.slice(0, idx).trim();
        const v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
        if (!process.env[k]) process.env[k] = v;
      }
    }
  }
}

// Define canonical DarkTrace schema on Arkiv
export const ReceiptsSchema = defineSchema("receipts", {
  poolId: str().indexed(),
  searcher: addr().indexed(),
  victim: addr().indexed(),
  lp: addr().indexed(),
  blockNumber: u64().indexed(),
  receiptHash: str().indexed(),
  extractedUSDC: dec(),
  simulationHash: str(),
  txHashes: bytes(),
});

async function main() {
  loadEnv();
  console.log("=== DarkTrace — Arkiv Rabdi Testnet Live On-Chain Write/Read ===");

  const accessKey = process.env.ARKIV_ACCESS_KEY || "";
  let pkStr = (process.env.ARKIV_PRIVATE_KEY || process.env.ARKIV_WRITER_ADDRESS || "").trim().replace(/^['"]|['"]$/g, "");
  if (!pkStr.startsWith("0x")) pkStr = `0x${pkStr}`;

  if (pkStr.length !== 66) {
    console.error("FAILED Private key must be 66 characters (0x + 64 hex chars).");
    process.exit(1);
  }

  const account = privateKeyToAccount(pkStr as `0x${string}`);
  console.log(`Writer Wallet Address: ${account.address}`);
  console.log(`Access Key:            ${accessKey.slice(0, 10)}...`);

  const chain = rabdi({ accessKey });

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(),
  });

  const testReceipt: ExtractionReceipt = {
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

  const receiptHash = computeReceiptHash(testReceipt);
  console.log(`Computed canonical receiptHash: ${receiptHash}`);

  try {
    console.log("Broadcasting entity creation on Rabdi testnet (Chain 7794095)...");
    const { entityKey, txHash } = await walletClient.createEntity(
      ReceiptsSchema,
      {
        poolId: testReceipt.poolId.toLowerCase(),
        searcher: addr(testReceipt.searcher.toLowerCase() as `0x${string}`),
        victim: addr(testReceipt.victim.toLowerCase() as `0x${string}`),
        lp: addr(testReceipt.lp.toLowerCase() as `0x${string}`),
        blockNumber: u64(BigInt(testReceipt.blockNumber)),
        receiptHash: receiptHash.toLowerCase(),
        extractedUSDC: dec(testReceipt.extractedUSDC),
        simulationHash: testReceipt.simulationHash.toLowerCase(),
        txHashes: stringToBytes(JSON.stringify(testReceipt.txHashes)),
      },
      { expiration: ExpirationTime.fromDays(30) }
    );

    console.log(`Transaction broadcasted: ${txHash}`);
    console.log(`WRITE_OK ${entityKey}`);

    console.log(`Querying back entity by receiptHash from Rabdi...`);
    const res = await publicClient
      .select({
        $key: true,
        $owner: true,
        receiptHash: true,
        poolId: true,
        searcher: true,
        victim: true,
        extractedUSDC: true,
      })
      .from(ReceiptsSchema)
      .where(eq("receiptHash", receiptHash.toLowerCase()))
      .fetch();

    if (!res.entities || res.entities.length === 0) {
      console.error(`FAILED Could not find created entity on Rabdi.`);
      process.exit(1);
    }

    const matched = res.entities[0];
    console.log(`READ_OK ${matched.$key}`);
    console.log("Matched Entity on Rabdi:", JSON.stringify(matched, null, 2));
    console.log(`Explorer URL: https://rabdi.explorer.arkiv.network/entity/${matched.$key}`);
    console.log("SUCCESS Live Arkiv on-chain roundtrip verified!");
  } catch (err) {
    console.error("FAILED", err);
    process.exit(1);
  }
}

main();
