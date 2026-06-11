# Mintangle

Rectangle.app-style keyboard window management for the Linux Mint **Cinnamon**
desktop. Mintangle lets you move and resize the focused window with keyboard
shortcuts, using Cinnamon/Muffin APIs directly.

For the full product behavior — actions, default shortcuts, repeat-cycling, and
margins — see [`PRODUCT.md`](PRODUCT.md). This README covers installing and
developing the extension.

> Status: early development. The extension currently ships a safe no-op
> lifecycle skeleton; window-management behavior is being built out per the
> backlog in [`docs/backlog`](docs/backlog).

## Development

Mintangle is written in **TypeScript** and developed with **Node.js**. The
TypeScript source is bundled into a single GJS-compatible extension with
[esbuild](https://esbuild.github.io/); the bundled output in `build/` is what
Cinnamon actually loads.

### Requirements

- Node.js (with `npm`) — used only for development/build, never at runtime.
- Linux Mint Cinnamon — to install and test the extension.

The extension itself has **no runtime dependencies**; it talks to Cinnamon and
Muffin directly.

### Setup

```bash
npm install
```

### Commands

| Command                 | What it does                                                        |
| ----------------------- | ------------------------------------------------------------------- |
| `npm run build`         | Bundle the TypeScript into `build/` (`extension.js`, `metadata.json`). |
| `npm run typecheck`     | Type-check with `tsc --noEmit` (no output emitted).                 |
| `npm run clean`         | Remove the `build/` directory.                                      |
| `npm run install:local` | Build, then copy `build/` into your local Cinnamon extensions dir.  |

### Build output

`npm run build` produces a `build/` folder containing the loadable extension:

```text
build/
  extension.js     # bundled + transpiled from extension.ts and src/
  metadata.json    # copied verbatim
```

`build/` is generated and git-ignored — never edit it by hand.

The bundler wraps the code in an IIFE and re-exposes `init` / `enable` /
`disable` as top-level `var`s, because Cinnamon loads `extension.js` through
GJS's legacy `imports` module system and reads those lifecycle hooks off the
file's top level. See [`scripts/build.mjs`](scripts/build.mjs).

### Install and test in Cinnamon

```bash
npm run install:local
```

This installs into `~/.local/share/cinnamon/extensions/mintangle@cedrichan/`.
Then enable Mintangle in **Cinnamon → System Settings → Extensions** (or restart
Cinnamon with `Alt+F2` → `r`). Toggle it off/on to verify enable/disable behave.

## Project layout

```text
extension.ts            # Cinnamon lifecycle entry (esbuild entry point)
src/
  actions.ts            # action dispatch (action ID -> geometry op)
  geometry.ts           # pure geometry calculations
  keybindings.ts        # shortcut registration / rebinding
  settings.ts           # settings load, validation, defaults, listeners
  state.ts              # in-memory per-window state
types/
  cinnamon.d.ts         # minimal ambient types for the GJS/Cinnamon runtime
scripts/
  build.mjs             # esbuild bundle + asset copy -> build/
metadata.json           # Cinnamon extension manifest
tsconfig.json           # TypeScript config (type-checking)
package.json            # dev scripts and devDependencies
```

## Documentation

- [`PRODUCT.md`](PRODUCT.md) — product behavior (source of truth).
- [`AGENTS.md`](AGENTS.md) — developer/agent guidance and conventions.
- [`docs/backlog`](docs/backlog) — work items.
