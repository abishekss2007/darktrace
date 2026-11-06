# Arkiv Schema — darktrace.v1

Technical specification for the three entity schemas indexed on the Arkiv Rabdi testnet (Chain ID `7794095`) under the `darktrace.v1` namespace.

The source of truth is the `defineSchema(...)` calls in [`lib/arkiv/sdk.ts`](../lib/arkiv/sdk.ts). The indexer writes and the web app reads through those same schemas.

| Logical entity | SDK schema name (`arkiv.schema` tag) |
| :--- | :--- |
| `ExtractionReceipt` | `receipts` |
| `SearcherProfile` | `darktrace.searcher_profiles` |
| `LPClaim` | `darktrace.lp_claims` |

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
  - `injectedSlippageBps`: `u64().optional()` — Slippage attributed to the frontrun.
  - `legitSlippageBps`: `u64().optional()` — Clean-market slippage from the CPMM counterfactual.
  - `createdAtMs`: `u64().optional()` — Receipt creation time. Together with the fields above, it lets anyone recompute `receiptHash` from Arkiv data alone.
  - *Why optional:* the sample entity below was written before these columns existed. Optional columns let it still match the schema, so it isn't silently skipped on reads. New writes always fill them in.

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
  - `bondedUSDC`: `dec()` — Forensic bond on Base Sepolia (starts at `0`; no invented default).
  - `slashedUSDC`: `dec()` — Cumulative bond reduced on Base Sepolia.
- **Upsert:** the indexer `patchEntity`s the existing profile owned by the writer, or `createEntity`s the first one.

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
  - `createdAtMs`: `u64()` — Epoch timestamp (ms) of claim execution.

#### Illustrative JSON Example
```json
// Illustrative claim entity
{
  "receiptHash": "0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce",
  "lp": "0x9999000011112222333344445555666677778888",
  "claimTx": "0x4289870dba2b919eac9e654e853ff45f38a03bb9a66e0be3d6da8d8e07deab9d",
  "createdAtMs": 1730850000000
}
```

---

## 2. Read Path in DarkTrace Application

Every read is filtered `.ownedBy(writer)`. The web routes below run on the server and query Arkiv on every request:

1. [`apps/web/src/app/dashboard/page.tsx`](../apps/web/src/app/dashboard/page.tsx): `receipts` ordered by `blockNumber desc`.
2. [`apps/web/src/app/receipt/[hash]/page.tsx`](../apps/web/src/app/receipt/[hash]/page.tsx): `receipts where receiptHash = …` (or `getEntity($key)`), plus `darktrace.lp_claims where receiptHash = …`.
3. [`apps/web/src/app/pool/[id]/page.tsx`](../apps/web/src/app/pool/[id]/page.tsx): `receipts where poolId = …`.
4. [`apps/web/src/app/searcher/[address]/page.tsx`](../apps/web/src/app/searcher/[address]/page.tsx): `receipts where searcher = …`.
5. [`apps/web/src/app/lp/[address]/page.tsx`](../apps/web/src/app/lp/[address]/page.tsx): `receipts where victim = …` ∪ `where lp = …`, plus `darktrace.lp_claims where lp = …`.
6. [`apps/web/src/app/api/stats/route.ts`](../apps/web/src/app/api/stats/route.ts): aggregate count and USDC sum over `receipts`.
