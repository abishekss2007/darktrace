import "dotenv/config";
import http from "node:http";
import { ArkivSdk } from "@darktrace/arkiv";
import { ForensicPipeline } from "./pipeline";
import { startHookWatcher } from "./watcher";

async function main() {
  const hookAddress = (process.env.HOOK_ADDRESS || "0x00000000000000000000000000000000000000C0") as `0x${string}`;
  const demoFast = process.env.DEMO_FAST === "1";
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  const arkivMemory = process.env.ARKIV_DEV_MODE === "memory";

  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "INFO",
      stage: "BOOTSTRAP",
      message: "DarkTrace Forensic Indexer Service initialized",
      hookAddress,
      demoFast,
      port,
      arkiv: arkivMemory ? "memory (offline)" : "live (Rabdi 7794095)",
      arcRpcUrl: process.env.ARC_RPC_URL || "https://rpc.testnet.arc.network",
    })
  );

  // Never crash the service over a missing writer key: stay up, report it on /health,
  // and fail loudly per event (see watcher.ts) instead of faking writes.
  const keyStatus = new ArkivSdk().writerKeyStatus;
  const arkivWriter = arkivMemory
    ? "memory"
    : keyStatus === "ok"
      ? "live"
      : keyStatus === "invalid"
        ? "invalid-key"
        : "unconfigured";
  if (arkivWriter !== "live" && arkivWriter !== "memory") {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "WARN",
        stage: "ARKIV_WRITER",
        message:
          arkivWriter === "invalid-key"
            ? "ARKIV_PRIVATE_KEY is set but is not 32 bytes hex (quotes/extra characters?): extractions will NOT be sealed on Arkiv"
            : "ARKIV_PRIVATE_KEY not set: detected extractions will NOT be sealed on Arkiv (set the key, or ARKIV_DEV_MODE=memory for offline runs)",
      })
    );
  }

  const pipeline = new ForensicPipeline({
    demoFast,
  });

  const unwatch = startHookWatcher({
    hookAddress,
    pipeline,
  });

  // Health check HTTP server for container runtime
  const server = http.createServer((req, res) => {
    const url = req.url || "/";
    if (
      url === "/health" ||
      url === "/" ||
      url.startsWith("/api/indexer/health") ||
      url === "/api/indexer"
    ) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "healthy",
          service: "indexer",
          hookAddress,
          arkivWriter,
          timestamp: new Date().toISOString(),
        })
      );
      return;
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });

  server.listen(port, () => {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "INFO",
        stage: "HTTP_READY",
        message: `Indexer health server listening on port ${port}`,
      })
    );
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
    server.close();
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
