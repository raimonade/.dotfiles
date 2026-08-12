---
title: Authenticate before route loaders
impact: HIGH
impactDescription: prevents unauthorized route data loading
source: https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes
sourceChecked: "2026-08-11"
tags: tanstack, security, auth, beforeLoad, redirect
---

## Authenticate before route loaders

For the pinned TanStack Router version, verify the current `beforeLoad` and `redirect` contract in official documentation. Current Router guidance throws `redirect()` from `beforeLoad`; this stops child route loading before loaders run.

```tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const user = await context.auth.currentUser()
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    return { user }
  },
})
```

Returning from a JavaScript function does stop subsequent statements, but a returned redirect object is not the documented Router redirect protocol. Follow the pinned version's API instead of relying on that incidental control flow.

A route guard protects route UI and loader sequencing; it is not a data authorization boundary. Every server function, API route, or other endpoint returning private data must independently authenticate and authorize the request.
