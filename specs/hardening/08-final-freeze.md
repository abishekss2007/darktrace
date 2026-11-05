# Stage 8 — Q&A Prep, Demo Checklist, Booth Strategy & Final Freeze

**Timestamp:** 2026-11-06  
**Status:** Executed (Awaiting User Approval)  
**Target Commits:**
1. `docs(submission): qa prep + demo checklist + booth strategy`
2. `chore(specs): final hardening checklist`

---

## 1. Summary of Deliverables Created in Stage 8

### 1.1 Judge Q&A Rehearsal Guide (`specs/submission/qa-prep.md`)
Authored five direct, first-person answers strictly within the 60–80 word constraint:

| Question | Topic | Word Count | Target Range |
| :--- | :--- | :--- | :--- |
| **Q1** | Why isn't the hook blocking sandwiches instead of logging them? | **72 words** | 60–80 words |
| **Q2** | Who funds the RebateVault in production? | **72 words** | 60–80 words |
| **Q3** | How do you know the counterfactual price is right without replaying the full block? | **68 words** | 60–80 words |
| **Q4** | Isn't a 3-swap sequence detection trivially gameable by splitting across 2 addresses? | **71 words** | 60–80 words |
| **Q5** | Are your dashboard numbers real? | **73 words** | 60–80 words |

### 1.2 Ten-Point Pre-Record Demo Checklist (`specs/submission/demo-checklist.md`)
Created a numbered 10-point terminal and browser verification runbook covering:
1. Live Arc Testnet `RebateVault` balance check (`5.00 USDC` via `cast call`).
2. Wallet connection to Base Sepolia (`84532`) and Arc Testnet (`5042002`).
3. Fresh incognito session at `100%` zoom (`1920x1080`).
4. Always-visible `BASE SEPOLIA · ARC TESTNET` header badge.
5. Inline `[DEMO]` badges and `"Illustrative data. Live counters reflect only on-chain activity."` disclaimer.
6. End-to-end `/demo` dry run verifying `$1.25 USDC` extraction, `+$187 bps` vs `12 bps` slippage, and `-$1.21` LVR delta.
7. Two-flow separation cards (`Flow 1 · Base Sepolia` vs `Flow 2 · Arc Testnet`).
8. Pre-loaded Blockscout and Arc Explorer contract tabs.
9. Notification muting and microphone level check.
10. Live `/api/stats` JSON probe (`vaultBalanceUSDC: 5`).

### 1.3 Partner Booth Visit Runbook (`specs/submission/booth-strategy.md`)
Ordered `1. Uniswap Foundation → 2. Arc → 3. Arkiv` with:
- Exact pre-loaded URLs for each booth.
- 30-second first-person opening pitch tailored to each partner's prize criteria.
- Specific technical question to ask the partner engineer first.
- Direct feedback snippet mapped to `specs/submission/partner-feedback.md`.

### 1.4 Final Hardening Verification Matrix (`specs/hardening/FINAL-CHECKLIST.md`)
Compiled a flat verification checklist across all Non-Negotiable Rules and Stages 0–8 with exact file and line citations (`✅`) and explicit human-action items (`⚠️`).

