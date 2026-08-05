---
title: Deferred Data Streaming with defer() + Await
impact: CRITICAL
impactDescription: eliminates waterfalls for non-critical data
tags: tanstack, streaming, defer, await, waterfall
---

## Deferred Data Streaming with defer() + Await

Use `defer()` for non-critical data that shouldn't block rendering. Only `await` critical data needed for initial render.

**Incorrect: all data blocks rendering**

```tsx
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const user = await fetchUser()
    const activity = await fetchActivity() // Blocks even though not critical
    const notifications = await fetchNotifications() // Also blocks
    return { user, activity, notifications }
  },
  component: Dashboard,
})
```

**Correct: only critical data blocks, rest streams in**

```tsx
import { createFileRoute, defer, Await } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const user = await fetchUser() // Critical: await
    return {
      user,
      activityPromise: defer(fetchActivity()), // Non-critical: defer
      notificationsPromise: defer(fetchNotifications()), // Non-critical: defer
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const { user, activityPromise, notificationsPromise } = Route.useLoaderData()

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      <Suspense fallback={<ActivitySkeleton />}>
        <Await promise={activityPromise}>
          {(activity) => <ActivityFeed data={activity} />}
        </Await>
      </Suspense>

      <Suspense fallback={<NotificationsSkeleton />}>
        <Await promise={notificationsPromise}>
          {(notifications) => <NotificationsList data={notifications} />}
        </Await>
      </Suspense>
    </div>
  )
}
```

**When to defer:**
- Secondary content (activity feeds, notifications, recommendations)
- Below-the-fold content
- Data for collapsed/hidden sections
- Analytics or tracking data

**When NOT to defer:**
- Data needed for initial render above the fold
- Data that determines page layout
- Auth/permission data (use `beforeLoad` instead)
