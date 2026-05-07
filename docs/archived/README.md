# `docs/archived/`

Archive lane. Files here are **not auto-loaded into agent context** — Claude Code, Cyrus, and gstack skills all skip this folder per the repo `CLAUDE.md` `## Do not load` rule.

## What lives here

Anything superseded but worth keeping for reference:

- An old `idea.md` after a substantive pivot (`archived/idea-v1.md`)
- A design that lost the bake-off (`archived/2026-04-15-bot-on-twilio.md`)
- A plan that was abandoned mid-execution
- Old TODOS lists from gstack reviews

## Rules

1. **Never directly create files here.** Move them in from `idea.md`, `designs/`, `plans/`, or `knowledge/` — preserve the original filename and date prefix.
2. **Don't grep this folder by accident.** Tooling won't auto-load it; humans can `grep docs/archived/` deliberately when researching.
3. **Reviving a file:** `git mv docs/archived/<file> docs/<live-folder>/<file>` and update its `status:` frontmatter.
