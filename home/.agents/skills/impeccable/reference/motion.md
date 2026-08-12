# Motion

Motion explains state, relationship, and hierarchy, or creates the one authored moment the surface has earned. Decoration without a job is animation debt.

**By mode.** Persuade and Experience may let motion carry the voice — prefer one rehearsed focal sequence to repeated section reveals. Operate and Read use motion for feedback, state, and continuity, kept fast; a product loads into a task, and nobody wants to watch it arrive. On native, follow the motion section of [platforms.md](platforms.md) instead of the web tooling below. For drag, swipe, sheets, drawers, and scrubbers, load [direct-manipulation.md](direct-manipulation.md).

## Find the job

Inspect the existing motion language, interaction states, target devices, and performance budget. Animate only where motion would acknowledge an action, make a state change or spatial relationship legible, preserve continuity through navigation or layout change, direct attention at a moment that matters, or embody the chosen visual world. A static area does not need motion merely because it exists.

## Set the thesis

Write it down before implementing:

- **Focal moment** — the one sequence or interaction that deserves authorship, if any.
- **Continuity** — the state, layout, or navigation changes that need explaining.
- **Feedback** — the controls and outcomes that need acknowledgment.
- **Budget** — which effects may be expensive, and how often they run.

The focal moment comes from *this* product and surface. A generic fade-and-rise, hover lift, parallax layer, or scroll reveal is not a thesis.

## Choose material by meaning

Transform and opacity are reliable foundations, not the whole palette. Pick properties for what the transition communicates:

- **Continuity and relationship** — shared-element motion, FLIP-style transforms, View Transitions, deliberate spatial movement.
- **Focus and depth** — bounded blur, filter, backdrop, light, or shadow change. Blur also usefully masks a transition that cannot be made perfect.
- **Reveal and composition** — masks, clip paths, cropping, controlled occlusion.
- **Material and energy** — color, gradient position, texture, distortion, or shader work when the world and runtime support it.
- **State and feedback** — the smallest change that makes cause and result unmistakable.

One strong material idea carried through the focal sequence beats stacked techniques. Sibling stagger belongs where a list appears as a list, with a capped total delay — not every scrolled section reinterpreted as a staggered list.

## Timing and easing

| Duration | Use |
|---|---|
| 100–150 ms | immediate feedback |
| 150–300 ms | routine state change |
| 300–500 ms | layout, overlay, or view transition |
| 500–800 ms | a deliberately authored focal entrance |

Exit faster than entrance. Use exponential deceleration — `cubic-bezier(0.16, 1, 0.3, 1)` is a dependable confident arrival — and do not reach for bounce or elastic by reflex. Long feedback reads as latency.

## Implement to the runtime

- CSS transitions and keyframes for declarative state and bounded sequences; prefer transitions over keyframe sequences for anything a user can retrigger, because a transition retargets from its current value while a keyframe restarts.
- The Web Animations API or the project's existing motion library for interruption, sequencing, and dynamic values. Do not add a dependency for an effect the current stack expresses cleanly.
- `@starting-style` for entrance animations, which removes the scaffolding that enter-state classes need.
- View Transitions or shared-element techniques where continuity across states is the point.
- Scroll-driven animation only when the scroll relationship itself carries meaning, always with a static fallback.

Anchored overlays transform from their trigger — set `transform-origin` at the trigger's position so a popover grows from the thing that opened it. Centered modals stay centered, and nothing scales from `0`, which makes children flicker as they scale with the parent.

Keep content visible in the default state so a failed script never hides the page. Avoid animating `width`, `height`, `top`, `left`, and margins casually — use FLIP, transforms, or grid techniques. Bound blur, filter, shadow, canvas, and shader work to isolated regions. Apply `will-change` only during a known animation. Profile inherited custom-property updates before driving per-frame state through a variable on a large descendant tree. Measure on target devices rather than assuming transform means fast.

Debugging tactics that pay for themselves: slow the animation down 10× to see what is really happening, and step frame by frame to check transform origin and whether coordinated properties actually start together.

## Accessibility

Gate hover-triggered motion behind `@media (hover: hover) and (pointer: fine)`. Keyboard-triggered actions respond immediately — motion designed for a pointer feels broken when a keyboard fires it.

Every animation needs a `prefers-reduced-motion` path with an *intentional* alternative: remove travel, momentum, and overshoot while preserving the opacity, color, and state changes that carry meaning. Reduced motion means fewer and gentler animations, not a page where nothing confirms an action. Under `prefers-reduced-transparency`, replace translucent materials with a more opaque surface and reduce blur.

Respect autoplay and sound preferences; nonessential loops stop when offscreen or hidden. Sound never plays without an explicit opt-in.

## Ambitious technique

When the brief asks for something that should feel technically extraordinary and the direction is still open, compare a small set of distinct approaches and get a pick before building—this is the work most likely to be thrown away. Context decides what extraordinary means: a particle system flatters a portfolio and embarrasses a settings page, while a settings page with instant optimistic saves and animated state transitions is extraordinary in its own register.

The toolkit, by what it achieves: View Transitions and `@starting-style` for cinematic state change; spring physics for natural motion with real interruption; scroll-driven animations for scroll-linked reveals; WebGL, WebGPU, Canvas/OffscreenCanvas, and SVG filter chains for rendering past CSS; virtual scrolling and GPU-rendered charts for data that must feel alive; `@property` for animating gradients and complex values; Web Workers and WASM for keeping the main thread free.

Discipline is what separates ambition from breakage: every technique degrades gracefully behind `@supports` or a capability check, and the experience without it is still good; target 60fps and simplify below 50; lazy-initialize heavy resources near the viewport and pause offscreen rendering; test on a real mid-range device. Never use technical ambition to mask weak fundamentals, and never layer competing extraordinary moments — focus creates impact, excess creates noise.

## Verify

The focal motion is specific to this world and surface. Every supporting animation explains feedback, state, or relationship. Interruption and rapid repeat behave correctly. Desktop, mobile, and keyboard paths remain usable. The reduced-motion path reduces movement without erasing meaning. Expensive effects stay smooth on the target device. And the removal test: taking an animation away should lose meaning or authored character — if nobody would notice, it was decoration.
