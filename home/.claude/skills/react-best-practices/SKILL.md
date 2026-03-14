---
name: react-best-practices
description: React and TanStack Start performance optimization guidelines. Use when writing, reviewing, or refactoring React/TanStack code to ensure optimal performance patterns. Triggers on tasks involving React components, route loaders, data fetching, bundle optimization, or performance improvements.
---

# React Best Practices

## Overview

Performance optimization guide for React and TanStack Start applications, ordered by impact. Apply these patterns when writing or reviewing code to maximize performance gains.

## When to Apply

Reference these guidelines when:
- Writing new React components or TanStack routes
- Implementing data fetching (loaders or server functions)
- Reviewing code for performance issues
- Refactoring existing React/TanStack code
- Optimizing bundle size or load times

## Priority-Ordered Guidelines

Rules are prioritized by impact:

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Eliminating Waterfalls | CRITICAL |
| 2 | Bundle Size Optimization | CRITICAL |
| 3 | Server-Side Performance | HIGH |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH |
| 5 | Re-render Optimization | MEDIUM |
| 6 | Rendering Performance | MEDIUM |
| 7 | JavaScript Performance | LOW-MEDIUM |
| 8 | Advanced Patterns | LOW |

## Quick Reference

### Critical Patterns (Apply First)

**Eliminate Waterfalls:**
- Use `Promise.all()` for independent async operations
- Start promises early, await late
- Use `defer()` + `<Await>` for non-critical data streaming
- Use `ensureQueryData` + `useSuspenseQuery` for TanStack Query

**Reduce Bundle Size:**
- Avoid barrel file imports (import directly from source)
- Use `lazyRouteComponent` or `React.lazy` for heavy components
- Defer non-critical third-party libraries
- Preload based on user intent

### High-Impact TanStack Patterns

- Use `beforeLoad` for auth guards (throw redirect, not return)
- Use server function pipeline: `.middleware().inputValidator().handler()`
- Use `VITE_*` prefix for client-accessible env vars
- Keep secrets in server functions only

### Medium-Impact Client Patterns

- Use TanStack Query for automatic request deduplication
- Defer state reads to usage point
- Use derived state subscriptions
- Apply `startTransition` for non-urgent updates
- Use passive event listeners for scroll/touch
- Version and minimize localStorage data

### Re-render Optimization

- Derive state during render, not in effects
- Use functional setState for stable callbacks
- Hoist default non-primitive props outside component
- Put interaction logic in event handlers, not effects
- Avoid memo for simple primitive expressions
- Use refs for transient frequently-changing values

### JavaScript Performance

- Group CSS changes via classes or cssText
- Check array length before expensive comparisons
- Use loop for min/max instead of sort
- Use toSorted() for immutable sorting

### Re-render Optimization (cont.)

- `useMemo` is a perf hint, not a guarantee — use `useState` when correctness requires persistence
- Wrap state updates in `startTransition()` for `<ViewTransition>` to animate

### Rendering Performance

- Animate div wrapper, not SVG element directly
- Use useTransition for loading states
- Use inline script to prevent hydration flicker
- Use `useId()` for unique DOM IDs — never hardcode IDs that collide across instances
- Context over `cloneElement` — cloneElement breaks with RSC/lazy/`"use cache"`
- `ownerDocument.defaultView` for correct `window` in portals/iframes
- DOM side-effects (injected `<style>`) need cleanup via `useLayoutEffect` return for `<Activity>`

### Server-Side Performance (cont.)

- `taintUniqueValue`/`taintObjectReference` to prevent server secrets reaching client

## References

Full documentation with code examples is available in:

- `references/react-performance-guidelines.md` - Complete guide with all patterns
- `references/rules/` - Individual rule files organized by category

To look up a specific pattern, grep the rules directory:
```
grep -l "suspense" references/rules/
grep -l "barrel" references/rules/
grep -l "swr" references/rules/
```

## Rule Categories in `references/rules/`

- `tanstack-*` - TanStack Start/Router specific patterns
- `async-*` - Waterfall elimination patterns
- `bundle-*` - Bundle size optimization
- `server-*` - Server-side performance
- `client-*` - Client-side data fetching
- `rerender-*` - Re-render optimization
- `rendering-*` - DOM rendering performance
- `js-*` - JavaScript micro-optimizations
- `advanced-*` - Advanced patterns

### TanStack-Specific Rules

- `tanstack-defer-streaming` - Use `defer()` + `<Await>` for non-critical data
- `tanstack-ensure-suspense` - Use `ensureQueryData` + `useSuspenseQuery` pattern
- `tanstack-beforeload-security` - Auth guards with `beforeLoad` + `throw redirect()`
- `tanstack-server-function-pipeline` - Full `.middleware().inputValidator().handler()` pattern
- `tanstack-env-security` - `VITE_*` vs `process.env` security
