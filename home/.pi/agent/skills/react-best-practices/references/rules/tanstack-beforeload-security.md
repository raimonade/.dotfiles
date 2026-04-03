---
title: Auth Guards with beforeLoad
impact: HIGH
impactDescription: prevents data leakage, security checkpoint
tags: tanstack, security, auth, beforeLoad, redirect
---

## Auth Guards with beforeLoad

Use `beforeLoad` for auth checks instead of `loader`. When `beforeLoad` throws, loaders never execute—preventing data leakage.

**Incorrect: auth check in loader (parallel execution risk)**

```tsx
export const Route = createFileRoute('/admin')({
  loader: async ({ context }) => {
    if (!context.user) {
      redirect({ to: '/login' }) // Wrong: doesn't throw, loader continues
    }
    return fetchAdminData() // May execute before redirect!
  },
})
```

**Incorrect: auth check in loader with return**

```tsx
export const Route = createFileRoute('/admin')({
  loader: async ({ context }) => {
    if (!context.user) {
      return redirect({ to: '/login' }) // Wrong: return doesn't stop execution
    }
    return fetchAdminData() // Still executes, data may leak
  },
})
```

**Correct: auth check in beforeLoad with throw**

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' }) // MUST throw, not return
    }
  },
  loader: () => fetchAdminData(), // Only runs if auth passes
})
```

**Correct: authenticated route group pattern**

```tsx
// src/routes/_authenticated.tsx
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }, // Preserve intended destination
      })
    }
    return { user: session.user } // Add to context for children
  },
  component: () => <Outlet />,
})

// src/routes/_authenticated/dashboard.tsx
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { user } = Route.useRouteContext() // Access user from parent
  return <h1>Welcome, {user.name}</h1>
}
```

**Key rules:**
- Always `throw redirect()`, never `return redirect()`
- Put auth checks in `beforeLoad`, not `loader`
- Use route groups (`_authenticated`) for shared auth logic
- Pass auth context to children via `beforeLoad` return value

**Why this matters:**
- `beforeLoad` runs serially before loaders
- Throwing stops all downstream execution
- Loaders run in parallel—checking auth there risks data leakage
