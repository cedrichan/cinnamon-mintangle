# Plan: BL-05 — Geometry: thirds & two-thirds (orientation-aware)

**Date:** 2026-06-10
**Backlog item:** BL-05
**File:** `src/geometry.ts`

## Goal

Add pure geometry functions for third and two-thirds placements to `src/geometry.ts`.
Orientation-aware: landscape divides horizontally, portrait divides vertically.

## Rounding strategy

Compute boundary points with `Math.round` so the remainder spreads across slots
rather than piling onto the last one. Max difference between any two slots is 1px.

```
b1 = Math.round(dim / 3)
b2 = Math.round(2 * dim / 3)

first  → offset=0,  size=b1      (0→b1)
center → offset=b1, size=b2−b1  (b1→b2)
last   → offset=b2, size=dim−b2 (b2→dim)

first-two-thirds → offset=0,  size=b2      (0→b2)
last-two-thirds  → offset=b1, size=dim−b1 (b1→dim)
```

Where `dim` is `workArea.width` (landscape) or `workArea.height` (portrait).

Example — dim=1000: b1=333, b2=667 → slots 333, 334, 333 (remainder in center).

## Steps

- [x] Write plan file
- [x] Add `placeFirstThird(workArea)` — orientation-aware, returns Rect
- [x] Add `placeCenterThird(workArea)` — orientation-aware, returns Rect
- [x] Add `placeLastThird(workArea)` — orientation-aware, returns Rect
- [x] Add `placeFirstTwoThirds(workArea)` — orientation-aware, returns Rect
- [x] Add `placeLastTwoThirds(workArea)` — orientation-aware, returns Rect
- [x] Run `npm run build` and confirm zero errors
- [x] Archive BL-05 to `docs/backlog/done/`

## Constraints

- No Cinnamon globals — fully testable outside Cinnamon.
- `workArea` is already margin-adjusted before these functions are called.
- All outputs must be integers (boundary points from Math.round are already integers).
- Each function delegates orientation detection to `isLandscape(workArea)`.

## Deviations

_None so far._
