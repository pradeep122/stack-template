# Build from the repo root:
#   docker build -f apps/web/Dockerfile \
#     --build-arg NEXT_PUBLIC_CONVEX_URL=... \
#     --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=... -t web .
ARG NODE_VERSION=24
ARG TURBO_VERSION=2.9.10

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /app

FROM base AS pruner
ARG TURBO_VERSION
COPY . .
RUN pnpm dlx turbo@${TURBO_VERSION} prune web-app --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ ./
# Public by definition: these are inlined into the browser bundle.
ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web-app build

FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=8080
WORKDIR /app
COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=node:node /app/apps/web/public ./apps/web/public
# Next writes its ISR/image cache here; mount a volume to keep it across restarts.
RUN mkdir -p /app/apps/web/.next/cache && chown node:node /app/apps/web/.next/cache
USER node
VOLUME ["/app/apps/web/.next/cache"]
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
CMD ["node", "apps/web/server.js"]
