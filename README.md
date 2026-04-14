# fnrules

**All your AI rules. One sidebar.**

<!-- [![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/fnrhombus.fnrules)](https://marketplace.visualstudio.com/items?itemName=fnrhombus.fnrules) -->
<!-- [![Installs](https://img.shields.io/visual-studio-marketplace/i/fnrhombus.fnrules)](https://marketplace.visualstudio.com/items?itemName=fnrhombus.fnrules) -->
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

Every AI coding assistant has its own config file. Claude Code wants `CLAUDE.md`. Cursor wants `.cursorrules`. Copilot wants `copilot-instructions.md`. Windsurf, Codex -- they all have their own format, in their own location, and you forget half of them exist.

**fnrules** puts them all in one sidebar panel so you can see what's configured, create what's missing, and open any rule file in one click.

<!-- Screenshot: a VS Code sidebar showing the AI Rules panel with Claude Code (expanded, showing CLAUDE.md and .claude/rules/testing.md), GitHub Copilot (expanded, showing .github/copilot-instructions.md), and Cursor/Windsurf/Codex collapsed as "not configured" with grayed text. -->

## Supported tools

| Tool | Files detected |
|------|---------------|
| Claude Code | `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md` |
| Cursor | `.cursorrules`, `.cursor/rules/*.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurfrules` |
| Codex | `AGENTS.md` |

## Features

- **Sidebar tree view** -- see every AI rule file in your workspace, grouped by tool
- **One-click file creation** -- create any missing config file with a sensible starter template
- **Status bar indicator** -- `AI Rules: 2/5` shows how many tools are configured at a glance
- **Auto-refresh** -- file watchers detect when rule files are added or removed
- **Context menus** -- right-click unconfigured tools to create their files

## Commands

All commands are available from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) under the **AI Rules** category:

| Command | Description |
|---------|-------------|
| AI Rules: Create CLAUDE.md | Create a Claude Code rules file |
| AI Rules: Create .cursorrules | Create a Cursor rules file |
| AI Rules: Create Copilot Instructions | Create a GitHub Copilot instructions file |
| AI Rules: Create .windsurfrules | Create a Windsurf rules file |
| AI Rules: Create AGENTS.md | Create a Codex agents file |
| AI Rules: Refresh | Force-refresh the tree view |

## Why not "AI Rules" extension?

The existing "AI Rules" extension (291 installs) doesn't support Claude Code or Codex, and lacks file creation and status bar features.

| Feature | fnrules | AI Rules |
|---------|---------|----------|
| Claude Code (CLAUDE.md) | Yes | No |
| Cursor (.cursorrules) | Yes | Yes |
| GitHub Copilot | Yes | Yes |
| Windsurf | Yes | Yes |
| Codex (AGENTS.md) | Yes | No |
| File creation with templates | Yes | No |
| Status bar indicator | Yes | No |
| File watching / auto-refresh | Yes | Partial |

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=fnrhombus.fnrules) or search for **"AI Rules Manager"** in the Extensions tab.

## Support

If you find this useful, consider supporting development:

- [GitHub Sponsors](https://github.com/sponsors/fnrhombus)
- [Buy Me a Coffee](https://buymeacoffee.com/fnrhombus)

## License

[MIT](LICENSE)
