# BL-03 — Geometry base helpers (work area, margins, clamp)

- **Status:** Not started
- **Priority:** P0
- **Depends on:** —
- **Parallelizable with:** BL-01, BL-02, BL-08
- **Affected files:** `src/geometry.js`

## Summary

Build the Cinnamon-independent foundation of the geometry layer: take a work-area
rectangle plus margin settings and produce the margin-adjusted available area,
with helpers to clamp and integer-round any computed rectangle. All placement
families (BL-04..07) build on these helpers. Keep this module free of Cinnamon
globals so it is testable outside Cinnamon.

## Scope

- [ ] Define the rectangle shape `{ x, y, width, height }` used across geometry.
- [ ] Implement margin application against a work-area rectangle (shared layer,
      not per-action), returning the margin-adjusted available area.
- [ ] Implement integer rounding so all outputs have integer x/y/width/height.
- [ ] Implement safe clamping for invalid or too-small rectangles (enforce a
      minimum size; keep the rect within the available area).
- [ ] Implement orientation detection (landscape vs portrait) from a work area.

## Acceptance criteria

- Module has no dependency on Cinnamon/Muffin globals.
- All helper outputs are integers.
- Margins are applied once in the shared layer; no per-action margin logic.
- Degenerate inputs (zero/negative size) clamp safely without throwing.

## References

- `PRODUCT.md` → "Center Prominently Geometry" (margin-adjusted available area)
- `AGENTS.md` → "Keep Geometry Deterministic", "Respect Work Areas", "Margins"
