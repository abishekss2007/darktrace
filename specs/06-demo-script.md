# DarkTrace — 3-Minute Video Demo Script

**Event**: ETHGlobal Mumbai 2026  
**Format**: 3 minutes, 1080p, real voiceover (no text-to-speech, no video speedup)  
**Target Prizes**: Uniswap Foundation, Arc, Arkiv  

---

### [0:00 – 0:15] Hook & Problem Statement
* **Visual**: Screen recording opens on `http://localhost:3000/dashboard`. Camera zooms slightly into the top surveillance metrics showing:
  - 3 Monitored Pools `[DEMO DATA]`
  - $3.75 Extracted (24h) `[DEMO DATA]`
  - $5.00 USDC Vault Reserve on Arc (Live On-Chain)
* **Voiceover**:
  > *"In the last 24 hours on Base, LPs lost thousands to toxic sandwich attacks and LVR. Current solutions force a painful trade-off: either block trades and kill routing flow, or let LPs bleed value silently. DarkTrace solves this: hooks detect the extraction, Arkiv seals the proof, and LPs get their USDC back on Arc."*

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

### [1:30 – 2:05] Cryptographic Proof Sealing on Arkiv
* **Visual**: The status pill turns to `ARCHIVED` (purple).
* **Visual**: Highlight the `Canonical Receipt Hash` (`0x9c8d…abcd`) and the `Arkiv Proof Record` (`arkiv://darktrace.v1/receipt/...`). Click through to `/receipt/[hash]` to show the full immutable receipt record and transaction hashes.
* **Voiceover**:
  > *"The simulator serializes this forensic evidence into an immutable `ExtractionReceipt` and commits it to Arkiv. Arkiv acts as the permanent, decentralized proof ledger. Once sealed, neither the searcher nor the LP can alter the facts of what happened in that block."*

---

### [2:05 – 2:45] USDC Restitution Claim on Arc & Slashing
* **Visual**: Return to `/demo`. The green button unlocks: **`[Claim $1.25 USDC Rebate]`**.
* **Visual**: Click the claim button. A brief confirmation pulse appears.
* **Visual**: Status switches to `REBATED` (mint green).
* **Visual**: The top counter **`LP USDC BALANCE (ARC)`** ticks up from `$15.00` to **`$16.25 USDC`** (drawing against the **`$5.00 USDC`** live `RebateVault` reserve).
* **Visual**: Click through to `/searcher/0x1111...` showing searcher bonded collateral (`$25.00 USDC`) reduced by `$2.10 USDC` across observed Base Sepolia extractions.
* **Voiceover**:
  > *"Now, the restitution. On Arc, Circle's USDC-native Layer-1, `SimulationRegistry.sol` verifies the simulation hash, and `RebateVault.sol`—pre-funded with 5.00 USDC on-chain—releases $1.25 USDC directly to the LP. Watch the balance tick up in real time from $15.00 to $16.25 USDC."*

---

### [2:45 – 3:15] Network Effects & The Credit Score for MEV
* **Visual**: Switch to `/dashboard` and show the monitored pools list.
* **Voiceover**:
  > *"Any Uniswap v4 pool can opt into DarkTrace by attaching our lightweight hook. It requires no changes to user routing, no latency overhead, and no impossible single-tx cross-chain assumptions. The Arkiv receipt becomes the searcher's on-chain credit score, and Arc provides predictable, low-cost USDC settlement."*

---

### [3:15 – 3:30] Architecture Summary & Closing
* **Visual**: Slide displaying the three buildings:
  1. Base Sepolia (Uniswap v4 Hook)
  2. Arc Testnet (Rebate Vault & Simulator)
  3. Arkiv (Decentralized Proof Ledger)
  - GitHub repo URL + MIT License.
* **Voiceover**:
  > *"DarkTrace: MEV forensics for Uniswap v4 LPs. Hooks detect it, Arkiv seals it, and Arc pays it back. Thank you."*

