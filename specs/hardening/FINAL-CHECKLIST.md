# Final Hardening Checklist — DarkTrace Pre-Submission Audit

Flat verification matrix of every commitment required across Stages 0 through 8 and the Non-Negotiable Rules. Every `✅` cites the exact file and line range satisfying the requirement; every `⚠️` names the honest reason why human action or external infrastructure remains.

---

## Non-Negotiable Rules

- ✅ **Rule 1 — Preserve existing git history without squashing, rebasing, or amending**: All original 22 commits (`d567275`..`ec73cd7`) are untouched; 15 incremental conventional commits (`54cebe1`..`9892f98`, plus 2 Stage 8 commits) were appended on `main`.
- ✅ **Rule 2 — Targeted diffs only (no wholesale regeneration >30% without approval)**: All code and spec changes were applied as surgical edits via targeted patches (`git log -n 15 --stat`), with the `AI_ATTRIBUTION.md` rewrite explicitly authorized in Stage 4.2.
- ✅ **Rule 3 — No unverified on-chain or mathematical claims**: Every numerical claim is either bound to live Arc Testnet RPC (`apps/web/src/app/demo/page.tsx:L70-L82`, `apps/web/src/app/api/stats/route.ts:L16-L46`), proven via constant-product formula (`lib/simulator/counterfactual.ts:L1-L79`, `specs/03-arc-simulator.md:L28-L80`), or cited with conservative literature floors (`README.md:L16,L163-L165`).
- ✅ **Rule 4 — No fake tx hashes, fake block numbers, or unlabeled demo mode**: Synthetic claim tx hashes were removed (`apps/web/src/data/mockData.ts:L85,L124`, `apps/web/src/app/demo/page.tsx:L122-L129`), and all seeded figures carry an inline default-visible `[DEMO]` badge (`apps/web/src/components/ui/DemoData.tsx:L11-L39`).
- ✅ **Rule 5 — No synchronous cross-chain execution claims**: Base Sepolia bond reduction (`Flow 1`) and Arc Testnet pre-funded vault restitution (`Flow 2`) are explicitly separated across specs (`specs/03-arc-simulator.md:L117-L128`), contract comments (`contracts/src/SearcherRegistry.sol:L63`), and UI (`apps/web/src/app/receipt/[hash]/page.tsx:L170-L185`).
- ✅ **Rule 6 — Staged execution with commit prefixes, diff summaries, `/specs/hardening/NN-*.md` notes, and approval gates**: Documented across `specs/hardening/00-audit.md` through `specs/hardening/08-final-freeze.md`.
- ✅ **Rule 7 — Per-file `/AI_ATTRIBUTION.md` updated at every code/spec stage**: Maintained across all tracked files in `AI_ATTRIBUTION.md:L18-L114`.
- ⚠️ **Rule 8 — Screenshot placeholders (`![screenshot](screenshots/NN.png)`) populated with live PNG captures**: Markdown placeholders are embedded in `specs/hardening/01-vault-consistency.md:L69-L73`, `02-cross-chain-scope.md:L49-L51`, `03-demo-data-labeling.md:L55-L58`, `05-simulator-honesty.md:L47-L48`, and `06-mev-claim-citation.md:L29`, awaiting manual browser PNG capture by the user into `screenshots/`.

---

## Stage 0 — Read-Only Audit

- ✅ **0.a–0.j — Run all 10 read-only diagnostics (commit count, last 50 commits, diff stats, hardcoded numbers grep, fork/replay grep, cross-chain slash grep, `.env.example`, verbatim `AI_ATTRIBUTION.md`, live Arc `RebateVault` balance, Arkiv `ExtractionReceipt` count)**: Recorded verbatim in `specs/hardening/00-audit.md:L11-L265`.
- ✅ **0.memo — Output 4 blockers, 3 mediums, and recommended execution order**: Recorded in `specs/hardening/00-audit.md:L268-L303`.

---

## Stage 1 — Fix Blocker 1: Vault / Numbers Consistency

- ✅ **1.1 — Document actual vault balance (`5.00 USDC`), per-attack rebate amount (`$1.25 USDC`), and seeded dashboard range (`$3.75 USDC`)**: Recorded in `specs/hardening/01-vault-consistency.md:L11-L58`.
- ✅ **1.2 — Reconcile all UI numbers (`page.tsx`, `dashboard/page.tsx`, `demo/page.tsx`, `receipt/[hash]/page.tsx`, `pool/[id]/page.tsx`, `lp/[address]/page.tsx`, `searcher/[address]/page.tsx`, `mockData.ts`) and wrap seeded figures in `<DemoData>`**: Implemented in `apps/web/src/components/ui/DemoData.tsx:L1-L39`, `apps/web/src/data/mockData.ts:L16-L125`, `apps/web/src/app/page.tsx:L48-L78`, `apps/web/src/app/dashboard/page.tsx:L69-L176`, and `apps/web/src/app/demo/page.tsx:L18-L355`.
- ✅ **1.3 — Align `/specs/06-demo-script.md` LP balance delta (`$15.00 → $16.25 USDC`, `+$1.25 USDC`) and dashboard hero numbers (`$3.75` extracted, `$5.00 USDC` vault reserve)**: Implemented in `specs/06-demo-script.md:L35-L45,L85-L120`.
- ✅ **1.4 — Record vault funding plan (`5.00 USDC` via tx `0x4289870dba2b919eac9e654e853ff45f38a03bb9a66e0be3d6da8d8e07deab9d`) and per-receipt cap (`2.00 USDC`) in `/specs/03-arc-simulator.md`**: Implemented in `specs/03-arc-simulator.md:L103-L115`.
- ✅ **1.5 — Update `/AI_ATTRIBUTION.md` for all Stage 1 files**: Recorded in `AI_ATTRIBUTION.md:L77-L87,L94,L97,L100`.

