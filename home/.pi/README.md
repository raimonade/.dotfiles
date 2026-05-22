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
npm run test:web-tools
npm run typecheck:pi-ephemeral
```

Current workspace-managed extensions:

- `agent/extensions/web-tools`
- `agent/extensions/pi-ephemeral`

MCP support is provided by the installed `npm:pi-mcp-adapter` package and configured in `agent/mcp.json`.

After changing extension code or package settings, reload pi with `/reload`.

## Pi Ephemeral

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

Current starter catalog in this dotfiles repo includes:

- ephemeral skills: `emil-design-eng`, `pr-walkthrough`, `prd-to-todos`, `setup-matt-pocock-skills`, `ui`, `write-a-prd`

Typical flow:

```text
/reload
/ephemeral
```

After applying changes in the Ephemeral UI, run `/reload` in the project session to activate them.
