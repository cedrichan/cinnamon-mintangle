# Mintangle

Rectangle.app-style keyboard window management for the Linux Mint **Cinnamon**
desktop. Move and resize the focused window with keyboard shortcuts — halves,
corners, thirds, fourths, and more.

## Installation

### From a release

1. Download the latest release archive.
2. Extract it to `~/.local/share/cinnamon/extensions/mintangle@cedrichan/`.
3. Open **System Settings → Extensions**, find Mintangle, and enable it.

### Build from source

```bash
npm install
npm run install:local
```

`install:local` builds the extension and copies it into
`~/.local/share/cinnamon/extensions/mintangle@cedrichan/`.

Then open **System Settings → Extensions**, find Mintangle, and enable it.

To reload after a source change: toggle the extension off and on in System
Settings, or restart Cinnamon with `Alt+F2` → `r`.

## Default shortcuts

All shortcuts use `Ctrl + Meta` (`Ctrl + Super`). Display movement adds `Alt`.

| Action              | Default shortcut          |
| ------------------- | ------------------------- |
| Left Half           | Ctrl + Meta + Left        |
| Right Half          | Ctrl + Meta + Right       |
| Top Half            | Ctrl + Meta + Up          |
| Bottom Half         | Ctrl + Meta + Down        |
| Center Half         | Ctrl + Meta + H           |
| Top Left            | Ctrl + Meta + U           |
| Top Right           | Ctrl + Meta + I           |
| Bottom Left         | Ctrl + Meta + J           |
| Bottom Right        | Ctrl + Meta + K           |
| First Third         | Ctrl + Meta + D           |
| Center Third        | Ctrl + Meta + F           |
| Last Third          | Ctrl + Meta + G           |
| First Two Thirds    | Ctrl + Meta + E           |
| Last Two Thirds     | Ctrl + Meta + T           |
| First Fourth        | Ctrl + Meta + 1           |
| Second Fourth       | Ctrl + Meta + 2           |
| Third Fourth        | Ctrl + Meta + 3           |
| Last Fourth         | Ctrl + Meta + 4           |
| First Three Fourths | Ctrl + Meta + 5           |
| Last Three Fourths  | Ctrl + Meta + 6           |
| Maximize            | Ctrl + Meta + Enter       |
| Almost Maximize     | Ctrl + Meta + M           |
| Center              | Ctrl + Meta + C           |
| Center Prominently  | Ctrl + Meta + P           |
| Restore             | Ctrl + Meta + Backspace   |
| Next Display        | Ctrl + Meta + Alt + Right |
| Previous Display    | Ctrl + Meta + Alt + Left  |

On landscape monitors, First/Last refer to left/right. On portrait monitors,
First/Last refer to top/bottom.

## Repeat cycling

Pressing the same shortcut repeatedly cycles the window through related
positions within the same size category. **Sizes do not change** — a half-size
action stays half-size, a third stays a third.

| Category               | Cycle                                           |
| ---------------------- | ----------------------------------------------- |
| Halves (left/right)    | Left → Center → Right (wraps)                   |
| Halves (top/bottom)    | Top → Bottom (wraps)                            |
| Corners                | Clockwise through the four corners              |
| Thirds                 | First → Center → Last (wraps)                   |
| Two-thirds             | First ↔ Last                                    |
| Fourths                | First → Second → Third → Last (wraps)           |
| Three-fourths          | First ↔ Last                                    |
| Maximize / Center / Restore | No cycling — reapplies the same action   |

Cycling resets after the **repeat timeout** (default 1500 ms). If cycling is
disabled for a category, repeated presses reapply the action's default position.

For the exact per-action cycle order see [`PRODUCT.md`](PRODUCT.md).

## Settings

| Setting                         | Type       | Default |
| ------------------------------- | ---------- | ------- |
| Enable repeated command cycling | boolean    | true    |
| Repeat timeout                  | integer ms | 1500    |
| Enable half position cycling    | boolean    | true    |
| Enable third position cycling   | boolean    | true    |
| Enable fourth position cycling  | boolean    | true    |
| Enable corner position cycling  | boolean    | true    |
| Enable display cycling          | boolean    | true    |

## Development

Mintangle is written in **TypeScript** and bundled with
[esbuild](https://esbuild.github.io/) into a single GJS-compatible
`extension.js`. Node.js is the build runtime only — the extension itself has no
runtime dependencies and talks to Cinnamon and Muffin directly.

### Requirements

- Node.js (with `npm`) — build and type-checking only, not a runtime dependency.
- Linux Mint Cinnamon — to install and test the extension.

### Setup

```bash
npm install
```

### Commands

| Command                 | What it does                                                           |
| ----------------------- | ---------------------------------------------------------------------- |
| `npm run build`         | Bundle the TypeScript into `build/` (`extension.js`, `metadata.json`). |
| `npm run typecheck`     | Type-check with `tsc --noEmit`.                                        |
| `npm run clean`         | Remove the `build/` directory.                                         |
| `npm run install:local` | Build, then copy `build/` into your local Cinnamon extensions dir.     |

### Build output

`npm run build` produces a `build/` folder containing the loadable extension:

```text
build/
  extension.js     # bundled + transpiled from extension.ts and src/
  metadata.json    # copied verbatim
```

`build/` is generated and git-ignored — never edit it by hand.

The bundler wraps the code in an IIFE and re-exposes `init` / `enable` /
`disable` as top-level `var`s so Cinnamon's legacy `imports` loader can read
the lifecycle hooks. See [`scripts/build.mjs`](scripts/build.mjs).

### Project layout

```text
extension.ts            # Cinnamon lifecycle entry (esbuild entry point)
src/
  actions.ts            # action dispatch (action ID → geometry op)
  geometry.ts           # pure geometry calculations
  keybindings.ts        # shortcut registration / rebinding
  settings.ts           # settings load, validation, defaults, listeners
  state.ts              # in-memory per-window state
types/
  cinnamon.d.ts         # minimal ambient types for the GJS/Cinnamon runtime
scripts/
  build.mjs             # esbuild bundle + asset copy → build/
metadata.json           # Cinnamon extension manifest
settings-schema.json    # Cinnamon settings schema
tsconfig.json           # TypeScript config (type-checking)
package.json            # dev scripts and devDependencies
```

## Documentation

- [`PRODUCT.md`](PRODUCT.md) — product behavior specification (source of truth).
- [`AGENTS.md`](AGENTS.md) — developer and agent guidance.
- [`docs/backlog`](docs/backlog) — work items.
