# Final Submission Freeze Checklist — DarkTrace

Comprehensive evidence checklist verifying submission qualification across the three target partner prizes and cross-cutting integrity rules for ETHGlobal Mumbai 2026. Every item is marked `✅` (backed by an exact file path, command, or transaction hash) or `⚠️` (with explicit reason).

---

## 1. Uniswap Foundation — Qualifying Evidence

- [x] ✅ `/FEEDBACK.md` exists at repo root: [`FEEDBACK.md`](../../FEEDBACK.md)
- [x] ✅ `FEEDBACK.md` `blob/main/` URL resolves: `https://github.com/samudragupto/darktrace/blob/main/FEEDBACK.md`
- [x] ✅ Line numbers in `FEEDBACK.md` verified against current `contracts/src/DarkTraceHook.sol`:
  - `beforeSwap`: lines 103–120
  - `afterSwap`: lines 125–205
  - transient storage slots: lines 245–301
  - `PoolTransientState` bitpacking: lines 29–36, 257–301
  - Deployed hook address on Base Sepolia (`84532`): `0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0` (`0x00C0` flag bitmask, salt `0x139d`)
- [ ] ⚠️ Form submitted at `https://developers.uniswap.org/hackathon-feedback`: `[MANUAL: To be submitted by human user with FEEDBACK.md link]`
- [ ] ⚠️ Confirmation saved at `specs/submission/uniswap-form-confirmation.png`: `[MANUAL: Screenshot of confirmation screen to be captured upon form submission]`

---

## 2. Arc — Qualifying Evidence

- [x] ✅ `/arc-studio/prompt.md` exists: [`arc-studio/prompt.md`](../../arc-studio/prompt.md)
- [x] ✅ `/arc-studio/report.md` exists and is filled: [`arc-studio/report.md`](../../arc-studio/report.md)
  - Studio project URL: `https://studio.arc.io` (Project: DarkTrace MEV Restitution)
  - SimulationRegistry (Studio): `0x52794Da13E573c9e73D32248a286843418Ba2983`
  - RebateVault (Studio): `0x676065eb7c72ddf2048f21e6cb2ca6721827c1de`
  - Test suite results: **60 passing** (all unit, invariant, reentrancy, and fuzz tests)
  - Arc Native USDC (ERC-20, 6 decimals): `0x3600000000000000000000000000000000000000`
- [x] ✅ Studio project URL responds on Arc Testnet explorer:
  - SimulationRegistry: `https://explorer.testnet.arc.io/address/0x52794Da13E573c9e73D32248a286843418Ba2983`
  - RebateVault: `https://explorer.testnet.arc.io/address/0x676065eb7c72ddf2048f21e6cb2ca6721827c1de`
- [x] ✅ Original Foundry deployment retained and funded:
  - SimulationRegistry: `0xb8416cb4d82BA72b70C3EC55d7AC66b5DB415CF8`
  - RebateVault: `0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD` (funded with 5.00 USDC via tx `0x4289870dba2b919eac9e654e853ff45f38a03bb9a66e0be3d6da8d8e07deab9d`)
- [ ] ⚠️ Arc Studio vault unfunded: Studio's web deployer key (`0x5B12...`) is non-exportable; live demo settles against the funded Foundry deployment of the identical contracts.
- [x] ✅ `/demo` runs end-to-end: Displays live reserve on funded RebateVault (`0x2ab7...28CD`), calculates `$1.25 USDC` rebate claim, and honestly simulates settlement in the frontend UI without broadcasting fake on-chain claims.

---

## 3. Arkiv — Qualifying Evidence

- [x] ✅ All five required submission files exist at repository root:
  - [`/arkiv/schema.md`](../../arkiv/schema.md)
  - [`/arkiv/friction.md`](../../arkiv/friction.md)
  - [`/arkiv/reach.md`](../../arkiv/reach.md)
  - [`/arkiv/why-arkiv.md`](../../arkiv/why-arkiv.md)
  - [`/arkiv/how-you-use-arkiv.md`](../../arkiv/how-you-use-arkiv.md)
  - [`/arkiv/README.md`](../../arkiv/README.md) (judge index)
