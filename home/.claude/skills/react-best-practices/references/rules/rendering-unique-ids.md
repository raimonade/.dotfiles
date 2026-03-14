---
title: Use useId() for Component DOM IDs
impact: MEDIUM
impactDescription: prevents ID collisions when components render multiple times
tags: rendering, useId, svg, instance, ssr
---

## Use useId() for Component DOM IDs

Never hardcode DOM `id` attributes in reusable components. Multiple instances collide, causing broken SVG masks/clips, form label associations, and `getElementById` returning the wrong element.

**Incorrect (hardcoded IDs collide):**

```tsx
function Logo(props: SVGProps) {
  return (
    <svg {...props}>
      <mask id="mask0">
        <path d="..." fill="white" />
      </mask>
      <g mask="url(#mask0)">
        <rect fill="blue" />
      </g>
    </svg>
  )
}
```

Two `<Logo />` on the same page: both define `id="mask0"`, second instance's mask references first instance's definition.

**Correct (unique IDs per instance):**

```tsx
import { useId } from 'react'

function Logo(props: SVGProps) {
  const id = useId()
  return (
    <svg {...props}>
      <mask id={`${id}-m0`}>
        <path d="..." fill="white" />
      </mask>
      <g mask={`url(#${id}-m0)`}>
        <rect fill="blue" />
      </g>
    </svg>
  )
}
```

`useId()` generates stable, unique IDs that are consistent between server and client renders. Use it for SVG internal references (`mask`, `clipPath`, `linearGradient`), form `htmlFor`/`id` pairs, and any DOM ID in a reusable component.

For chart export or screenshot capture, prefer passing refs (`useRef`) over string IDs to `getElementById`.

Reference: https://react.dev/reference/react/useId
