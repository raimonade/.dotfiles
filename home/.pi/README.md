# .pi

Global pi config, synced via dotfiles and stowed into `~/.pi`.

## Extension workspace

Package-style global extensions live in `agent/extensions/`.

Pi auto-discovers global extensions from:

- `~/.pi/agent/extensions/*.ts`
- `~/.pi/agent/extensions/*/index.ts`
- package-style extension directories under `~/.pi/agent/extensions/` that declare `pi.extensions` in `package.json`

This repo also treats `home/.pi` as an npm workspace root for extension development.

Install or refresh dependencies from here:

```bash
cd ~/.pi
npm install
```

Run targeted checks:

```bash
npm run check
npm run test:web-tools
npm run typecheck:pi-ephemeral
```

Current workspace-managed extensions:

- `agent/extensions/web-tools`
- `agent/extensions/pi-mcp`
- `agent/extensions/pi-ephemeral`

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

- ephemeral skills: `grill-me`, `pr-walkthrough`, `prd-to-todos`, `tdd`, `write-a-prd`

Typical flow:

```text
/reload
/ephemeral
```

After applying changes in the Ephemeral UI, run `/reload` in the project session to activate them.
