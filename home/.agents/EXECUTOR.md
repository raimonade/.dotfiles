# Executor — your integration surface

Third-party integrations (Mobbin, Linear, Axiom, PostHog, Sanity, Vercel,
Cloudflare, Context7, Better Stack, Google Analytics, grep.app, Payload, ui.sh …)
are configured **once** in Executor and shared across every agent. A single local
daemon (`~/.executor/data.db`) backs all of them. Do **not** try to reach these
services with WebFetch/curl — most require auth Executor already holds, so a raw
fetch returns 401/403. Go through Executor instead.

## Universal surface — the CLI (works identically for Pi, Codex, Claude)

```sh
executor tools sources                 # list everything configured + tool counts
executor tools search "<intent>"       # find a tool → returns its dotted `path`
executor tools describe <path>         # input/output JSON + TypeScript schema
executor call <path> '{"k":"v"}'       # invoke a tool
executor web                           # open the UI to add/configure integrations
```

Paths look like `mobbin.user.mobbin.search_screens`. Always `describe` first to
get required args (skipping one returns a validation error, not a default):

```sh
executor tools describe mobbin.user.mobbin.search_screens
# → { query: string; platform: "ios" | "web"; … }
executor call mobbin.user.mobbin.search_screens '{"query":"settings billing","platform":"web"}'
```

Reach order for "what do I have / just call X": `executor tools sources` /
`search` → `describe` → `call`. No MCP round-trip needed.

## Mobbin freshness

Mobbin results can surface older captures. When using Mobbin (`search_screens`,
`search_flows`, `search_sections`) for UI inspiration or product references,
default to the newest available screenshots:

- Put freshness intent in the query when relevant: `latest`, `current`, `recent`,
  or the current year.
- Prefer results that look current; if metadata includes capture dates or app/site
  versions, choose the newest.
- If results look stale or lack any freshness signal, rerun a narrower,
  freshness-biased query before citing or copying the pattern.
- If an older-looking screenshot is all you have, call that out explicitly.

## Claude-only note

Claude also has the `executor` MCP server (`execute` TypeScript sandbox + `skills`
tools). Prefer it over the CLI only when you need to **chain** several tool calls
in one sandbox run, or when a tool emits **rich content** (Mobbin returns inline
screen images / an interactive gallery that the CLI can't render). Inside the
sandbox: `await tools["<path>"](args)` — e.g.
`await tools["mobbin.user.mobbin.search_screens"]({ query: "..." })`. For a plain
"list what's connected" or a single call, the shell CLI above is faster.
