# Fullstack Monorepo Template

This repo is a modern TypeScript monorepo for a shared notes app across web and native.

It currently uses:

- [Turborepo](https://turbo.build/repo)
- [pnpm](https://pnpm.io/)
- [Next.js 16](https://nextjs.org/) with the App Router
- [Expo SDK 55](https://docs.expo.dev/) with Expo Router
- [React 19](https://react.dev/)
- [Convex](https://convex.dev/)
- [Clerk](https://clerk.com/)
- [OpenAI](https://platform.openai.com/docs/quickstart?api-mode=responses) for optional note summaries

## What’s inside

- `apps/web` - the Next.js web app
- `apps/native` - the Expo native app
- `packages/backend` - the Convex backend and generated API types

## Quick start

### 1. Install dependencies

```sh
pnpm install
```

### 2. Configure Convex

Run the backend setup command:

```sh
pnpm --filter @packages/backend setup
```

This will log you into Convex, create or connect a project, and generate `packages/backend/.env.local`.

### 3. Configure Clerk for Convex

Follow the official [Convex + Clerk guide](https://docs.convex.dev/auth/clerk).

In the Clerk dashboard, enable the Convex integration and copy the Clerk JWT issuer domain. Add it to your Convex environment variables as:

```sh
CLERK_JWT_ISSUER_DOMAIN=https://your-frontend-api.clerk.accounts.dev
```

If you want native social login, enable Google and Apple in Clerk as well.

If you want AI summaries, also add:

```sh
OPENAI_API_KEY=...
```

to your Convex environment variables.

### 4. Configure the app env files

Create `.env.local` files in `apps/web` and `apps/native` from the provided `.example.env` files.

- Use `CONVEX_URL` from `packages/backend/.env.local` for both `NEXT_PUBLIC_CONVEX_URL` and `EXPO_PUBLIC_CONVEX_URL`
- Use your Clerk publishable key for both app env files
- Use your Clerk secret key in `apps/web/.env.local`

### 5. Run the apps

```sh
pnpm dev
```

This runs the backend, web app, and native app through Turbo.

## Deploy to the home server (instead of Vercel)

Web apps run as containers on the Mac Studio (`~/server`), behind Caddy and a Cloudflare Tunnel, with secrets from the local Infisical. Convex and Supabase stay in their clouds; EAS builds are unaffected. Design: `~/server/docs/superpowers/specs/2026-10-14-app-hosting-design.md`.

### The per-app contract

- A `Dockerfile` that serves HTTP on `0.0.0.0:8080`.
- `GET /healthz` returns 200.
- Runs as a non-root user and works with a read-only root filesystem (`--read-only`), with a writable `/tmp` and an optional `/data` volume.
- Public build-time values (`NEXT_PUBLIC_*`, `PUBLIC_*`) arrive as build args. They end up in the browser bundle, so they are public by definition.
- Runtime secrets arrive only as environment variables. Nothing secret is baked into an image layer; check with `scripts/check-image-secrets.sh <image>`.

### Choose a recipe

| Project                                        | Recipe                                                   | `framework` for `new-app.sh` |
| ---------------------------------------------- | -------------------------------------------------------- | ---------------------------- |
| Next.js in this monorepo                       | `apps/web/Dockerfile` (standalone output, `turbo prune`) | `next`                       |
| Astro, fully static                            | `deploy/astro/Dockerfile.static` (nginx-unprivileged)    | `astro-static`               |
| Astro with endpoints, forms or any server code | `deploy/astro/Dockerfile.ssr` (Node adapter, standalone) | `astro-ssr`                  |

Prefer static whenever nothing needs a server. Copy the Astro recipe files into the Astro project root. `Dockerfile.ssr` needs `@astrojs/node` in `standalone` mode and a `src/pages/healthz.ts` route returning `ok`; `Dockerfile.static` needs `nginx.conf` and `security-headers.conf` beside it.

### Next.js image

Build from the repo root:

```sh
docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... \
  -t web .
docker run --read-only --tmpfs /tmp -e CLERK_SECRET_KEY=... -p 8080:8080 web
```

- Build args needed: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`. The build downloads Google Fonts, so it needs internet access.
- Runtime env needed: `CLERK_SECRET_KEY` (the server fails requests without it). Anything else the app reads from `process.env` belongs in Infisical.
- `/app/apps/web/.next/cache` (ISR and image-optimisation cache) is declared as a volume. Mount a named volume there to keep it across restarts; it is safe to lose.
- `sharp` is installed for `next/image`.
- `/healthz` is excluded from the Clerk proxy matcher in `apps/web/src/proxy.ts`, so health checks never touch auth.
- The `turbo` version in the Dockerfile (`TURBO_VERSION`) must match the one in the root `package.json`.

### Creating the server side

In `~/server`, `scripts/new-app.sh <app> --repo <git ssh url> --framework next|astro-static|astro-ssr [--dir <subdir>] [--prod-host <domain>] [--tier customer-facing|internal] [--infisical-project <id>]` generates the per-app directory (compose, deploy and env-rendering scripts, config). Follow what the script prints; do not hand-edit Caddy, Authelia or Cloudflare outside it.

### Secrets with Infisical

- One Infisical project per app named `<app>` with environments `dev`, `staging`, `prod`; one read-only machine identity per app named `app-<name>`.
- Local processes on the Mac Studio talk to `http://127.0.0.1:8081` (`export INFISICAL_DOMAIN=http://127.0.0.1:8081`); containers use `http://infisical:8080`; other machines use the public Infisical URL.
- `.infisical.json` holds only the project id (not a secret). Replace the placeholder `workspaceId` with the real one (`infisical init` writes it). Newer CLIs prefer `.infisical.yaml` but still read `.infisical.json`.
- Run anything with secrets through the CLI, never `.env` files or `bw-env`:

```sh
infisical run --env=dev -- pnpm dev
```

- Secrets the template expects in Infisical `dev`: `CONVEX_DEPLOY_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CONVEX_URL`; plus `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `ANTHROPIC_API_KEY` if the app uses them.
- Pushing secrets to the clouds is outbound only, via `~/server/scripts/infisical-push-convex.sh` and `~/server/scripts/infisical-push-supabase.sh` (run each without arguments for usage).

### Claude connectors (`.mcp.json`)

`.mcp.json` starts the Supabase and Convex MCP servers through `infisical run`, so `SUPABASE_ACCESS_TOKEN` and `CONVEX_DEPLOY_KEY` come from Infisical `dev` as environment variables and never appear in the file or in process arguments. Edit the placeholders: the Infisical project id and `--project-ref` for Supabase.

- Supabase: `@supabase/mcp-server-supabase` (pinned) with `--read-only` and `--project-ref`; the token is read from `SUPABASE_ACCESS_TOKEN`.
- Convex: `convex mcp start` with `--disable-tools run,envGet,envList,envSet,envRemove`. The deployment is selected by the dev `CONVEX_DEPLOY_KEY`. Production access stays off unless `--dangerously-enable-production-deployments` is passed, which this template never does.

Docs relied on: https://supabase.com/docs/guides/getting-started/mcp, https://github.com/supabase-community/supabase-mcp, https://docs.convex.dev/ai/convex-mcp-server, https://infisical.com/docs/cli/commands/run, https://infisical.com/docs/cli/project-config.

### What Vercel features are gone on purpose

- No preview deployments: one staging site (branch `main`, behind the Authelia login) and one production site (branch `prod`).
- No edge runtime: do not use `export const runtime = "edge"`; everything runs as Node.
- No Vercel analytics or speed insights; use PostHog/GA4.
- No multi-region CDN; Cloudflare caches static assets via cache headers.
- No push-to-deploy webhook yet; `deploy.sh` is run on the server.

### Vercel removal checklist

- [ ] Delete `apps/web/vercel.json` and the `.vercel/` directory; unlink the project (`vercel unlink`) and remove it in the Vercel dashboard once DNS has moved.
- [ ] Remove `runtime = "edge"` exports and any `@vercel/*` packages (for example `@vercel/analytics` and `@vercel/speed-insights`).
- [ ] Copy every Vercel environment variable into the matching Infisical environment, then delete them in Vercel. Public values become build args, not runtime env.
- [ ] Convex: the Vercel flow used `convex deploy --cmd`; deploy the backend separately (`pnpm --filter @packages/backend exec convex deploy`) and pass the production URL as the `NEXT_PUBLIC_CONVEX_URL` build arg.
- [ ] Clerk: add the new hostnames to the allowed origins and redirect URLs.
- [ ] Deploy to staging (`<app>-staging.datahats.app`), verify, then promote `main` to `prod` as the owner.
- [ ] DNS cutover: lower the TTL a day ahead, publish the production route on the server, point the domain's record at the Cloudflare tunnel, verify `HTTP 200` on the real hostname, and only then remove the domain from Vercel.

## Adding dependencies

Install dependencies in the package that actually uses them.

Examples:

```sh
pnpm --filter web-app add mypackage@latest
pnpm --filter native-app add mypackage@latest
pnpm --filter @packages/backend add mypackage@latest
```

## Notes

- The native app uses Expo Router route groups under `apps/native/src/app`
- The web app protects note routes with `apps/web/src/proxy.ts`
- Convex enforces note ownership server-side in `packages/backend/convex/notes.ts`
