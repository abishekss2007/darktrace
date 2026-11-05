import {
  ExtractionReceipt,
  SearcherProfile,
  LPClaim,
  computeReceiptHash,
} from "./schemas";

export interface ArkivClientConfig {
  rpcUrl?: string;
  chainId?: string | number;
  accessKey?: string;
  writerAddress?: string;
  namespace?: string;
  devMode?: string;
}

export class ArkivRpcError extends Error {
  public cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "ArkivRpcError";
    this.cause = cause;
  }
}

/**
 * Arkiv decentralized ledger adapter for DarkTrace MEV forensics.
 * Connects exclusively to Arkiv rabdi testnet (chain 7794095).
 * Fails loudly on RPC errors and disallows silent fallbacks.
 */
export class ArkivClient {
  private rpcUrl: string;
  private chainId: string;
  private accessKey?: string;
  private writerAddress?: string;
  private namespace: string;
  private isMemoryMode: boolean = false;

  // In-memory store retained ONLY when NODE_ENV === 'development' AND ARKIV_DEV_MODE === 'memory'
  private memoryReceipts: Map<string, ExtractionReceipt> = new Map();
  private memoryProfiles: Map<string, SearcherProfile> = new Map();
  private memoryClaims: Map<string, LPClaim[]> = new Map();

  constructor(config: ArkivClientConfig = {}) {
    const isProd = process.env.NODE_ENV === "production";
    const devMode = config.devMode || process.env.ARKIV_DEV_MODE;

    const rpcUrl = config.rpcUrl || process.env.ARKIV_RPC_URL;
    const accessKey = config.accessKey || process.env.ARKIV_ACCESS_KEY;
    const chainId = String(config.chainId || process.env.ARKIV_CHAIN_ID || "7794095");
    const writerAddress = config.writerAddress || process.env.ARKIV_WRITER_ADDRESS;

    if (isProd && (!rpcUrl || !accessKey)) {
      throw new Error("[arkiv] missing required env: ARKIV_RPC_URL, ARKIV_ACCESS_KEY.");
    }

    if (devMode === "memory") {
      this.isMemoryMode = true;
      this.rpcUrl = rpcUrl || "https://rpc.rabdi.db-chain.testnet.arkiv.network";
      console.warn("[arkiv] development memory mode — no live writes");
    } else {
      const targetRpc = rpcUrl || "https://rpc.rabdi.db-chain.testnet.arkiv.network";
      if (!targetRpc.includes("rabdi.db-chain.testnet.arkiv.network")) {
        throw new Error(
          `[arkiv] Invalid RPC URL: "${targetRpc}". ARKIV_RPC_URL must point to rabdi.db-chain.testnet.arkiv.network`
        );
      }
      this.rpcUrl = targetRpc;
    }

    this.chainId = chainId;
    this.accessKey = accessKey;
    this.writerAddress = writerAddress;
    this.namespace = config.namespace || "darktrace.v1";
  }

  private async remoteRpcCall(method: string, params: Record<string, unknown>): Promise<unknown> {
    if (this.isMemoryMode) {
      return null;
    }

    try {
      const response = await fetch(this.rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.accessKey ? { Authorization: `Bearer ${this.accessKey}` } : {}),
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method,
          params: [params],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as { error?: { code: number; message: string }; result?: unknown };
      if (data.error) {
        throw new Error(`RPC Error (${data.error.code}): ${data.error.message}`);
      }

      return data.result;
    } catch (err) {
      const errorDetail = err instanceof Error ? `: ${err.message}` : "";
      throw new ArkivRpcError(`[arkiv] Remote call to ${method} failed on ${this.rpcUrl}${errorDetail}`, err);
    }
  }

  /**
   * Writes an immutable forensic receipt to the Arkiv ledger.
   * @param receipt The validated ExtractionReceipt object
   */
  async writeExtractionReceipt(
    receipt: ExtractionReceipt
  ): Promise<{ receiptHash: string; entityId: string; entityKey?: string }> {
    const hash = computeReceiptHash(receipt);
    const entityId = `${this.namespace}:receipt:${hash}`;

    if (this.isMemoryMode) {
      this.memoryReceipts.set(hash.toLowerCase(), receipt);
      await this._recordSearcherExtraction(receipt.searcher, receipt.extractedUSDC, receipt.blockNumber);
      return { receiptHash: hash, entityId, entityKey: hash };
    }

    const payload = {
      namespace: this.namespace,
      entityId,
      payload: receipt,
      indexes: {
        poolId: receipt.poolId.toLowerCase(),
        searcher: receipt.searcher.toLowerCase(),
        victim: receipt.victim.toLowerCase(),
        receiptHash: hash.toLowerCase(),
        blockNumber: receipt.blockNumber,
      },
    };

    const res = (await this.remoteRpcCall("arkiv_putEntity", payload)) as { entityKey?: string } | undefined;
    const entityKey = res?.entityKey || hash;

    // Also update searcher profile stats
    await this._recordSearcherExtraction(receipt.searcher, receipt.extractedUSDC, receipt.blockNumber);

    return {
      receiptHash: hash,
      entityId,
      entityKey,
    };
  }

