# Plan: BL-04 — Geometry: Halves & Corners

**Date:** 2026-06-10
**Backlog item:** BL-04
**Depends on:** BL-03 (done — `Rect`, `applyMargins`, `integerRect`, `clampRect`, `isLandscape`)

## Goal

Implement pure geometry functions for the five half placements and four corner
placements in `src/geometry.ts`. All outputs must be integer-rounded and stay
within the margin-adjusted available area.

## Approach

Extend `src/geometry.ts` with a BL-04 section below the existing BL-03 helpers.
No new files needed.

## Tiling rule

To guarantee no gap and no overlap across all integer inputs:

- `halfW = Math.floor(area.width / 2)` → left/first half width
- remaining half width = `area.width - halfW` → right/second half width
- Same pattern for height.

This ensures left + right = full width and top + bottom = full height exactly.

## Half placement functions

All accept a margin-adjusted `Rect` (caller applies `applyMargins` first).
All return `integerRect(...)` of the computed rectangle.

| Function           | x                              | y              | width              | height              |
| ------------------ | ------------------------------ | -------------- | ------------------ | ------------------- |
| `leftHalf(area)`   | area.x                         | area.y         | halfW              | area.height         |
| `rightHalf(area)`  | area.x + halfW                 | area.y         | area.width - halfW | area.height         |
| `centerHalf(area)` | area.x + Math.floor(halfW / 2) | area.y         | halfW              | area.height         |
| `topHalf(area)`    | area.x                         | area.y         | area.width         | halfH               |
| `bottomHalf(area)` | area.x                         | area.y + halfH | area.width         | area.height - halfH |

`centerHalf`: horizontally centered with the same width as leftHalf/rightHalf
(50% of available width). Center offset = `Math.floor(halfW / 2)` so it sits
midway without fractional pixels.

## Corner placement functions

`halfW = Math.floor(area.width / 2)`, `halfH = Math.floor(area.height / 2)`

| Function            | x              | y              | width              | height              |
| ------------------- | -------------- | -------------- | ------------------ | ------------------- |
| `topLeft(area)`     | area.x         | area.y         | halfW              | halfH               |
| `topRight(area)`    | area.x + halfW | area.y         | area.width - halfW | halfH               |
| `bottomLeft(area)`  | area.x         | area.y + halfH | halfW              | area.height - halfH |
| `bottomRight(area)` | area.x + halfW | area.y + halfH | area.width - halfW | area.height - halfH |

Corners tile all four quadrants perfectly with no gap or overlap.

## Acceptance criteria

- Each placement fills its expected fraction of the area.
- `leftHalf` + `rightHalf` widths sum to `area.width`; positions don't overlap.
- `topHalf` + `bottomHalf` heights sum to `area.height`; positions don't overlap.
- `centerHalf` is horizontally centered with 50% width.
- All four corners tile perfectly (no gap, no overlap).
- All outputs have integer x/y/width/height.
- No Cinnamon globals referenced.

## File changes

- `src/geometry.ts` — add BL-04 placement functions below BL-03 helpers
- `docs/backlog/BL-03-geometry-base.md` — archive to done
- `docs/backlog/BL-04-geometry-halves-corners.md` — archive to done

## Status

- [x] Plan written
- [x] Implementation: half placements
- [x] Implementation: corner placements
- [x] Build verified
- [x] Backlog items archived
