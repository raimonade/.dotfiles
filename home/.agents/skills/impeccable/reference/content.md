# Content, states, and resilience

Interface text and the states it lives in: what the user reads, what they see before there is data, what happens when something fails, and what happens at the edges. Preserve factual meaning, product terminology, and brand voice — ask before changing a claim, a legal meaning, or a domain term.

## Language

Read the whole interaction path, not isolated strings. Look for ambiguous nouns and verbs, internal jargon, vague labels and states, missing consequences or recovery, inconsistent terminology, redundant headings and helper text, text that breaks at realistic widths or in translation, and tone that ignores stress or risk.

For each state, decide the one fact the user needs now, the action available next, the supporting context that changes the decision, and the tone the moment deserves. Say each idea once — if the heading already explains the state, the intro adds something new or disappears.

**Actions and navigation.** A specific verb and object where the outcome is not already obvious. Labels describe what will happen, not the gesture that triggers it. The same concept keeps the same noun and verb everywhere. For destructive actions, name the object and the consequence; prefer undo to confirmation when recovery is safe, and when confirmation is genuinely needed, put the action on the button rather than `Yes` / `OK` / `Submit`.

**Forms.** Persistent labels — a placeholder is an example, not a label. Format and eligibility requirements appear before submission, not after failure. Explain why information is needed when that is not obvious. Required and optional treatment stays consistent. Validation says what needs attention and how to fix it, without blaming the user, near the field, and announced accessibly.

**Errors.** An actionable error answers what failed, why when that is known and useful, and how to recover or what alternative remains. Do not surface an internal code as the primary message, and do not promise a cause the system cannot know. Privacy, payment, deletion, access loss, and blocked work are treated seriously — warmth helps, jokes do not.

**Help.** Helper text answers an implicit question instead of restating the control. Uncommon detail goes behind progressive disclosure. Link text makes sense out of context; icon-only controls carry accessible names.

Voice stays constant while tone adapts to the moment. Use plain language without flattening terminology the audience genuinely knows. Keep a short glossary when inconsistency spans the product, and never vary the word for a thing for literary effect.

## The states every surface owes

- **Loading** — name the real operation and set an honest expectation when the wait is meaningful. Show determinate progress when it exists; never invent it. Skeletons that match the incoming layout beat a spinner in the middle of content.
- **Empty** — distinguish first use, no results, active filters, no permission, and failure; they are five different states with five different next actions. A first-use empty state teaches the interface: what will be here, why it matters, and the one action that starts it.
- **Error** — the message above, plus a path back. Preserve whatever the user had entered.
- **Success** — confirm the outcome, and mention the consequence only when it changes what to do next. Routine success is brief.
- **Disabled** — say why, or do not disable. An unexplained disabled control is a dead end.
- **Permission and offline** — name what is unavailable and what still works.

## Onboarding

Time to value is the metric. Show rather than tell, make it skippable wherever possible, and respect the user's intelligence — nobody reads a five-step tour.

- Prefer contextual, just-in-time guidance at the moment a feature is first reachable over an upfront ceremony.
- Let the first real action *be* the tutorial: a pre-filled example, a sample project, a template.
- Ask only for what is needed to start; defer the rest into the product.
- Feature discovery belongs where the feature lives, once, dismissible, and never again.
- Always leave an exit, and make progress visible when a flow genuinely has steps.

## Hardening

**Text and overflow.** Test with the shortest and longest realistic content, plus a hostile case. Long unbroken strings need `overflow-wrap` or `text-overflow`; truncation needs the full value available on hover, focus, or a details view. Multi-line clamps must not hide the only copy of something important. Containers grow or scroll rather than clipping.

**Internationalization.** German expands roughly 30%, and CJK contracts while needing more line height. Never concatenate sentence fragments — pass complete translatable messages with structured placeholders translators can reorder. Format dates, numbers, and currency through the platform's locale APIs. Support RTL with logical properties (`margin-inline-start`, not `margin-left`) and mirror directional icons. Pluralization goes through a real plural-rules mechanism, not `count === 1`.

**Edge cases and boundaries.** Zero, one, and very many. Missing avatars, names, images, and optional fields. Extreme numbers and negative values. Time zones, DST, and the year boundary. Concurrent edits and stale data. Double submits and rapid repeated clicks. Deep-linking into a state that no longer exists. Back-button behavior mid-flow.

**Input.** Validate and sanitize at the trust boundary, on the server as well as the client. Never render untrusted HTML. Enforce the same constraints in the UI that the backend enforces, so the user learns them before submitting.

**Failure.** Network errors, timeouts, and partial responses each get a designed state. Retry with backoff where retrying is safe; make it explicit where it is not. Never lose user input to a failed request — preserve it and let them try again. An error boundary contains a component failure instead of blanking the page.

**Accessibility resilience.** The interface still works at 200% zoom, with a large system font, in forced-colors mode, with reduced motion and reduced transparency, and with the keyboard alone. Announce async state changes through a live region so a screen-reader user learns what a sighted user sees.

## Verify

Read the flow in context and check comprehension without hidden product knowledge; actionability at every error, empty state, and decision point; factual accuracy and consistent terminology; scanability at target widths and 200% zoom; long names, localization expansion, pluralization, and dynamic values; accessible names and announced state changes; and tone proportional to consequence. The final copy is as short as it can be without losing meaning or recovery.
