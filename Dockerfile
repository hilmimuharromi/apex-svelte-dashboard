# ── Stage 1: Build ──────────────────────────────────────────
FROM node:22-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy lockfiles first for cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install ALL deps (including devDeps needed for build)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build SvelteKit → adapter-node output
RUN pnpm run build

# Prune dev deps — keep only production node_modules for runtime
RUN pnpm prune --prod

# ── Stage 2: Runtime ───────────────────────────────────────
FROM node:22-slim AS runtime

WORKDIR /app

# Copy built output + production node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "build/index.js"]
