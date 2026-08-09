# DOTFILES

**Generated:** 2026-06-22T00:00:00Z
**Commit:** upstream-sync

macOS dev env via GNU Stow. Ghostty + Herdr + Fish + Zed + Git worktrees + pi. Workflow follows dmmulroy upstream with Zed substituted for Neovim.

## STRUCTURE

```
.dotfiles/
├── dot                 # CLI: init/update/doctor/stow/package (bash)
├── home/.agents/       # Shared agent policy and canonical skills
│   └── skills/         # Skills discovered by Pi, Claude, Codex, and other agents
├── home/.claude/       # Stowed to ~/.claude/
│   ├── agents/         # Subagents: oracle, librarian, reviewer, planner, security
│   ├── commands/       # Slash commands: code-review, clean, ...
│   └── skills/         # Claude-specific skills and compatibility links
├── home/.config/       # Stowed to ~/.config/
│   ├── fish/           # Shell (AGENTS.md)
│   ├── zed/            # Primary editor; includes blocking CLI adapter
│   ├── nvim/           # Retained config, not part of the primary workflow
│   ├── herdr/          # Primary workspace/tab/pane manager
│   ├── git/            # Git config
│   ├── ghostty/        # Terminal; launch Herdr explicitly per upstream
│   └── starship.toml   # Prompt
├── home/.pi/           # Pi agent workspace (AGENTS.md)
│   └── agent/            # Pi extensions and saved chains; runtime skills stay untracked
├── home/.local/bin/    # Scripts stowed to ~/.local/bin (on PATH)
│   ├── agent-repos     # Agent repository helper
│   └── task-loop       # Autonomous PRD impl loop
├── packages/
│   ├── bundle          # Base Brewfile
│   └── bundle.work     # Work additions (formulas only)
└── docs/
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add package | `dot package add <name>` or edit `packages/bundle` |
| Shell alias/abbr | `home/.config/fish/conf.d/aliases.fish` |
| Shell function | `home/.config/fish/functions/` |
| Git alias | `home/.config/git/config` `[alias]` section |
| Zed settings | `home/.config/zed/settings.json` |
| Herdr workspace/binding | `home/.config/herdr/config.toml` |
| Upstream worktree helpers | `home/.config/fish/functions/{wt,wtd,wtcd,wtl,wtp,wtr}.fish` |
| Starship prompt | `home/.config/starship.toml` |
| Git config | `home/.config/git/config` |
| Claude skill | `home/.claude/skills/<name>/` |
| Claude command | `home/.claude/commands/<name>.md` |
| Claude agent | `home/.claude/agents/<name>.md` |
| Claude settings | `home/.claude/settings.json` |
| Claude MCP | `home/.claude/mcp.json` |
| Pi extension | `home/.pi/agent/extensions/<name>/` |
| Pi saved workflow | `home/.pi/agent/chains/<name>.chain.json` |
| Shared agent skill | `home/.agents/skills/<name>/SKILL.md` |
| Pi settings | `home/.pi/agent/settings.json` |

## CONVENTIONS

- Stow layout: `home/` mirrors `~`, stow creates symlinks
- Fish: `conf.d/` auto-sourced, `functions/` lazy-loaded
- Zed substitutes for upstream Neovim: `$EDITOR`, `$VISUAL`, Git editing, and shell editor commands
- Git worktree helpers stay byte-for-byte aligned with `dmmulroy/.dotfiles` upstream
- Upstream helpers use `WT_DIR`, a `.bare` root, or sibling directories; Herdr's native worktrees are separate
- Git abbrs: ~180 oh-my-zsh style via `__git.init.fish`
- Private helpers: prefix `__` (e.g., `__git.default_branch`)
- VCS: Git worktrees for normal project flow
- Pi extensions: TypeScript, npm workspaces under `home/.pi/`
- Shared skills: canonical under `home/.agents/skills/`, Markdown-first (`SKILL.md`), optional bundled resources

## ANTI-PATTERNS

- Edit `~/.config/*` directly (changes lost on stow)
- Casks in `bundle.work` (use base bundle)
- Hardcode paths (use `$DOTFILES_DIR`, `$HOME`)
- Nested git repos in stowed dirs (creates symlink issues)
- node_modules in stowed dirs (Pi extensions exception — gitignored)
- Track generated Pi skill/runtime directories (`home/.pi/agent/skills`, `home/.pi/ephemeral`, nested `home/.pi/.pi`)

## COMMANDS

```bash
dot init              # Full setup (brew, stow, bun, Vite+, Pi, ssh, font, fish)
dot update            # Pull + brew upgrade + restow + pi update
dot doctor            # Health check
dot stow              # Resymlink only
dot package add X     # Add + install package
dot benchmark-shell   # Fish startup perf
dot gen-ssh-key       # Generate ed25519 key by email domain
wt <branch> [base]    # Upstream: create branch + Git worktree
wtcd <directory>      # Upstream: change to sibling/configured worktree
wtd <remote-branch>   # Upstream: detached remote review worktree
wtr <directory>       # Upstream: remove worktree and delete branch
```

## KEY CONFIGS

| Tool | Entry | Notes |
|------|-------|-------|
| Fish | `config.fish` | Terminal editor + lazy workflow functions |
| Zed | `settings.json` | Primary graphical project editor |
| Herdr | `config.toml` | Persistent workspaces/tabs/panes + native worktrees/agent state |
| Ghostty | `config` | Terminal; run `herdr` from the desired project directory |
| Zed wait adapter | `zed-wait.sh` | Blocking editor command for Git and terminal tools |
| Git | `config` | SSH signing, rebase-oriented workflow |
| Starship | `starship.toml` | 2s timeout for slower shims, custom.scm after dir |
| Pi | `settings.json` | Catppuccin theme and configured extensions/skills |

## UNIQUE STYLES

- Herdr prefix: `C-;`; workspaces group repo worktrees and agent state
- Herdr splits: `\` right, `Enter` down; pane movement stays prefix-scoped because Zed is external
- `wt*` remains the unmodified dmmulroy upstream Git worktree command family
- Zed project opening is explicit via `code .`; it is not patched into upstream helpers
- git: `fomo` = fetch origin main + rebase
- Dark themes across tools; Herdr/Zed use Catppuccin variants and Ghostty uses Whimsy

## NOTES

- `dot update` handles WARP VPN brew API issues automatically
- Start the upstream workspace flow with `cd <repo> && herdr`; Ghostty does not add local launch automation
- Starship `command_timeout = 2000` because some node shims are slow
- `secrets.fish` is gitignored — contains env tokens for work services
- `.pi/agent/*` mostly gitignored; extensions + skills explicitly un-ignored
