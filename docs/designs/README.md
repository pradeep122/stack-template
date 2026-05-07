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
kind: design                # required
linear-issue: DAT-N         # set by /promote-spec when promoted
linear-project: <url>       # set by /promote-spec
status: DRAFT|APPROVED|SUPERSEDED
---
```

## Relocation from gstack cache

When a gstack skill writes to `~/.gstack/projects/<slug>/<file>.md`, move the markdown here as the final step and replace the original with a symlink so gstack tooling still resolves it:

```sh
SRC=~/.gstack/projects/<slug>/<gstack-filename>.md
DST=$(git rev-parse --show-toplevel)/docs/designs/<date>-<slug>.md
mv "$SRC" "$DST" && ln -s "$DST" "$SRC" && git add "$DST"
```

State files (`timeline.jsonl`, `learnings.jsonl`) stay in `~/.gstack/`. Only markdown moves.
