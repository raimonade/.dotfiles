---
title: Dynamic Imports for Heavy Components
impact: CRITICAL
impactDescription: directly affects TTI and LCP
tags: bundle, dynamic-import, code-splitting, lazy-loading
---

## Dynamic Imports for Heavy Components

Use `lazyRouteComponent` (TanStack) or `React.lazy` + `Suspense` to lazy-load large components not needed on initial render.

**Incorrect (Monaco bundles with main chunk ~300KB):**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Correct (TanStack route with lazy component):**

```tsx
import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/editor')({
  component: lazyRouteComponent(() => import('./monaco-editor')),
})
```

**Correct (React.lazy + Suspense for non-route components):**

```tsx
import { lazy, Suspense } from 'react'

const MonacoEditor = lazy(() => import('./monaco-editor').then(m => ({ default: m.MonacoEditor })))

function CodePanel({ code }: { code: string }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <MonacoEditor value={code} />
    </Suspense>
  )
}
```

**Correct (client-only component with typeof window check):**

```tsx
import { lazy, Suspense } from 'react'

const MonacoEditor = lazy(() => import('./monaco-editor').then(m => ({ default: m.MonacoEditor })))

function CodePanel({ code }: { code: string }) {
  if (typeof window === 'undefined') return <Skeleton />

  return (
    <Suspense fallback={<Skeleton />}>
      <MonacoEditor value={code} />
    </Suspense>
  )
}
```
