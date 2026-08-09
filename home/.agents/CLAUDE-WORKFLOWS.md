# Claude workflow details

The disclosed branch of `~/.claude/CLAUDE.md`: model routing, Codex delegation, specialized subagents, TraceDecay escape hatches.

## Picking models for workflows and subagents

Rankings are defaults, not limits. Higher = better. `cost` means effective cost/availability, not list price; `intelligence` means how hard a problem can be handed off unsupervised; `taste` covers UI/UX, code quality, API design, and copy.

| model | cost | intelligence | taste |
| --- | ---: | ---: | ---: |
| GPT-5.6 Sol | 9 | 10 | 6 |
| sonnet-5 | 5 | 5 | 7 |
| opus-5 | 4 | 9 | 9 |

How to apply:

- **Never use Fable**; never Haiku unless the user explicitly asks. Opus 5 owns design direction, taste-heavy synthesis, and final visual review.
- A cheaper model's output missing the bar → rerun or redo with a smarter model without asking. Judge output quality, not price; cost is a tie-breaker only. For anything that ships, intelligence > taste > cost.
- Opus 5 is the orchestrator/synthesis model for hard judgment, at **high effort** — escalate to xhigh/max/extra only after a high-value task failed at high effort.
- Bulk/mechanical execution belongs to **GPT-5.6 Sol via Codex**: clear-spec implementation, migrations, repetitive edits, test writing, data analysis, broad codebase spelunking, and other token-hungry work. Discovery-heavy implementation → let Codex own discovery through verification instead of making Opus read the same surface first.
- Computer use, browser/UI verification, screenshots, and hands-on UX checks also belong to Codex first; report the findings back to Opus 5 for final judgment.
- User-facing work (UI, copy, API design, product decisions) needs taste >= 7: opus-5 or sonnet-5; Codex executes only once the direction is clear.
- Reviews of plans/implementations: opus-5 for final judgment, optionally GPT-5.6 Sol/Codex as an independent extra reviewer.

## Cross-model implementation handoff

`~/.agents/CONDUCT.md`'s trajectory-first policy governs — including when to keep a
read-only plan and what the **trajectory bundle** contains. Claude-specific facts:

- A read-only Opus plan followed by a fresh Codex implementation session is not the default cost optimization: it duplicates discovery and loses provider cache/context.
- Claude → Codex plugin/CLI delegation does not transfer Claude's private context window. For a cohesive task, either keep Claude end-to-end or let Codex own discovery and implementation end-to-end.
- Harness can switch models without losing the conversation → use the prewalk shape: Opus grounds the approach, creates a bounded todo with a validation step per item, establishes a repro/failing test when applicable, and lands the first small valid edit; the executor continues with that history, diff, and todo once the planning-only instruction is removed.
- Cross-harness delegation that is still justified → hand off the trajectory bundle in the shared workspace, and tell the receiver to inspect the diff first, verify inherited claims, and reread only edit-critical spans.

Codex fallback protocol:

- Prefer the installed Codex Claude Code plugin over hand-rolled Bash wrappers.
- First run `/codex:setup` if Codex availability/auth is uncertain.
- For implementation, debugging, or substantial investigation, use `/codex:rescue <self-contained task>`.
- For implementation-sized tasks, explicitly ask Codex to edit and verify; the plugin's rescue agent defaults to write-capable Codex runs unless the task is review/read-only.
- For normal review, use `/codex:review --wait` or `/codex:review --background`.
- For challenge/design review, use `/codex:adversarial-review --wait <focus>` or `/codex:adversarial-review --background <focus>`.
- For long-running plugin jobs, use `/codex:status`, `/codex:result`, and `/codex:cancel` rather than re-running from scratch.
- Raw CLI fallback only when the plugin is unavailable or too restrictive:
  - Read-only investigation: `codex exec -s read-only --cd "$PWD" "<self-contained prompt>"`.
  - Implementation: `codex exec -s workspace-write --cd "$PWD" "<self-contained prompt>"`.
  - Review: `codex review --uncommitted "<review focus>"` or `codex review --base <branch> "<review focus>"`.
