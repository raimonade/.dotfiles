# Plannotator profile

Load this profile only when the user asks to review or annotate the HTML through Plannotator.

## Delivery

- Approval or proposal flow: `plannotator annotate <file> --render-html --gate`
- Informational flow: `plannotator annotate <file> --render-html`

Use Plannotator only when the CLI is already available. Do not install it or another skill as a side effect. Otherwise return the HTML path normally.

## Theme

Use semantic tokens so Plannotator can override them when embedded:

```css
:root {
  --background: oklch(0.97 0.005 260);
  --foreground: oklch(0.18 0.02 260);
  --card: oklch(1 0 0);
  --muted: oklch(0.92 0.01 260);
  --muted-foreground: oklch(0.40 0.02 260);
  --primary: oklch(0.50 0.25 280);
  --secondary: oklch(0.50 0.18 180);
  --accent: oklch(0.60 0.22 50);
  --destructive: oklch(0.50 0.25 25);
  --success: oklch(0.45 0.20 150);
  --warning: oklch(0.55 0.18 85);
  --border: oklch(0.88 0.01 260);
  --code-bg: var(--muted);
  --radius: 0.625rem;
  --font-sans: Inter, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-display: ui-serif, Georgia, serif;
}
```

Map the explainer's page, surface, text, subdued text, and accent variables to these tokens. Inter is intentional inside this profile because the artifact is joining Plannotator's interface rather than establishing an independent visual identity.

Keep content structure evidence-driven. The profile does not require KPI cards, timelines, accent side borders, or any other fixed component.
