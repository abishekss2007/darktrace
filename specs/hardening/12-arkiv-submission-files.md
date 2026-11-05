# Stage 3 — The Five Arkiv Submission Files

**Timestamp:** 2026-11-06T02:55:10+05:30  
**Status:** WAITING FOR APPROVAL  
**Proposed Commits:**
1. `docs(arkiv): five submission files at required paths`
2. `docs(arkiv): README index for submission artifacts`

---

## 1. Summary of Changes
Created the five mandatory qualification documents at the repository root in `/arkiv/`:
- [`arkiv/schema.md`](file:///c:/Users/user/Desktop/darktrace/arkiv/schema.md): Detailed schemas for `ExtractionReceipt`, `SearcherProfile`, `LPClaim` with owner wallet `0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5`, 30-day expiration, and verified live on-chain entity `0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca` on Rabdi testnet.
- [`arkiv/friction.md`](file:///c:/Users/user/Desktop/darktrace/arkiv/friction.md): First-person engineering friction report addressing RPC endpoint drift (`rpc.arkiv.network` vs `rpc.rabdi.db-chain.testnet.arkiv.network`), canonical hash parity between TypeScript and Solidity (`SimulationRegistry.sol`), and fail-loud SDK design.
- [`arkiv/reach.md`](file:///c:/Users/user/Desktop/darktrace/arkiv/reach.md): Concrete audience breakdown (LPs, MEV researchers, pool deployers) and post-Mumbai roadmap.
- [`arkiv/why-arkiv.md`](file:///c:/Users/user/Desktop/darktrace/arkiv/why-arkiv.md): Analysis of decentralized DB-chain benefits over PostgreSQL, advantages over raw event logs, and deliberate size/expiry trade-offs.
- [`arkiv/how-you-use-arkiv.md`](file:///c:/Users/user/Desktop/darktrace/arkiv/how-you-use-arkiv.md): Explicit query filters (`poolId`, `searcher`, `victim`, `receiptHash`), frontend dependency paths, and honest declaration of off-chain simulation boundaries.
- [`arkiv/README.md`](file:///c:/Users/user/Desktop/darktrace/arkiv/README.md): Index guide for judges with verified explorer links.
- Updated [`AI_ATTRIBUTION.md`](file:///c:/Users/user/Desktop/darktrace/AI_ATTRIBUTION.md) with per-file entries.

## 2. Diff Summary
- `A arkiv/schema.md` (+82 lines)
- `A arkiv/friction.md` (+42 lines)
- `A arkiv/reach.md` (+36 lines)
- `A arkiv/why-arkiv.md` (+37 lines)
- `A arkiv/how-you-use-arkiv.md` (+41 lines)
- `A arkiv/README.md` (+24 lines)
- `A specs/hardening/12-arkiv-submission-files.md` (+30 lines)
- `M AI_ATTRIBUTION.md` (+7 lines)

