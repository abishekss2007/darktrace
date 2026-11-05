# DarkTrace — Deployment Specification

**Target Event**: ETHGlobal Mumbai 2026  
**Networks**:
- **Base Sepolia** (EVM / Uniswap v4 PoolManager & Hook)
- **Arc Testnet** (Circle USDC-native L1 / SimulationRegistry & RebateVault)
- **Arkiv Decentralized Proof Ledger** (Namespace: `darktrace.v1`)

---

## 1. Network & Parameter Matrix

| Network | Chain ID | Currency | Primary Contracts Deployed |
| :--- | :--- | :--- | :--- |
| **Base Sepolia** | `84532` | `ETH` | `DarkTraceHook` (`0x...00C0`), `SearcherRegistry` |
| **Arc Testnet** | `5042002` | `USDC` (native 18d) | `SimulationRegistry`, `RebateVault` (using 6d ERC-20 `0x36000...`) |
| **Arkiv Ledger** | N/A (Gateway) | N/A | Namespace `darktrace.v1` schemas & receipts |

### Official Protocol Endpoints & Precompiles
* **Base Sepolia PoolManager**: `0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408`
* **Arc Testnet RPC**: `https://rpc.testnet.arc.circle.com`
* **Arc Native USDC ERC-20 Wrapper**: `0x3600000000000000000000000000000000000000` (6 decimals)
* **Arkiv API Gateway**: `https://api.testnet.arkiv.network`

---

## 2. Uniswap v4 Hook Deployment & Salt Mining (Base Sepolia)

### 2.1 Hook Flag Bitmask
Uniswap v4 requires hook contracts to encode permission flags directly in the leading bits of their contract address:
```solidity
uint160 public constant BEFORE_SWAP_FLAG = 1 << 7; // 0x0080
uint160 public constant AFTER_SWAP_FLAG  = 1 << 6; // 0x0040
uint160 public constant REQUIRED_FLAGS   = 0x00C0;
```
Any deployment must be executed through a CREATE2 deployer or salt mining script that searches for a salt producing `(address(hook) & 0x3FFF) == 0x00C0`.

### 2.2 Deployment Script (`DeployBaseSepolia.s.sol`)
The deployment script:
1. Deploys `SearcherRegistry.sol` using standard CREATE.
2. Mines a 32-byte salt that satisfies `0x00C0` permissions when deploying `DarkTraceHook(poolManager, address(searcherRegistry))`.
3. Deploys `DarkTraceHook.sol` via CREATE2 with the mined salt.
4. Outputs the deployed contract addresses and verification parameters.

Command:
```bash
forge script script/DeployBaseSepolia.s.sol:DeployBaseSepoliaScript \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --verify
```

---

## 3. Arc Settlement & Rebate Deployment (Arc Testnet)

### 3.1 Deployment Sequence
1. Deploy `SimulationRegistry.sol` (registers deterministic counterfactual proof hashes).
2. Deploy `RebateVault.sol` configured with:
   - `usdc`: `0x3600000000000000000000000000000000000000` (Arc standard 6-decimal USDC ERC-20 interface)
   - `simulationRegistry`: Deployed `SimulationRegistry` address
   - `authorizedSigner`: Simulator worker public address
3. Seed `RebateVault` with initial test USDC pool liquidity (e.g., 50,000 USDC) to service claims.

Command:
```bash
forge script script/DeployArcTestnet.s.sol:DeployArcTestnetScript \
  --rpc-url https://rpc.testnet.arc.circle.com \
  --broadcast
```

---

## 4. Arkiv Proof Ledger Registration

Register namespace schemas via the Arkiv client:
```typescript
import { ArkivClient } from "@darktrace/arkiv";

const arkiv = new ArkivClient({
  gatewayUrl: process.env.ARKIV_GATEWAY_URL || "https://api.testnet.arkiv.network",
  privateKey: process.env.ARKIV_SIGNER_KEY,
});

await arkiv.registerSchema("ExtractionReceipt", extractionReceiptSchema);
await arkiv.registerSchema("SearcherProfile", searcherProfileSchema);
await arkiv.registerSchema("LPClaim", lpClaimSchema);
```

---

## 5. Off-Chain Indexer & Watchdog Worker Setup

The indexer runs as a Node.js daemon (or Docker container) bridging Base Sepolia and Arc Testnet:

### Environment Configuration (`apps/indexer/.env`)
```bash
# Base Sepolia
BASE_SEPOLIA_RPC=https://sepolia.base.org
DARKTRACE_HOOK_ADDRESS=0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0
SEARCHER_REGISTRY_ADDRESS=0x24A2669C706CCE71BAea24a4De18D9D215713551

# Arc Testnet
ARC_TESTNET_RPC=https://rpc.testnet.arc.circle.com
SIMULATION_REGISTRY_ADDRESS=0xa91B334B80dEAc5a730B29311317b9bA82e4e7c8
REBATE_VAULT_ADDRESS=0x4De85311B930263CE81D3C89B5F942475beA798C
SIMULATOR_PRIVATE_KEY=0x...

# Arkiv
ARKIV_GATEWAY_URL=https://api.testnet.arkiv.network
ARKIV_PRIVATE_KEY=0x...
ARKIV_NAMESPACE=darktrace.v1

# Fast Mode for Local/Live Demo
DEMO_FAST=1
```

Running via Docker:
```bash
docker compose up -d
```

---

## 6. End-to-End Verification Runbook

1. **Verify Hook Flag Validation**: Call `poolManager.swap(...)` through hook on Base Sepolia; verify `ExtractionDetected` event emitted with valid `proofHash`.
2. **Verify Indexer Ingestion**: Check indexer stdout logs for `[DarkTrace Watcher] Detected ExtractionDetected` and `Simulation sealed with hash`.
3. **Verify Arkiv Ledger**: Query `arkiv.getByPool(poolId)` and ensure receipt exists with immutable timestamp.
4. **Verify Arc Claim Execution**: Execute `rebateVault.claimRebate(proofBundle, signature)` on Arc Testnet; assert LP USDC balance increases by exact extracted delta.

