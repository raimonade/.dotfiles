---
title: Use ownerDocument for Portal Event Listeners
impact: LOW
impactDescription: ensures events work in portals and iframes
tags: rendering, portal, iframe, event-listeners, ownerDocument
---

## Use ownerDocument for Portal Event Listeners

Components rendered in portals, pop-out windows, or iframes exist in a different document context. Event listeners attached to `window` directly won't fire for these components.

**Incorrect (only works in parent window):**

```tsx
function KeyboardShortcuts({ children }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { /* ... */ }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  return <div>{children}</div>
}
```

**Correct (works in portals and iframes):**

```tsx
function KeyboardShortcuts({ children }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const win = ref.current?.ownerDocument.defaultView || window
    const handler = (e: KeyboardEvent) => { /* ... */ }
    win.addEventListener('keydown', handler)
    return () => win.removeEventListener('keydown', handler)
  }, [])

  return <div ref={ref}>{children}</div>
}
```

`ownerDocument.defaultView` returns the correct `window` object for the document where the DOM element actually resides. This is only relevant for components that may render inside portals or iframes; for top-level dashboard components in a standard SPA, using `window` directly is fine.

Reference: https://shud.in/thoughts/build-bulletproof-react-components