---

## Stage 2 — Fix Blocker 2: Cross-Chain Slashing Honesty

- ✅ **2.1 — Add `"Cross-Chain Restitution: Out of Scope for Hackathon"` with the exact three required sentences to `/specs/03-arc-simulator.md`**: Implemented verbatim in `specs/03-arc-simulator.md:L117-L128`.
- ✅ **2.2 — Remove synchronous cross-chain language and separate Flow 1 (Base Sepolia) and Flow 2 (Arc) in `/specs/01-architecture.md` Mermaid diagram and `/specs/02-hook-design.md`**: Implemented in `specs/01-architecture.md:L12-L54` and `specs/02-hook-design.md:L114-L124`.
- ✅ **2.3 — Relabel UI copy on `/searcher/[address]`, `/receipt/[hash]`, and `/demo` to `"bond reduced (Base Sepolia, forensic only)"` with separate chain cards**: Implemented in `apps/web/src/app/searcher/[address]/page.tsx:L56-L77`, `apps/web/src/app/receipt/[hash]/page.tsx:L170-L185`, and `apps/web/src/app/demo/page.tsx:L131-L133,L307-L315`.
- ✅ **2.4 — Add `// NOTE: does not settle across chains; see specs/03` above `slashBond()` in `contracts/src/SearcherRegistry.sol` without altering bytecode**: Implemented in `contracts/src/SearcherRegistry.sol:L63` (`forge test` 4/4 passing).
- ✅ **2.5 — Write `/specs/hardening/02-cross-chain-scope.md` and update `/AI_ATTRIBUTION.md`**: Recorded in `specs/hardening/02-cross-chain-scope.md:L1-L52` and `AI_ATTRIBUTION.md:L30,L84-L87,L91-L97,L101`.

---

## Stage 3 — Fix Blocker 3: Testnet Demo Data Labeling

- ✅ **3.1 — Create `<NetworkBadge>` (`BASE SEPOLIA · ARC TESTNET`) always visible in top-right header**: Implemented in `apps/web/src/components/ui/NetworkBadge.tsx:L1-L16` and rendered in `apps/web/src/components/layout/Header.tsx:L67`.
- ✅ **3.2 — Create `<DemoData>` rendering inline `[DEMO]` badge (`10px` monospace, muted amber border) and add `"Illustrative data. Live counters reflect only on-chain activity."` below dashboard hero**: Implemented in `apps/web/src/components/ui/DemoData.tsx:L11-L39`, `apps/web/src/app/dashboard/page.tsx:L116-L118`, and `apps/web/src/app/page.tsx:L80-L82`.
- ✅ **3.3 — Create `/api/stats` route querying live Arc `RebateVault` balance and Arkiv `darktrace.v1` counts (`10s` cache, `<500ms` timeout)**: Implemented in `apps/web/src/app/api/stats/route.ts:L1-L78`.
- ⚠️ **3.3b — Remote Arkiv RPC endpoint (`https://rpc.arkiv.network`) live entity count**: `lib/arkiv/client.ts:L22-L108` falls back gracefully to deterministic in-memory stores (`memoryReceipts`, `memoryProfiles`, `memoryClaims`) and `/api/stats` returns `0` when the remote Arkiv JSON-RPC endpoint is unreachable or unauthenticated.
- ✅ **3.4 — Add `"Testnet & Demo Data Policy"` section to `/specs/05-ui-ux.md`**: Implemented in `specs/05-ui-ux.md:L114-L132`.
- ✅ **3.5 — Write `/specs/hardening/03-demo-data-labeling.md` and update `/AI_ATTRIBUTION.md`**: Recorded in `specs/hardening/03-demo-data-labeling.md:L1-L59` and `AI_ATTRIBUTION.md:L73,L77-L78,L81-L86,L89,L96,L102`.

---

## Stage 4 — Fix Blocker 4: Commit History + AI Attribution

