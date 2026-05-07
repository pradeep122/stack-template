# Project — `<rename-when-cloned>`

This was scaffolded from `pradeep122/stack-template` (which descends from `get-convex/turbo-expo-nextjs-clerk-convex-monorepo`).

## What lives where

| Path | Purpose | Notes |
|---|---|---|
| `apps/web/` | Next.js 16 (App Router) | Tailwind 4, Clerk, Convex client. Server Components by default. |
| `apps/native/` | Expo SDK + Expo Router | Same Convex + Clerk, NativeWind for styling. |
| `apps/agents/` | Claude Agent SDK workers | Long-lived agent loops (Telegram bots, scheduled workers, etc.). Scripts run via `tsx`. |
| `packages/backend/` | Convex backend | Schema, queries, mutations, actions, scheduled functions. The source of truth for data. |
| `packages/lib/` | Shared TS utilities | Pure functions used by 2+ apps. Vitest-tested. No DOM/RN imports here. |

## Priority order (strict)

`maintainability > testability > modularity > composability` — when two designs trade off, pick the more obvious-in-six-months one over the cleverer one.

## Conventions

- TypeScript strict everywhere. No `any` — use `unknown` and narrow.
- Vitest for unit + integration. Playwright for web E2E (in `apps/web/e2e/`).
- Test file lives next to source (`foo.ts` ↔ `foo.test.ts`).
- Server actions for form posts; route handlers only for webhooks/OAuth.
- Convex schema-first. Validate args. Don't call mutations from queries.
- No `useState` for data the server owns — use Convex `useQuery`.
- Don't write JSDoc that restates types. Comment the *why*, not the *what*.
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`. Co-author Claude when AI-generated.

## Secrets

`.env.tmpl` (committed) declares `bw://item-name/field` references. Run dev with `bw-env .env.tmpl -- pnpm dev`. Never commit real `.env` files. Per-project Bitwarden item names follow the pattern `<service>-<project-slug>` (e.g. `clerk-medtracker`, `convex-medtracker`).

## Common commands

```sh
pnpm install          # install all workspaces
pnpm dev              # turbo run dev — runs all apps' dev servers
pnpm typecheck        # turbo run typecheck across the workspace
pnpm test             # vitest across the workspace
pnpm lint             # next lint in apps/web
pnpm exec playwright test    # E2E (web)
```

## Per-tech sub-agents

Use the user-global agents at `~/.claude/agents/<tech>.md` for idiomatic patterns: `nextjs`, `convex`, `expo`, `vercel-ai-sdk`, `vitest`. For a tech not on that list, run `/scaffold-tech-agent <name>`.

## Cyrus

When this repo is registered with Cyrus (`cyrus self-add-repo <git-url> "datahats"`), Linear issues assigned to the Cyrus agent user automatically spawn a Claude session in a worktree of this repo. Issue comments + PR drafts come back to Linear and GitHub.
