# Visual Explainer patterns

Copy-adapt reference for the HTML artifacts this skill produces. Read the section
you need; skip the rest.

## Theme tokens

Every page defines the same variable names so the templates stay interchangeable.
Define light first, then override in a `prefers-color-scheme` block.

```css
:root {
  --font-body: 'Avenir Next', Optima, 'Segoe UI', system-ui, sans-serif;
  --font-mono: Menlo, 'SF Mono', 'Cascadia Mono', Consolas, monospace;

  --bg: #faf7f5;
  --surface: #ffffff;
  --surface-2: #f3ede9;      /* recessed: reference material */
  --surface-raised: #fffdfb; /* elevated: primary section */
  --border: rgba(0, 0, 0, 0.09);
  --text: #241c16;
  --text-dim: #7d7268;

  --accent-a: #b3441a;       /* terracotta */
  --accent-b: #4d7c30;       /* sage */
  --accent-c: #0f766e;       /* teal */
  --accent-a-dim: rgba(179, 68, 26, 0.09);
  --accent-b-dim: rgba(77, 124, 48, 0.09);
  --accent-c-dim: rgba(15, 118, 110, 0.09);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #17110e;
    --surface: #211a16;
    --surface-2: #1b1512;
    --surface-raised: #2b221d;
    --border: rgba(255, 255, 255, 0.1);
    --text: #f0e7e0;
    --text-dim: #a2938a;

    --accent-a: #f08a5d;
    --accent-b: #a3c46a;
    --accent-c: #5eead4;
    --accent-a-dim: rgba(240, 138, 93, 0.14);
    --accent-b-dim: rgba(163, 196, 106, 0.14);
    --accent-c-dim: rgba(94, 234, 212, 0.14);
  }
}
```

Offline-safe body/mono stacks with real character (pick one per page, vary across
pages): `'Avenir Next', Optima` · `'Iowan Old Style', Palatino` · `'Helvetica
Neue', 'Segoe UI'` for body; `Menlo` · `'Andale Mono'` · `'Courier New'` for mono.
Other accent directions: rose+cranberry, amber+emerald, deep blue+gold, slate+teal.

Style links explicitly — `color: var(--accent-a)` plus an underline. Browser
default blue fails contrast on dark backgrounds.

Give the background a little atmosphere, one line, no mesh blobs:

```css
body { background: var(--bg) radial-gradient(circle, var(--border) 1px, transparent 1px) 0 0 / 24px 24px; }
```

## Page shell

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  color: var(--text);
  font: 400 15px/1.65 var(--font-body);
  padding: 40px 24px;
}
.page { max-width: 1040px; margin: 0 auto; }
h1 { font-size: 38px; line-height: 1.1; letter-spacing: -0.02em; text-wrap: balance; }
h2 { font-size: 22px; letter-spacing: -0.01em; margin-bottom: 12px; }
.subtitle { font-family: var(--font-mono); font-size: 12px; color: var(--text-dim); }
@media (max-width: 700px) { body { padding: 20px 14px; } h1 { font-size: 26px; } }
```

## Cards and depth

Namespace page classes as `.ve-*`. Never define a page-level `.node` — Mermaid
uses `.node` internally on its SVG groups and page styles leak into diagrams.

```css
.ve-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent-a);
  border-radius: 10px;
  padding: 16px 20px;
  min-width: 0;                 /* required inside grid/flex */
}
.ve-card--raised { background: var(--surface-raised); box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
.ve-card--quiet { background: var(--surface-2); border-left-color: var(--border); }
.ve-card__label { font: 500 11px var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-dim); }

