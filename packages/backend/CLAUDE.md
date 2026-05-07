# `packages/backend` — Convex backend

Reach for the `convex` user-global agent at `~/.claude/agents/convex.md` for idiomatic patterns. Highlights:

- `convex/schema.ts` is the source of truth. Every table validated. Indexes explicit (`.index("by_user", ["userId"])`).
- Three function kinds, never blur them: `query` (read-only, reactive), `mutation` (transactional), `action` (third-party calls, no transactions).
- Auth: `await ctx.auth.getUserIdentity()` at the top of every user-scoped function. Never trust client-supplied userIds.
- Scheduled functions in `crons.ts` before reaching for Trigger.dev.
- Internal-only functions: use `internalQuery` / `internalMutation` / `internalAction` (not exposed to the client).
- Vector search via `.vectorIndex(...)` before adding pgvector or Pinecone.

Tests: `convex-test`'s `convexTest()` wrapper for in-memory backend. Don't mock the DB.
