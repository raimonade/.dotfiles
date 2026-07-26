---
name: tracedecay
description: Use TraceDecay for open-ended codebase exploration, symbol/call tracing, impact analysis, cross-branch or cross-project context, and past-session or project-memory recovery. Load before broad grep/file reading when the TraceDecay daemon is available; skip for exact-file narrow handoffs or while the daemon is intentionally disabled.
---

# TraceDecay in Pi

Use Pi's `mcp` gateway to reach the lazy `tracedecay` server without placing every tool schema in context.

## Availability gate

Before connecting, check whether `~/.tracedecay/daemon.sock` exists. If absent, TraceDecay is intentionally contained because startup ingestion can cause sustained CPU use at large repository scale:

- do not install, start, or restart the daemon;
- use Pi's normal code tools instead;
- do not repeatedly retry MCP or CLI calls.

Pi's `~/.pi/agent/bin/tracedecay` wrapper enforces this for daemon start commands while `~/.pi/agent/state/tracedecay-daemon-contained` exists. Never bypass that guard with `/opt/homebrew/bin/tracedecay`. Removing the marker is allowed only for an explicitly approved, bounded validation and it must be restored afterward unless the scaling issue is verified fixed.

A present socket permits normal routing below. Confirm project/index state with `tracedecay_status` when results may be unavailable or stale; never run manual sync speculatively.

## Pi transport

Discover cached tools without connecting when needed:

```text
mcp({ search: "tracedecay context search grep outline body" })
```

Call tools through the proxy; `args` must be a JSON string:

```text
mcp({ tool: "tracedecay_context", args: "{\"task\":\"trace request authorization and identify tests\"}" })
```

If an MCP call fails while the daemon socket still exists, inspect the exact command with `tracedecay tool <name> --help`, then use `tracedecay tool <name> --args '<json>'` once. Fall back to normal tools if the daemon becomes unavailable.

## Routing

- Open-ended concept/task exploration: `tracedecay_context`.
- Symbol lookup: `tracedecay_search`; exact identifier: `tracedecay_by_name`.
- Literal, regex, config key, or error text: `tracedecay_grep`.
- Large-file orientation: `tracedecay_outline`, then `tracedecay_body` or bounded `tracedecay_read`.
- Calls and blast radius: `tracedecay_callers`, `tracedecay_callees`, `tracedecay_path`, and impact/diff context tools discovered via `mcp({ search: ... })`.
- Another registered repo/workspace: `tracedecay_project_list` or `tracedecay_project_search`, then pass its selector to context/search tools.
- Past decisions or transcript recovery: `tracedecay_message_search` and fact/memory tools.

Use returned node IDs for narrow follow-ups and pass `seen_node_ids` when supported. Narrow a truncated result before retrieving more; do not repeat a broad semantic query. Repository instructions and explicit user constraints always outrank this routing.
