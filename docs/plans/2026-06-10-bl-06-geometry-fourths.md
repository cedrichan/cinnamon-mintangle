# Plan: BL-06 — Geometry: fourths & three-fourths

- **Date:** 2026-06-10
- **Status:** In progress

## Scope

Add six pure exported functions to `src/geometry.ts`:

- `placeFirstFourth`
- `placeSecondFourth`
- `placeThirdFourth`
- `placeLastFourth`
- `placeFirstThreeFourths`
- `placeLastThreeFourths`

No changes to `constants.ts` — action IDs and cycle sequences are already defined.

## Orientation behavior (PRODUCT.md)

- Landscape (`width >= height`): divide horizontally — first = leftmost, last = rightmost.
- Portrait: divide vertically — first = top, last = bottom.

## Rounding — boundary array

Compute slot boundaries via `Math.round` to avoid gaps/overlaps between adjacent slots:

```
boundary[i] = Math.round(i * available.width / 4)   // landscape
boundary[i] = Math.round(i * available.height / 4)  // portrait
```

Each slot's position and size derive from consecutive boundaries, so adjacent fourths
share exactly the same pixel boundary. Rounding error is at most 1px, satisfying
the acceptance criterion.

## Three-fourths geometry

- `first-three-fourths` = slots 0–2: `x = boundary[0] = 0`, `w = boundary[3]`
- `last-three-fourths`  = slots 1–3: `x = boundary[1]`,   `w = boundary[4] - boundary[1]`

## Each function flow

1. `applyMargins(workArea, margin)` → `available`
2. Detect orientation via `isLandscape(available)`
3. Compute boundaries; derive slot rect
4. Return `clampRect(integerRect(rect), available)`

## Manual test checklist

- [ ] On a landscape monitor: fourths tile the full width with no visible gap
- [ ] On a portrait monitor: fourths tile the full height with no visible gap
- [ ] `first-three-fourths` spans exactly 3 of 4 slots from the left (landscape) / top (portrait)
- [ ] `last-three-fourths` spans exactly 3 of 4 slots from the right (landscape) / bottom (portrait)
- [ ] All coordinates are integers
- [ ] With margins enabled, all placements stay within the margin-adjusted work area

## Deviations

None.
