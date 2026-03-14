---
title: Use Context Instead of cloneElement
impact: MEDIUM
impactDescription: prevents breakage with RSC, lazy, and async boundaries
tags: rendering, composition, context, cloneElement, rsc
---

## Use Context Instead of cloneElement

`React.cloneElement` and `React.Children.map` break when children are React Server Components, `React.lazy` components, or `"use cache"` boundaries (children become Promises or opaque references).

**Incorrect (breaks with modern React):**

```tsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return React.Children.map(children, child =>
    React.cloneElement(child, { theme })
  )
}
```

**Correct (works everywhere):**

```tsx
const ThemeContext = createContext('light')

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
```

Context works across server components, client components, lazy boundaries, and async children. For component libraries using base-ui or Radix, prefer the `render` prop callback pattern over `cloneElement`:

```tsx
// Instead of: render={cloneElement(child, extraProps)}
// Use:        render={children}  (base-ui merges props automatically)
```

Reference: https://shud.in/thoughts/build-bulletproof-react-components
