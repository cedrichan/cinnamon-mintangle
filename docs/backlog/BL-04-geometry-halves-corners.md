# BL-04 — Geometry: halves & corners

- **Status:** Not started
- **Priority:** P1
- **Depends on:** BL-03
- **Parallelizable with:** BL-05, BL-06, BL-07
- **Affected files:** `src/geometry.js`

## Summary

Implement the half-sized and corner placements as pure functions over the
margin-adjusted available area. These are position placements only — sizes do not
change on repeat (repeat cycling itself lives in BL-09).

## Scope

- [ ] Half placements: `left-half`, `right-half`, `center-half`, `top-half`,
      `bottom-half`. Center Half is a first-class v1 placement.
- [ ] Corner placements: `top-left`, `top-right`, `bottom-left`, `bottom-right`
      (quarter-sized).
- [ ] Ensure left/right/center halves tile the available width; top/bottom halves
      tile available height; corners tile both.
- [ ] All outputs integer and clamped via BL-03 helpers.

## Acceptance criteria

- Each placement fills its expected fraction of the margin-adjusted area.
- Center Half is horizontally centered and half-width.
- Adjacent placements do not overlap and leave no gap beyond rounding.

## References

- `PRODUCT.md` → "Horizontal / Vertical Half Actions", "Corner Actions",
  decision "Center Half is included as a first-class v1 action"
- `AGENTS.md` → "Keep Geometry Deterministic"
