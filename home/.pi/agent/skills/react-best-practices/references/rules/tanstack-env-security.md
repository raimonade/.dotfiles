---
title: Environment Variable Security
impact: HIGH
impactDescription: prevents secret leakage to client
tags: tanstack, security, environment, vite, secrets
---

## Environment Variable Security

In TanStack Start (Vite-based), only `VITE_*` prefixed variables are available on the client. Non-prefixed variables are server-only. Using `process.env` in the wrong context leaks secrets or causes runtime errors.

**Environment variable availability:**

| Pattern      | Availability    | Access                         |
|--------------|-----------------|--------------------------------|
| `VITE_*`     | Client + Server | `import.meta.env.VITE_API_URL` |
| Non-prefixed | Server only     | `process.env.DATABASE_URL`     |

**Incorrect: accessing secrets in route loader**

```tsx
export const Route = createFileRoute('/dashboard')({
  loader: () => {
    // DANGEROUS: Route loaders can run on client!
    const apiKey = process.env.SECRET_API_KEY // Undefined on client, or leaks
    return fetchData(apiKey)
  },
})
```

**Incorrect: accessing server env in component**

```tsx
function Settings() {
  // WRONG: process.env is not available in browser
  const dbUrl = process.env.DATABASE_URL // undefined
  return <div>{dbUrl}</div>
}
```

**Correct: use server functions for secrets**

```tsx
import { createServerFn } from '@tanstack/react-start'

// Server function - always runs on server
export const getSecureData = createServerFn({ method: 'GET' }).handler(async () => {
  const apiKey = process.env.SECRET_API_KEY // Safe: server only
  return callExternalAPI(apiKey)
})

// Route uses server function
export const Route = createFileRoute('/dashboard')({
  loader: () => getSecureData(), // Server function call
  component: Dashboard,
})
```

**Correct: use VITE_ prefix for public config**

```tsx
// .env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=MyApp

// Component - safe to use VITE_ vars
function Footer() {
  return <span>{import.meta.env.VITE_APP_NAME}</span>
}

// Route loader - safe for VITE_ vars
export const Route = createFileRoute('/api-test')({
  loader: () => fetch(import.meta.env.VITE_API_URL),
})
```

**Rules:**
- Never access `process.env` in components or route loaders
- Use `VITE_*` prefix for any config needed on client
- Use server functions for any operation requiring secrets
- Keep secrets in non-prefixed env vars (`DATABASE_URL`, `SECRET_KEY`)

**Common mistakes:**
```tsx
// ❌ process.env in loader
loader: () => fetch(process.env.API_URL)

// ✅ VITE_ prefix or server function
loader: () => fetch(import.meta.env.VITE_API_URL)
loader: () => fetchFromServer() // server function

// ❌ Logging secrets (will appear in client bundle)
console.log(process.env.SECRET)

// ✅ Log in server function only
createServerFn({ method: 'GET' }).handler(() => {
  console.log(process.env.SECRET) // Server-only log
})
```
