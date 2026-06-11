# Plan: BL-14 — Extension Lifecycle Wiring

**Date:** 2026-06-11
**Backlog item:** BL-14-extension-lifecycle.md
**Status:** Complete

## Goal

Wire `MintangleSettings`, `WindowStateManager`, `KeybindingManager`, and
`dispatchAction` together inside Cinnamon's `init`/`enable`/`disable` hooks in
`extension.ts`.

## Files changed

| File                                                    | Change                                    |
| ------------------------------------------------------- | ----------------------------------------- |
| `extension.ts`                                          | Implement full enable/disable lifecycle   |
| `docs/plans/2026-06-11-bl-14-extension-lifecycle.md`   | This plan                                 |
| `docs/backlog/done/BL-14-extension-lifecycle.md`       | Archive on completion                     |

## Design decisions

- `init` remains side-effect-free; only stores `extensionMeta` for later use.
- `enable` constructs all instances fresh and calls `keybindingManager.enable()`.
- `disable` tears down in reverse order: keybindings → state → settings.
- Double-enable / double-disable are guarded by a module-level `_enabled` flag.
- Re-enabling after disable constructs fresh instances — no stale references.
- `MintangleSettings` receives a plain `{}` as bindObject; Cinnamon's
  ExtensionSettings duck-types the bind target.

## Checklist

- [x] Plan reviewed and saved
- [x] `extension.ts` updated with imports and lifecycle wiring
- [x] TypeScript compiles clean
- [x] Build succeeds
- [ ] Manual enable/disable cycle verified
- [x] Backlog item archived
