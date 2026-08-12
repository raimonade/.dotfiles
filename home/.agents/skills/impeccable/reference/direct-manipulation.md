# Direct manipulation

Load this only for drag, swipe, sheet, drawer, scrubber, or other gesture-driven UI. The interface should remain under the user's control throughout the gesture.

## Gesture loop

1. Track the primary pointer continuously and capture it for the gesture. Guard against accidental multi-touch.
2. Update the controlled value 1:1 with the pointer; feedback starts on the first meaningful movement, not after release.
3. Keep a short position-and-time history so release velocity is measured rather than guessed.
4. Detect plausible gesture directions together, then cancel losers once intent is clear. Preserve platform navigation gestures.
5. At a boundary, apply resistance rather than a hard stop. Rubber-banding should reveal the limit without implying extra range.

## Release and interruption

A release continues from the current visible value and velocity. Choose the destination from projected momentum, then hand release velocity into an interruptible spring:

```text
projected = current + (velocity / 1000) * deceleration / (1 - deceleration)
```

Use the nearest valid snap point to `projected`, not to the release position. Treat the equation as a starting model and tune against the real control and device.

- Retarget from the current rendered value; a new gesture can grab and reverse motion immediately.
- Carry velocity through a reversal instead of hard-cutting to a new animation.
- Use independent axes when their velocity and bounds differ.
- Prefer critically damped motion for routine controls. Slight bounce belongs only to momentum-driven interactions.
- Use the project's existing motion runtime. Add a spring dependency only when the native platform or installed stack cannot provide honest interruption and velocity handoff.

## Accessibility

Under `prefers-reduced-motion`, remove momentum, overshoot, and travel while preserving immediate state feedback. Under `prefers-reduced-transparency`, replace translucent materials with a more opaque surface and reduce or remove blur.

Verify on real pointer and touch hardware: dragging, release, reversal, boundary resistance, multi-touch rejection, system gestures, reduced motion, and reduced transparency.
