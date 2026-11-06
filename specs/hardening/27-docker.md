# Stage 3 Audit: Docker Configuration & Local Reproducibility

## 1. Overview & Objectives
The goal of Stage 3 is to make the DarkTrace forensic indexer service cleanly reproducible and testable in local and evaluator environments via Docker without requiring external private keys, broken cross-platform build artifacts, or phantom services.

## 2. Issues Identified & Remediations

### A. Obsolete `version: "3.8"` & Phantom Service
- **Issue**: `docker-compose.yml` specified the deprecated top-level `version: "3.8"` tag, triggering compose warnings. It also defined a `services.simulator` service that attempted to execute `node dist/simulator-worker.js`, which does not exist in the codebase (`simulator` is an internal TypeScript library consumed directly by the indexer pipeline).
- **Fix**: Removed the deprecated `version` attribute and purged the phantom `simulator` service.

### B. Placeholder Addresses & RPC Endpoints
- **Issue**: `docker-compose.yml` contained placeholder zero addresses for `HOOK_ADDRESS` and `SIMULATION_REGISTRY_ADDRESS`, and referenced outdated `.arc.network` RPC domains.
- **Fix**: Updated with verified deployment targets:
  - `HOOK_ADDRESS`: `0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0` (Base Sepolia)
  - `SIMULATION_REGISTRY_ADDRESS`: `0xb8416cb4d82BA72b70C3EC55d7AC66b5DB415CF8` (Arc Testnet Foundry registry)
  - `ARC_RPC_URL`: `https://rpc.testnet.arc.io`
  - `ARKIV_RPC_URL`: `https://rpc.rabdi.db-chain.testnet.arkiv.network`

### C. Multi-Stage Hermetic Container Build
- **Issue**: The original Dockerfile attempted to copy a pre-built host artifact (`dist/index.js`), which failed in container environments when the host had not run a pre-build, or copied host platform symlinks.
- **Fix**: Implemented a hermetic multi-stage build:
  1. **Builder Stage (`node:20-slim`)**: Prepares pnpm 9.1.4, installs dependencies with `--frozen-lockfile`, copies monorepo sources, and compiles `apps/indexer/dist/index.js` cleanly via esbuild.
  2. **Runner Stage (`node:20-slim`)**: Minimal production image containing only the bundled `dist/index.js`, `package.json`, and `curl` for the runtime healthcheck.

### D. Cross-Platform `.dockerignore`
- **Issue**: Missing or flat `node_modules` rules allowed host OS symlinks and build caches to contaminate the container build context.
- **Fix**: Configured comprehensive wildcard ignore rules (`**/node_modules`, `**/dist`, `**/.next`, `contracts/out`, `contracts/cache`, `.env*`).

### E. Evaluator Reproducibility in Memory Mode
- **Issue**: Evaluators running `docker compose up` do not possess production Arkiv private access keys; attempting to boot would throw `[arkiv] missing required env: ARKIV_RPC_URL, ARKIV_ACCESS_KEY.`.
- **Fix**: In `docker-compose.yml`, configured `NODE_ENV=development` and `ARKIV_DEV_MODE=memory` with `ARKIV_ACCESS_KEY=local_evaluator_memory_key`, allowing the indexer service to start, initialize the hook watcher, and pass health checks out-of-the-box.

## 3. Verification Evidence

### Compose Validation
```console
$ docker compose config -q
# Exit code: 0
```

### Build & Smoke Test
```console
$ docker compose build
# Built image darktrace-indexer:latest

$ docker compose up -d
# Container darktrace-indexer-1 Started

$ docker compose ps
# NAME                  IMAGE               COMMAND                  SERVICE   CREATED          STATUS                    PORTS
# darktrace-indexer-1   darktrace-indexer   "docker-entrypoint.s…"   indexer   21 seconds ago   Up 20 seconds (healthy)   0.0.0.0:8080->8080/tcp

$ curl http://localhost:8080/health
{
  "status": "healthy",
  "service": "indexer",
  "hookAddress": "0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0",
  "timestamp": "2026-11-05T23:58:52.704Z"
}

$ docker compose down
# Container darktrace-indexer-1 Stopped and Removed
```

