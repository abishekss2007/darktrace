# Stage 7 Audit: README Polish & Submission Runbook

## 1. Overview & Objectives
Stage 7 polishes the project's primary entrypoint (`README.md`), verifying that all deployment tables, reproducibility commands, architecture diagrams, and submission evidence links are accurate, honest, and verifiable.

## 2. Key Refinements

1. **Dual Vault Table Transparency**:
   - Explicitly listed both the active Foundry settlement vault (`0x2ab7...28CD`, 5.00 USDC reserve) and the Arc Studio provenance vault (`0x6760...c1de`, 60/60 passing tests).
   - Documented both `SimulationRegistry` contracts (`0xb841...5CF8` and `0x5279...2983`).

2. **Honest Demo Behavior Description**:
   - Replaced claims of broadcasted on-chain claim transactions with an honest description of simulated restitution preview in the interactive terminal.
   - Refined slippage decomposition numbers (187 - 12 = 175 bps net injected slippage, $1.25 restitution).

3. **Deterministic Runbook**:
   - Added `pnpm install --frozen-lockfile`.
   - Included `pnpm test` step covering the TypeScript unit test suites.
   - Added Docker Compose build, healthcheck query, and teardown commands.

4. **Evidence Directory Integration**:
   - Linked [`docs/evidence/link-audit.md`](../../docs/evidence/link-audit.md) and [`docs/screenshots/README.md`](../../docs/screenshots/README.md).

