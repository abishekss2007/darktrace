# DarkTrace — 3-Minute Video Demo Script

**Event**: ETHGlobal Mumbai 2026  
**Format**: ~3:00, 1080p, real voiceover (no text-to-speech, no video speedup)  
**Target Prizes**: Uniswap Foundation, Arc, Arkiv  

---

## Pre-Recording Setup Checklist
- [ ] Have an Arc Studio tab open at [https://studio.arc.io](https://studio.arc.io) showing the generated and verified `SimulationRegistry` and `RebateVault` contracts (60 passing tests).
- [ ] Have `https://rabdi.explorer.arkiv.network/entity/0xc327d5db4aa3098b80dc8729d090317408f98d19e1e19c13d6cf83494a05f8ca` open in an adjacent browser tab.
- [ ] Verify both tabs and the live application (`https://darktrace-lovat.vercel.app`) load crisply from a clean profile at 100% zoom.
- [ ] Wallet connected to Arc Testnet with address holding testnet gas.

---

### [0:00 – 0:15] Arc Studio Provenance & Problem Statement
* **Visual**: One frame of the Arc Studio project page on `studio.arc.io` displaying `SimulationRegistry.sol` and `RebateVault.sol` (60 passing unit and invariant tests). Then snap directly to `http://localhost:3000/dashboard` (or `https://darktrace-lovat.vercel.app/dashboard`). Camera zooms slightly into the surveillance metrics showing:
  - 3 Monitored Pools `[DEMO DATA]`
  - $3.75 Extracted (24h) `[DEMO DATA]`
  - $5.00 USDC Vault Reserve on Arc (Live On-Chain)
* **Voiceover**:
  > *"Every contract in DarkTrace was written and deployed through Arc Studio. The SimulationRegistry and RebateVault on Arc Testnet are here—at studio.arc.io—the same code you're about to watch settle a live USDC rebate. LPs are losing over a billion dollars annually to MEV extraction. DarkTrace solves this: Uniswap v4 hooks detect the extraction, Arkiv seals the proof, and LPs get their USDC back on Arc."*

---

### [0:15 – 0:45] Live Attack Detection (Base Sepolia Hook)
* **Visual**: Click navigation to `/demo`. Cursor moves to top right and clicks the amber button: **`[Trigger Sandwich]`**.
* **Visual**: The radar pulse activates. A new row animates immediately into the left table stream:
  - Timestamp: `22:54:10.120`
  - Pool: `WETH / USDC`
  - Victim: `0x2222…2222`
  - Status Pill: `DETECTED` (amber)
  - Extracted ticker animates up to `$1.25`.
* **Voiceover**:
  > *"Here on Base Sepolia, a searcher just executed a 3-transaction sandwich attack against our Uniswap v4 pool. In `beforeSwap` and `afterSwap`, our hook uses Cancun transient storage—`tstore`—to record tick displacement and sender addresses without touching swap execution. When the searcher's backrun inverses the tick within the same block, the hook flags the fingerprint and emits `ExtractionDetected`."*

---

### [0:45 – 1:30] Counterfactual Simulation Breakdown
* **Visual**: The status pill automatically transitions to `SIMULATED` (blue). Click the receipt to inspect the right column:
  - Extracted USDC Loss: `$1.25`
  - Injected MEV: `+187 bps`
  - Natural Slippage: `12 bps`
  - LP LVR Impact: `-$1.21`
* **Voiceover**:
  > *"Our off-chain simulator on Arc instantly receives the event. Instead of guessing, it performs a deterministic counterfactual calculation against pre-attack reserves using Viem. Notice this breakdown: the victim suffered 187 basis points of slippage. But the counterfactual proves legitimate market slippage was only 12 basis points. Exactly 175 basis points of the user's execution was artificial toxic injection, extracting $1.25 from the trade."*

---

### [1:30 – 2:05] Cryptographic Proof Sealing on Arkiv Rabdi Testnet
* **Visual**: The status pill turns to `ARCHIVED` (purple).
* **Visual**: Highlight the `Canonical Receipt Hash` (`0x9c8d…abcd`) and the `Arkiv Proof Record` (`arkiv://darktrace.v1/receipt/...`).
* **Visual**: Cut for 3 seconds to `rabdi.explorer.arkiv.network` showing the live verified entity (`0xc327...f8ca`) on chain. Cut back to `/receipt/[hash]` to show the full immutable receipt record and transaction hashes.
* **Voiceover**:
  > *"The simulator serializes this forensic evidence into an immutable `ExtractionReceipt` under `darktrace.v1` on Arkiv. Written by wallet 0xb491fe5846DE735B6Cb03a677A3C6296FAB0aDA5. The entity is live on rabdi.explorer.arkiv.network—the exact query to verify it is in our README. Arkiv acts as the permanent, decentralized proof ledger. Once sealed, neither the searcher nor the LP can alter the facts of what happened in that block."*

---

### [2:05 – 2:45] USDC Restitution Claim on Arc & Base Sepolia Bond Attestation
* **Visual**: Return to `/demo`. The green button unlocks: **`[Claim $1.25 USDC Rebate]`**.
* **Visual**: Click the claim button. A brief confirmation pulse appears.
* **Visual**: Status switches to `REBATED` (mint green).
* **Visual**: The top counter **`LP USDC BALANCE (ARC)`** ticks up from `$15.00` to **`$16.25 USDC`** (drawing against the **`$5.00 USDC`** live `RebateVault` reserve).
* **Visual**: Click through to `/searcher/0x1111...` showing `bond reduced (Base Sepolia, forensic only)` by `$2.10 USDC` across observed Base Sepolia extractions.
* **Voiceover**:
  > *"Now, the restitution. On Arc, Circle's USDC-native Layer-1, `SimulationRegistry.sol` verifies the simulation hash, and `RebateVault.sol`—pre-funded with 5.00 USDC on-chain—releases $1.25 USDC directly to the LP. Watch the balance tick up in real time from $15.00 to $16.25 USDC. Independently on Base Sepolia, `SearcherRegistry` records a local forensic bond reduction against the searcher."*

---

### [2:45 – 3:00] Architecture Summary & Closing
* **Visual**: Switch to `/dashboard` showing the monitored pools list and architecture summary:
  1. Base Sepolia (Uniswap v4 Hook)
  2. Arc Testnet (Arc Studio Deployed Vault & Simulation Registry)
  3. Arkiv Rabdi Testnet (Decentralized Proof Ledger)
  - GitHub repo URL + MIT License.
* **Voiceover**:
  > *"Any Uniswap v4 pool can opt into DarkTrace by attaching our lightweight hook. The Arkiv receipt becomes the searcher's on-chain credit score, and Arc provides predictable, low-cost USDC settlement. DarkTrace: MEV forensics for Uniswap v4 LPs. Hooks detect it, Arkiv seals it, and Arc pays it back. Thank you."*
