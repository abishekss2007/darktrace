import "dotenv/config";
import { ForensicPipeline } from "./pipeline";
import { startHookWatcher } from "./watcher";

async function main() {
  const hookAddress = (process.env.HOOK_ADDRESS || "0x00000000000000000000000000000000000000C0") as `0x${string}`;
  const demoFast = process.env.DEMO_FAST === "1";

  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "INFO",
      stage: "BOOTSTRAP",
      message: "DarkTrace Forensic Indexer Service initialized",
      hookAddress,
      demoFast,
      arcRpcUrl: process.env.ARC_RPC_URL || "https://rpc.testnet.arc.network",
    })
  );

  const pipeline = new ForensicPipeline({
    demoFast,
  });

  const unwatch = startHookWatcher({
    hookAddress,
    pipeline,
  });

  process.on("SIGINT", () => {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "INFO",
        stage: "SHUTDOWN",
        message: "Shutting down indexer gracefully",
      })
    );
    unwatch();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "FATAL",
      stage: "CRASH",
      message: err.message,
    })
  );
  process.exit(1);
});
