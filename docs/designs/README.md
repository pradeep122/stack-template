# `docs/designs/`

gstack design + decision artifacts. Outputs of:

- `/design-consultation`, `/design-shotgun`, `/plan-design-review`
- `/office-hours`, `/autoplan`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-devex-review`
- ADR-style decision records (validation outcomes, architecture pivots)

## Naming

`YYYY-MM-DD-<slug>.md` — date prefix anchors the artifact in time, slug names the decision (`validation-experiment`, `bot-architecture`, `landing-page-spec`).

## Frontmatter

```yaml
---
kind: design # required
function: engineering | gtm | operations # required — see docs/README.md
linear-issue: DAT-N # the Linear project's umbrella issue (set when project exists)
linear-project: <url> # the Linear project this design backs (set when project exists)
status: DRAFT|APPROVED|SUPERSEDED
---
```

## H1 prefix

`# <Function> Design: <Title>`. Examples:

- `# Engineering Design: Phase 2 — Telegram Bot Architecture`
- `# GTM Design: Founder's Beta Sampler — Validation Experiment`

The function name in the H1 must match the `function:` value in FM.

## Relocation from gstack cache

When a gstack skill writes to `~/.gstack/projects/<slug>/<file>.md`, move the markdown here as the final step and replace the original with a symlink so gstack tooling still resolves it:

```sh
SRC=~/.gstack/projects/<slug>/<gstack-filename>.md
DST=$(git rev-parse --show-toplevel)/docs/designs/<date>-<slug>.md
mv "$SRC" "$DST" && ln -s "$DST" "$SRC" && git add "$DST"
```

State files (`timeline.jsonl`, `learnings.jsonl`) stay in `~/.gstack/`. Only markdown moves.
