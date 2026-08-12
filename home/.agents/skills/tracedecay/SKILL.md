---
name: tracedecay
description: Use TraceDecay for open-ended codebase exploration, symbol/call tracing, impact analysis, cross-branch or cross-project context, and past-session or project-memory recovery. Load before broad grep/file reading when the TraceDecay daemon is available; skip for exact-file narrow handoffs or while the daemon is intentionally disabled.
---

# TraceDecay

## Availability gate

Before connecting, check whether `~/.tracedecay/daemon.sock` exists. If absent, TraceDecay is intentionally contained because startup ingestion can cause sustained CPU use at large repository scale:

- do not install, start, or restart the daemon;
- use the host's normal code tools instead;
- do not repeatedly retry MCP or CLI calls.

Pi's `~/.pi/agent/bin/tracedecay` wrapper enforces this for daemon start commands while `~/.pi/agent/state/tracedecay-daemon-contained` exists. Never bypass that guard with `/opt/homebrew/bin/tracedecay`. Removing the marker is allowed only for an explicitly approved, bounded validation and it must be restored afterward unless the scaling issue is verified fixed.

A present socket permits normal routing below. Confirm project/index state with `tracedecay_status` when results may be unavailable or stale; never run manual sync speculatively.

## Transport by host

- **Claude Code:** tools are exposed over MCP, usually namespaced (e.g. `mcp__plugin_tracedecay_graph__tracedecay_context`) and often deferred — load schemas first with `ToolSearch("select:<full tool name>, ...")`, then call them like any tool. Refer to tools below by their short `tracedecay_*` suffix.
- **Pi:** use the lazy `mcp` gateway. Discover: `mcp({ search: "tracedecay context search grep" })`. Call with `args` as a JSON string: `mcp({ tool: "tracedecay_context", args: "{\"task\":\"trace request authorization\"}" })`.
- **Codex or any shell-only host:** use the CLI: `tracedecay tool <name> --args '<json>'` (run `tracedecay tool` to list, `tracedecay tool <name> --help` for parameters).

If an MCP call fails while the daemon socket still exists, fall back to the CLI form once rather than retrying MCP; fall back to normal tools if the daemon becomes unavailable.

## Routing

- Open-ended concept/task exploration: `tracedecay_context`.
- Symbol lookup: `tracedecay_search`; exact identifier: `tracedecay_find_exact_symbol` or `tracedecay_by_qualified_name`.
- Literal, regex, config key, or error text: `tracedecay_grep`.
- Large-file orientation: `tracedecay_outline`, then `tracedecay_body` or bounded `tracedecay_read`.
- Calls and blast radius: `tracedecay_callers`, `tracedecay_callees`, `tracedecay_call_chain`, `tracedecay_impact`, `tracedecay_affected`.
- Another registered repo/workspace: `tracedecay_project_list` or `tracedecay_project_search`, then pass its selector to context/search tools.
- Past decisions or transcript recovery: `tracedecay_message_search` and fact/memory tools.

Use returned node IDs for narrow follow-ups and pass `seen_node_ids` when supported. Narrow a truncated result before retrieving more; do not repeat a broad semantic query.

For unfamiliar repositories, let the first useful TraceDecay result choose the files to inspect. Before editing, identify the owning module, source contract, affected callers and tests, local precedent, and narrowest verifier. Refine an incomplete query instead of inferring absence. If source is generated, minified, redacted, or otherwise transformed, search stable structural anchors and corroborate the conclusion through an independent surface. Use scoped shell search when the repository is unavailable to TraceDecay or the question concerns an exact filesystem/generated-text artifact; state that fallback briefly.

Repository instructions and explicit user constraints always outrank this routing.
