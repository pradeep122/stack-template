# `apps/web` — Next.js 16 (App Router)

Reach for the `nextjs` user-global agent at `~/.claude/agents/nextjs.md` for idiomatic patterns. Highlights:

- Server Components by default; `"use client"` only on small interactive leaves.
- Server Actions for form posts; route handlers only for webhooks / OAuth callbacks.
- Convex from the client via `convex/react`'s `useQuery` / `useMutation`; from server components via `convex/nextjs`'s `fetchQuery`.
- Tailwind 4 inline. No styled-components, no CSS modules.
- Vitest unit tests next to source (`foo.tsx` ↔ `foo.test.tsx`). Playwright in `e2e/`.
- Don't put `NEXT_PUBLIC_*` on a key that wouldn't be safe in a browser bundle.

Run:
- `pnpm dev` — Next dev server.
- `pnpm test` — Vitest.
- `pnpm exec playwright test` — E2E.
- `pnpm typecheck` / `pnpm lint`.
