# Arkiv Friction & Developer Experience Report

**Event:** ETHGlobal Mumbai 2026  
**Project:** DarkTrace (MEV Forensics for Uniswap v4 LPs)  
**Track:** Build on Arkiv (from scratch)  

---

## 1. Concrete Engineering Friction & Root Causes

### 1.1 RPC Endpoint Drift Between Docs & Testnet
When we started building DarkTrace, our client adapter was pointed at `https://rpc.arkiv.network` because that was the primary hostname surfaced in early documentation snippets. However, the active public testnet for hackathon submissions is **Rabdi** (`https://rpc.rabdi.db-chain.testnet.arkiv.network`, Chain ID `7794095`). Because the stale endpoint accepted connections but failed to process entities, this endpoint divergence cost us approximately 45 minutes of debugging.  
- **Suggested Improvement:** Add an explicit network indicator badge at the very top of `docs.arkiv.network` naming the active testnet ("Rabdi — Chain 7794095") and issue an HTTP 302 or clear JSON-RPC deprecation redirect on `rpc.arkiv.network` pointing developers to the current testnet RPC.

### 1.2 Canonical Hash Parity Between TypeScript & Solidity
In DarkTrace, Arkiv entity records anchor directly to an on-chain smart contract on Arc: [`contracts/src/SimulationRegistry.sol`](../contracts/src/SimulationRegistry.sol). The contract commits a canonical `bytes32 receiptHash` against which [`contracts/src/RebateVault.sol`](../contracts/src/RebateVault.sol) releases USDC to liquidity providers. Because standard JavaScript objects lack deterministic key ordering and native integer width types, we had to hand-craft a deterministic hashing routine in [`lib/arkiv/schemas.ts`](../lib/arkiv/schemas.ts) using `keccak256(stringToBytes(JSON.stringify({...})))` with strict lowercase normalization:
```typescript
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
```
Any mismatch in key sequence or checksum capitalization caused `RebateVault.claimRebate` to revert with `UnverifiedSimulation`.  
- **Suggested Improvement:** Publish an `@arkiv/schema-codegen` CLI tool that reads a `.arkiv` schema definition and compiles both TypeScript hashing helpers and an ABI-compatible Solidity `struct` with deterministic hashing functions. This is the single highest-leverage developer-experience improvement for any decentralized application that anchors Arkiv entities to EVM smart contracts.

### 1.3 Silent In-Memory Fallback vs. Fail-Loud Semantics
In our early prototype build, when the remote JSON-RPC returned a 502 error during local development, our client fell back to an in-memory `Map<string, ExtractionReceipt>` (`memoryReceipts`). As a result, write operations appeared to "succeed" in tests, but zero entities were published to the live testnet. We resolved this in Stage 2 by refactoring [`lib/arkiv/client.ts`](../lib/arkiv/client.ts) to throw a typed `ArkivRpcError` and strictly require `ARKIV_DEV_MODE="memory"` for mock testing.  
- **Suggested Behavior Change:** SDK client methods should fail loudly by default and never paper over RPC errors with silent fallbacks unless an offline mock mode is explicitly configured.

