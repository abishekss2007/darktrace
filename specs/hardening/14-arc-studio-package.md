# Stage 5 — Arc Studio Qualification Package

**Timestamp:** 2026-11-06T03:02:00+05:30  
**Status:** WAITING FOR APPROVAL  
**Proposed Commit:** `chore(arc-studio): prompt + checklist + report template`  

---

## 1. Summary of Changes
Prepared the complete Arc Studio qualification package in `/arc-studio/`:
- [`arc-studio/prompt.md`](file:///c:/Users/user/Desktop/darktrace/arc-studio/prompt.md): Paste-ready prompt matching exact public APIs of `SimulationRegistry.sol` (`attest`, `receiptOf`) and `RebateVault.sol` (`claimRebate`, `fund`, `emergencyWithdraw`), specifying native Arc USDC `0x3600000000000000000000000000000000000000` (6 decimals), ReentrancyGuard, and Foundry unit tests for double-claim and unauthorized-attest.
- [`arc-studio/README.md`](file:///c:/Users/user/Desktop/darktrace/arc-studio/README.md): 14-step checklist for the human operator to complete on [studio.arc.io](https://studio.arc.io) (project creation, testing, deployment, vault funding, Vercel env update, and live demo run).
- [`arc-studio/report.md`](file:///c:/Users/user/Desktop/darktrace/arc-studio/report.md): Submission record template to document Studio project URL, deployed contract addresses, deployment tx hashes, and test results, with original Foundry deployment addresses retained for reproducibility.
- Updated [`AI_ATTRIBUTION.md`](file:///c:/Users/user/Desktop/darktrace/AI_ATTRIBUTION.md) with per-file entries.

## 2. Diff Summary
- `A arc-studio/prompt.md` (+74 lines)
- `A arc-studio/README.md` (+24 lines)
- `A arc-studio/report.md` (+15 lines)
- `A specs/hardening/14-arc-studio-package.md` (+26 lines)
- `M AI_ATTRIBUTION.md` (+5 lines)

