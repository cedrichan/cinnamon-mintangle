# Plan: BL-13 — Multi-monitor / Display Movement

**Date:** 2026-06-11
**Backlog item:** BL-13-display-movement.md
**Status:** Complete

## Goal

Implement explicit next/previous display actions that preserve the focused
window's relative frame geometry across monitor work areas, while keeping
repeated layout shortcuts on their current display.

## Files changed

| File                                              | Change                                        |
| ------------------------------------------------- | --------------------------------------------- |
| `src/geometry.ts`                                 | Add pure work-area-to-work-area frame mapping |
| `src/actions.ts`                                  | Implement next/previous display dispatch      |
| `types/cinnamon.d.ts`                             | Declare per-monitor work-area API             |
| `docs/plans/2026-06-11-bl-13-display-movement.md` | This plan                                     |
| `docs/backlog/done/BL-13-display-movement.md`     | Archive on completion                         |

## Design decisions

- Monitor traversal follows Muffin monitor index order and wraps at either end.
- Display actions no-op when display cycling is disabled or fewer than two
  monitors are available.
- Relative position and size are scaled from the source work area to the target
  work area, then rounded and clamped to the target work area.
- Display actions update restore/runtime state through the same state manager
  fields used by layout actions.
- Layout repeat-cycle handling remains unchanged, so left/right half repeats
  cannot trigger display movement.

## Checklist

- [x] Plan reviewed and saved
- [x] Pure relative geometry mapping implemented
- [x] Display action dispatch implemented
- [x] Cinnamon ambient types updated
- [x] Pure geometry mapping executable checks pass
- [x] TypeScript compiles clean
- [x] Build succeeds
- [x] Formatting check run; pre-existing repository issues recorded
- [x] Manual multi-monitor test notes recorded
- [x] Backlog item archived

## Manual test notes

- With two or more monitors, trigger next/previous display and confirm the
  window moves in monitor index order and wraps.
- Confirm relative position and size are preserved across differently sized
  work areas where practical.
- Disable display cycling and confirm display actions no-op.
- On a single-monitor setup, confirm display actions no-op without errors.
- Repeat Left Half and Right Half and confirm the window remains on its monitor.

## Deviations

- `npm run format:check` remains failing on pre-existing formatting issues,
  including existing sections of `src/actions.ts` and `src/geometry.ts`.
  Unrelated formatting was left unchanged to keep BL-13 scoped.
