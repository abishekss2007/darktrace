# DarkTrace Visual Evidence & Screenshot Catalog

This catalog documents the visual and structural evidence of the DarkTrace system across the Uniswap v4 hook, Arc Testnet USDC vault, Arkiv Rabdi ledger, and live web application.

---

## 1. Application Interface Views (Live Hosted on Vercel)

### A. Forensics Dashboard (`/dashboard`)
- **URL**: `https://darktrace-lovat.vercel.app/dashboard`
- **Key Visual Evidence**:
  - Monitored Uniswap v4 pools table.
  - Active LP reserve counter reflecting live on-chain balance (`5.00 USDC` in Foundry Vault `0x2ab7...28CD`).
  - Clear `[DEMO]` pills differentiating historical mock datasets from verified on-chain state.

### B. Interactive Forensic Terminal (`/demo`)
- **URL**: `https://darktrace-lovat.vercel.app/demo`
- **Key Visual Evidence**:
  - Two-column split layout: Left = Live Uniswap v4 Sandwich Attack replay; Right = Counterfactual pricing engine.
  - Slippage decomposition display: Gross observed slippage (`199 bps`) - Normal liquidity slippage (`12 bps`) = MEV injected slippage (`187 bps`).
  - Restitution calculation (`1.25 USDC`).
  - Honest settlement UX: Clicking "Claim Rebate" demonstrates restitution without broadcasting synthetic transactions, explicitly displaying `"Simulated Rebate Claim Settled (Demo)"`.

### C. Canonical Forensic Receipt View (`/receipt/0xe9e5...`)
- **URL**: `https://darktrace-lovat.vercel.app/receipt/0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce`
- **Key Visual Evidence**:
  - 3-tx sandwich sequence breakdown (frontrun swap -> victim swap -> backrun swap).
  - Explicit identifier labeling: Canonical `receiptHash` (`0xe9e5...`) vs Arkiv Entity Key (`0xc327...`).
  - Direct 1-click link to the verified entity on the Arkiv Rabdi Block Explorer.

---

## 2. On-Chain & Explorer Evidence

### D. Uniswap v4 Hook on Base Sepolia
- **Address**: `0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0`
- **Explorer**: `https://sepolia.basescan.org/address/0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0`
- **Verification**: Salt `0x139d` mined against CREATE2 deployer, fulfilling Uniswap v4 hook permissions `0x00C0` (`beforeSwap` and `afterSwap`).

### E. Arc Testnet Rebate Vault (Foundry Deployment)
- **Address**: `0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD`
- **Explorer**: `https://explorer.testnet.arc.io/address/0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD`
- **Verification**: Verified on-chain balance of `5.00 USDC` (`5,000,000` raw units) funded via transaction `0x4289870dba2b919eac9e654e853ff45f38a03bb9a66e0be3d6da8d8e07deab9d`.

### F. Arc Studio Contract Suite & Test Evidence
- **Report**: [`arc-studio/report.md`](../../arc-studio/report.md)
- **Verification**: 60 out of 60 unit, fuzz, reentrancy, and invariant tests passing inside Arc Studio, validating advanced stablecoin logic, `RebateVault.sol`, and `SimulationRegistry.sol`.

### G. Arkiv Rabdi Testnet Verified Ledger Entity
- **Entity Key (`$key`)**: `0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca`
- **Receipt Hash**: `0xe9e56b6adbf0cae90f08b28a0ae3dccd9fc4ece42eb7b0126e4f208646eae6ce`
- **Explorer**: `https://rabdi.explorer.arkiv.network/entity/0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca`
- **Write Transaction**: `0x544ee730bb736cdbafcd837bad62f857c8ed0e0eaedf7afce807ffb060c6e0f6`
- **Verification**: Fully queryable entity confirmed via SDK write/read roundtrip (`pnpm arkiv:write-test`).

