---
title: Start partially dependent work early
impact: HIGH
tags: async, parallelization, dependencies
---

## Start partially dependent work early

Represent the dependency graph with ordinary promises. Start independent work immediately and derive dependent work from the promise it needs.

```typescript
const userPromise = fetchUser()
const configPromise = fetchConfig()
const profilePromise = userPromise.then((user) => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  configPromise,
  profilePromise,
])
```

Here `fetchConfig()` runs alongside both user and profile work, while profile still waits for the user it requires. Keep the graph explicit; do not add a scheduling dependency for a small promise chain.
