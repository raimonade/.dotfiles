# Executor — your integration surface

Third-party integrations (Mobbin, Linear, Axiom, PostHog, Vercel, Cloudflare,
Context7, Better Stack, Google Analytics, grep.app, Payload, ui.sh …)
are configured **once** in Executor 2 and shared across every agent. Do **not**
try to reach these services with WebFetch/curl — most require auth Executor
already holds, so a raw fetch returns 401/403. Go through Executor instead.

## Surface — the `executor` MCP server

Executor 2 is reached only over MCP (HTTP, `http://127.0.0.1:4790/mcp` in the
Claude, Pi and Cursor configs). The Executor 1 CLI (`executor tools …`,
`executor call`, `executor web`) no longer exists; do not use it. The server
exposes `skills`, `search`, `describe`, `call`, `execute` and `resume`:

- `search({ query: "<intent>" })` → each tool's exact `path` (`tools.<slug>.<tool>`) and input type
- `describe({ paths })` → full signatures. Always `describe` before calling;
  never guess argument names (a missing one is a validation error, not a default)
- `call({ calls: { path, input } })` → invoke; an array of calls runs concurrently
- `execute` → a JavaScript program for when one call's result feeds another or a
  large result should be filtered first; inside it paths are async functions,
  e.g. `await tools.mobbin.search_screens({ … })`
- `skills({})` lists Executor's own skills; read `code-mode` before using `execute`
- A call that pauses for approval or input: show the request to the user and
  `resume` it; never repeat the call

Reach order for "what do I have / just call X": `search` → `describe` → `call`.
Prefer `call` for a single call, `execute` only to chain or to filter large or
rich output (Mobbin returns inline screen images / an interactive gallery).

## Local Plane

The self-hosted Spotwise tracker is registered as the official Plane MCP server
under the canonical `spotwise-plane.org.default.*` paths. Use it for Plane,
`WAY-*` issues, and Wayfinder maps; never raw API calls. Load the
installed `plane` skill for fixed project context and the narrow self-hosted
relation compatibility tool. Ignore any stale zero-tool `local_plane_*` entries.

## Mobbin freshness

Mobbin results can surface older captures, so `search_screens` / `search_flows` /
`search_sections` for UI inspiration or product references default to the newest
available screenshots:

- Put freshness intent in the query when relevant: `latest`, `current`, `recent`,
  or the current year. Where metadata carries capture dates or app/site versions,
  choose the newest.
- Results that look stale or carry no freshness signal → rerun a narrower,
  freshness-biased query before citing or copying the pattern.
- An older-looking screenshot as the only option → call that out explicitly.
