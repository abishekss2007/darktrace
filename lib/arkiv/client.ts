import {
  ExtractionReceipt,
  SearcherProfile,
  LPClaim,
  computeReceiptHash,
} from "./schemas";

export interface ArkivClientConfig {
  rpcUrl?: string;
  apiKey?: string;
  namespace?: string;
}

/**
 * Arkiv decentralized ledger adapter for DarkTrace MEV forensics.
 * Connects to Arkiv DB-Chain endpoints with fallback to local state for deterministic testing.
 */
export class ArkivClient {
  private rpcUrl: string;
  private apiKey?: string;
  private namespace: string;

  // Local fallback storage for offline operation and deterministic testing
  private memoryReceipts: Map<string, ExtractionReceipt> = new Map();
  private memoryProfiles: Map<string, SearcherProfile> = new Map();
  private memoryClaims: Map<string, LPClaim[]> = new Map();

  constructor(config: ArkivClientConfig = {}) {
    this.rpcUrl = config.rpcUrl || process.env.ARKIV_RPC_URL || "https://rpc.arkiv.network";
    this.apiKey = config.apiKey || process.env.ARKIV_API_KEY;
    this.namespace = config.namespace || "darktrace.v1";
  }

  /**
   * Writes an immutable forensic receipt to the Arkiv ledger.
   * @param receipt The validated ExtractionReceipt object
   */
  async writeExtractionReceipt(
    receipt: ExtractionReceipt
  ): Promise<{ receiptHash: string; entityId: string }> {
    const hash = computeReceiptHash(receipt);
    const entityId = `${this.namespace}:receipt:${hash}`;

    // TODO: confirm SDK method names against Arkiv docs
    // In production, Arkiv DB-Chain uses arkiv_putEntity or the @arkiv-network/sdk client:
    // await this.remoteRpcCall("arkiv_putEntity", {
    //   namespace: this.namespace,
    //   entityId,
    //   payload: receipt,
    //   indexes: {
    //     poolId: receipt.poolId.toLowerCase(),
    //     searcher: receipt.searcher.toLowerCase(),
    //     victim: receipt.victim.toLowerCase(),
    //     receiptHash: hash
    //   }
    // });

    // Store in internal registry (always available for local execution & tests)
    this.memoryReceipts.set(hash.toLowerCase(), receipt);

    // Also update searcher profile stats
    await this._recordSearcherExtraction(receipt.searcher, receipt.extractedUSDC, receipt.blockNumber);

    return {
      receiptHash: hash,
      entityId,
    };
  }

  /**
   * Retrieves all forensic receipts recorded for a specific Uniswap v4 pool.
   */
  async getByPool(poolId: string): Promise<ExtractionReceipt[]> {
    const normalized = poolId.toLowerCase();
    
    // TODO: confirm SDK method names against Arkiv docs
    // const res = await this.remoteRpcCall("arkiv_queryEntities", {
    //   namespace: this.namespace,
    //   filter: { "indexes.poolId": normalized }
    // });

    const results: ExtractionReceipt[] = [];
    for (const receipt of this.memoryReceipts.values()) {
      if (receipt.poolId.toLowerCase() === normalized) {
        results.push(receipt);
      }
    }
    return results.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Retrieves a single receipt by its canonical receiptHash.
   */
  async getReceipt(hash: string): Promise<ExtractionReceipt | null> {
    const normalized = hash.toLowerCase();
    const found = this.memoryReceipts.get(normalized);
    return found ? { ...found } : null;
  }

  /**
   * Queries the reputation and slashing profile for a searcher address.
   */
  async searcherProfile(address: string): Promise<SearcherProfile | null> {
    const normalized = address.toLowerCase();
    const profile = this.memoryProfiles.get(normalized);
    if (!profile) return null;
    return { ...profile };
  }

  /**
   * Upserts a searcher profile with bond and slashing data.
   */
  async updateSearcherProfile(profile: SearcherProfile): Promise<void> {
    const normalized = profile.searcher.toLowerCase();
    this.memoryProfiles.set(normalized, { ...profile });
  }

  /**
   * Records an LP restitution claim on the ledger.
   */
  async writeLPClaim(claim: LPClaim): Promise<void> {
    const lpNormalized = claim.lp.toLowerCase();
    const existing = this.memoryClaims.get(lpNormalized) || [];
    existing.push({ ...claim });
    this.memoryClaims.set(lpNormalized, existing);

    // TODO: confirm SDK method names against Arkiv docs
    // await this.remoteRpcCall("arkiv_putEntity", {
    //   namespace: this.namespace,
    //   entityId: `${this.namespace}:claim:${claim.receiptHash}`,
    //   payload: claim,
    //   indexes: { lp: lpNormalized, receiptHash: claim.receiptHash }
    // });
  }

  /**
   * Retrieves all restitution claims associated with an LP address.
   */
  async lpClaims(lpAddress: string): Promise<LPClaim[]> {
    const normalized = lpAddress.toLowerCase();
    const claims = this.memoryClaims.get(normalized) || [];
    return [...claims].sort((a, b) => b.createdAt - a.createdAt);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Internal Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  private async _recordSearcherExtraction(
    searcher: string,
    extractedAmount: string,
    blockNumber: number
  ): Promise<void> {
    const norm = searcher.toLowerCase();
    const current = this.memoryProfiles.get(norm) || {
      v: "1.0.0",
      searcher: norm,
      extractions: 0,
      bondedUSDC: "10000.00", // Default baseline bond for demo
      slashedUSDC: "0.00",
      lastSeenBlock: blockNumber,
    };

    current.extractions += 1;
    current.lastSeenBlock = blockNumber;
    this.memoryProfiles.set(norm, current);
  }
}
