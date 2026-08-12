---
name: visual-explainer
description: Generate an HTML visual explanation.
disable-model-invocation: true
license: MIT
metadata:
  author: nicobailon
  version: "0.9.0"
---

# Visual Explainer

Generate HTML pages that explain systems, code changes, plans, data, and technical
concepts visually: architecture overviews, diff/plan reviews, project recaps,
comparison tables, and slide decks.

## Delivery rules

- Reach for HTML when the user asks for a visual artifact or when relationships
  genuinely need spatial representation. Ordinary tables and review summaries stay
  in chat.
- Write to the requested path, or `~/.agent/diagrams/<descriptive-name>.html`.
  Report the path. Open it in a browser when the user asked to view it or the
  workflow needs visual verification.
- **Offline by default.** Embed all CSS and JS; use local font stacks. Mermaid and
  webfonts load from a CDN, so use them only when the user has allowed network
  access for this artifact — and keep a readable in-page fallback so the page
  still explains itself when the CDN is unreachable.
- Ground every claim in inspected files, command output, or `file:line` evidence.
  Never invent rationale, code paths, or momentum.

## Reference routing

| Need | Read |
|---|---|
| Any page: tokens, cards, tables, overflow, nav, motion, Mermaid contract | `./references/patterns.md` |
| Card/plan layout with section nav | `./templates/architecture.html` |
| Comparison, audit, or status matrix | `./templates/data-table.html` |
| Mermaid diagram with zoom/pan/expand | `./templates/mermaid-flowchart.html` |
| Slide deck | `./templates/slide-deck.html` |
| Annotation or review through Plannotator | `./references/profiles/plannotator.md` |

## Choose the representation

| Content | Default |
|---|---|
| Flowchart, pipeline, state machine, decision tree, sequence, ER, class, C4 | Mermaid |
| Text-heavy architecture, module internals, implementation plans | CSS grid cards |
| 15+ elements | Small Mermaid overview + CSS detail cards |
| Comparison, audit, status matrix | Semantic `<table>` |
| Timeline, roadmap, dashboard | CSS grid + KPI cards |
| Slide deck | Only when explicitly requested |

## Page recipes

Each recipe is a section order; gather the evidence for every section before
writing HTML.

- **Diff review** — summary · file map (`<details>` when long) · architecture
  impact · before/after behaviour · risk (correctness, tests, API compatibility,
  security, performance) · coupling · merge recommendation. Colour language: red
  removed, green added, amber modified/risk, blue context.
- **Plan review** — plan summary · accuracy verdict (correct / stale / risky /
  unsupported) · current vs proposed architecture · gap and risk matrix ·
  file-by-file review · corrections · decision.
- **Visual plan** — goal and non-goals · current state · proposed design ·
  ordered phases · file map · interfaces and contracts · risks · test plan ·
  acceptance checklist.
- **Project recap** — identity and stack · architecture snapshot · recent
  activity as narrative · current state (uncommitted work, branches, blockers) ·
  mental-model map · risks · useful commands · evidence-backed next steps.
- **Fact check** — extract verifiable claims from an existing artifact, verify
  each against source or git history, correct in place, and append a summary of
  what was checked and changed.

## Style invariants

- Semantic HTML wherever it helps accessibility and copy/paste: `<table>` with
  `<caption>`/`<th scope>`, real headings, lists, `<details>`, `<figcaption>`.
- Palette through CSS custom properties: `--bg`, `--surface`, `--border`,
  `--text`, `--text-dim`, and 3–5 accents; light and dark both work.
- Pick an aesthetic direction before writing — blueprint, editorial, paper/ink,
  terminal, IDE, data-dense — and vary it across artifacts.
- Avoid generic defaults: no body font that is only Inter, Roboto, Arial,
  Helvetica, or system-ui; no violet/fuchsia Tailwind accents (`#8b5cf6`,
  `#7c3aed`, `#a78bfa`, `#d946ef`) as the main palette; no cyan+magenta neon
  dashboard; no gradient-mesh blobs.
- Guard overflow: `min-width: 0` on grid/flex children, `overflow-wrap:
  break-word` on text, scroll containers around wide tables and code.
- Namespace page classes `.ve-*`. Never define a page-level `.node` — Mermaid
  owns it.
- Depth sparingly: elevated for the one primary section, recessed for reference.
- Motion only where it clarifies hierarchy, and always behind
  `prefers-reduced-motion`. No continuous glow, pulse, or breathing.

## Final checklist

- complete HTML document, written to the reported path;
- opens with no console errors;
- no horizontal overflow at desktop width, and readable at 700px;
- fonts and any CDN feature degrade to a readable page;
- tables keep their rows/columns and wrap long text;
- Mermaid diagrams use the `diagram-shell` contract with zoom/pan/fit/expand;
- slides fit one viewport, carry dots/counter/keyboard nav, and cover the source;
- `prefers-reduced-motion` honoured;
- the main idea is obvious in the first viewport;
- the styling would not be mistaken for a generic dark/violet template.
