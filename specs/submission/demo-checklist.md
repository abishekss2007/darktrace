# DarkTrace — 10-Point Pre-Record Demo Checklist

Run through all 10 items in order immediately before hitting record for the ETHGlobal Mumbai 2026 submission video.

---

1. [ ] **Local `pnpm dev` Boots Clean**:
   - Run `pnpm --filter @darktrace/web dev` and verify `http://localhost:3000` (and live production `https://darktrace-lovat.vercel.app/`) renders with zero console or hydration errors.
2. [ ] **`/demo` Trigger & Claim Button Works 10/10 Times**:
   - Click **`[Trigger Sandwich]`** -> verify `DETECTED` (`0s`) -> `SIMULATED` (`1.1s`) -> `ARCHIVED` (`2.1s`), then click **`[Claim $1.25 USDC Rebate]`** -> verify `REBATED` and balance increment `$15.00 → $16.25 USDC`. Refresh before recording.
3. [ ] **`RebateVault` Live On-Chain Balance Verified (`5.00 USDC`)**:
   - Run:
     ```bash
     cast call 0x3600000000000000000000000000000000000000 "balanceOf(address)(uint256)" 0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD --rpc-url https://rpc.testnet.arc.network
     ```
   - Confirm output prints `5000000 [5e6]` (**`5.00 USDC`**) and matches `VAULT RESERVE (ARC): $5.00 USDC` in `/demo` and `/dashboard`.
4. [ ] **Script Numbers Match Vault Balance to the Cent**:
   - Keep [`/specs/06-demo-script.md`](../06-demo-script.md) open on a second monitor:
     - Dashboard: `3 Monitored Pools [DEMO]`, `$3.75 Extracted (24h) [DEMO]`, `$5.00 USDC Vault Reserve (Arc)`
     - Demo attack: `$1.25 USDC` extracted (`+187 bps` injected vs `12 bps` natural, `-$1.21` LVR delta)
     - Claim delta: `$15.00 → $16.25 USDC` (`+$1.25 USDC`)
     - Searcher profile: `bond reduced (Base Sepolia, forensic only)` `$2.10 USDC [DEMO]`
5. [ ] **Header `<NetworkBadge>` & `[DEMO]` Pills Visible**:
   - Confirm `BASE SEPOLIA · ARC TESTNET` is visible in the top-right header bar and `[DEMO]` badges appear next to all seeded figures.
6. [ ] **Screen Recording Set to 1080p (`1920x1080`) & Mic Checked**:
   - Set browser zoom to `110%–125%` so monospace hashes and tabular numbers are legible at 1080p; record a 5-second audio test to check for clipping or background noise.
7. [ ] **Video Duration Strictly 2:00 – 3:45**:
   - Target `3:15` total runtime (never under `2:00`, never over `4:00`).
8. [ ] **No Text-to-Speech, No Speedup, No Music-Over-Text**:
   - Use real human voiceover at `1.0x` playback speed with zero background music.
9. [ ] **File Size & Bitrate Under Platform Limits**:
   - Export as `.mp4` (`H.264`, `AAC` audio, `~5–8 Mbps` bitrate, `< 100 MB` file size) for fast upload to ETHGlobal / YouTube / Loom.
10. [ ] **Backup Recording Saved Locally**:
    - Save a timestamped local copy (`darktrace-ethglobal-mumbai-2026-demo.mp4`) on disk before uploading.

