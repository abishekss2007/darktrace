# DarkTrace — 3-Minute Video Demo Script

**Event**: ETHGlobal Mumbai 2026  
**Format**: 3 minutes, 1080p, real voiceover (no text-to-speech, no video speedup)  
**Target Prizes**: Uniswap Foundation, Arc, Arkiv  

---

### [0:00 – 0:15] Hook & Problem Statement
* **Visual**: Screen recording opens on `http://localhost:3000/dashboard`. Camera zooms slightly into the top surveillance metrics showing:
  - 482 Extractions
  - $148,920.40 Extracted Volume (Past 7d)
  - $112,450.00 Rebates Paid on Arc
* **Voiceover**:
  > *"In the last 24 hours on Base, LPs lost thousands to toxic sandwich attacks and LVR. Current solutions force a painful trade-off: either block trades and kill routing flow, or let LPs bleed value silently. DarkTrace solves this: hooks detect the extraction, Arkiv seals the proof, and LPs get their USDC back on Arc."*

---

### [0:15 – 0:45] Live Attack Detection (Base Sepolia Hook)
* **Visual**: Click navigation to `/demo`. Cursor moves to top right and clicks the amber button: **`[Trigger Test Sandwich]`**.
* **Visual**: The radar pulse activates. A new row animates immediately into the left table stream:
  - Timestamp: `22:54:10.120`
  - Pool: `WETH / USDC`
  - Victim: `0x2222…2222`
  - Status Pill: `DETECTED` (amber)
  - Extracted ticker animates up to `$174.80`.
* **Voiceover**:
  > *"Here on Base Sepolia, a searcher just executed a 3-transaction sandwich attack against our Uniswap v4 pool. In `beforeSwap` and `afterSwap`, our hook uses Cancun transient storage—`tstore`—to record tick displacement and sender addresses without touching swap execution. When the searcher's backrun inverses the tick within the same block, the hook flags the fingerprint and emits `ExtractionDetected`."*

---

### [0:45 – 1:30] Counterfactual Simulation Breakdown
* **Visual**: The status pill automatically transitions to `SIMULATED` (blue). Click the receipt to inspect the right column:
  - Extracted USDC Loss: `$174.80`
  - Injected MEV: `+187 bps`
  - Natural Slippage: `12 bps`
  - LP LVR Impact: `-$169.50`
* **Voiceover**:
  > *"Our off-chain simulator on Arc instantly receives the event. Instead of guessing, it performs a deterministic counterfactual replay against pre-attack reserves using Viem. Notice this breakdown: the victim suffered 187 basis points of slippage. But the counterfactual proves legitimate market slippage was only 12 basis points. Exactly 175 basis points of the user's execution was artificial toxic injection, extracting $174.80 from the trade."*

---

### [1:30 – 2:05] Cryptographic Proof Sealing on Arkiv
* **Visual**: The status pill turns to `ARCHIVED` (purple).
* **Visual**: Highlight the `Canonical Receipt Hash` (`0x9c8d…abcd`) and the `Arkiv Proof Record` (`arkiv://darktrace.v1/receipt/...`). Click through to `/receipt/[hash]` to show the full immutable receipt record and transaction hashes.
* **Voiceover**:
  > *"The simulator serializes this forensic evidence into an immutable `ExtractionReceipt` and commits it to Arkiv. Arkiv acts as the permanent, decentralized proof ledger. Once sealed, neither the searcher nor the LP can alter the facts of what happened in that block."*

---

### [2:05 – 2:45] USDC Restitution Claim on Arc & Slashing
* **Visual**: Return to `/demo`. The green button unlocks: **`[Claim $174.80 USDC Rebate]`**.
* **Visual**: Click the claim button. A brief confirmation pulse appears.
* **Visual**: Status switches to `REBATED` (mint green).
* **Visual**: The top counter **`LP USDC BALANCE (ARC)`** ticks up from `$2,450.00` to **`$2,624.80 USDC`**.
* **Visual**: Click through to `/searcher/0x1111...` showing searcher bonded collateral reduced and slashed by `$174.80`.
* **Voiceover**:
  > *"Now, the restitution. On Arc, Circle's USDC-native Layer-1, `SimulationRegistry.sol` verifies the simulation hash, and `RebateVault.sol` releases USDC directly to the LP. Watch the balance tick up in real time: $174.80 returned. Meanwhile, the searcher's registered bond in `SearcherRegistry` is slashed, replenishing the vault."*

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
