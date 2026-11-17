# Claude workflow details

On-demand detail for `~/.claude/CLAUDE.md`.

## Effort

Sessions run at **medium** (`effortLevel` in `~/.claude/settings.json`). Raise to high for hard debugging, research or long unattended runs; xhigh/max only after a high-value task failed at high. A "don't overthink" line in a prompt does not reduce thinking; lower the effort instead.

## Subagents

- Subagents don't inherit context (forks do). For cohesive work, keep it in the main loop or let one subagent own discovery through verification.
- A brief is self-contained: goal, constraints, evidence, ownership, acceptance criteria. Ask for back: summary, files changed, checks run, blockers, assumptions. Inspect the output before presenting it as final.
- Browser/UI verification → `browser-verify` agent (Sonnet); judgement stays in the main loop.

## TraceDecay fallbacks

- MCP call errored or server disconnected → `tracedecay tool <name> --args '<json>'` (same JSON as the MCP tool; `--args -` with a quoted heredoc for quotes/newlines; `tracedecay tool <name> --help` for parameters). Don't query `.tracedecay` databases directly.
- Spawning `Explore` anyway → tell it: "This repo is enrolled in TraceDecay. Start with `tracedecay_context` and let its results choose which files to read; use `tracedecay_grep` for literal text."
- Past decisions → `tracedecay_fact_store_search`, `tracedecay_message_search`.
- A tool limitation worth fixing → suggest an issue at https://github.com/ScriptedAlchemy/tracedecay, with proprietary code stripped.
