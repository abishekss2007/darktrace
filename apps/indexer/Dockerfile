# Stage 1: Build standalone bundle
FROM node:20-slim AS builder

WORKDIR /app

# Enable pnpm matching monorepo version
RUN corepack enable && corepack prepare pnpm@9.1.4 --activate

# Copy workspace configuration and package manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/indexer/package.json ./apps/indexer/package.json
COPY lib/arkiv/package.json ./lib/arkiv/package.json
COPY lib/simulator/package.json ./lib/simulator/package.json
COPY apps/web/package.json ./apps/web/package.json

# Copy application and library source trees
COPY apps/indexer/src ./apps/indexer/src
COPY apps/indexer/tsconfig.json ./apps/indexer/tsconfig.json
COPY lib/arkiv ./lib/arkiv
COPY lib/simulator ./lib/simulator

# Install dependencies in container
RUN pnpm install --frozen-lockfile

# Build standalone bundled artifact within apps/indexer workspace
RUN cd apps/indexer && pnpm run build

# Stage 2: Minimal production runner
FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/apps/indexer/dist/index.js ./dist/index.js
COPY --from=builder /app/apps/indexer/package.json ./package.json

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "dist/index.js"]
