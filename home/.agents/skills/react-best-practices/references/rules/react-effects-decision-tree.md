---
title: Effects synchronize external systems
impact: HIGH
tags: react, useEffect, derived-state, synchronization
---

## Effects synchronize external systems

An Effect is appropriate when rendering must synchronize with something React does not control: a browser API, third-party widget, network/subscription lifecycle, external store, analytics impression, or similar system.

| Need | Prefer |
|---|---|
| Value derived from props or state | Calculate during render |
| Expensive derived value | Calculate during render; add `useMemo` only when measurement justifies it |
| Response to click, submit, drag, or another user action | Event handler |
| Reset all local state for a different entity | Give the subtree a semantic `key` |
| Notify a parent because an event changed state | Update both in the event handler |
| Subscribe to an external store | `useSyncExternalStore` when it fits |
| Route or application data | Framework loader/query primitive |
| Manual request in an Effect | Abort or ignore stale work during cleanup |

Decision path:

```text
User interaction?                 -> event handler
Derived from current render data? -> calculate during render
Different entity needs fresh state? -> keyed subtree
External system lifecycle?        -> Effect with symmetric cleanup
Application data?                 -> framework data layer when available
```

Keep each Effect focused on one external synchronization contract. Dependencies describe values the synchronization reads; do not suppress them to force a lifecycle. Cleanup must undo subscriptions, timers, requests, observers, and imperative integrations created by the Effect.
