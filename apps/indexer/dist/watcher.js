"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHookWatcher = startHookWatcher;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const EXTRACTION_DETECTED_EVENT = (0, viem_1.parseAbiItem)("event ExtractionDetected(bytes32 indexed poolId, address indexed searcher, address indexed victim, uint256 extractedValue, bytes32 proofHash)");
function startHookWatcher(config) {
    const publicClient = (0, viem_1.createPublicClient)({
        chain: chains_1.baseSepolia,
        transport: (0, viem_1.http)(config.rpcUrl || process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org"),
    });
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "INFO",
        stage: "INIT",
        message: "DarkTrace Base Sepolia Hook Watcher started",
        hookAddress: config.hookAddress,
    }));
    const unwatch = publicClient.watchEvent({
        address: config.hookAddress,
        event: EXTRACTION_DETECTED_EVENT,
        onLogs: async (logs) => {
            for (const log of logs) {
                if (!log.args.poolId || !log.args.searcher || !log.args.victim)
                    continue;
                await config.pipeline.processExtraction({
                    poolId: log.args.poolId,
                    searcher: log.args.searcher,
                    victim: log.args.victim,
                    extractedValue: log.args.extractedValue ?? 0n,
                    proofHash: log.args.proofHash ?? "0x00",
                    blockNumber: Number(log.blockNumber),
                    txHash: log.transactionHash,
                });
            }
        },
        onError: (error) => {
            console.error(JSON.stringify({
                timestamp: new Date().toISOString(),
                level: "ERROR",
                stage: "WATCHER_ERROR",
                message: error.message,
            }));
        },
    });
    return unwatch;
}