- ✅ **4.1 — Evaluate commit count (`31` commits at Stage 4, `>25` threshold) and document git history**: Recorded in `specs/hardening/04-attribution-and-history.md:L11-L26` and `RESTRUCTURE_NOTES.md:L1-L30`.
- ✅ **4.2 — Rewrite `/AI_ATTRIBUTION.md` as a per-file table across `git ls-files` with `| File | AI-assisted | What AI drafted | What I rewrote / verified |`**: Implemented in `AI_ATTRIBUTION.md:L18-L114`.
- ⚠️ **4.2b — Fill remaining `[TODO: fill from commits]` personal notes in `/AI_ATTRIBUTION.md`**: 6 boilerplate config rows (`contracts/README.md`, `lib/arkiv/tsconfig.json`, `lib/simulator/tsconfig.json`, `apps/indexer/tsconfig.json`, `apps/web/tsconfig.json`, `apps/web/postcss.config.mjs`) retain `[TODO: fill from commits]` per Stage 4.2 instruction (`"Where you don't know what I personally wrote vs AI, leave a placeholder [TODO: fill from commits] and list those files for me to fill in manually"`).
- ✅ **4.3 — Create `/specs/README.md` indexing all core specs (`00`–`07`), hardening notes (`00`–`08`), and submission artifacts**: Implemented in `specs/README.md:L1-L40`.
- ✅ **4.4 — Write `/specs/hardening/04-attribution-and-history.md`**: Recorded in `specs/hardening/04-attribution-and-history.md:L1-L56`.

---

## Stage 5 — Fix Medium M1: Simulator Honesty

- ✅ **5.1 — Audit `/lib/simulator` and `/apps/indexer` for fork/replay vs. closed-form CPMM implementation (Path B confirmed)**: Documented in `specs/hardening/05-simulator-honesty.md:L11-L25`.
- ✅ **5.2 (Path B) — Add header comment `// Counterfactual price = CPMM formula applied to (reserveBefore, victimSwapInput). No fork replay. See specs/03 §3.2.` to `lib/simulator/counterfactual.ts` and align terminology across code, specs, and UI**: Implemented in `lib/simulator/counterfactual.ts:L1`, `apps/indexer/src/pipeline.ts:L6,L101`, `apps/web/src/app/page.tsx:L131`, and `apps/web/src/app/receipt/[hash]/page.tsx:L132`.
- ✅ **5.3 — Add `"Fidelity & Limits"` section to `/specs/03-arc-simulator.md` stating full tick-crossing replay is a post-hackathon upgrade**: Implemented in `specs/03-arc-simulator.md:L82-L98`.
- ✅ **5.4 — Write `/specs/hardening/05-simulator-honesty.md` and update `/AI_ATTRIBUTION.md`**: Recorded in `specs/hardening/05-simulator-honesty.md:L1-L50` and `AI_ATTRIBUTION.md:L46,L52,L94,L104`.

---

## Stage 6 — Fix Medium M2: Citation for the "$1.2B" Claim

- ✅ **6.1 — Replace all instances of `"$1.2B"` across `README.md`, `specs/00-plan.md`, `apps/web/src/app/page.tsx`, and `specs/06-demo-script.md` with `"$1B+ annually"` / `"over $1 billion annually by conservative estimates"` and add the methodology footnote**: Implemented in `README.md:L16,L163-L165`, `specs/00-plan.md:L16,L30-L32`, `apps/web/src/app/page.tsx:L24`, and `specs/06-demo-script.md:L20`.
- ✅ **6.2 — Write `/specs/hardening/06-mev-claim-citation.md` and update `/AI_ATTRIBUTION.md`**: Recorded in `specs/hardening/06-mev-claim-citation.md:L1-L31` and `AI_ATTRIBUTION.md:L19,L81,L91,L97,L105`.

---

## Stage 7 — Fix Medium M3: Partner Feedback Paragraphs

- ✅ **7.1 — Write `/specs/submission/partner-feedback.md` with three 200–250 word first-person paragraphs (Uniswap Foundation: 224 words, Arc: 230 words, Arkiv: 212 words) citing specific code and friction**: Implemented in `specs/submission/partner-feedback.md:L1-L34`.
- ✅ **7.2 — Write `/specs/hardening/07-partner-feedback.md`**: Recorded in `specs/hardening/07-partner-feedback.md:L1-L40`.

---

## Stage 8 — Q&A Prep + Final Freeze

- ✅ **8.1 — Write `/specs/submission/qa-prep.md` answering Q1–Q5 in 60–80 words each in direct first-person voice (Q1: 72 words, Q2: 72 words, Q3: 68 words, Q4: 71 words, Q5: 73 words)**: Implemented in `specs/submission/qa-prep.md:L1-L52`.
- ✅ **8.2 — Write `/specs/submission/demo-checklist.md` with a 10-point numbered pre-record verification list including live `5.00 USDC` vault check**: Implemented in `specs/submission/demo-checklist.md:L1-L57`.
- ✅ **8.3 — Write `/specs/submission/booth-strategy.md` ordered `Uniswap → Arc → Arkiv` with pre-loaded URLs, 30s pitches, booth questions, and feedback snippets**: Implemented in `specs/submission/booth-strategy.md:L1-L79`.
- ✅ **8.4 — Write `/specs/hardening/FINAL-CHECKLIST.md` with honest `✅` (file+line) and `⚠️` (reason) status markers**: Recorded in this file (`specs/hardening/FINAL-CHECKLIST.md:L1-L115`).

