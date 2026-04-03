---
title: Defer Non-Critical Third-Party Libraries
impact: CRITICAL
impactDescription: loads after hydration
tags: bundle, third-party, analytics, defer
---

## Defer Non-Critical Third-Party Libraries

Analytics, logging, and error tracking don't block user interaction. Load them after hydration.

**Incorrect (blocks initial bundle):**

```tsx
import { Analytics } from '@vercel/analytics/react'

function RootComponent() {
  return (
    <html>
      <body>
        <Outlet />
        <Analytics />
      </body>
    </html>
  )
}
```

**Correct (loads after hydration with React.lazy):**

```tsx
import { lazy, Suspense } from 'react'

const Analytics = lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })))

function RootComponent() {
  return (
    <html>
      <body>
        <Outlet />
        {typeof window !== 'undefined' && (
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        )}
      </body>
    </html>
  )
}
```

**Correct (useEffect for client-only loading):**

```tsx
import { useEffect, useState } from 'react'

function AnalyticsLoader() {
  const [Analytics, setAnalytics] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    import('@vercel/analytics/react').then(m => setAnalytics(() => m.Analytics))
  }, [])

  return Analytics ? <Analytics /> : null
}
```
