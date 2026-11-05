import "dotenv/config";
import http from "node:http";
import { ForensicPipeline } from "./pipeline";
import { startHookWatcher } from "./watcher";

async function main() {
  const hookAddress = (process.env.HOOK_ADDRESS || "0x00000000000000000000000000000000000000C0") as `0x${string}`;
  const demoFast = process.env.DEMO_FAST === "1";
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "INFO",
      stage: "BOOTSTRAP",
      message: "DarkTrace Forensic Indexer Service initialized",
      hookAddress,
      demoFast,
      port,
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