- [x] ✅ `lib/arkiv/client.ts` hits rabdi, no silent fallback in production:
  - Target endpoint: `https://rpc.rabdi.db-chain.testnet.arkiv.network` (Chain ID `7794095`)
  - Enforces `rabdi.db-chain.testnet.arkiv.network` hostname check
  - Throws typed `ArkivRpcError` on network errors
  - Disallows in-memory fallback unless explicitly running with `ARKIV_DEV_MODE="memory"`
- [x] ✅ Identifier decoupling strictly enforced:
  - `arkivEntityKey` (`0xc327...`): Used for Rabdi Block Explorer entity links.
  - `receiptHash` (`0xe9e5...`): Used for app routing (`/receipt/<hash>`) and contract attestation.
- [x] ✅ `pnpm arkiv:write-test` prints `WRITE_OK` and `READ_OK`:
  - Verified on Rabdi testnet via tx `0x544ee730bb736cdbafcd837bad62f857c8ed0e0eaedf7afce807ffb060c6e0f6`
  - `WRITE_OK 0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca`
  - `READ_OK 0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca`
- [x] ✅ `README.md` contains writer wallet + reproducible query + rabdi explorer link:
  - Writer wallet: `0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5`
  - Sample entity link: [https://rabdi.explorer.arkiv.network/entity/0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca](https://rabdi.explorer.arkiv.network/entity/0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca)
  - Reproducible viem / `@arkiv-network/sdk` query snippet included in [`README.md`](../../README.md#arkiv-integration-rabdi-testnet-chain-7794095)
- [x] ✅ `/arkiv/schema.md` names the writer wallet: `0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5`

---

## 4. Cross-Cutting Integrity

- [x] ✅ `AI_ATTRIBUTION.md` updated for every file touched across all stages: [`AI_ATTRIBUTION.md`](../../AI_ATTRIBUTION.md)
- [x] ✅ Linear commit history: **60+ commits**, all conventional commits with semantic prefixes.
- [x] ✅ CI/CD pipeline enforces `--frozen-lockfile`, `forge test`, `pnpm test`, and Next.js production build: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
- [x] ✅ Docker containerization verified with multi-stage build and `/health` probe: [`docker-compose.yml`](../../docker-compose.yml).
- [x] ✅ Hardening documentation suite complete:
  - `specs/hardening/24-read-only-link-audit.md` (Stage 0)
  - `specs/hardening/25-arkiv-identifier-fix.md` (Stage 1)
  - `specs/hardening/26-web3-claims.md` (Stage 2)
  - `specs/hardening/27-docker.md` (Stage 3)
  - `specs/hardening/28-ci-cd.md` (Stage 4)
  - `specs/hardening/29-link-verification.md` (Stage 5)
  - `specs/hardening/30-screenshots.md` (Stage 6)
  - `specs/hardening/31-readme.md` (Stage 7)
  - `specs/hardening/32-final-release-verification.md` (Stage 8)
- [x] ✅ Link audit and screenshots catalogs complete:
  - [`docs/evidence/link-audit.md`](../../docs/evidence/link-audit.md)
  - [`docs/screenshots/README.md`](../../docs/screenshots/README.md)

---

## 5. Submission Form Values (Paste Ready)

- **Project name:** `DarkTrace`
- **Tagline:** `MEV forensics for Uniswap v4 LPs. Hooks detect it, Arkiv seals it, and Arc pays it back in native USDC.`
- **Category:** `DeFi`
- **Emoji:** `🌘`
- **Target Partner Prizes:**
  1. **Uniswap Foundation:** `Build with Uniswap (from scratch)`
     - *Qualification Link:* `https://github.com/samudragupto/darktrace/blob/main/FEEDBACK.md`
  2. **Arc:** `Best Smart Contracts with Advanced Stablecoin Logic (Arc Studio)`
     - *Qualification Evidence:* Arc Studio generated contracts (`SimulationRegistry.sol` `0x52794Da13E573c9e73D32248a286843418Ba2983`, `RebateVault.sol` `0x676065eb7c72ddf2048f21e6cb2ca6721827c1de`), 60 passing unit tests, and [`arc-studio/report.md`](../../arc-studio/report.md)
  3. **Arkiv:** `Build on Arkiv (from scratch)`
     - *Qualification Evidence:* Five required documents in [`/arkiv/`](../../arkiv/), live verified entity [`0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca`](https://rabdi.explorer.arkiv.network/entity/0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca) on Rabdi testnet (`7794095`), and writer wallet `0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5`
- **NOT Selected:** Continuity bounties, Swarm bonus
