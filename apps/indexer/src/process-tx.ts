// Runs the forensic pipeline for ONE Base Sepolia transaction that emitted ExtractionDetected:
//   hook event -> rebuild sandwich from Swap events -> CPMM counterfactual -> Arkiv receipt -> Arc attestation.
//
// Usage:
//   pnpm --filter @darktrace/indexer process-tx <txHash>            # live: writes Arkiv + attests on Arc
//   pnpm --filter @darktrace/indexer process-tx <txHash> --dry-run  # no writes: prints what would be sealed
// Env: ARKIV_PRIVATE_KEY (writer wallet; also owns SimulationRegistry), BASE_SEPOLIA_RPC (optional).
import "dotenv/config";
import { createPublicClient, http, parseAbi, decodeEventLog, type Hex, type PublicClient } from "viem";
import { baseSepolia } from "viem/chains";
import { ArkivClient } from "@darktrace/arkiv";
import { ForensicPipeline } from "./pipeline";

const HOOK = (process.env.HOOK_ADDRESS || "0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0").toLowerCase();
const EVENT_ABI = parseAbi([
  "event ExtractionDetected(bytes32 indexed poolId, address indexed searcher, address indexed victim, uint256 extractedValue, bytes32 proofHash)",
]);

async function main() {
  const [txHash, ...flags] = process.argv.slice(2);
  const dryRun = flags.includes("--dry-run");
  if (!txHash || !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    console.error("usage: process-tx <txHash> [--dry-run]");
    process.exit(1);
  }

  const baseClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org"),
  }) as PublicClient;

  const receipt = await baseClient.getTransactionReceipt({ hash: txHash as Hex });
  const log = receipt.logs.find((l) => l.address.toLowerCase() === HOOK);
  if (!log) throw new Error(`no ExtractionDetected from hook ${HOOK} in ${txHash}`);
  const { args } = decodeEventLog({ abi: EVENT_ABI, data: log.data, topics: log.topics });

  // Dry run: drop every signer key BEFORE the pipeline reads them, so nothing can be written.
  if (dryRun) process.env.ARC_PRIVATE_KEY = process.env.ARKIV_PRIVATE_KEY = "";
  const pipeline = new ForensicPipeline({
    baseClient,
    demoFast: false,
    ...(dryRun ? { arkivClient: new ArkivClient({ devMode: "memory" }) } : {}),
  });

  const result = await pipeline.processExtraction({
    poolId: args.poolId,
    searcher: args.searcher,
    victim: args.victim,
    extractedValue: args.extractedValue,
    proofHash: args.proofHash,
    blockNumber: Number(receipt.blockNumber),
    txHash: receipt.transactionHash,
    logIndex: log.logIndex,
  });
  if (!result) return;

  console.log("\n=== DarkTrace receipt ===");
  console.log(JSON.stringify(
    {
      mode: dryRun ? "dry-run (nothing written)" : "live",
      receiptHash: result.receiptHash,
      extractedUSDC: result.receipt.extractedUSDC,
      injectedSlippageBps: result.receipt.injectedSlippageBps,
      legitSlippageBps: result.receipt.legitSlippageBps,
      searcher: result.receipt.searcher,
      victim: result.receipt.victim,
      txHashes: result.receipt.txHashes,
      arkivEntityKey: result.arkivEntityKey,
      arkivExplorer: result.arkivEntityKey ? `https://rabdi.explorer.arkiv.network/entity/${result.arkivEntityKey}` : undefined,
      attestedOnArc: result.attestedOnArc,
      arcTxHash: result.arcTxHash,
      web: `https://darktrace-lovat.vercel.app/receipt/${result.receiptHash}`,
    },
    null,
    2
  ));
}

main().catch((err) => {
  console.error("FAILED", err instanceof Error ? err.message : err);
  process.exit(1);
});
