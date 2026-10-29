---
name: tracedecay
description: Local setup for TraceDecay — availability check and how each host (Pi, Claude Code, Codex) calls its tools. Load alongside the upstream TraceDecay skills (routing-tracedecay, exploring-code, tracing-functions, …) before the first TraceDecay call; skip while the daemon is down.
---

# TraceDecay (local setup)

Which tool answers which question lives in the upstream skills: start with
`routing-tracedecay`, or load the specific one (`exploring-code`,
`tracing-functions`, `assessing-impact`, `editing-safely`, `reviewing-changes`,
`fixing-build-and-type-errors`, `project-memory`, `managing-session-context`).
They ship with the Claude plugin at `~/.claude/plugins/marketplaces/tracedecay/skills`,
and `tracedecay update` refreshes them. Pi does not load them (they cost context
and saw no use); route with this skill there.

## Availability

Stock install: binary `~/.local/bin/tracedecay`, daemon service (Linux: systemd user
unit `tracedecay.service`; macOS: LaunchAgent `com.tracedecay.daemon`), data `~/.tracedecay`. Run `tracedecay daemon status` once per session; exit 0
(`protocol: Ready`) means it is serving. A socket file alone proves nothing. On
non-zero exit use normal code tools, and do not start, restart, update, or
reinstall the daemon unless the user asks. Do not retry failed calls in a loop.

A repository is enrolled once with `tracedecay init`; linked worktrees share it.
An unenrolled repo answers `project_not_enrolled` — tell the user rather than
enrolling unasked. When a result's freshness line is not `fresh`, say so.

## Transport by host

- **Pi:** native `tracedecay_*` tools from the `tracedecay` extension
  (`~/.pi/agent/extensions/tracedecay`, a curated subset of the catalog); routes
  are in the `tracedecay-cli` skill. Catalog tools without a native wrapper go
  through the `tracedecay` MCP server (`~/.pi/agent/mcp.json`):
  `mcp({ tool: "<name>", args: {...} })`. From an unenrolled cwd every project
  call answers `project_not_enrolled`; pass `project_selector` or use the CLI.
- **Claude Code:** plugin `tracedecay@tracedecay`; tools are namespaced
  (`mcp__plugin_tracedecay_graph__tracedecay_context`) and often deferred — load
  schemas with `ToolSearch` first.
- **Codex / shell:** `tracedecay tool <name> --args '<json>'` (`--args -` for a
  heredoc). `tracedecay tool` lists tools; `tracedecay tool <name> --help` shows
  parameters.

If an MCP call fails while `daemon status` is green, retry once via the CLI form,
then fall back to normal tools.
