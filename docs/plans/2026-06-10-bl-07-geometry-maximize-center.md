# Plan: BL-07 — Geometry: maximize, almost-maximize, center family

**Date:** 2026-06-10  
**Status:** Approved — in progress

## Goal

Add four placement functions to `src/geometry.ts`:

| Action              | Behavior                                                    |
| ------------------- | ----------------------------------------------------------- |
| `maximize`          | Fill the margin-adjusted available area                     |
| `almost-maximize`   | Slightly inset from maximize, visibly distinct (see below)  |
| `center`            | Center the window at its current size (no resize)           |
| `center-prominently`| Resize to 70% × 70% of available area and center           |

## Function signatures

All functions accept a pre-computed `available: Rect` (the margin-adjusted work area
returned by `applyMargins`). The caller is responsible for applying margins before
calling these functions — consistent with the BL-03 contract.

```ts
export function placeMaximize(available: Rect): Rect

export function placeAlmostMaximize(available: Rect): Rect

/** currentWidth/currentHeight: the window's current frame dimensions */
export function placeCenter(available: Rect, currentWidth: number, currentHeight: number): Rect

export function placeCenterProminently(available: Rect): Rect
```

## Implementation details

### `placeMaximize`

Fills the available area exactly:

```
x = available.x
y = available.y
width = available.width
height = available.height
```

Then `integerRect` + `clampRect`.

### `placeAlmostMaximize`

PRODUCT.md requires this to be "visibly distinct from maximize" but does not specify
an exact dimension.

Fixed 32px inset on each side, centered. The constant `ALMOST_MAXIMIZE_INSET = 32`
lives in `src/constants.ts`.

```
width  = available.width  - 2 * ALMOST_MAXIMIZE_INSET
height = available.height - 2 * ALMOST_MAXIMIZE_INSET
x      = available.x + ALMOST_MAXIMIZE_INSET
y      = available.y + ALMOST_MAXIMIZE_INSET
```

Then `integerRect` + `clampRect`.

### `placeCenter`

Centers the window at its current `currentWidth × currentHeight`. If the current
size exceeds the available area, `clampRect` brings it back in bounds.

```
x = available.x + Math.round((available.width  - currentWidth)  / 2)
y = available.y + Math.round((available.height - currentHeight) / 2)
width  = currentWidth
height = currentHeight
```

Then `integerRect` + `clampRect(rect, available)`.

### `placeCenterProminently`

Resizes to 70% × 70% of the available area (per PRODUCT.md "Center Prominently
Geometry"), then centers:

```
width  = Math.round(available.width  * 0.7)
height = Math.round(available.height * 0.7)
x      = available.x + Math.round((available.width  - width)  / 2)
y      = available.y + Math.round((available.height - height) / 2)
```

Then `integerRect` + `clampRect`.

## File changes

- **`src/constants.ts`** — add `ALMOST_MAXIMIZE_INSET = 32`.
- **`src/geometry.ts`** — add the four functions above, importing `ALMOST_MAXIMIZE_INSET`.

## Out of scope

- Action dispatch wiring (BL-10)
- Repeat/cycle state (BL-09)
- Settings (BL-11)
- Keybindings (BL-12)

## Acceptance criteria (from BL-07)

- [ ] `center` does not change window size, only position.
- [ ] `center-prominently` produces 70% × 70% of the (margin-adjusted) work area.
- [ ] `almost-maximize` is visibly distinct from `maximize`.
- [ ] All outputs are integers and clamped.

## Deviations

_None yet._
