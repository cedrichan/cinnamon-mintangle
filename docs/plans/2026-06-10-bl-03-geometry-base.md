# Plan: BL-03 — Geometry base helpers

**Date:** 2026-06-10
**Backlog item:** BL-03
**File:** `src/geometry.ts`

## Steps

- [x] Define and export `Rect` interface `{ x, y, width, height }`
- [x] Implement and export `applyMargins(workArea, margin)` — shrinks work area by margin on all four sides; falls back to original if result is degenerate
- [x] Implement and export `integerRect(rect)` — rounds all fields with `Math.round`
- [x] Implement and export `clampRect(rect, available, minWidth?, minHeight?)` — enforces minimum size (default 50×50) and keeps rect within available area
- [x] Implement and export `isLandscape(workArea)` — returns `width >= height`
- [x] Archive BL-03 backlog item to `docs/backlog/done/`

## Constraints

- No Cinnamon globals — fully testable outside Cinnamon.
- Margins applied once in the shared layer; no per-action margin logic.
- All outputs are integers.
- Degenerate inputs clamp safely without throwing.

## Deviations

_None so far._
