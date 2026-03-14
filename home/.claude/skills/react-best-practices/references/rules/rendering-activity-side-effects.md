---
title: Clean Up DOM Side Effects for Activity
impact: MEDIUM
impactDescription: prevents style leaks when Activity hides components
tags: rendering, activity, style, side-effects, useLayoutEffect
---

## Clean Up DOM Side Effects for Activity

`<Activity>` preserves the DOM when hiding components. Injected `<style>` tags, global event listeners, and other DOM-level side effects persist even when the component is "hidden", because the DOM nodes remain in the document.

**Incorrect (dark theme persists when Activity hides):**

```tsx
function DarkTheme({ children }) {
  return (
    <>
      <style>{`:root { --bg: #000; --fg: #fff; }`}</style>
      {children}
    </>
  )
}
```

When wrapped in `<Activity mode="hidden">`, the `<style>` tag remains in the DOM, keeping dark theme active.

**Correct (styles disabled on cleanup):**

```tsx
function DarkTheme({ children }) {
  const ref = useRef<HTMLStyleElement>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    ref.current.media = 'all'
    return () => { ref.current!.media = 'not all' }
  }, [])

  return (
    <>
      <style ref={ref} media="not all">
        {`:root { --bg: #000; --fg: #fff; }`}
      </style>
      {children}
    </>
  )
}
```

Setting `media="not all"` disables the stylesheet without removing it from the DOM. `useLayoutEffect` cleanup runs when Activity hides the component, disabling the styles. When Activity shows it again, the effect re-runs and re-enables them.

Apply this pattern to any component that injects global `<style>` tags, modifies `document.body` classes, or adds global event listeners that should stop when the component becomes inactive.

Reference: https://shud.in/thoughts/build-bulletproof-react-components
