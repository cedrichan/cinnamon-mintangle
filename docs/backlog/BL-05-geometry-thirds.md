# BL-05 — Geometry: thirds & two-thirds (orientation-aware)

- **Status:** Not started
- **Priority:** P1
- **Depends on:** BL-03
- **Parallelizable with:** BL-04, BL-06, BL-07
- **Affected files:** `src/geometry.js`

## Summary

Implement third and two-thirds placements as pure functions, orientation-aware:
landscape divides horizontally, portrait divides vertically. Position only — no
size cycling.

## Scope

- [ ] Thirds: `first-third`, `center-third`, `last-third`.
- [ ] Two-thirds: `first-two-thirds`, `last-two-thirds`.
- [ ] Landscape: first = left, center = center, last = right (and left/right for
      two-thirds). Portrait: first = top, center = center, last = bottom.
- [ ] Use orientation detection from BL-03; all outputs integer and clamped.

## Acceptance criteria

- On landscape, thirds tile horizontally; on portrait, vertically.
- Two-thirds span exactly two of the three slots, anchored first/last correctly.
- Rounding does not leave a visible gap or overlap beyond 1px.

## References

- `PRODUCT.md` → "Third Actions", "Two-Thirds Actions" (orientation rules),
  decision "Thirds, fourths, and three-fourths are orientation-aware"
- `AGENTS.md` → "Keep Geometry Deterministic"
