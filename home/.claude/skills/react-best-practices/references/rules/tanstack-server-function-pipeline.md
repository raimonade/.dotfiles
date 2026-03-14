---
title: Server Function Pipeline Pattern
impact: HIGH
impactDescription: type-safe validation, reusable middleware, security
tags: tanstack, server-function, middleware, validation, zod
---

## Server Function Pipeline Pattern

Use the full pipeline pattern for server functions: `Configuration → Middleware → Validation → Handler`. This ensures type safety, reusable auth, and proper validation.

**Incorrect: no validation, no middleware**

```tsx
const createUser = createServerFn(async (data) => {
  return db.user.create({ data }) // No validation, no auth check
})
```

**Incorrect: manual validation in handler**

```tsx
const createUser = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  if (!data.email || !data.name) {
    throw new Error('Invalid input') // Manual, not type-safe
  }
  return db.user.create({ data })
})
```

**Correct: full pipeline pattern**

```tsx
import { createServerFn, createMiddleware } from '@tanstack/react-start'
import { z } from 'zod'

// 1. Define reusable middleware
const authMiddleware = createMiddleware().server(async ({ next, context }) => {
  const session = await getSession(context.request)
  if (!session) {
    throw new Error('Unauthorized')
  }
  return next({ context: { ...context, user: session.user } })
})

const loggingMiddleware = createMiddleware().server(async ({ next }) => {
  const start = Date.now()
  const result = await next()
  console.log(`Request took ${Date.now() - start}ms`)
  return result
})

// 2. Define validation schema
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
})

// 3. Build server function with pipeline
export const createUser = createServerFn({ method: 'POST' })
  .middleware([loggingMiddleware, authMiddleware])
  .inputValidator((data: unknown) => CreateUserSchema.parse(data))
  .handler(async ({ data, context }) => {
    // `data` is typed as { email: string; name: string }
    // `context.user` is available from middleware
    return db.user.create({
      data: { ...data, createdBy: context.user.id },
    })
  })
```

**Using server functions in components:**

```tsx
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/server/functions/users'

function CreateUserForm() {
  const queryClient = useQueryClient()
  const createUserFn = useServerFn(createUser) // Handles redirects/errors

  const mutation = useMutation({
    mutationFn: (data: { email: string; name: string }) => createUserFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      mutation.mutate({
        email: formData.get('email') as string,
        name: formData.get('name') as string,
      })
    }}>
      <input name="email" type="email" required />
      <input name="name" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  )
}
```

**Pipeline order:**
1. `method` - GET for reads, POST for mutations
2. `.middleware([...])` - Auth, logging, rate limiting
3. `.inputValidator()` - Zod schema validation
4. `.handler()` - Business logic with typed data/context

**Benefits:**
- Type inference flows through entire pipeline
- Middleware is reusable across functions
- Validation errors are caught early with clear messages
- Context accumulates through middleware chain
