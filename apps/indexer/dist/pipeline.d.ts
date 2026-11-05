import { ArkivClient, ExtractionReceipt } from "@darktrace/arkiv";
export interface ExtractionEventPayload {
    poolId: `0x${string}`;
    searcher: `0x${string}`;
    victim: `0x${string}`;
    extractedValue: bigint;
    proofHash: `0x${string}`;
    blockNumber: number;
    txHash?: `0x${string}`;
}
export interface PipelineConfig {
    arkivClient?: ArkivClient;
    demoFast?: boolean;
    arcRpcUrl?: string;
    arcPrivateKey?: `0x${string}`;
    simulationRegistryAddress?: `0x${string}`;
}
export interface ProcessedPipelineResult {
    receipt: ExtractionReceipt;
    receiptHash: string;
    simulationHash: string;
    attestedOnArc: boolean;
    arcTxHash?: string;
}
export declare class ForensicPipeline {
    private arkiv;
    private demoFast;
    private arcRpcUrl;
    private arcPrivateKey?;
    private simulationRegistryAddress?;
    private processedHashes;
    constructor(config?: PipelineConfig);
    /**
     * Main pipeline entry: Event -> Simulator -> Arkiv -> Arc SimulationRegistry
     */
    processExtraction(event: ExtractionEventPayload): Promise<ProcessedPipelineResult | null>;
    private log;
}