- This machine's `~/.codex/config.toml` defaults to `model = "gpt-5.6-sol"`, so leave the model unset to use GPT-5.6 Sol. If a workflow overrides the model, explicitly select `gpt-5.6-sol`.
- Fresh-context prompts to Codex must be self-contained, but never plan-only postcards: include the goal and constraints plus the concrete trajectory bundle above. For independent work, give ownership and acceptance criteria and let Codex discover the relevant code itself.
- Require Codex to return: summary, files changed or inspected, checks run, failures/blockers, and any assumptions. Inspect its output before presenting it as final.

Using GPT-5.6 Sol inside Claude workflows/subagents:

- If a workflow/Agent `model` parameter only accepts Claude models, use the Codex plugin's `codex-rescue` subagent path rather than building a custom wrapper.
- The wrapper/subagent should be thin: forward either an independently owned Codex task or the concrete trajectory bundle above, preserve Codex output, and avoid doing the bulk work itself.
- Do not spend high-effort Opus 5 tokens on child-agent bulk execution. GPT-5.6 Sol should execute; Opus 5 should coordinate, critique, and synthesize.

## Specialized Subagents

### Oracle
Invoke for: code review, architecture decisions, debugging analysis, refactor planning, second opinion.
Prompt with: precise problem + relevant file paths. Ask for concrete outcomes.

**Response format** (collapse sections for simple questions):
1. TL;DR — 1-3 sentences, recommended simple approach
2. Recommendation — numbered steps/checklist, minimal diffs
3. Rationale — brief justification, why alternatives unnecessary now
4. Risks & Guardrails — key caveats and mitigations
5. When to Reconsider — concrete triggers for more complex design

**Operating principles**: default simplest viable solution, prefer minimal incremental changes, YAGNI/KISS, one primary recommendation, calibrate depth to scope, stop when good enough.

**Effort estimates**: S (<1hr), M (1-3hr), L (1-2d), XL (>2d)

**Tool usage**: read-only access — read, grep, glob, WebFetch, WebSearch. Use MCP tools freely: opensrc (explore 3rd-party source), context7 (library docs/API examples), grep_app (public GitHub usage patterns).

### Librarian
Invoke for: understanding 3rd party libraries/packages, exploring remote repositories, discovering open source patterns. Show response in full — do not summarize.

**Tool arsenal**:
- opensrc — deep exploration of specific repos, comparing implementations
- grep_app — find usage patterns across public GitHub repos
- context7 — library docs, API examples, usage patterns
- WebSearch — current docs, blog posts, discussions

**Output**: direct answer + source links + diagrams if architecture involved. Link to GitHub source with fluent markdown links.

## TraceDecay escape hatches

Tool routing and the no-Explore-agents rule are always on in `~/.claude/CLAUDE.md`.
Reach here for the edges:

- **MCP call errored, timed out, or the server disconnected** → every tool is also a shell command: `tracedecay tool <name> --args '<json>'`, taking the same JSON arguments object as the MCP tool; pipe it via `--args -` (a quoted heredoc) when it contains quotes or newlines. `tracedecay tool` lists all tools, `tracedecay tool <name> --help` shows parameters. Pass schema fields inside the JSON object; never invent per-key flags or enum values from memory. Fall back to this CLI rather than querying `.tracedecay` databases directly or abandoning tracedecay.
- **A code-analysis question the tools can't fully answer** → try other built-in MCP tools first. If the user explicitly needs raw store inspection, use the graph DB path resolved by `tracedecay_storage_status` (never a hardcoded repo-local path), and answer complex structural queries with SQL.
- **You spawn an Explore agent anyway** (the user asked, or a sub-task requires it) → put this in the agent prompt:

  > This session has a resolved active tracedecay project. Use `tracedecay_context` as your ONLY exploration tool. Call it with your question in plain English. Do not call Read, glob, grep, or list_directory — the source sections returned by tracedecay_context ARE the relevant code. Follow the call budget in the tool description. Pass `seen_node_ids` from each response to the next call's `exclude_node_ids`.

- **An extractor, schema, or tool could answer something natively but doesn't** → propose that the user open an issue at https://github.com/ScriptedAlchemy/tracedecay describing the limitation, and **remind them to strip sensitive or proprietary code from the description first**.

<!-- TRACEDECAY MEMORY DIGEST START -->
## TraceDecay memory digest

No durable facts exported yet. Approved facts from TraceDecay project memory will appear here; use MCP tool `tracedecay_recall` for on-demand memory search.
<!-- TRACEDECAY MEMORY DIGEST END -->
