import {
  ExtractionReceipt,
  SearcherProfile,
  LPClaim,
  computeReceiptHash,
} from "./schemas";
import { ArkivSdk, ArkivReceipt } from "./sdk";

export interface ArkivClientConfig {
  accessKey?: string;
  /** Private key of the writer wallet (required for live writes). */
  privateKey?: string;
  /** Address whose entities are trusted on read. */
  writerAddress?: string;
  /** Logical namespace, used for entityId labels only. */
  namespace?: string;
  /** "memory" keeps everything in-process (tests / offline dev). */
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

export interface WriteReceiptResult {
  receiptHash: string;
  entityId: string;
  /** Arkiv $key of the created entity (undefined in memory mode). */
  entityKey?: string;
  /** Arkiv transaction hash (undefined in memory mode). */
  arkivTxHash?: string;
}

/** Strips Arkiv metadata off a live receipt, returning the canonical receipt shape. */
function toExtractionReceipt(r: ArkivReceipt): ExtractionReceipt {
  return {
    v: "1.0.0",
    poolId: r.poolId,
    searcher: r.searcher,
    victim: r.victim,
    lp: r.lp,
    blockNumber: r.blockNumber,
    extractedUSDC: r.extractedUSDC,
    injectedSlippageBps: r.injectedSlippageBps ?? 0,
    legitSlippageBps: r.legitSlippageBps ?? 0,
    simulationHash: r.simulationHash,
    txHashes: r.txHashes,
    createdAt: r.createdAtMs ?? 0,
  };
}

/**
 * DarkTrace's Arkiv adapter (Rabdi testnet, chain 7794095).
 * Live mode goes through the official @arkiv-network/sdk (see ./sdk.ts) and fails loudly.
 * Memory mode exists only for unit tests and offline development.
 */
export class ArkivClient {
  private namespace: string;
  private isMemoryMode: boolean;
  private sdk?: ArkivSdk;

  private memoryReceipts: Map<string, ExtractionReceipt> = new Map();
  private memoryProfiles: Map<string, SearcherProfile> = new Map();
  private memoryClaims: Map<string, LPClaim[]> = new Map();

  constructor(config: ArkivClientConfig = {}) {
    const devMode = config.devMode || process.env.ARKIV_DEV_MODE;
    this.namespace = config.namespace || "darktrace.v1";
    this.isMemoryMode = devMode === "memory";

    if (this.isMemoryMode) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("[arkiv] ARKIV_DEV_MODE=memory is not allowed in production");
      }
      console.warn("[arkiv] development memory mode — no live writes");
      return;
    }

