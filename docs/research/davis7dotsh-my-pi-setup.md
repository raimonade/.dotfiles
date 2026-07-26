# `davis7dotsh/my-pi-setup` review

Reviewed latest `main` at [`2657bae6`](https://github.com/davis7dotsh/my-pi-setup/commit/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd) on 2026-07-26.

## Verdict

Keep **our `pi-subagents` 0.34.0 as the orchestration core**. It is stronger for durable async runs, declarative chains, dynamic fanout, saved workflows, scheduling, worktree isolation, forked context, acceptance gates, supervisor/intercom routing, and operational recovery.

Davis's setup is stronger in three areas:

1. **TUI presentation** — a coherent GitHub-dark theme, responsive two-line footer, rich workflow dashboard, subagent takeover view, and background-terminal inspector.
2. **Cross-harness delegation** — one manager normalizes Pi, Claude Code, and Codex CLI children.
3. **Model-authored workflows** — bounded JavaScript orchestration with `phase()`, `agent()`, `parallel()`, structured results, sandboxing, persisted artifacts, and a polished dashboard.

Their repository has **no license** (`license: null` in the GitHub API and no `LICENSE` file). Do not copy implementation or theme files verbatim. Obtain permission or reimplement selected behavior clean-room from public Pi APIs and independently chosen design tokens.

## Adoption status

Implemented independently using Pi's public extension API:

- responsive two-line session footer with a one-line narrow fallback;
- semantic theme roles, context-pressure states, ANSI-aware truncation, and control-sequence sanitization;
- Catppuccin Macchiato activation;
- focused rendering tests at roomy, medium, narrow, and no-color conditions.

The orchestration core, workflow execution model, and background-process ownership remain unchanged.

## Subagents: ours vs. theirs

| Area | Ours | Davis | Winner |
|---|---|---|---|
| Backends | Pi children with provider/model selection | Pi + Claude Code SDK + Codex app-server | Davis, if native CLI harnesses matter |
| Chains/workflows | Sequential, parallel, dynamic expand/collect, saved chains, prompt workflows | Ad-hoc children plus separate inline-JS workflow engine | Ours for repeatability; Davis for expressiveness |
| Context | Fresh or true persisted-session fork | Fresh isolated child prompts | Ours |
| Isolation | Optional Git worktrees, setup hooks, patch capture | Shared cwd; trust checked, but no worktree isolation | Ours |
| Coordination | Supervisor/intercom, attention notices, steer/resume/interrupt | Steer, wait, cancel, interactive takeover | Ours operationally; Davis visually |
| Durability | Async artifacts, status/events/transcripts, resume, scheduling | Session-scoped children; shutdown aborts them | Ours |
| Safety | Child tool boundaries, one-writer policy, model scope, acceptance gates | Good bounds/trust checks, but Claude bypasses permissions and Codex uses danger-full-access | Ours |
| UI | Adaptive fleet widget and transcript status | Full-screen picker/takeover with live transcript and input | Davis |

**Decision:** do not replace ours. Borrow the ideas of a richer fleet/takeover surface and, if desired, add optional native Claude/Codex adapters behind our existing safety model rather than adopting Davis's permissive defaults.

## Workflows: ours vs. theirs

Davis's [`workflow` extension](https://github.com/davis7dotsh/my-pi-setup/blob/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/extensions/workflows/index.ts) lets the model author JavaScript using `phase`, `agent`, and `parallel`. It caps concurrency at four and calls at 32, returns typed error values, runs source in a permissioned subprocess with authenticated IPC, and persists run artifacts. The dashboard is excellent.

Our declarative chains are safer, easier to inspect, reusable, and already support dynamic fanout, structured output, async execution, named outputs, review loops, worktrees, scheduling, and acceptance. Arbitrary workflow code adds a larger trust and maintenance surface.

**Decision:** keep declarative chains. Borrow:

- phase labels and a richer workflow dashboard;
- compact per-agent usage/context/elapsed-time rows;
- persisted bounded transcripts and result artifacts;
- a restricted expression/branching layer only if real workflows prove chains insufficient.

Do not add arbitrary JS execution merely for novelty.

## Visual direction

The screenshot's strongest element is the **two-line footer**, not the tall logo:

- row 1: cwd ↔ provider/model/thinking;
- row 2: context/window, cost, tokens/s ↔ branch, changed files, PR;
- extension statuses below.

Adopt this behavior clean-room with semantic theme roles and width-aware truncation. Keep the header responsive: a three-row mark on roomy empty sessions, a one-line `PI · cwd` fallback on short/narrow terminals. The checked-in header is static, not animated. Avoid its brittle private-tree mutation that removes the Themes section.

Our tracked `catppuccin-macchiato` theme is now active, and the footer derives its colors from Pi's semantic theme roles rather than hardcoded palette values.

Accessibility requirements: honor `NO_COLOR`, gate truecolor gradients, sanitize cwd/branch labels, gate OSC-8 links by terminal capability, and maintain contrast on near-black surfaces.

## Ranked adoption candidates

1. **Responsive footer/dashboard** — highest daily value; clean-room implementation.
2. **Theme consolidation** — activate the existing Catppuccin theme or author a GitHub-dark alternative; do not leave a tracked-but-unused theme.
3. **Workflow/fleet dashboard UX** — add phase grouping, usage, elapsed time, and transcript takeover to our existing orchestration rather than replacing it.
4. **`ask_user` multiple-choice UX** — useful for bounded decisions, with a freeform escape hatch.
5. **`/copy-all` behavior** — small convenience command; implement independently.
6. **Background-terminal manager** — useful for session-scoped servers/logs and completion notifications, but lower priority because Herdr already owns panes/process visibility.
7. **Per-turn recaps** — optional; likely visual/cost noise unless explicitly enabled.

Skip Firecrawl (duplicate external search/key), runtime `fd`/`rg` downloads (Homebrew already owns them), wholesale installation into `~/.pi/agent` (conflicts with Stow), and subagent replacement.

## Primary sources

- [README](https://github.com/davis7dotsh/my-pi-setup/blob/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/README.md)
- [Setup](https://github.com/davis7dotsh/my-pi-setup/blob/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/SETUP.md)
- [Subagents](https://github.com/davis7dotsh/my-pi-setup/tree/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/extensions/subagents)
- [Workflows](https://github.com/davis7dotsh/my-pi-setup/tree/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/extensions/workflows)
- [UI customization](https://github.com/davis7dotsh/my-pi-setup/blob/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/extensions/ui-customization/index.ts)
- [Theme](https://github.com/davis7dotsh/my-pi-setup/blob/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/themes/github-dark-default.json)
- [Screenshot](https://github.com/davis7dotsh/my-pi-setup/blob/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/assets/pi-setup.jpeg)
