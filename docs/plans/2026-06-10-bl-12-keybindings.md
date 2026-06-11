# Plan: BL-12 — Keybinding registration / unregistration

**Date:** 2026-06-10  
**Status:** Done

## Goal

Implement `KeybindingManager` in `src/keybindings.ts`: register all action shortcuts with Cinnamon on enable, route presses to a dispatch callback, unregister cleanly on disable, and rebind live when settings change.

## Files Changed

- `types/cinnamon.d.ts` — add `CinnamonKeybindingManager` interface and extend `imports.ui.main`
- `src/keybindings.ts` — implement `KeybindingManager` class

## Design

### `KeybindingManager` constructor

```ts
constructor(settings: MintangleSettings, dispatch: (action: ActionId) => void)
```

Accepts settings (for per-action shortcut reads and change listeners) and a dispatch callback (supplied by extension.ts; BL-10/BL-14 will provide the real dispatcher).

### Public API

- `enable()` — registers all shortcuts; failures are caught, logged, and stored
- `destroy()` — unregisters all bindings, disconnects settings change listeners
- `registrationErrors()` — returns `Map<ActionId, string>` for BL-16

### Internals

- `_registered: Map<ActionId, string>` — tracks `(action → bound shortcut)` for rebind/unregister
- `_errors: Map<ActionId, string>` — registration failures
- `_listenerIds: number[]` — connection IDs to disconnect on destroy
- `_register(action, shortcut)` — calls `addHotKey('mintangle-<action>', shortcut, cb)`, records on success
- `_unregister(action)` — calls `removeHotKey('mintangle-<action>')`, removes from map
- `_rebind(action)` — reads new shortcut from settings, unregisters old, registers new

### Keybinding name

`mintangle-` + action ID (e.g. `mintangle-left-half`) — unique, avoids conflicts.

### Failure handling

If `addHotKey` returns `false` or throws: log with `log()`/`logError()`, store in `_errors`, continue with remaining actions.

### Settings change listeners

One listener per action connected via `settings.connect(shortcutKey(action), () => _rebind(action))`. All IDs tracked in `_listenerIds` for cleanup.

## Checklist

- [x] Plan saved
- [x] `cinnamon.d.ts` updated with keybinding manager types
- [x] `src/keybindings.ts` implemented
- [x] TypeScript build passes (`npm run build`)
- [x] Type-check passes (`tsc --noEmit`)
- [x] Backlog item archived to `docs/backlog/done/`
