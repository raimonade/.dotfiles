# PI AGENT WORKSPACE

Global Pi config, synced through dotfiles and stowed into `~/.pi`.

## Structure

```
.pi/
├── package.json          # npm workspace root: agent/extensions/*
├── tsconfig.json         # strict TypeScript config for local extensions
└── agent/
    ├── settings.json     # provider/model/packages/skill disables
    ├── mcp.json          # MCP server definitions consumed by pi-mcp-adapter
    ├── cloak.json        # secret masking patterns
    ├── extensions/       # local TypeScript extensions and workspace packages
    │   ├── web-tools/          # webfetch/websearch tools
    │   ├── pi-ephemeral/       # project-local ephemeral resource picker
    │   ├── pi-skill-toggle/    # interactive skill frontmatter toggler
    │   ├── pi-cloak/           # secret cloaking extension
    │   ├── todos/              # file-backed todo tool
    │   └── *.ts                # standalone extensions
    └── skills/           # curated global Pi skills
```

## Commands

```bash
npm install              # refresh extension workspace deps
npm run check            # typecheck/test local Pi extensions
npm run test:web-tools   # web-tools tests only
```

## Conventions

- Use `@earendil-works/*` Pi packages, not old `@mariozechner/*` imports.
- Prefer packaged integrations in `agent/settings.json` (`npm:pi-mcp-adapter`, etc.) over vendored copies.
- Keep runtime state and caches out of git; only config, local extensions, skills, and themes should be tracked.
- Keep global skills curated. Add broad reusable skills here; put project/vendor-specific skills in ephemeral/project-local config.
- Do not reintroduce removed gateway/provider experiments unless explicitly requested.

## Notes

- MCP is provided by `npm:pi-mcp-adapter`; keep server config in `agent/mcp.json`.
- `pi-skill-toggle` provides `/toggle-skills` for making installed skills invocable or manual-only.
- `pi-ephemeral` provides `/ephemeral` for selecting project-local resources.
