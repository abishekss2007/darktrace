# Stage 6 — Citation for MEV Loss Claim Specification

**Stage**: 6 (Fix Medium M2)  
**Objective**: Replace all uncited `"$1.2B"` claims across the repository with the conservative floor `"$1B+ annually"` / `"over $1 billion annually by conservative estimates"` and add the required methodology footnote.

---

## 1. Summary of Changes

1. **`README.md` (lines 3–7)**:
   - Replaced `"LPs are losing $1.2B to MEV."` with `"LPs are losing $1B+ annually to MEV (over $1 billion annually by conservative estimates[^1])."`
   - Added footnote `[^1]`:
     > `"LVR/MEV loss estimates vary by methodology; see Flashbots/RAMS and Dune MEV dashboards. DarkTrace uses 'over $1B annually' as a conservative floor, not a canonical figure."`
2. **`specs/00-plan.md` (lines 14–17)**:
   - Replaced `"exceeding $1.2B annually"` with `"over $1 billion annually by conservative estimates ($1B+ annually)[^1]"` and added the same methodology footnote `[^1]`.
3. **`apps/web/src/app/page.tsx` (line 16)**:
   - Replaced `"LPs are losing $1.2B to MEV."` with `"LPs are losing $1B+ annually to MEV (over $1 billion annually by conservative estimates)."`
4. **`specs/06-demo-script.md` (line 15, Step 6.3)**:
   - Updated the opening voiceover line to:
     > `"LPs are losing over a billion dollars annually to MEV extraction."`
5. **`AI_ATTRIBUTION.md` & `specs/README.md`**:
   - Updated attribution entries and indexed `hardening/06-mev-claim-citation.md`.

---

## 2. UI Screenshot Placeholder
- Home Page Hero Copy (`$1B+ annually` / `over $1 billion annually by conservative estimates`): `![screenshot](screenshots/06-home-mev-claim.png)`

