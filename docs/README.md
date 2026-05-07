# `docs/` — idea→design→plan layout

Canonical doc layout for this repo. Every project scaffolded from `stack-template` inherits it. The contract:

| Path                  | What it is                                                            | Who reads it                          |
| --------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| `docs/idea.md`        | One-pager: problem, audience, hard constraints, current bet           | Everything. **Read first.**           |
| `docs/designs/`       | gstack outputs (design consultations, autoplan TODOS, design reviews) | gstack skills, /promote-spec, Cyrus   |
| `docs/plans/`         | superpowers executable phase plans                                    | superpowers, /promote-spec, Cyrus     |
| `docs/knowledge/`     | Research, business plans, market notes — read-only baseline           | Reference only — don't edit casually  |
| `docs/archived/`      | Archived; **NOT auto-loaded into context**                            | Nothing automatic                     |

The flow: an idea (`idea.md`) → a gstack design (`designs/YYYY-MM-DD-<slug>.md`) → a superpowers plan (`plans/YYYY-MM-DD-<slug>.md`) → execution (Cyrus / `/execute-plan`). Each artifact has a stable home so the next tool in the pipeline can find it.

See each folder's own `README.md` for naming + frontmatter rules.