    this.sdk = new ArkivSdk({
      accessKey: config.accessKey,
      privateKey: config.privateKey,
      writerAddress: config.writerAddress,
    });
  }

  get live(): boolean {
    return !this.isMemoryMode;
  }

  private async call<T>(what: string, fn: (sdk: ArkivSdk) => Promise<T>): Promise<T> {
    try {
      return await fn(this.sdk!);
    } catch (err) {
      const detail = err instanceof Error ? `: ${err.message}` : "";
      throw new ArkivRpcError(`[arkiv] ${what} failed on Rabdi${detail}`, err);
    }
  }

  /** Writes an immutable forensic receipt to Arkiv. */
  async writeExtractionReceipt(receipt: ExtractionReceipt): Promise<WriteReceiptResult> {
    const hash = computeReceiptHash(receipt);
    const entityId = `${this.namespace}:receipt:${hash}`;

    if (this.isMemoryMode) {
      this.memoryReceipts.set(hash.toLowerCase(), receipt);
      await this._recordSearcherExtraction(receipt.searcher, receipt.blockNumber);
      return { receiptHash: hash, entityId };
    }

    const res = await this.call("writeReceipt", (s) => s.writeReceipt(receipt));
    await this._recordSearcherExtraction(receipt.searcher, receipt.blockNumber);
    return { receiptHash: res.receiptHash, entityId, entityKey: res.entityKey, arkivTxHash: res.txHash };
  }

  /** All receipts recorded for a Uniswap v4 pool, newest first. */
  async getByPool(poolId: string): Promise<ExtractionReceipt[]> {
    const normalized = poolId.toLowerCase();
    if (this.isMemoryMode) {
      return Array.from(this.memoryReceipts.values())
        .filter((r) => r.poolId.toLowerCase() === normalized)
        .sort((a, b) => b.createdAt - a.createdAt);
    }
    const rows = await this.call("listReceiptsByPool", (s) => s.listReceiptsByPool(normalized));
    return rows.map(toExtractionReceipt);
  }

  /** A single receipt by its canonical receiptHash. */
  async getReceipt(hash: string): Promise<ExtractionReceipt | null> {
    const normalized = hash.toLowerCase();
    if (this.isMemoryMode) {
      const found = this.memoryReceipts.get(normalized);
      return found ? { ...found } : null;
    }
    const row = await this.call("getReceiptByHash", (s) => s.getReceiptByHash(normalized));
    return row ? toExtractionReceipt(row) : null;
  }

  /** Reputation profile for a searcher address. */
  async searcherProfile(address: string): Promise<SearcherProfile | null> {
    const normalized = address.toLowerCase();
    if (this.isMemoryMode) {
      const profile = this.memoryProfiles.get(normalized);
      return profile ? { ...profile } : null;
    }
    const p = await this.call("getSearcherProfile", (s) => s.getSearcherProfile(normalized));
    if (!p) return null;
    return {
      v: "1.0.0",
      searcher: p.searcher,
      extractions: p.extractions,
      bondedUSDC: p.bondedUSDC,
      slashedUSDC: p.slashedUSDC,
      lastSeenBlock: p.lastSeenBlock,
    };
  }

  /** Creates or patches a searcher profile. */
  async updateSearcherProfile(profile: SearcherProfile): Promise<void> {
    const normalized = profile.searcher.toLowerCase();
    if (this.isMemoryMode) {
      this.memoryProfiles.set(normalized, { ...profile });
      return;
    }
    await this.call("upsertSearcherProfile", (s) => s.upsertSearcherProfile(profile));
  }

  /** Records an LP restitution claim. */
  async writeLPClaim(claim: LPClaim): Promise<void> {
    const lpNormalized = claim.lp.toLowerCase();
    if (this.isMemoryMode) {
      const existing = this.memoryClaims.get(lpNormalized) || [];
      existing.push({ ...claim });
      this.memoryClaims.set(lpNormalized, existing);
      return;
    }
    await this.call("writeLPClaim", (s) => s.writeLPClaim(claim));
  }

  /** All restitution claims for an LP address, newest first. */
  async lpClaims(lpAddress: string): Promise<LPClaim[]> {
    const normalized = lpAddress.toLowerCase();
    if (this.isMemoryMode) {
      const claims = this.memoryClaims.get(normalized) || [];
      return [...claims].sort((a, b) => b.createdAt - a.createdAt);
    }
    const rows = await this.call("listLPClaims", (s) => s.listLPClaims(normalized));
    return rows
      .map((c) => ({ v: "1.0.0" as const, lp: c.lp, receiptHash: c.receiptHash, claimTx: c.claimTx, createdAt: c.createdAt }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  private async _recordSearcherExtraction(searcher: string, blockNumber: number): Promise<void> {
    const norm = searcher.toLowerCase();
    const current: SearcherProfile = (await this.searcherProfile(norm)) || {
      v: "1.0.0",
      searcher: norm,
      extractions: 0,
      bondedUSDC: "0",
      slashedUSDC: "0",
      lastSeenBlock: blockNumber,
    };
    current.extractions += 1;
    current.lastSeenBlock = blockNumber;
    await this.updateSearcherProfile(current);
  }
}
