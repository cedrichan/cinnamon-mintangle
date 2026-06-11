# Plan: BL-10 — Action Dispatch

**Date:** 2026-06-10
**Backlog item:** BL-10-action-dispatch.md
**Status:** In progress

## Goal

Implement `src/actions.ts` to wire action IDs to geometry operations and execute
the full AGENTS.md pipeline: resolve focused window → active monitor/work area →
action + repeat-cycle state → target rect → validate/clamp → apply move/resize →
update state.

## Files changed

| File | Change |
|------|--------|
| `types/cinnamon.d.ts` | Add `MetaRectangle`, `MetaDisplay`, `global`, `log()`, new `MetaWindow` methods |
| `src/actions.ts` | Replace stub with full dispatch implementation |
| `docs/plans/2026-06-10-bl-10-action-dispatch.md` | This file |
| `docs/backlog/done/BL-10-action-dispatch.md` | Archived on completion |

## Design decisions

- **Margin defaults to 0.** No margin setting exists yet (BL-15). Marked with a
  comment as a placeholder.
- **Display movement stubbed.** `next-display` / `previous-display` log a message
  and return. BL-13 owns the full implementation.
- **`restore` does not update `previousFrame`.** Per PRODUCT.md, repeated restore
  reapplies the same pre-Mintangle frame indefinitely.
- **`move_resize_frame(false, …)` — userOp=false.** Programmatic placement, not
  a user drag.
- **Window type filter.** Skip desktop (1) and dock (2) only. Other types pass
  through; Muffin no-ops gracefully for non-movable windows. move_resize is
  wrapped in try/catch per AGENTS.md fail-safe requirement.

## Pipeline

1. `global.display.get_focus_window()` — return early if null
2. Skip `META_WINDOW_DESKTOP` (1) and `META_WINDOW_DOCK` (2)
3. `stateManager.register(win)` + get current state
4. Snapshot `win.get_frame_rect()` as `currentFrame`
5. `win.get_work_area_current_monitor()` → `workArea`; margin = 0
6. Special case `restore`: apply `state.previousFrame` if present, update state
7. Special case `next-display` / `previous-display`: log stub, return
8. `resolveCycle(actionId, state, settings, Date.now())`
9. `_computeRect(effectiveAction, workArea, margin, currentFrame.width, currentFrame.height)`
10. `win.move_resize_frame(false, …)` wrapped in try/catch
11. `stateManager.update(…)` with full state patch

## Checklist

- [x] Plan saved
- [x] `types/cinnamon.d.ts` updated
- [x] `src/actions.ts` implemented
- [x] TypeScript compiles clean (`npm run typecheck`)
- [x] Build succeeds (`npm run build`)
- [x] Backlog item archived
