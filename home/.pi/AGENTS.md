# PI AGENT WORKSPACE

**Generated:** 2026-06-22T00:00:00Z
**Commit:** upstream-sync

Global Pi config, synced through dotfiles and stowed into `~/.pi`. npm workspace for Pi agent extensions + skills. TypeScript, ESM-only.

## Structure

```
.pi/
├── package.json          # npm workspace root: agent/extensions/*
├── tsconfig.json         # strict TypeScript config for local extensions
└── agent/
    ├── settings.json     # provider/model/packages/skill disables
    ├── mcp.json          # MCP server definitions consumed by pi-mcp-adapter
    ├── cloudflare-deployment-allowlist.json # explicit deploy policy; deny-all by default
    ├── cloak.json        # secret masking patterns
    ├── chains/           # reusable declarative pi-subagents workflows
    ├── extensions/       # local TypeScript extensions and workspace packages
    │   ├── cfpaste/            # Cloudflare Markdown paste commands
    │   ├── opencode-cloudflare/ # Cloudflare gateway provider helpers
    │   ├── save-md/            # save markdown helper extension
    │   ├── pi-ephemeral/       # project-local ephemeral resource picker
    │   ├── pi-skill-toggle/    # interactive skill frontmatter toggler
    │   ├── pi-cloak/           # secret cloaking extension
    │   ├── session-footer/     # responsive session telemetry footer
    │   ├── todos/              # file-backed todo tool
    │   └── *.ts                # standalone extensions and deployment guards
    └── skills/           # unique Pi-owned links only; ignored by git
```

Canonical shared skills live in `../.agents/skills/` in this repository and are stowed to `~/.agents/skills/`. Pi discovers them there directly; do not add duplicate links under `agent/skills/`.

## Commands

```bash
npm install                        # refresh extension workspace deps
npm run check                      # typecheck/test local Pi extensions
npm run test:cfpaste               # cfpaste tests only
npm run test:save-md               # save-md tests only
npm run test:session-footer        # responsive footer tests only
```

## Where to look

| Task | Location |
|------|----------|
| Change default model/provider | `agent/settings.json` |
| Add pi package | `agent/settings.json` → `packages[]` |
| Configure MCP servers | `agent/mcp.json` |
| Create saved subagent workflow | `agent/chains/<name>.chain.json` |
| Create extension | `agent/extensions/<name>/` with `package.json` |
| Create standalone extension | `agent/extensions/<name>.ts` |
| Create shared skill | `../.agents/skills/<name>/SKILL.md` |
| Secret masking | `agent/cloak.json` |
| Run extension tests | `npm run check` (from .pi root) |
| Type-check | `npm run check` (from .pi root) |

## Conventions

- Use `@earendil-works/*` Pi packages, not old `@mariozechner/*` imports.
- Prefer packaged integrations in `agent/settings.json` (`npm:pi-mcp-adapter`, `git:github.com/dmmulroy/pi-web-tools`, etc.) over vendored copies.
- Extensions as npm workspace packages: each has own `package.json`.
- Standalone extensions: single `.ts` file in `extensions/`.
- Shared skills: canonical under `../.agents/skills/`; `SKILL.md` entry with optional bundled resources; no Pi compatibility links.
- Saved workflows: declarative `pi-subagents` chains under `agent/chains/`; prefer phase/label metadata, structured outputs, and bounded fanout over executable workflow scripts.
- ESM only: `"type": "module"` everywhere.
- Keep runtime state and caches out of git; only config, local extensions, shared `.agents` skills, and themes should be tracked.
- Keep the global upstream-aligned skill catalog under `../.agents/skills/`; put project/vendor-specific skills in ephemeral/project-local config.
- Do not reintroduce removed gateway/provider experiments unless explicitly requested.

## Anti-patterns

- Installing deps at workspace root for extension-specific needs (use per-package).
- Committing `node_modules/` (gitignored per-extension).
- Editing `agent/settings.json` outside dotfiles repo (stow overwrites).
- Adding runtime state files to git (most of `agent/*` is gitignored; `agent/skills/` stays ignored).
- Mirroring shared skills under `agent/skills/`; keep only unique Pi-owned integrations there.
- Writing any private model/provider IDs into tests, fixtures, docs, examples, source comments, tracked configuration, or any other version-controlled file.

## Gitignore pattern

Most of `agent/` is gitignored by default. Tracked files are explicitly un-ignored:
- `agent/settings.json`, `agent/cloak.json`, `agent/mcp.json`, `agent/cloudflare-deployment-allowlist.json`, `agent/tsconfig.json`, `agent/package.json`
- `agent/extensions/**` (but `node_modules/` within are re-ignored)
- `agent/chains/**`
- `agent/themes/*.json`

Unique `agent/skills/` links, `ephemeral/`, and nested `.pi/` runtime directories remain ignored.

## Notes

- MCP is provided by `npm:pi-mcp-adapter`; keep server config in `agent/mcp.json`.
- `pi-skill-toggle` provides `/toggle-skills` for making installed skills invocable or manual-only.
- `pi-ephemeral` provides `/ephemeral` for selecting project-local resources.
- Treat local provider/model overlays as private information: never expose them in version-controlled content.