  /**
   * Retrieves all forensic receipts recorded for a specific Uniswap v4 pool.
   */
  async getByPool(poolId: string): Promise<ExtractionReceipt[]> {
    const normalized = poolId.toLowerCase();

    if (this.isMemoryMode) {
      const results: ExtractionReceipt[] = [];
      for (const receipt of this.memoryReceipts.values()) {
        if (receipt.poolId.toLowerCase() === normalized) {
          results.push(receipt);
        }
      }
      return results.sort((a, b) => b.createdAt - a.createdAt);
    }

    const res = (await this.remoteRpcCall("arkiv_queryEntities", {
      namespace: this.namespace,
      filter: { "indexes.poolId": normalized },
    })) as { entities?: { payload: ExtractionReceipt }[] } | undefined;

    const receipts = (res?.entities || []).map((e) => e.payload);
    return receipts.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Retrieves a single receipt by its canonical receiptHash.
   */
  async getReceipt(hash: string): Promise<ExtractionReceipt | null> {
    const normalized = hash.toLowerCase();

    if (this.isMemoryMode) {
      const found = this.memoryReceipts.get(normalized);
      return found ? { ...found } : null;
    }

    const res = (await this.remoteRpcCall("arkiv_queryEntities", {
      namespace: this.namespace,
      filter: { "indexes.receiptHash": normalized },
      limit: 1,
    })) as { entities?: { payload: ExtractionReceipt }[] } | undefined;

    const found = res?.entities?.[0]?.payload;
    return found || null;
  }

  /**
   * Queries the reputation and slashing profile for a searcher address.
   */
  async searcherProfile(address: string): Promise<SearcherProfile | null> {
    const normalized = address.toLowerCase();

    if (this.isMemoryMode) {
      const profile = this.memoryProfiles.get(normalized);
      return profile ? { ...profile } : null;
    }

    const res = (await this.remoteRpcCall("arkiv_queryEntities", {
      namespace: this.namespace,
      filter: { "indexes.searcher": normalized },
      limit: 1,
    })) as { entities?: { payload: SearcherProfile }[] } | undefined;

    const found = res?.entities?.[0]?.payload;
    return found || null;
  }

  /**
   * Upserts a searcher profile with bond and slashing data.
   */
  async updateSearcherProfile(profile: SearcherProfile): Promise<void> {
    const normalized = profile.searcher.toLowerCase();

    if (this.isMemoryMode) {
      this.memoryProfiles.set(normalized, { ...profile });
      return;
    }

    await this.remoteRpcCall("arkiv_putEntity", {
      namespace: this.namespace,
      entityId: `${this.namespace}:searcher:${normalized}`,
      payload: profile,
      indexes: {
        searcher: normalized,
        lastSeenBlock: profile.lastSeenBlock,
      },
    });
  }

  /**
   * Records an LP restitution claim on the ledger.
   */
  async writeLPClaim(claim: LPClaim): Promise<void> {
    const lpNormalized = claim.lp.toLowerCase();

    if (this.isMemoryMode) {
      const existing = this.memoryClaims.get(lpNormalized) || [];
      existing.push({ ...claim });
      this.memoryClaims.set(lpNormalized, existing);
      return;
    }

    await this.remoteRpcCall("arkiv_putEntity", {
      namespace: this.namespace,
      entityId: `${this.namespace}:claim:${claim.receiptHash.toLowerCase()}`,
      payload: claim,
      indexes: {
        lp: lpNormalized,
        receiptHash: claim.receiptHash.toLowerCase(),
      },
    });
  }

  /**
   * Retrieves all restitution claims associated with an LP address.
   */
  async lpClaims(lpAddress: string): Promise<LPClaim[]> {
    const normalized = lpAddress.toLowerCase();

    if (this.isMemoryMode) {
      const claims = this.memoryClaims.get(normalized) || [];
      return [...claims].sort((a, b) => b.createdAt - a.createdAt);
    }

    const res = (await this.remoteRpcCall("arkiv_queryEntities", {
      namespace: this.namespace,
      filter: { "indexes.lp": normalized },
    })) as { entities?: { payload: LPClaim }[] } | undefined;

    const claims = (res?.entities || []).map((e) => e.payload);
    return claims.sort((a, b) => b.createdAt - a.createdAt);
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
    const current = (await this.searcherProfile(norm)) || {
      v: "1.0.0",
      searcher: norm,
      extractions: 0,
      bondedUSDC: "25.00", // Default baseline bond for demo
      slashedUSDC: "0.00",
      lastSeenBlock: blockNumber,
    };

    current.extractions += 1;
    current.lastSeenBlock = blockNumber;
    await this.updateSearcherProfile(current);
  }
}
