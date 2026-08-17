# .pi

Global pi config, synced via dotfiles and stowed into `~/.pi`.

## Extension dependency workspace

Package-style global extensions stay in `agent/extensions/` so pi can auto-discover them from:

- `~/.pi/agent/extensions/*.ts`
- `~/.pi/agent/extensions/*/index.ts`
- package-style extension directories under `~/.pi/agent/extensions/` that declare `pi.extensions` in `package.json`

This directory is the shared npm workspace root for extension development.

Install or refresh dependencies from here:

```bash
cd ~/.pi
npm install
```

Run workspace checks:

```bash
npm run check
npm run test:cfpaste
npm run test:save-md
npm run typecheck:pi-ephemeral
npm run typecheck:pi-skill-toggle
```

Current workspace-managed extensions:

- `agent/extensions/cfpaste`
- `agent/extensions/opencode-cloudflare`
- `agent/extensions/save-md`
- `agent/extensions/session-footer`
- `agent/extensions/pi-ephemeral`
- `agent/extensions/pi-skill-toggle`

Standalone extensions include the fail-closed Cloudflare deployment allowlist and worker-configuration guard. Deployments remain blocked until `~/.pi/agent/cloudflare-deployment-allowlist.json` explicitly lists an allowed Worker/environment pair. Pi Web Tools is installed from `git:github.com/dmmulroy/pi-web-tools` through `agent/settings.json` rather than maintained locally; Fish supplies its public Exa endpoint from `~/.config/fish/conf.d/pi-web-tools.fish`.

MCP support is provided by the installed `npm:pi-mcp-adapter` package and configured in `agent/mcp.json`.

After changing extension code or package settings, reload pi with `/reload`.

## Skill management

`pi-skill-toggle` adds `/toggle-skills` for making installed skills agent-invocable or manual-only by editing skill frontmatter.

`pi-ephemeral` adds the `/ephemeral` command for selecting project-local ephemeral resources.

It manages project-level resources under a repo’s local `.pi/` directory, including:

- skills
- prompts
- extensions
- MCP servers

Global catalog sources live here:

- `~/.pi/ephemeral/skills/`
- `~/.pi/ephemeral/prompts/`
- `~/.pi/ephemeral/extensions/`
- `~/.pi/ephemeral/mcp/mcp.json`

Typical flow:

```text
/reload
/ephemeral
```

After applying changes in the Ephemeral UI, run `/reload` in the project session to activate them.
