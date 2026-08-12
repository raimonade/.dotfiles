# Native platforms

For apps shipping to Apple or Android hardware — SwiftUI, UIKit, Jetpack Compose, Android Views, React Native, Expo, Flutter. On native, the platform guidelines govern structure, navigation, and interaction in every mode; brand expresses through the layer the platform leaves open — tint, type accent, motion personality, content. The web numbers elsewhere in this skill are replaced by the ones here.

**The slop test.** Would a fluent user of this platform trust the app, or pause at every subtly-off control? The tell is "ported from somewhere else": reinvented navigation, a back affordance that ignores the system gesture, web-shaped buttons, hover-dependent affordances, one platform's controls wearing the other's skin. Default to the platform's own components and depart only for a reason the user would thank you for.

## iOS / iPadOS

**Layout.** Lay out inside the safe-area insets — no controls under the notch, Dynamic Island, home indicator, or rounded corners. Tab bar for 2–5 top-level *sections* (never actions), navigation stack for hierarchy, sheet for a self-contained task. The left-edge back gesture is muscle memory: never disable or overlay it. Large titles on top-level screens collapsing to inline on scroll; detail screens stay inline.

**Touch targets.** 44×44 pt minimum, with breathing room between adjacent targets.

**Type.** System text styles (Large Title through Caption) so text follows the user's reading size — no hard-coded point sizes. San Francisco carries body, labels, and controls; a brand face may appear in display moments. 11 pt floor; Body is 17 pt.

**Color and material.** Semantic system colors (label, secondaryLabel, systemBackground, separator, tint) adapt to Dark Mode and increased contrast automatically; raw hex breaks there. Dark Mode is a first-class appearance, designed and tested. One tint color drives interactive elements. System materials for blur behind bars and sheets, not hand-rolled glassmorphism.

**Components.** Platform controls — switch, segmented control, stepper, system pickers, action sheets, alerts, context menus, swipe actions. Reinventing these is the most common native slop. SF Symbols for iconography, baseline-aligned and Dynamic Type-aware; do not mix in a web icon set. Sheets for focused dismissible sub-tasks, full-screen covers for immersion, with clear Cancel/Done and swipe-to-dismiss honored unless data loss requires a guard. Grouped or inset lists for settings-shaped content.

**Motion.** System transitions: push slides, sheets rise, dismiss reverses the entrance. Custom transitions that fight the navigation model disorient. Honor Reduce Motion with a crossfade instead of parallax and large slides.

## Android

**Layout.** Material navigation matched to width: navigation bar (bottom, 3–5 destinations) on compact, navigation rail or drawer on expanded — never a phone bottom bar shipped untouched to a tablet. System Back always works, including the predictive Back gesture. Edge-to-edge with window insets applied for status bar, navigation bar, display cutout, and IME. Top app bar for screen context, paired with a FAB when the screen has one primary action.

**Touch targets.** 48×48 dp minimum, with at least 8 dp between them.

**Type.** The Material type scale — Display, Headline, Title, Body, Label, each in large/medium/small. Map text to roles rather than hand-picking sizes per screen. Roboto is the system face; theme a brand face in through the scale. `sp` units, never fixed `px`, so type follows the system font-size setting.

**Color.** Material color roles (primary, on-primary, surface, surface-variant, secondary-container, outline, error) resolve light, dark, and contrast variants automatically; raw hex breaks there. Dynamic Color where it fits, with a static fallback. Dark theme is a first-class scheme, never a quick invert. Convey elevation through tonal surface levels rather than arbitrary drop shadows.

**Components and motion.** Material buttons (filled / tonal / outlined / text), FAB, switches, chips, snackbars, bottom sheets, Material dialogs, navigation bar/rail/drawer. One FAB, one primary action. Snackbars for transient feedback, dialogs only for decisions that must interrupt. Material motion patterns — container transform, shared-axis, fade-through — with standard easing and durations, and the system "remove animations" setting honored with a crossfade or instant cut.

## Adapting across contexts

The trap is treating adaptation as scaling. Rethink the experience for the new context inside that platform's conventions.

**Phone → tablet.** Restructure, do not stretch; a scaled-up phone UI is the failure mode. Drive structure from size classes / window size classes, never from device-model checks. Navigation changes shape: tab bar to sidebar on iPad, navigation bar to rail or drawer on expanded Android. Use the width for split view and master-detail, multi-column grids, and popovers where phones used sheets. Multitasking is a size, not an edge case — Split View and multi-window can hand you a phone-width window on a tablet, and size-class-driven layout handles both for free.

**Orientation and foldables.** Landscape restructures — side-by-side panes, repositioned controls — and never clips or letterboxes. Lock orientation only when the task truly demands it. Foldables react to posture and hinge; test folded, unfolded, and tabletop.

**Platform → platform.** Translate idioms; never transplant them.

| iOS | Android |
|---|---|
| Tab bar | Navigation bar / rail / drawer |
| Edge-swipe back, back chevron | Predictive Back gesture / button |
| Switch, segmented control, system pickers | Material switch, chips, Material pickers |
| Action sheet | Bottom sheet / Material dialog |
| SF Symbols, SF Pro, Dynamic Type | Material Symbols, Roboto, sp scaling |
| Semantic system colors, materials | Material color roles, tonal elevation |
| System push/sheet transitions | Container transform, shared-axis, fade-through |

Rebuild navigation and controls in the target's vocabulary, and carry the brand's expressive layer across through the target's theming system. A cross-platform app still owes each OS its guarantees on that hardware: safe-area insets, Reduce Motion, and edge-swipe back on iOS; insets, predictive Back, and font scale on Android.

**Web → native.** Reconform, do not reflow. Platform navigation replaces web navigation, platform controls replace HTML-shaped ones, touch-first affordances replace hover, and Dynamic Type or `sp` replaces px-based type. Then hold the result to the slop test above.

## Verifying the build

Screenshots come from the simulator, emulator, or device — never a browser.

- **iOS:** `xcrun simctl io booted screenshot <path>`. With several simulators running, replace `booted` with the target's UDID from `xcrun simctl list devices booted`; display names collide, UDIDs do not. `xcrun simctl ui booted appearance dark` flips the appearance, and a pass at a large Dynamic Type size catches the truncation a fixed layout hides.
- **Android:** `adb exec-out screencap -p > <path>`, with `adb -s <serial>` when several devices are attached. `adb shell cmd uimode night yes` flips an emulator's theme. To test font scale on an emulator, capture its current `settings get system font_scale` value first and restore that exact value afterward. Never change a physical device's theme or accessibility settings without explicit permission.

Capture every device class the app ships to — at least one phone, plus one tablet when tablets are a target — and both orientations where both ship. Simulators give breadth; posture, gestures, refresh rates, and performance need real hardware. Say which one produced the evidence.

Never ship a stretched phone layout on a tablet, port one platform's controls onto the other, hide core functionality on smaller devices, or lock orientation to dodge a layout bug.
