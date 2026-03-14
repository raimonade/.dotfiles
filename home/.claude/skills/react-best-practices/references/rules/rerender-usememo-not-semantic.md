---
title: Don't Rely on useMemo for Correctness
impact: MEDIUM
impactDescription: prevents bugs when React drops memoized values
tags: rerender, useMemo, state, correctness, cache
---

## Don't Rely on useMemo for Correctness

`useMemo` is a performance hint, not a semantic guarantee. React reserves the right to discard cached values (during HMR, for offscreen components, in future optimizations). If your code breaks when the memoized value recomputes, use `useState` instead.

**Incorrect (random colors regenerate if cache dropped):**

```tsx
function ThemeProvider({ baseTheme }: Props) {
  const colors = useMemo(
    () => getRandomColors(baseTheme),
    [baseTheme]
  )
  return <div style={colors}>{children}</div>
}
```

If React drops the memo cache (which it may do), `getRandomColors` runs again producing different random values. The UI flickers to new colors.

**Correct (state persists correctly):**

```tsx
function ThemeProvider({ baseTheme }: Props) {
  const [colors, setColors] = useState(() => generateAccentColors(baseTheme))
  const [prevTheme, setPrevTheme] = useState(baseTheme)

  if (baseTheme !== prevTheme) {
    setPrevTheme(baseTheme)
    setColors(generateAccentColors(baseTheme))
  }

  return <div style={colors}>{children}</div>
}
```

**When to use `useMemo`:** pure performance optimization where recomputing produces the same result.

**When to use `useState`:** the value must persist (generated IDs, random values, one-time computations, anything where recomputing would produce a different result).

Reference: https://react.dev/reference/react/useMemo#caveats
