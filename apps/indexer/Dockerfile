FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/ ./lib/
COPY apps/indexer/ ./apps/indexer/

RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @darktrace/indexer build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app /app

ENV NODE_ENV=production
CMD ["node", "apps/indexer/dist/index.js"]
