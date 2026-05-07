# `docs/plans/`

superpowers executable phase plans. Outputs of:

- `superpowers:writing-plans` (`/write-plan`)
- Read by `superpowers:executing-plans` (`/execute-plan`) and Cyrus

This is the **canonical superpowers plan location** for this repo, overriding the skill's default of `docs/superpowers/plans/`. The override is wired via the repo `CLAUDE.md` `## Tool routing` block.

## Naming

`YYYY-MM-DD-<slug>.md`. Slug names the deliverable (`phase-2-bot-m1-identity`, `founders-beta-sampler`).

## Frontmatter

```yaml
---
kind: plan                                          # required
linear-issue: DAT-N                                 # set by /promote-spec
linear-project: <linear-project-url>                # set by /promote-spec
design-doc: docs/designs/YYYY-MM-DD-<slug>.md       # link back to the gstack design (optional)
created: YYYY-MM-DD
status: ready
---
```

Plus the superpowers-required header line near the top:

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Phase headings

Use `## Phase N — <name>` or `## Milestone M<N> — <name>`. Cyrus dispatches on these heading forms when handling child issues.
