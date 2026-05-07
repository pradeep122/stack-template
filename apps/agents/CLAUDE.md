# `apps/agents` — Claude Agent SDK workers

## Purpose

Long-lived TypeScript processes that drive Claude as an agent. Examples: Telegram bots that reply via Claude, scheduled data extractors, on-demand research agents called from Convex actions.

This is *not* the place for Claude Code skills or sub-agents — those live in `~/.claude/`.

## When to add a worker here

Add when:
- The agent runs on a schedule or in response to events (not on a user's request path).
- It needs filesystem, long-running state, or local Ollama.
- It would otherwise be awkward to put inside a Convex action (`action()` has a 10-minute soft cap).

Don't add when:
- A Convex action is enough (simple LLM call from a mutation).
- It's a one-shot script — put in `scripts/`.

## Authentication

Local dev: Claude Code OAuth (Max plan) via the `claude` CLI's auto-detected creds. No env var needed.

Cloud / production worker: `ANTHROPIC_API_KEY` from `.env.tmpl` (`bw://anthropic/password`). Only fund when going to production.

## Conventions

- One file per agent in `src/`. Name the file by the *side effect*: `reply-on-telegram.ts`, not `agent.ts`.
- Pure helper code goes in `packages/lib/`, not here.
- Tests with Vitest. Mock the model with `MockLanguageModelV1` from `ai/test`; never hit the real model in unit tests.
- Use the `vercel-ai-sdk` user agent (`~/.claude/agents/vercel-ai-sdk.md`) when wiring a model call.

## Running

```sh
pnpm dev          # tsx watch — restart on change
pnpm start        # one-shot run
pnpm test         # vitest
pnpm typecheck    # tsc --noEmit
```
