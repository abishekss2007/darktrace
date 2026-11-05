# Commit History & Scaffold Notes for Judges

This document provides transparency on commit granularity across the DarkTrace repository (`git log --oneline`) for ETHGlobal Mumbai 2026 judges.

## Summary of Commit Structure
- **Total Commits**: 31+ incremental conventional commits (`feat`, `fix`, `test`, `docs`, `chore`), all authored during the ETHGlobal Mumbai 2026 hackathon window without history rewriting, squashing, or rebasing.
- **Note on Initial Monorepo Scaffold (`77074c6`)**:
  - Commit `77074c6` (`chore: scaffold monorepo, foundry, next.js, rainbowkit`) initialized the `pnpm` workspace lockfile (`pnpm-lock.yaml`, ~18,000 lines), Foundry standard libraries (`forge-std`, `v4-core`), and the Next.js 14 App Router + RainbowKit provider shell.
  - All core protocol logic—`DarkTraceHook.sol` (`8392e1b`), hook unit tests (`a7b1430`), Arkiv schemas & adapter (`21af7e4`, `594a740`), counterfactual simulator (`6148239`), Arc `RebateVault.sol` & `SimulationRegistry.sol` (`ccbfada`, `47e3aea`), off-chain indexer (`6c1ded5`, `a3e5212`), forensic UI views (`b068f72`, `3d63fc4`, `02d2cc7`, `dcd5bd6`), live deployments (`f10f121`, `1e01c48`), and the pre-submission hardening pass—was built and committed in small, isolated stage commits afterward.
- **Note on Vercel Container Bundle (`ec73cd7`)**:
  - Commit `ec73cd7` (`fix(vercel): make indexer container self-contained for vercel build context`) includes the pre-bundled `apps/indexer/dist/index.js` artifact required because Vercel multi-service container builds (`buildah`) scope the Docker build context strictly to `apps/indexer`.

