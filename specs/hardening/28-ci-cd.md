# Stage 4 Audit: CI/CD Pipeline Hardening

## 1. Overview & Objectives
The CI/CD pipeline in `.github/workflows/ci.yml` is the gatekeeper for reproducible evaluation. The objective of Stage 4 is to enforce deterministic dependency resolution, eliminate loose supply-chain bypasses (`--frozen-lockfile=false`), and ensure complete test coverage across Solidity smart contracts, TypeScript unit tests, and production web bundles on every push and pull request.

## 2. Issues Identified & Remediations

### A. Supply-Chain Bypass (`--frozen-lockfile=false`)
- **Issue**: The original workflow executed `pnpm install --frozen-lockfile=false`, which ignores discrepancies between `package.json` and `pnpm-lock.yaml`, risking subtle dependency drift and supply-chain vulnerabilities in CI.
- **Fix**: Replaced with strict `pnpm install --frozen-lockfile`. Pinned pnpm version to `9.1.4` matching local development and container runtime.

### B. Missing TypeScript Test Execution
- **Issue**: The original CI workflow ran only `forge test` and `pnpm --filter @darktrace/web build`. It did not execute the 19 TypeScript unit tests in `@darktrace/simulator`, `@darktrace/arkiv`, and `@darktrace/indexer`.
- **Fix**: Added `pnpm test` step to CI, validating:
  - Counterfactual simulator slippage decomposition (187 - 12 = 175 bps) and hash repeatability.
  - Arkiv identity separation (`receiptHash` vs `arkivEntityKey`) and explorer deep-linking.
  - Forensic pipeline in-memory event ingestion, deduplication, and local attestation.

### C. Missing Indexer Standalone Bundler Verification
- **Issue**: CI did not verify whether `apps/indexer` could bundle its standalone artifact with esbuild.
- **Fix**: Added `cd apps/indexer && pnpm run build` to guarantee indexer bundle integrity prior to container packaging.

## 3. Workflow Specification
The hardened `.github/workflows/ci.yml` defines two parallel jobs:
1. **`foundry-test`**:
   - Environment: `ubuntu-latest`.
   - Toolchain: `foundry-rs/foundry-toolchain@v1` (`stable`).
   - Command: `cd contracts && forge test -vvv`.
2. **`node-ci`**:
   - Environment: `ubuntu-latest`.
   - Toolchain: Node `20` via `actions/setup-node@v4` with pnpm cache, `pnpm` `9.1.4`.
   - Commands:
     - `pnpm install --frozen-lockfile`
     - `pnpm test`
     - `cd apps/indexer && pnpm run build`
     - `pnpm --filter @darktrace/web build`

## 4. Local Execution Verification
All workflow steps were executed locally and passed with exit code 0:
- `forge test`: 15 passed, 0 failed.
- `pnpm test`: 19 passed, 0 failed.
- `cd apps/indexer && pnpm run build`: `dist/index.js` bundled cleanly.
- `pnpm --filter @darktrace/web build`: 12 routes generated cleanly.
