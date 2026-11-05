# DarkTrace — Arkiv Schema & Storage Specification

## 1. Overview

Arkiv provides a decentralized, queryable entity-database layer on DB-Chains. DarkTrace utilizes Arkiv to store immutable forensic proof receipts, historical searcher reputation scores, and liquidity provider restitution claim records.

All entities are namespaced under:
`darktrace.v1`

---

## 2. Entity Schemas

### 2.1 ExtractionReceipt
Represents an attested forensic receipt following an on-chain extraction detection and off-chain counterfactual verification.

```typescript
export interface ExtractionReceipt {
  v: "1.0.0";
  poolId: string;              // Uniswap v4 PoolId (0x hex)
  searcher: string;            // Frontrunning/Backrunning address
  victim: string;              // Swapper whose price was displaced
  lp: string;                  // Primary affected LP position / pool address
  blockNumber: number;         // Base Sepolia block number of attack
  extractedUSDC: string;       // Formatted extracted USDC amount (6 decimals)
  injectedSlippageBps: number; // Slippage caused directly by the frontrun
  legitSlippageBps: number;    // Counterfactual slippage without frontrun
  simulationHash: string;      // Deterministic viem execution hash (0x hex)
  txHashes: string[];          // [frontrunTx, victimTx, backrunTx]
  createdAt: number;           // Unix millisecond timestamp
}
```

**Indexing Attributes**:
- `entityType`: `"ExtractionReceipt"`
- `poolId`: Lowercase hex string
- `searcher`: Lowercase Ethereum address
- `victim`: Lowercase Ethereum address
- `receiptHash`: Canonical keccak256 hash of the normalized JSON string

---

### 2.2 SearcherProfile
Tracks cumulative extraction statistics, active bonds, and slashing records to construct an on-chain reputation score.

```typescript
export interface SearcherProfile {
  v: "1.0.0";
  searcher: string;            // Ethereum address of searcher bot
  extractions: number;         // Count of detected extractions
  bondedUSDC: string;          // Current active bond collateral (formatted string)
  slashedUSDC: string;         // Cumulative slashed collateral sent to RebateVault
  lastSeenBlock: number;       // Most recent block with observed activity
}
```

**Indexing Attributes**:
- `entityType`: `"SearcherProfile"`
- `searcher`: Lowercase Ethereum address

---

### 2.3 LPClaim
Maintains an immutable public record of every restitution claim settled by the `RebateVault` on Arc Testnet.

```typescript
export interface LPClaim {
  v: "1.0.0";
  receiptHash: string;         // keccak256 hash of the parent ExtractionReceipt
  lp: string;                  // Liquidity provider address receiving the rebate
  claimTx: string;             // Arc Testnet transaction hash
  createdAt: number;           // Unix millisecond timestamp
}
```

**Indexing Attributes**:
- `entityType`: `"LPClaim"`
- `lp`: Lowercase Ethereum address
- `receiptHash`: Canonical receipt identifier

---

## 3. Cryptographic Verification & Canonical Hashes

Every `ExtractionReceipt` produces a canonical `receiptHash` calculated deterministically:
$$\text{receiptHash} = \text{keccak256}(\text{utf8Encode}(\text{canonicalStringify}(receipt)))$$

This hash matches the attestation stored in `SimulationRegistry.sol` on Arc and is required by `RebateVault.sol` to claim USDC.
