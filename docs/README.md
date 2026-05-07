# `docs/` — idea→design→plan layout

Canonical doc layout for this repo. Every project scaffolded from `stack-template` inherits it. The contract:

| Path              | What it is                                                            | Who reads it                         |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------ |
| `docs/idea.md`    | One-pager: problem, audience, hard constraints, current bet           | Everything. **Read first.**          |
| `docs/designs/`   | gstack outputs (design consultations, autoplan TODOS, design reviews) | gstack skills, /promote-spec, Cyrus  |
| `docs/plans/`     | superpowers executable phase plans                                    | superpowers, /promote-spec, Cyrus    |
| `docs/knowledge/` | Research, business plans, market notes — read-only baseline           | Reference only — don't edit casually |
| `docs/archived/`  | Archived; **NOT auto-loaded into context**                            | Nothing automatic                    |

The flow: an idea (`idea.md`) → a gstack design (`designs/YYYY-MM-DD-<slug>.md`) → a superpowers plan (`plans/YYYY-MM-DD-<slug>.md`) → execution (Cyrus / `/execute-plan`). Each artifact has a stable home so the next tool in the pipeline can find it.

See each folder's own `README.md` for naming + frontmatter rules.

## Function tagging

Every design and plan declares which company function owns it. Default three buckets — refine in the repo `CLAUDE.md` if a project needs a different split:

| Function        | Scope                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Engineering** | Code (web/native/agents/backend), infra, dev tooling.                                                                     |
| **GTM**         | Acquisition, brand, content, social, customer research, validation experiments, product/UX, pricing, sales conversations. |
| **Operations**  | Supply chain, kitchen, packing, shipping, customer ops, KvK/NVWA/BTW compliance, finance, unit economics.                 |

`idea.md` has no function — it defines what the company does, not work owned by one function.

**Where the tag goes:**

- **Markdown plans + designs**: `function: engineering | gtm | operations` in frontmatter, and `# <Function>: <Title>` (designs use `# <Function> Design: <Title>`) as the H1. Filenames stay clean — the function lives in FM + H1 only.
- **Linear projects**: title prefixed (`Engineering: <Project Name>`); apply the matching label from the `Function` label group at project level.
- **Linear issues**: apply the function label per-issue. Usually inherits the project's function, but can override (e.g. an `Operations` issue inside a `GTM` project).
- **Cross-functional projects**: prefix with the _primary owner_ — the function with outcome accountability — and let issue-level labels handle the rest. Don't invent `Cross-functional:`.

## Linear mapping

| `docs/` artefact                                                              | Linear primitive                                                                                                     |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `idea.md`                                                                     | Not mirrored. Linked from project descriptions.                                                                      |
| `designs/<slug>.md`                                                           | Not mirrored. Linked from project description. FM `linear-project:` records which project the design backs.          |
| `plans/<slug>.md` (multi-week, ≥4 plan-internal milestones)                   | Linear **Project**. Plan-internal `M1..MN` → Linear **Milestones**.                                                  |
| `plans/<slug>.md` (single-phase, e.g. one milestone of a larger phase design) | Linear **Milestone** inside the parent phase project. Plan-internal stages/tasks → **Issues**.                       |
| Plan tasks (`- [ ]`)                                                          | **Issues** scoped to project + milestone. Created lazily by `/execute-plan` or Cyrus, not bulk-created at promotion. |
| `knowledge/`, `archived/`                                                     | Not mirrored.                                                                                                        |

`/promote-spec` reads `function:` from FM and applies the matching label + title prefix. The hybrid-by-size rule is mechanical: if FM already has `linear-project:`, the plan becomes a milestone in that project; otherwise it becomes a new project.
