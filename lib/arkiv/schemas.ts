import { keccak256, toHex, stringToBytes } from "viem";

export interface ExtractionReceipt {
  v: "1.0.0";
  poolId: string;
  searcher: string;
  victim: string;
  lp: string;
  blockNumber: number;
  extractedUSDC: string;
  injectedSlippageBps: number;
  legitSlippageBps: number;
  simulationHash: string;
  txHashes: string[];
  createdAt: number;
}

export interface SearcherProfile {
  v: "1.0.0";
  searcher: string;
  extractions: number;
  bondedUSDC: string;
  slashedUSDC: string;
  lastSeenBlock: number;
}

export interface LPClaim {
  v: "1.0.0";
  receiptHash: string;
  lp: string;
  claimTx: string;
  createdAt: number;
}

/**
 * Computes deterministic canonical hash for an ExtractionReceipt.
 */
export function computeReceiptHash(receipt: ExtractionReceipt): `0x${string}` {
  // Deterministic JSON ordering
  const canonical = JSON.stringify({
    v: receipt.v,
    poolId: receipt.poolId.toLowerCase(),
    searcher: receipt.searcher.toLowerCase(),
    victim: receipt.victim.toLowerCase(),
    lp: receipt.lp.toLowerCase(),
    blockNumber: receipt.blockNumber,
    extractedUSDC: receipt.extractedUSDC,
    injectedSlippageBps: receipt.injectedSlippageBps,
    legitSlippageBps: receipt.legitSlippageBps,
    simulationHash: receipt.simulationHash.toLowerCase(),
    txHashes: receipt.txHashes.map((h) => h.toLowerCase()),
    createdAt: receipt.createdAt,
  });

  return keccak256(stringToBytes(canonical));
}
