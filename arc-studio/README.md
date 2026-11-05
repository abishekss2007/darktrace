# Arc Studio Qualification Runbook & Checklist

This runbook guides manual execution on [studio.arc.io](https://studio.arc.io) to qualify DarkTrace for the **Arc: Best Smart Contracts with Advanced Stablecoin Logic (Arc Studio)** partner prize.

---

## Action Checklist

- [ ] **Step 1:** Open [https://studio.arc.io](https://studio.arc.io) in your browser.
- [ ] **Step 2:** Click **New Project** → paste the prompt from [`/arc-studio/prompt.md`](./prompt.md).
- [ ] **Step 3:** Sign in with the wallet you control on Arc Testnet.
- [ ] **Step 4:** Allow Arc Studio to generate both contracts (`SimulationRegistry.sol` and `RebateVault.sol`) plus the Foundry test suite.
- [ ] **Step 5:** Run tests inside Arc Studio; confirm all test cases pass green (double-claim and unauthorized-attest).
- [ ] **Step 6:** Click **Deploy** for `SimulationRegistry` → copy the deployed address.
- [ ] **Step 7:** Click **Deploy** for `RebateVault` passing `(0x3600000000000000000000000000000000000000, <SimulationRegistry_Address>, <Your_Address>)` → copy the deployed address.
- [ ] **Step 8:** Copy the **SHAREABLE Studio Project URL** from the project settings / share button.
- [ ] **Step 9:** Fund `RebateVault` on Arc Testnet with 5 USDC using the Arc faucet or transfer `5000000` units of `0x3600...` USDC to the new vault address.
- [ ] **Step 10:** Record: deployed addresses, Studio URL, and deploy/funding tx hashes in [`/arc-studio/report.md`](./report.md).
- [ ] **Step 11:** Update Vercel environment variables:
  - `NEXT_PUBLIC_SIMULATION_REGISTRY=<New_Address>`
  - `NEXT_PUBLIC_REBATE_VAULT=<New_Address>`
- [ ] **Step 12:** Trigger redeploy on Vercel.
- [ ] **Step 13:** Open `https://darktrace-lovat.vercel.app/demo` and run the `/demo` interactive flow end-to-end to verify live on-chain settlement with the new addresses.
- [ ] **Step 14:** Paste the completed report back into this chat.

