# BL-07 — Geometry: maximize, almost-maximize, center family

- **Status:** Not started
- **Priority:** P1
- **Depends on:** BL-03
- **Parallelizable with:** BL-04, BL-05, BL-06
- **Affected files:** `src/geometry.js`

## Summary

Implement the non-cycling placements: maximize, almost-maximize, center, and
center-prominently. Center Prominently is explicitly 70% × 70% of the active
monitor work area, computed from the margin-adjusted available area when margins
are enabled.

## Scope

- [ ] `maximize`: fill the margin-adjusted available area.
- [ ] `almost-maximize`: a slightly inset placement, distinct from maximize.
- [ ] `center`: keep the window's current size, centered (no resize).
- [ ] `center-prominently`: resize to 70% width × 70% height of the available
      area and center it; honor margins (compute 70% from margin-adjusted area).
- [ ] All outputs integer and clamped.

## Acceptance criteria

- `center` does not change window size, only position.
- `center-prominently` produces 70% × 70% of the (margin-adjusted) work area.
- `almost-maximize` is visibly distinct from `maximize`.

## References

- `PRODUCT.md` → "Maximize and Center Actions", "Center Prominently Geometry"
  (70% width/height; margin-adjusted), decision #3
- `AGENTS.md` → "Keep Geometry Deterministic", "Margins"
