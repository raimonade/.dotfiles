---
name: use-computer-mcp
description: Interact with desktop apps or authenticated browser UI through Open Computer Use MCP. Use when deterministic APIs cannot perform or verify the task.
---

# Computer use

Prefer an API or CLI for structured reads and writes. Use Computer for authentication-bound, desktop-only, or genuinely visual interaction, and for visible verification after a deterministic change.

## Identity

For Helium (`net.imput.helium`), choose the browser profile before navigation:

- company domain or internal service → work;
- personal account, finance, shopping, or personal service → personal;
- ambiguous or mixed identity → ask.

Confirm the profile from visible browser or account state. For another app, reuse its known bundle identifier; list apps only when identity is unknown or stale.

## State/action loop

1. Get fresh app state and confirm the intended app, window, account/profile, and next target.
2. Prefer semantic element actions over coordinates.
3. Use set-value for settable fields; otherwise focus the editable element, confirm focus, then type literal text.
4. Continue a short chain only while each next target exists in the latest returned state. Stop and inspect after navigation, submission, modal/window changes, downloads, or uncertainty.
5. Verify the requested outcome visibly; a successful tool response alone is insufficient.

Element indices belong to one snapshot. Refresh after state changes or failures rather than reusing stale indices. Increase text, tree depth, or node limits only when the default snapshot demonstrably omits required visible content.

## Recovery

One failed call ends that strategy. Change a precondition before retrying:

- stale element → refresh and select a current element;
- unfocused field → focus, inspect, then type;
- app/window missing → list apps once and adopt the returned identifier;
- tree lacks a rendered target → refresh after scroll, then use coordinates only as a bounded fallback;
- tool/catalog failure → reconnect once and rediscover the server surface;
- OS permission failure → report the required permission and pause.

## Harness transport

Discover the installed MCP tool names instead of assuming one transport. Claude commonly exposes namespaced Computer tools; Pi calls them through its MCP gateway; Codex may expose MCP tools directly. Describe an unfamiliar tool once, reuse its schema, and keep provider-specific call syntax out of the interaction plan.

Read [REFERENCE.md](REFERENCE.md) only when overriding snapshot budgets or choosing a non-default macOS click method.
