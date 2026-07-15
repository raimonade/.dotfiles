# FISH SHELL CONFIG

**Generated:** 2026-06-22T00:00:00Z
**Commit:** upstream-sync

Layered: `config.fish` -> `conf.d/*.fish` (auto) -> `functions/*.fish` (lazy)

## STRUCTURE

```
fish/
├── config.fish         # Core: greeting, EDITOR, MANPAGER, dotfiles PATH
├── conf.d/             # Auto-sourced config fragments
│   ├── aliases.fish    # Shell aliases (c, pn, wr); code is a lazy function
│   ├── paths.fish      # PATH modifications (.dotfiles, .local/bin, ghostty)
│   ├── git.fish        # Git abbreviations init
│   ├── brew.fish       # Homebrew setup
│   ├── zed.fish        # VISUAL=Zed when its CLI is installed
│   ├── vite-plus.fish  # Sources Vite+ env
│   ├── starship.fish   # Starship prompt init
│   ├── secrets.fish    # Env tokens (GITIGNORED)
│   └── ...             # Tool-specific (fnm, bun, zoxide, rustup, orbstack)
├── functions/          # Lazy-loaded functions
│   ├── __git.*.fish    # Internal git helpers
│   ├── gwip.fish       # WIP commit
│   └── ...             # Utilities (uuid, ulid, timer, notify, nato, rn)
└── completions/        # Command completions (dot, bun, wrangler, kubectl, vp)
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add alias | `conf.d/aliases.fish` |
| Add PATH | `conf.d/paths.fish` |
| Add function | `functions/<name>.fish` (1 function per file) |
| Git abbr | `functions/__git.init.fish` (180+ abbrs) |
| Tool setup | `conf.d/<tool>.fish` |
| Completions | `completions/<cmd>.fish` |
| Env secrets | `conf.d/secrets.fish` (gitignored) |

## CONVENTIONS

- Functions use `-d "description"` flag (mandatory)
- Private helpers prefix `__` (e.g., `__git.default_branch`)
- Namespace pattern: `__<namespace>.<function>` (dot-separated)
- Fallback chains for cross-platform compat (uuidgen -> python3 -> node)
- Fisher for plugin management (`fish_plugins`)
- Use `fish_add_path` not manual `set PATH`
- Use `set -gx` for global exports

## ANTI-PATTERNS

- Heavy work in `config.fish` (use `conf.d/` fragments)
- Blocking commands at startup (defer to function)
- Global vars without `set -gx`
- Using `~` in scripts (use `$HOME`)

## KEY COMMANDS

| Command | Expands To |
|-------|------------|
| `c` | clear |
| `code [path]` | New Zed workspace; current directory by default |
| `vim`/`vi` | Compatibility entrypoints that open Zed via `code` |
| `pn` | pnpm |
| `wr` | wrangler |
| `pbc`/`pbp` | pbcopy/pbpaste |
| `scratch` | Temporary file opened through blocking `$EDITOR` (Zed) |

## GIT ABBREVIATIONS

~180 oh-my-zsh style abbrs loaded via `__git.init`:
- Basic: `g`, `gst`, `gd`, `ga`, `gc`, `gp`, `gl`
- Branch: `gb`, `gco`, `gcb`, `gbd`, `gbD`, `gcom` (checkout default)
- Rebase: `grb`, `grbi`, `grbm`, `grbom` (fetch origin main + rebase)
- Amend: `gc!`, `gcan!`
- Push: `gp!` (force-with-lease), `gpu` (set-upstream)
- Stash: `gsta`, `gstp`
- Worktree: `gwt*`

## CUSTOM FUNCTIONS

| Function | Purpose |
|----------|---------|
| `wt <branch> [base]` | Upstream: create a branch and matching worktree |
| `wtd <remote-branch>` | Upstream: detached remote review worktree |
| `wtr <directory>` | Upstream: remove worktree and local branch |
| `wtcd <directory>` | Upstream: change to configured/sibling worktree |
| `wtl`/`wtp` | Upstream: list worktrees / prune stale metadata |
| `gwip`/`gunwip` | Create/undo WIP commit |
| `gbda` | Delete merged branches (incl. squash-merged) |
| `git_rebase_stack`/`gstk` | Rebase PR stack, auto-detects via gh |
| `gtest <cmd>` | Test command against staged changes only |
| `gbage` | List branches by age |
| `grename <old> <new>` | Rename branch locally + remote |
| `fvim [query]` | fzf → Zed |
| `uuid`/`ulid` | Generate IDs |
| `timer <duration>` | Countdown with notification (5s, 10m, 1h) |
| `notify <msg>` | Desktop notification |
| `tempd` | cd into new temp directory |
| `trash <file>` | Safe delete to ~/.Trash |
| `httpstatus <code>` | HTTP status lookup (supports wildcards) |
| `nato <text>` | Convert text to NATO phonetic alphabet |
| `rn` | Right now — current time + calendar |

## UPSTREAM WORKTREE FLOW

The `wt*` functions are restored byte-for-byte from `dmmulroy/.dotfiles`. They use raw Git worktrees, honor `WT_DIR`, recognize `.bare` layouts, and otherwise use sibling directories. Herdr and Zed are deliberately not patched into these upstream helpers; use Herdr's native worktree surface or `code .` separately.

## NOTES

- `secrets.fish` + `vault-funcs.fish` are gitignored — contain sensitive tokens
- `fish_frozen_key_bindings.fish` exists in conf.d — prevents fish from re-generating bindings
- `catppuccin_macchiato_theme.fish` sets shell colors to match global theme
- `config.fish` is minimal: greeting off, terminal-native MANPAGER, dotfiles PATH
- `conf.d/zed.fish` sets Zed `$VISUAL` plus blocking `zed-wait.sh` `$EDITOR`
