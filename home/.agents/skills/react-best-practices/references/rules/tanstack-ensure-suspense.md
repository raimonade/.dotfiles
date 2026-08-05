---
title: Ensure-Suspense Pattern with TanStack Query
impact: HIGH
impactDescription: eliminates waterfalls, guarantees data before render
tags: tanstack, query, suspense, ensureQueryData, cache
---

## Ensure-Suspense Pattern with TanStack Query

Use `ensureQueryData` in loaders + `useSuspenseQuery` in components to guarantee data is ready before route transition while maintaining cache benefits.

**Incorrect: fetch in component causes waterfall**

```tsx
export const Route = createFileRoute('/posts')({
  component: PostsPage,
})

function PostsPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) return <Skeleton /> // Waterfall: route renders, THEN fetches
  return <PostsList posts={posts} />
}
```

**Incorrect: fetch in loader but no cache reuse**

```tsx
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(), // Fetches but doesn't populate Query cache
  component: PostsPage,
})

function PostsPage() {
  const posts = Route.useLoaderData()
  // No automatic refetching, no cache invalidation
  return <PostsList posts={posts} />
}
```

**Correct: ensure-suspense pattern**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

// 1. Define query options (reusable config)
const postsQueryOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: fetchPosts,
})

export const Route = createFileRoute('/posts')({
  // 2. Preload in loader - populates cache before render
  loader: () => queryClient.ensureQueryData(postsQueryOptions),
  component: PostsPage,
})

function PostsPage() {
  // 3. Read from cache - never suspends after loader completes
  const { data: posts } = useSuspenseQuery(postsQueryOptions)

  return <PostsList posts={posts} />
}
```

**With parameters:**

```tsx
const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['posts', postId],
    queryFn: () => fetchPost(postId),
  })

export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params }) => queryClient.ensureQueryData(postQueryOptions(params.postId)),
  component: PostPage,
})

function PostPage() {
  const { postId } = Route.useParams()
  const { data: post } = useSuspenseQuery(postQueryOptions(postId))
  return <article>{post.content}</article>
}
```

**Benefits:**
- Data ready before route transition (no loading states on navigation)
- Full TanStack Query cache benefits (refetching, invalidation, deduplication)
- Type-safe from loader to component
- Background refetches keep data fresh
