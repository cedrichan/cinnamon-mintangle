# BL-06 — Geometry: fourths & three-fourths (orientation-aware)

- **Status:** Not started
- **Priority:** P1
- **Depends on:** BL-03
- **Parallelizable with:** BL-04, BL-05, BL-07
- **Affected files:** `src/geometry.js`

## Summary

Implement fourth and three-fourths placements as pure functions, orientation-aware:
landscape divides horizontally, portrait divides vertically. Position only — no
size cycling.

## Scope

- [ ] Fourths: `first-fourth`, `second-fourth`, `third-fourth`, `last-fourth`.
- [ ] Three-fourths: `first-three-fourths`, `last-three-fourths`.
- [ ] Landscape: first = leftmost … last = rightmost. Portrait: first = top …
      last = bottom.
- [ ] Three-fourths span exactly three of the four slots, anchored first/last.
- [ ] Use orientation detection from BL-03; all outputs integer and clamped.

## Acceptance criteria

- On landscape, fourths tile horizontally; on portrait, vertically.
- Three-fourths cover three contiguous fourths anchored first/last correctly.
- Rounding does not leave a visible gap or overlap beyond 1px.

## References

- `PRODUCT.md` → "Fourth Actions", "Three-Fourths Actions" (orientation rules)
- `AGENTS.md` → "Keep Geometry Deterministic"
