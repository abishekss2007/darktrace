import { ForensicPipeline } from "./pipeline";
export interface WatcherConfig {
    hookAddress: `0x${string}`;
    rpcUrl?: string;
    pipeline: ForensicPipeline;
}
export declare function startHookWatcher(config: WatcherConfig): import("viem", { with: { "resolution-mode": "import" } }).WatchEventReturnType;
