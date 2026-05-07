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

### How you (Claude) should behave when invoked by Cyrus

You'll be spawned in a fresh worktree with the assigned Linear issue's metadata available (issue id, title, description, **state**, labels, parent issue if any). **Dispatch on the issue's state.** Do not act outside what the state warrants — leave a comment explaining why and stop.

#### State: `Inbox` or `Spec`
**Refuse to act.** Post a Linear comment on the assigned issue:

> I don't act on `<state>` issues — they haven't been promoted yet. From a local Claude Code session, run `/promote-spec <issue-id>` to graduate this to `Building` (creates a project / milestone + linked plan file). Then re-assign me.

Move on. No code, no PR.

#### State: `Building` (the main case)

1. **Find the plan file**:
   - If the issue has a parent issue, fetch the parent and look for `linear-issue:` frontmatter pointers in the parent's description. Otherwise, look at this issue's own description.
   - In the worktree, search `docs/superpowers/plans/*.md` for a file with frontmatter `linear-issue: <this issue OR parent issue>`.
   - If 0 matches: post comment "no plan file found linked to this issue — run `/write-plan` then `/promote-spec` to set up the work" and stop.
   - If multiple: pick the most recent by mtime; mention the choice in the working comment.

2. **Identify the phase** (only if this is a child issue):
   - Child-issue titles look like `<parent title> — Phase N: <name>`.
   - Find the matching `## Phase N — <name>` section in the plan file.
   - If you can't pin a single phase, run the *whole* plan from the current state (read the plan's `- [ ]` checkboxes; pick up where the last commit left off).

3. **Execute**:
   - Use the **superpowers:executing-plans** skill — it runs the plan task-by-task with TDD discipline (RED → GREEN → REFACTOR per task, commit after each).
   - **Stay within the phase scope.** If the plan's other phases need work too, that's another child issue's job.
   - Don't widen scope. If the plan references a refactor "we'll also need to do later", don't do it here.

4. **Open a draft PR** when the phase's checkboxes are all green:
   - Title: matches the issue title (with the issue id prefix, e.g. `[DAT-24] Phase 1: schema + auth wiring`).
   - Body: the phase summary, list of changes, link back to the Linear issue.
   - Draft only — don't merge.

5. **Update the Linear issue**:
   - Post a comment with the PR link.
   - Don't change the issue state — that's the user's call (they merge, then `/land-and-deploy` moves it to `Done`).

6. **If you get stuck** for >20 minutes on one task:
   - Stop. Don't thrash.
   - Post a Linear comment with: what you tried, what's blocking, the smallest concrete question that would unblock you.
   - Add label `blocked-on-me`.
   - Don't open a PR for partial work.

#### State: `Shipping`

The user has run `/ship` already; a PR exists. Your job here is QA only.

1. Run the **gstack:qa** skill against a local dev server (`pnpm dev` then drive Chromium).
2. Find regressions, file fix commits on the same PR branch.
3. Post a comment summarizing what was tested and the result.
4. Don't merge. Don't change state.

#### State: `Done` or `Canceled`
**Refuse to act.** Post a comment: "this issue is `<state>` — re-open or create a new issue if there's more work." Stop.

---

### Hard rules across all states

- **Never** read or modify `~/.cyrus/.env` or anything under `~/.cyrus/` — those are secrets.
- **Never** use `--no-verify` to bypass git hooks. If a hook fails, fix the issue.
- **Never** force-push a branch you didn't create in this run.
- **Never** run destructive shell commands without a clear, scoped purpose (no `rm -rf` outside the worktree, no `git reset --hard origin/main`).
- **Always** check the issue's parent to see if there's a plan file pointer. The plan file is your spec.
- **Always** prefer reading existing code over guessing. The user's stack defaults are in this `CLAUDE.md`; per-tech idioms are in `~/.claude/agents/<tech>.md` (also accessible inside the Cyrus worktree).
- **Always** post one comment when you start, one when you finish (success or stuck). Silence is a bug.
