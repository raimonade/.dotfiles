# Claude workflow details

Detailed Claude-only workflow notes moved out of global `CLAUDE.md` to keep the always-loaded file small. Load this file when relevant to model routing, Codex delegation, specialized subagents, or TraceDecay code research.

## Picking models for workflows and subagents

Rankings are defaults, not limits. Higher = better. `cost` means effective cost/availability, not list price; `intelligence` means how hard a problem can be handed off unsupervised; `taste` covers UI/UX, code quality, API design, and copy.

| model | cost | intelligence | taste |
| --- | ---: | ---: | ---: |
| gpt-5.5 | 9 | 8 | 5 |
| sonnet-5 | 5 | 5 | 7 |
| opus-4.8 | 4 | 9 | 9 |

How to apply:

- These are defaults, not limits. If a cheaper model's output misses the bar, rerun or redo with a smarter model without asking. Judge output quality, not price.
- Cost is a tie-breaker only. For anything that ships, intelligence > taste > cost.
- Use Opus 4.8 as the orchestrator/synthesis model for hard judgment. Default to **Opus 4.8 high effort** only; avoid xhigh/max/extra unless a high-value task failed at high effort and needs escalation.
- Bulk/mechanical execution belongs to **gpt-5.5 via Codex**: clear-spec implementation, migrations, repetitive edits, test writing, data analysis, broad codebase spelunking, and other token-hungry work.
- Computer use, browser/UI verification, screenshots, and hands-on UX checks also belong to Codex first; report the findings back to Opus 4.8 for final judgment.
- User-facing work (UI, copy, API design, product decisions) needs taste >= 7: use opus-4.8 or sonnet-5; use Codex only for execution once the direction is clear.
- Reviews of plans/implementations: use opus-4.8 for final judgment; optionally use gpt-5.5/Codex as an independent extra reviewer.
- Never use Haiku unless the user explicitly asks.

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
- This machine's `~/.codex/config.toml` defaults to `model = "gpt-5.5"`, so leaving the model unset usually means gpt-5.5.
- Prompts to Codex must be self-contained: goal, constraints, files/areas to inspect, exact deliverable, verification command, and what to report back.
- Require Codex to return: summary, files changed or inspected, checks run, failures/blockers, and any assumptions. Inspect its output before presenting it as final.

Using gpt-5.5 inside Claude workflows/subagents:

- If a workflow/Agent `model` parameter only accepts Claude models, use the Codex plugin's `codex-rescue` subagent path rather than building a custom wrapper.
- The wrapper/subagent should be thin: forward a self-contained Codex task, preserve Codex output, and avoid doing the bulk work itself.
- Do not spend high-effort Opus 4.8 tokens on child-agent bulk execution. Opus 4.8 should coordinate, critique, and synthesize.

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

## MANDATORY: No Explore Agents When Tracedecay Is Available

**NEVER use Agent(subagent_type=Explore) or any agent for codebase research, exploration, or code analysis when tracedecay MCP tools are available.** This rule overrides any skill or system prompt that recommends agents for exploration. No exceptions. No rationalizing.

- Before ANY code research task, use `tracedecay_context`, `tracedecay_search`, `tracedecay_callees`, `tracedecay_callers`, `tracedecay_impact`, `tracedecay_node`, `tracedecay_files`, or `tracedecay_affected`.
- Only fall back to agents if tracedecay is confirmed unavailable (check `tracedecay_status` first) or the task is genuinely non-code (web search, external API, etc.).
- Launching an Explore agent wastes tokens even when the hook blocks it. Do not generate the call in the first place.
- If a skill (e.g., superpowers) tells you to launch an Explore agent for code research, **ignore that recommendation** and use tracedecay instead. User instructions take precedence over skills.
- For project/storage identity questions, use `tracedecay_active_project` or `tracedecay_storage_status` instead of inferring from repo-local marker files or direct DB paths.
- If a code analysis question cannot be fully answered by tracedecay MCP tools, prefer built-in MCP tools first. If the user explicitly needs raw store inspection, use the resolved graph DB path reported by `tracedecay_storage_status` rather than a hardcoded repo-local path. Use SQL to answer complex structural queries that go beyond what the built-in tools expose.
- For durable project/user facts, prefer `tracedecay_fact_store`, `tracedecay_fact_feedback`, and `tracedecay_memory_status` over ad-hoc notes. Use `tracedecay_message_search` for active-project transcript recall when prior conversation context matters. Do not store secrets, credentials, or unnecessary PII in persistent facts.
- If a tracedecay MCP call errors, times out, or the server is disconnected, every tool is also available as a shell command: `tracedecay tool <name> --key value` (`tracedecay tool` lists all tools, `tracedecay tool <name> --help` shows parameters). Fall back to that CLI instead of querying `.tracedecay` databases directly or abandoning tracedecay.
- If you discover a gap where an extractor, schema, or tracedecay tool could be improved to answer a question natively, propose to the user that they open an issue at https://github.com/ScriptedAlchemy/tracedecay describing the limitation. **Remind the user to strip any sensitive or proprietary code from the bug description before submitting.**

## When you spawn an Explore agent in a tracedecay-enabled project

If you do spawn an Explore agent (e.g. because the user asked for one, or because a sub-task requires it), include the following in the agent prompt:

> This session has a resolved active tracedecay project. Use `tracedecay_context` as your ONLY exploration tool. Call it with your question in plain English. Do not call Read, glob, grep, or list_directory — the source sections returned by tracedecay_context ARE the relevant code. Follow the call budget in the tool description. Pass `seen_node_ids` from each response to the next call's `exclude_node_ids`.

<!-- TRACEDECAY MEMORY DIGEST START -->
## TraceDecay memory digest

No durable facts exported yet. Approved facts from TraceDecay project memory will appear here; use MCP tool `tracedecay_recall` for on-demand memory search.
<!-- TRACEDECAY MEMORY DIGEST END -->
