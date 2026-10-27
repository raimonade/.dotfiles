# Claude workflow details

The disclosed branch of `~/.claude/CLAUDE.md`: model routing, specialized subagents, TraceDecay escape hatches.

## Picking models for workflows and subagents

Claude models only — no Codex/GPT delegation (plugin, CLI, or `codex-rescue` agent). Every subagent gets an explicit `model`; never Fable as a subagent.

| model | cost | intelligence | taste | use for |
| --- | ---: | ---: | ---: | --- |
| haiku | 10 | 5 | 4 | trivial high-volume lookups, extraction, summaries that are easy to check |
| sonnet | 7 | 8 | 7 | default: implementation, migrations, tests, research, browser/UI verification |
| opus | 4 | 9 | 9 | delegated judgement: independent review, architecture/debugging second opinion, design review |

Higher = better; `cost` means effective cost/availability. Rankings are defaults, not limits.

How to apply:

- The session model (Fable, else Opus) owns orchestration, design direction, taste-heavy synthesis, and final judgment/review. Opus subagents only when that judgement must run in parallel or isolated from the main loop.
- Output missing the bar → redo on the next model up without asking. Judge quality, not price; cost is a tie-breaker. For anything that ships, intelligence > taste > cost.
- Effort: **high** by default; escalate to xhigh/max only after a high-value task failed at high.
- Discovery-heavy implementation → let the Sonnet subagent own discovery through verification instead of the main loop reading the same surface first.
- Browser/UI verification → `browser-verify` agent (Sonnet); final judgment back in the main loop.

## Implementation handoff

`~/.agents/CONDUCT.md`'s trajectory-first policy governs — including when to keep a
read-only plan and what the **trajectory bundle** contains. Claude-specific facts:

- A read-only main-loop plan followed by a fresh-context subagent is not the default cost optimization: it duplicates discovery and loses cache/context.
- Subagents don't inherit the main loop's context (forks do). For a cohesive task, either keep it in the main loop or let one subagent own discovery and implementation end-to-end.
- Delegation still justified → prompt must be self-contained, never a plan-only postcard: goal, constraints, the trajectory bundle, ownership and acceptance criteria. Tell the receiver to inspect the diff first, verify inherited claims, and reread only edit-critical spans.
- Require subagents to return: summary, files changed or inspected, checks run, failures/blockers, assumptions. Inspect output before presenting it as final.

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

  > This repo is enrolled in TraceDecay. Start with `tracedecay_context` (plain-English question) and let its results choose which files to read; use `tracedecay_grep` for literal text. Follow the call budget in the tool description and pass `seen_node_ids` from each response into the next call.

- **An extractor, schema, or tool could answer something natively but doesn't** → propose that the user open an issue at https://github.com/ScriptedAlchemy/tracedecay describing the limitation, and **remind them to strip sensitive or proprietary code from the description first**.
- **Past decisions or project memory** → `tracedecay_fact_store_search` for durable facts, `tracedecay_message_search` / `tracedecay_lcm_grep` for session history.
