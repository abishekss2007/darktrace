# Stage 4 — Commit History & AI Attribution Specification

**Stage**: 4 (Fix Blocker 4)  
**Objective**: Audit commit count and history granularity, document initial scaffold commits transparently in `RESTRUCTURE_NOTES.md`, rewrite `/AI_ATTRIBUTION.md` as a comprehensive per-file table across `git ls-files`, and add `/specs/README.md` as the judge entry point.

---

## 1. Commit Count Audit (Step 4.1)
- **Diagnostic (`git log --oneline | wc -l`)**: **`31` commits** at Stage 4 start (exceeding the `>= 25` threshold, up from `22` at Stage 0, and will reach `38+` by Stage 8).
- **History Integrity**: Zero commits have been squashed, rebased, or amended.
- **Root Transparency Note (`RESTRUCTURE_NOTES.md`)**: Added `RESTRUCTURE_NOTES.md` at the repository root explaining why initial scaffold commit `77074c6` (monorepo + `pnpm-lock.yaml` + Foundry submodules) and Vercel container bundle commit `ec73cd7` (`apps/indexer/dist/index.js`) had large diff stats while all feature, test, deployment, and hardening work was committed in small, isolated conventional commits.

---

## 2. Per-File `/AI_ATTRIBUTION.md` Rewrite (Step 4.2)
- Rewrote `/AI_ATTRIBUTION.md` using the required four-column schema:
  `| File | AI-assisted | What AI drafted | What I rewrote / verified |`
- Covered every tracked project file from `git ls-files` with concrete line/commit references and `[TODO: fill from commits]` / `[HUMAN_NOTES]` placeholders where personal author notes can be added.

---

## 3. Judge Spec Entry Point (`/specs/README.md`, Step 4.3)
- Created `/specs/README.md` indexing all core specifications (`00-plan.md` through `07-deployment.md`) and all hardening audit specifications (`hardening/00-audit.md` through `hardening/04-attribution-and-history.md`) with one-line descriptions and clickable relative links.

