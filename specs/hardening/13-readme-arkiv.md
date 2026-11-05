# Stage 4 — README Section for Arkiv Rabdi Qualification

**Timestamp:** 2026-11-06T02:58:58+05:30  
**Status:** WAITING FOR APPROVAL  
**Proposed Commit:** `docs(readme): arkiv rabdi integration section + reproducible query`  

---

## 1. Summary of Changes
- Added deployed addresses table rows for `Arkiv (rabdi, 7794095)` namespace (`darktrace.v1`) and sample verified entity (`0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca`).
- Added dedicated section `## Arkiv integration (rabdi testnet, chain 7794095)` to `README.md` containing:
  - Writer wallet: `0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5`
  - Entities list and links to `/arkiv/schema.md` and `/arkiv/friction.md`
  - Reproducible verification query using `@arkiv-network/sdk` and `rabdi` chain
  - Live explorer link to verified entity
  - Sanity check command: `pnpm arkiv:write-test`
- Updated `/AI_ATTRIBUTION.md`.

## 2. Diff Summary
- `M README.md` (+45/-1 lines)
- `A specs/hardening/13-readme-arkiv.md` (+24 lines)
- `M AI_ATTRIBUTION.md` (+2 lines)

