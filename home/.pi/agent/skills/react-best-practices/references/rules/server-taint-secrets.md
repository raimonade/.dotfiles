---
title: Taint Server Secrets to Prevent Client Leaks
impact: HIGH
impactDescription: prevents sensitive data from reaching the client bundle
tags: server, security, taint, rsc, secrets
---

## Taint Server Secrets to Prevent Client Leaks

When Server Components pass data to Client Components, the entire object gets serialized to the client. Tokens, API keys, and other secrets embedded in data objects will leak.

**Incorrect (token serialized to client):**

```tsx
// Server Component
async function Dashboard() {
  const user = await getUser() // { name, email, token }
  return <UserProfile user={user} /> // token sent to client!
}
```

**Correct (taint sensitive values):**

```tsx
import { experimental_taintUniqueValue } from 'react'

async function Dashboard() {
  const user = await getUser()

  experimental_taintUniqueValue(
    'Do not pass the user token to the client.',
    user,
    user.token
  )

  return <UserProfile user={user} />
  // React throws if user.token reaches a Client Component
}
```

Use `taintObjectReference` to block entire objects:

```tsx
import { experimental_taintObjectReference } from 'react'

experimental_taintObjectReference(
  'Do not pass config to the client.',
  serverConfig
)
```

This is a defense-in-depth measure. The primary defense is to never pass unnecessary data to Client Components in the first place.

Reference: https://react.dev/reference/react/experimental_taintUniqueValue
