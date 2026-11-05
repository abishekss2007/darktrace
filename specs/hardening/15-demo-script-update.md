# Stage 6 — Demo Script Update for Arc Studio & Arkiv Live Verification

**Timestamp:** 2026-11-06T03:22:10+05:30  
**Status:** WAITING FOR APPROVAL  
**Proposed Commit:** `docs(demo): add arc studio + arkiv rabdi verification beats`  

---

## 1. Summary of Changes
Updated [`specs/06-demo-script.md`](file:///c:/Users/user/Desktop/darktrace/specs/06-demo-script.md):
- **Runtime & Setup Header:** Updated total runtime target to `~3:00` (well within ETHGlobal 4:00 limit) and added pre-recording checklist items for Arc Studio (`studio.arc.io`) and Arkiv Rabdi Explorer entity tab (`0xc327...f8ca`).
- **Added `[0:00 – 0:15]` Arc Studio Opening Beat:**
  - Visual: Arc Studio project page with 60 passing tests.
  - Spoken line: *"Every contract in DarkTrace was written and deployed through Arc Studio. The SimulationRegistry and RebateVault on Arc Testnet are here—at studio.arc.io—the same code you're about to watch settle a live USDC rebate."*
- **Modified `[1:30 – 2:05]` Arkiv Rabdi Beat:**
  - Visual: 3 seconds cut to `rabdi.explorer.arkiv.network` showing verified entity `0xc327...f8ca`.
  - Spoken line: *"Written by wallet 0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5. The entity is live on rabdi.explorer.arkiv.network—the exact query to verify it is in our README."*
- Updated `/AI_ATTRIBUTION.md`.

## 2. Diff Summary
- `M specs/06-demo-script.md` (+28/-12 lines)
- `A specs/hardening/15-demo-script-update.md` (+24 lines)
- `M AI_ATTRIBUTION.md` (+2 lines)

