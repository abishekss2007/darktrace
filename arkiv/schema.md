# Arkiv Schema — darktrace.v1

Technical specification for the three entity schemas indexed on the Arkiv Rabdi testnet (Chain ID `7794095`) under the `darktrace.v1` namespace.

---

## 1. Protocol Entity Schemas

### 1.1 `ExtractionReceipt` (Forensic MEV Proof)
- **Owner Wallet:** `0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5` (authorized DarkTrace indexer worker).
- **Expiration Policy:** 30 days (`ExpirationTime.fromDays(30)`).
  - *Justification:* Forensic sandwich evidence has a natural 30-day dispute and restitution review window. Historical analyses older than 30 days rely on the immutable canonical Solidity attestation committed to Arc Testnet via `SimulationRegistry.attest(receiptHash, ...)`.
- **Indexed Fields:**
  - `poolId`: `str().indexed()` — Enables O(1) query of all historical extractions for a specific Uniswap v4 pool.
  - `searcher`: `addr().indexed()` — Enables aggregating extractions into searcher reputation dossiers.
  - `victim`: `addr().indexed()` — Enables liquidity providers and victim swappers to discover compensable MEV losses.
  - `lp`: `addr().indexed()` — Enables pro-rata LP claim routing.
  - `blockNumber`: `u64().indexed()` — Enables range queries across blocks.
  - `receiptHash`: `str().indexed()` — Enables canonical point lookups matching on-chain `bytes32 receiptHash` in `SimulationRegistry.sol`.
- **Stored Non-Indexed Attributes:**
  - `extractedUSDC`: `dec()` — Quantified USDC extracted by injected slippage (6 decimals).
  - `simulationHash`: `str()` — Hash of counterfactual CPMM inputs.
  - `txHashes`: `bytes()` — Serialized JSON array containing the 3-transaction sandwich footprint (`[frontrunTx, victimTx, backrunTx]`).
  - `v`: `str()` — Schema version (`1.0.0`).

#### Verified Live On-Chain Example (Arkiv Rabdi Testnet)
The following record was created and verified on-chain via transaction `0x544ee730bb736cdbafcd837bad62f857c8ed0e0eaedf7afce807ffb060c6e0f6`:
```json
{
  "$key": "0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca",
  "$owner": "0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5",
  "receiptHash": "0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce",
  "poolId": "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
  "searcher": "0x1111111111111111111111111111111111111111",
  "victim": "0x2222222222222222222222222222222222222222",
  "lp": "0x3333333333333333333333333333333333333333",
  "blockNumber": 12489201,
  "extractedUSDC": "1.25",
  "simulationHash": "0xc9ddedeba69e600924875d3ce6c3e2cd554170c510cec4bfd5016182dc156309",
  "txHashes": "[\"0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111\",\"0xbbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222\",\"0xcccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333\"]"
}
```

---

### 1.2 `SearcherProfile` (Reputation Dossier)
- **Owner Wallet:** `0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5`.
- **Expiration Policy:** 30 days (`ExpirationTime.fromDays(30)`).
- **Indexed Fields:**
  - `searcher`: `addr().indexed()` — Lookup key for searcher reputation profiles.
  - `lastSeenBlock`: `u64().indexed()` — Recency filter for active searcher monitoring.
- **Stored Non-Indexed Attributes:**
  - `extractions`: `u64()` — Total cumulative sandwich events detected.
  - `bondedUSDC`: `dec()` — Baseline forensic bond on Base Sepolia (`$25.00 USDC`).
  - `slashedUSDC`: `dec()` — Cumulative bond reduced on Base Sepolia (`$2.10 USDC`).

#### Illustrative JSON Example
```json
// Illustrative profile entity
{
  "searcher": "0x1111111111111111111111111111111111111111",
  "extractions": 3,
  "bondedUSDC": "25.00",
  "slashedUSDC": "2.10",
  "lastSeenBlock": 12489350
}
```

---

### 1.3 `LPClaim` (Restitution Proof)
- **Owner Wallet:** `0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5`.
- **Expiration Policy:** 30 days (`ExpirationTime.fromDays(30)`).
- **Indexed Fields:**
  - `lp`: `addr().indexed()` — Queries all historical USDC restitution claims by an LP.
  - `receiptHash`: `str().indexed()` — Ensures one-to-one claim mapping.
- **Stored Non-Indexed Attributes:**
  - `claimTx`: `str()` — On-chain Arc Testnet transaction hash settling the USDC transfer.
  - `claimedUSDC`: `dec()` — Amount of USDC transferred from `RebateVault.sol`.
  - `createdAt`: `u64()` — Epoch timestamp of claim execution.

#### Illustrative JSON Example
```json
// Illustrative claim entity
{
  "receiptHash": "0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce",
  "lp": "0x9999000011112222333344445555666677778888",
  "claimTx": "0x4289870dba2b919eac9e654e853ff45f38a03bb9a66e0be3d6da8d8e07deab9d",
  "claimedUSDC": "1.25",
  "createdAt": 1730850000000
}
```

---

## 2. Read Path in DarkTrace Application

The following production frontend routes query Arkiv entities directly:
1. [`apps/web/src/app/searcher/[address]/page.tsx`](../apps/web/src/app/searcher/[address]/page.tsx): Queries `ExtractionReceipt` and `SearcherProfile` entities filtered by `where(eq("searcher", address))` to construct the searcher dossier.
2. [`apps/web/src/app/receipt/[hash]/page.tsx`](../apps/web/src/app/receipt/[hash]/page.tsx): Queries single `ExtractionReceipt` entities by `where(eq("receiptHash", hash))` to render the Arkiv Proof Record quadrant and the three-transaction sandwich sequence.
3. [`apps/web/src/app/api/stats/route.ts`](../apps/web/src/app/api/stats/route.ts): Queries aggregate entity counts from the `darktrace.v1` namespace for dashboard telemetry.