.ve-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.ve-grid > * { min-width: 0; }
```

Reserve `--raised` for the one primary section per page and `--quiet` for
reference material; flat is the default.

Badges and inline code:

```css
.ve-badge { display: inline-block; font: 500 11px var(--font-mono); padding: 2px 8px; border-radius: 999px; background: var(--accent-b-dim); color: var(--accent-b); }
code { font: 12px var(--font-mono); background: var(--accent-a-dim); color: var(--accent-a); padding: 1px 5px; border-radius: 3px; }
pre { background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; overflow-x: auto; }
pre code { background: none; color: var(--text); padding: 0; }
```

Show the 5–20 lines that carry the point, not whole files.

## Overflow protection

Long identifiers, paths, and wide tables are the usual break. Apply globally:

```css
:where(h1, h2, h3, p, li, td, th, .ve-card) { overflow-wrap: break-word; }
.ve-scroll { overflow-x: auto; }        /* wrap wide tables and code */
img, svg, table { max-width: 100%; }
```

Do not set `display: flex` on `<li>` when list markers matter — it removes the
marker box. Use `display: list-item` with padding, or move flex to an inner span.

## Tables

Use a real `<table>` with `<caption>`, `<thead>`, and `<th scope>` so the content
survives copy/paste and screen readers.

```css
.ve-scroll { overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
caption { text-align: left; padding: 12px 16px; color: var(--text-dim); font-size: 13px; }
th, td { padding: 10px 16px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; }
thead th { position: sticky; top: 0; background: var(--surface-2); font: 500 11px var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; }
tbody tr:last-child td { border-bottom: none; }
td.num { text-align: right; font-variant-numeric: tabular-nums; font-family: var(--font-mono); }
```

## Section navigation (4+ sections)

Sidebar on desktop, sticky bar on mobile, `IntersectionObserver` scroll spy.

```css
.ve-layout { display: grid; grid-template-columns: 180px 1fr; gap: 32px; align-items: start; }
.ve-toc { position: sticky; top: 24px; display: grid; gap: 2px; }
.ve-toc a { padding: 6px 10px; border-radius: 6px; font-size: 13px; color: var(--text-dim); text-decoration: none; border-left: 2px solid transparent; }
.ve-toc a.is-active { color: var(--accent-a); background: var(--accent-a-dim); border-left-color: var(--accent-a); }
@media (max-width: 860px) {
  .ve-layout { grid-template-columns: 1fr; gap: 16px; }
  .ve-toc { position: sticky; top: 0; z-index: 20; grid-auto-flow: column; justify-content: start; overflow-x: auto; background: var(--bg); padding: 8px 0; }
}
```

```js
const toc = document.querySelector('.ve-toc');
if (toc) {
  const links = new Map([...toc.querySelectorAll('a')].map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const active = links.get(entry.target.id);
      if (!active) continue;
      links.forEach((a) => a.classList.toggle('is-active', a === active));
      if (innerWidth <= 860) active.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  }, { rootMargin: '-10% 0px -80% 0px' });
  links.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
}
```

Under four sections, skip the nav.

## Mermaid (network required)

Mermaid loads from a CDN, so it is only available when the user has allowed
network access for the artifact. Otherwise use CSS cards, a table, or an inline
SVG, and say why.

Init, once per page:

```js
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
const dark = matchMedia('(prefers-color-scheme: dark)').matches;
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    fontFamily: "'Avenir Next', Optima, system-ui, sans-serif",
    fontSize: '17px',                       // 18–20px for 10+ node graphs
    primaryColor: dark ? '#2b221d' : '#fdf1eb',
    primaryBorderColor: dark ? '#f08a5d' : '#b3441a',
    primaryTextColor: dark ? '#f0e7e0' : '#241c16',
    lineColor: dark ? '#a2938a' : '#7d7268',
  },
});
```

Markup contract — one `.diagram-shell` per diagram, source in a
`<script type="text/plain">` so nothing depends on element IDs:

```html
<section class="diagram-shell">
  <p class="diagram-shell__hint">Ctrl/Cmd + wheel to zoom · drag to pan · double-click to fit</p>
  <div class="mermaid-wrap">
    <div class="zoom-controls">
      <button type="button" data-action="zoom-in" aria-label="Zoom in">+</button>
      <button type="button" data-action="zoom-out" aria-label="Zoom out">&minus;</button>
      <button type="button" data-action="zoom-fit" aria-label="Fit diagram">&#8634;</button>
      <button type="button" data-action="zoom-expand" aria-label="Open full size">&#x26F6;</button>
      <span class="zoom-label">Loading…</span>
    </div>
    <div class="mermaid-viewport"><div class="mermaid mermaid-canvas"></div></div>
  </div>
  <script type="text/plain" class="diagram-source">
    flowchart TD
      A["Push to main"] --> B{"Tests pass?"}
  </script>
</section>
```

`../templates/mermaid-flowchart.html` holds the working zoom/pan/expand engine —
copy it rather than rewriting it. Its shape: the SVG lives in an absolutely
positioned `.mermaid-canvas` inside an `overflow: hidden` `.mermaid-viewport`;
zoom sets the SVG's `width`/`height`, panning translates the canvas.

Insert rendered SVG with `new DOMParser().parseFromString(svg, 'text/html')` and
`document.adoptNode`. The strict `image/svg+xml` parser truncates Mermaid's
`<foreignObject>` labels, and `innerHTML` trips security scanners.

Authoring rules that prevent silent render failures:

- Quote every label containing punctuation: `A["Retry (max 3)"]`.
- Line breaks are `<br/>` inside a quoted label, never `\n`.
- `flowchart TD` by default; `LR` only for 3–4 node linear flows.
- `stateDiagram-v2` does not accept HTML in labels — keep them plain.
- 15+ elements: a small Mermaid overview plus CSS detail cards, not one giant graph.
- Fewer than ~7 nodes in a linear chain: CSS step cards read better than Mermaid.

Type picker: flowchart for pipelines/decisions · `sequenceDiagram` for
call-and-response over time · `erDiagram` for schemas · `stateDiagram-v2` for
lifecycles · `classDiagram` for type relationships · `C4Context` for system
boundaries.

## Motion

Entrance animation for hierarchy only; never continuous glow, pulse, or breathing.

```css
@keyframes ve-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.ve-in { animation: ve-rise 0.4s ease-out both; animation-delay: calc(var(--i, 0) * 0.06s); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Slides

Only when asked. Slides are a medium, not a paginated article.

```css
html, body { height: 100%; overflow: hidden; }
.deck { height: 100dvh; position: relative; }
.slide { position: absolute; inset: 0; display: grid; align-content: center; gap: 20px; padding: 6vh 8vw; opacity: 0; visibility: hidden; transition: opacity 0.35s ease; }
.slide.is-current { opacity: 1; visibility: visible; }
.slide h2 { font-size: clamp(30px, 5vw, 58px); }
.slide p, .slide li { font-size: clamp(16px, 1.7vw, 22px); }
```

Ten compositions to rotate through: title, section divider, content, split,
diagram, dashboard, table, code, quote, full-bleed. Three centred slides in a row
is a smell.

Chrome (all four required): prev/next buttons, `n / total` counter, clickable
dots, and keyboard `←`/`→`/`Home`/`End`. `../templates/slide-deck.html` has the
engine.

Before writing HTML, inventory the source and map every item to a slide. Content
that does not fit gets another slide — it never gets dropped.

## Optional generated images

If `surf` is available, generated images may be embedded as base64 for hero
banners or conceptual illustrations. Skip them for structural, data-heavy, or
diagram-suitable content. Every page must stand up without images.
