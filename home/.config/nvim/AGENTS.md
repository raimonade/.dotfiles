# NEOVIM CONFIG

Lua-based, lazy.nvim managed. TypeScript-focused w/ LSP. jj-aware.

## STRUCTURE

```
nvim/
├── init.lua              # Entry: require("rk")
├── lua/
│   ├── rk/               # Personal config module
│   │   ├── init.lua      # Orchestrates all requires
│   │   ├── keymaps.lua   # All keybindings (exports on_attach for LSP)
│   │   ├── options.lua   # vim.opt settings
│   │   ├── lazy.lua      # lazy.nvim bootstrap
│   │   └── prelude.lua   # Utility functions
│   └── plugins/          # 1 file per plugin
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add plugin | `lua/plugins/<name>.lua` returning spec table |
| Add keymap | `lua/rk/keymaps.lua` |
| Change option | `lua/rk/options.lua` |
| LSP server | `lua/plugins/lsp.lua` via `vim.lsp.config()` |
| Formatter | `lua/plugins/conform.lua` |
| TypeScript | `lua/plugins/typescript-tools.lua` (not lspconfig) |
| VCS signs | `lua/plugins/vcsigns.lua` (works with jj) |

## CONVENTIONS

- Plugin files return `{ ... }` table (lazy.nvim spec)
- Lazy load via `event`, `ft`, `cmd`, `keys`
- LSP uses nvim 0.11+ API: `vim.lsp.config()` + `vim.lsp.enable()`
- Keymaps applied via `LspAttach` autocmd from exported `keymaps.on_attach`
- Auto-center: ALL nav commands append `zz`
- Module pattern: `local M = {}` ... `return M`

## ANTI-PATTERNS

- tsserver via lspconfig (use typescript-tools.nvim)
- Hardcode colorscheme (catppuccin-macchiato via plugin)
- Skip lazy loading for heavy plugins
- LSP semantic highlights enabled (we disable @lsp groups)

## KEY BINDINGS

| Key | Mode | Action |
|-----|------|--------|
| `jj`/`JJ` | i | Exit insert |
| `H`/`L` | n,v | Line start/end |
| `U` | n | Redo |
| `S` | n | Quick substitute word |
| `<leader>e` | n | Oil file explorer |
| `<leader>m` | n | Maximize window |
| `<leader>w`/`<leader>q` | n | Save/Quit |
| `<leader>'` | n | Switch to last buffer |
| `<leader>f` | n | Format buffer |
| `<leader>1-5` | n | Harpoon file navigation |
| `<leader>sf` | n | Find files (jj-aware) |
| `<leader>sg` | n | Live grep |
| `<leader>/` | n | Fuzzy find in buffer |
| `<leader>ih` | n | Toggle inlay hints |
| `<leader>.` | n | Scratch buffer |
| `gx` | n | Open link (markdown/URL aware) |
| `]c`/`[c` | n | Next/prev hunk (centered) |
| `<C-h/j/k/l>` | n | Pane navigation (tmux-aware) |

## LSP SERVERS

typescript-tools (TS/JS), lua_ls (+ lazydev), tailwindcss, svelte, bash, css, html, json, yaml

## FORMATTER CHAIN

JS/TS/TSX/Svelte: oxfmt -> prettierd (first available, respects project config). Lua: stylua.

## UNIQUE FEATURES

- vcsigns.nvim: Works with jj, diffs against parent commit
- tiny-inline-diagnostic: Powerline-style inline diagnostics
- Snacks.nvim: Notifications, buffer delete, git browse, toggles
- jj-aware file picker: Tries jj telescope extension first
- telescope-jj: jj diff picker (`<leader>sj`)
