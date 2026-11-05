# DarkTrace — Judge Q&A Rehearsal Cards

**Tone**: Direct, honest about scope, zero marketing adjectives.  
**Length**: 60–80 words per answer, ready to memorize verbatim.

---

### Q1: "What's actually novel here?"
Most Uniswap v4 MEV hooks try to prevent extraction inside `beforeSwap` by adding dynamic fee spikes, auctions, or swap reverts, which adds latency and breaks aggregator routing. DarkTrace separates attribution from execution: our hook never blocks or taxes a swap. Instead, it fingerprints same-block tick inversions via transient storage, offloads constant-product counterfactual math off-chain, seals an indexed receipt on Arkiv, and settles LP restitution asynchronously in USDC on Arc against verifiable receipts.

---

### Q2: "The SimulationRegistry writer is a single EOA — why trust it?"
In this hackathon build, you do not have to trust the writer blindly because every `SimulationRegistry` attestation references an immutable Arkiv `ExtractionReceipt` containing the exact Base Sepolia transaction hashes, pre-attack reserves, and deterministic `keccak256` simulation hash. Anyone can re-run `runCounterfactualSimulation` against those inputs and verify the digest matches. Moving from an authorized operator EOA to a staked multi-prover quorum or TEE verifier is our production roadmap step, not claimed in this demo.

---

### Q3: "What stops a searcher from unbonding and continuing to sandwich?"
Nothing in a voluntary registry stops an unbonded address from submitting raw transactions to a public mempool. `SearcherRegistry` on Base Sepolia is an opt-in collateral and reputation layer for institutional solvers and routers that want verifiable clean-flow status. If a bonded solver sandwiches a protected pool, their Base Sepolia bond is reduced and their Arkiv `SearcherProfile` records the violation permanently, allowing order-flow routers to route around repeat offenders.

---

### Q4: "How is this different from Flashbots SUAVE / MEV trackers?"
MEV trackers like EigenPhi or Dune dashboards are read-only analytics tools that stop at block-level visualization and never return capital to affected LPs. SUAVE focuses on pre-execution order-flow auctions and encrypted block building. DarkTrace sits at the pool and post-execution settlement layer: our v4 hook attributes extraction inside `afterSwap`, Arkiv indexes the per-swap forensic receipt by pool and victim, and `RebateVault` on Arc turns that proof into an executable USDC claim.

---

### Q5: "What breaks first at scale?"
Two things break first at high throughput. First, our hook tracks one active `victimCandidate` and `frontrunTickDelta` per pool per block; if multiple independent sandwiches interleave inside the same pool during the same block, later swaps overwrite the earlier candidate slot. Second, our counterfactual engine uses single-range constant-product pricing (`x * y = k`), which is exact within one active v4 tick interval but drifts when a whale swap crosses multiple initialized tick boundaries.

