// Mintangle — geometry calculations.
//
// Responsibility (AGENTS.md): pure or mostly pure geometry calculations.
// Computes target window rectangles from action ID, work area, orientation,
// margins, and repeat state. Kept independent of Cinnamon globals so it can be
// tested outside Cinnamon.
//
// Base helpers (BL-03): Rect type, margin application, integer rounding,
// safe clamping, and orientation detection.
// Placement families land in BL-04..BL-07.

import { ALMOST_MAXIMIZE_INSET } from './constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A screen rectangle in pixels. All fields must be integers after geometry calculations. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Minimum window size enforced by clampRect
// ---------------------------------------------------------------------------

const MIN_WINDOW_SIZE = 50;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Apply a uniform margin to a work-area rectangle, returning the
 * margin-adjusted available area.
 *
 * Margins are applied once in this shared layer — never per-action.
 * If the margin would make the area degenerate (zero or negative size),
 * the original work area is returned unchanged.
 */
export function applyMargins(workArea: Rect, margin: number): Rect {
  if (margin <= 0) return workArea;
  const adjusted: Rect = {
    x: workArea.x + margin,
    y: workArea.y + margin,
    width: workArea.width - 2 * margin,
    height: workArea.height - 2 * margin,
  };
  if (adjusted.width <= 0 || adjusted.height <= 0) return workArea;
  return adjusted;
}

/**
 * Round all fields of a rectangle to integers.
 *
 * All placement outputs must be integers so the window manager receives
 * whole-pixel coordinates.
 */
export function integerRect(rect: Rect): Rect {
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

/**
 * Clamp a rectangle so it:
 *   1. Is at least minWidth × minHeight (defaults to MIN_WINDOW_SIZE each).
 *   2. Does not extend beyond the available area.
 *
 * Size is clamped first, then position, so the result always fits within
 * `available` even for degenerate inputs.
 */
export function clampRect(
  rect: Rect,
  available: Rect,
  minWidth = MIN_WINDOW_SIZE,
  minHeight = MIN_WINDOW_SIZE,
): Rect {
  // Enforce minimum size, capped to available area.
  const maxW = Math.max(available.width, minWidth);
  const maxH = Math.max(available.height, minHeight);
  const w = Math.min(maxW, Math.max(minWidth, rect.width));
  const h = Math.min(maxH, Math.max(minHeight, rect.height));

  // Clamp position so the rect stays within available.
  const maxX = available.x + available.width - w;
  const maxY = available.y + available.height - h;
  const x = Math.min(Math.max(rect.x, available.x), Math.max(available.x, maxX));
  const y = Math.min(Math.max(rect.y, available.y), Math.max(available.y, maxY));

  return { x, y, width: w, height: h };
}

/**
 * Return true if the work area is landscape-oriented (width >= height).
 *
 * Used by thirds and fourths families for orientation-aware placement
 * (BL-05, BL-06).
 */
export function isLandscape(workArea: Rect): boolean {
  return workArea.width >= workArea.height;
}

/**
 * Map a window frame from one monitor work area to another while preserving
 * its relative position and size. The result is clamped to the target work area.
 */
export function mapRectBetweenWorkAreas(rect: Rect, source: Rect, target: Rect): Rect {
  if (source.width <= 0 || source.height <= 0) {
    return clampRect(integerRect(rect), target);
  }

  const mapped: Rect = {
    x: target.x + ((rect.x - source.x) / source.width) * target.width,
    y: target.y + ((rect.y - source.y) / source.height) * target.height,
    width: (rect.width / source.width) * target.width,
    height: (rect.height / source.height) * target.height,
  };

  return clampRect(integerRect(mapped), target);
}

// ---------------------------------------------------------------------------
// Inter-tile gap helper (margin collapsing)
//
// Computes position and size of one slot in an axis-split layout so that:
//   - gap between any two adjacent tiles  = margin
//   - gap from the outer tile to the available-area edge = 0 (outer margin
//     is already provided by applyMargins)
//
// Derivation:
//   effectiveSize = totalSize − (total−1) × margin   (space for tiles only)
//   boundary_k    = Math.round(effectiveSize × k / total)
//   slot_pos      = start + boundary[index] + index × margin
//   slot_size     = boundary[index+span] − boundary[index] + (span−1) × margin
//
// When margin = 0 this degenerates to the pre-margin boundary math exactly,
// preserving existing placement behaviour.
// ---------------------------------------------------------------------------

function computeSlot(
  start: number,
  totalSize: number,
  margin: number,
  total: number,
  index: number,
  span: number = 1,
): { pos: number; size: number } {
  const effectiveSize = Math.max(0, totalSize - (total - 1) * margin);
  const bStart = Math.round((effectiveSize * index) / total);
  const bEnd = Math.round((effectiveSize * (index + span)) / total);
  return {
    pos: start + bStart + index * margin,
    size: bEnd - bStart + (span - 1) * margin,
  };
}

// ---------------------------------------------------------------------------
// BL-04 — Half placements
//
// All functions accept the raw work area and margin; applyMargins is called
// internally. Adjacent halves have a gap of `margin` between them (margin
// collapsing), equal to the gap from the window to the screen edge.
// ---------------------------------------------------------------------------

export function leftHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 2, 0);
  return clampRect(
    integerRect({ x, y: available.y, width: w, height: available.height }),
    available,
  );
}

export function rightHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 2, 1);
  return clampRect(
    integerRect({ x, y: available.y, width: w, height: available.height }),
    available,
  );
}

/** Centered, half-width column, full height. Same tile width as left/right half. */
export function centerHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const w = computeSlot(available.x, available.width, margin, 2, 0).size;
  const offset = Math.round((available.width - w) / 2);
  return clampRect(
    integerRect({ x: available.x + offset, y: available.y, width: w, height: available.height }),
    available,
  );
}

export function topHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 2, 0);
  return clampRect(
    integerRect({ x: available.x, y, width: available.width, height: h }),
    available,
  );
}

export function bottomHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 2, 1);
  return clampRect(
    integerRect({ x: available.x, y, width: available.width, height: h }),
    available,
  );
}

// ---------------------------------------------------------------------------
// BL-04 — Corner placements (2×2 grid)
//
// All four corners tile with a gap of `margin` between adjacent cells both
// horizontally and vertically.
// ---------------------------------------------------------------------------

export function topLeft(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 2, 0);
  const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 2, 0);
  return clampRect(integerRect({ x, y, width: w, height: h }), available);
}

export function topRight(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 2, 1);
  const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 2, 0);
  return clampRect(integerRect({ x, y, width: w, height: h }), available);
}

export function bottomLeft(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 2, 0);
  const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 2, 1);
  return clampRect(integerRect({ x, y, width: w, height: h }), available);
}

export function bottomRight(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 2, 1);
  const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 2, 1);
  return clampRect(integerRect({ x, y, width: w, height: h }), available);
}

// ---------------------------------------------------------------------------
// Thirds and two-thirds placements (BL-05)
//
// computeSlot is used for each slot so inter-tile gaps equal the screen-edge
// margin (margin collapsing). Landscape divides horizontally, portrait vertically.
// ---------------------------------------------------------------------------

/** First third of the work area (left third on landscape, top third on portrait). */
export function placeFirstThird(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 3, 0);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 3, 0);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

/** Center third of the work area. */
export function placeCenterThird(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 3, 1);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 3, 1);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

/** Last third of the work area (right third on landscape, bottom third on portrait). */
export function placeLastThird(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 3, 2);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 3, 2);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

/** First two thirds of the work area (left two thirds on landscape, top two thirds on portrait). */
export function placeFirstTwoThirds(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 3, 0, 2);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 3, 0, 2);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

/** Last two thirds of the work area (right two thirds on landscape, bottom two thirds on portrait). */
export function placeLastTwoThirds(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 3, 1, 2);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 3, 1, 2);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

// ---------------------------------------------------------------------------
// Fourths & three-fourths placements (BL-06)
//
// Orientation-aware: landscape divides horizontally, portrait vertically.
// computeSlot ensures inter-tile gaps equal the screen-edge margin (margin
// collapsing). Rounding error is at most 1px between any two adjacent slots.
// ---------------------------------------------------------------------------

export function placeFirstFourth(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 4, 0);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 4, 0);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeSecondFourth(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 4, 1);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 4, 1);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeThirdFourth(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 4, 2);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 4, 2);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeLastFourth(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 4, 3);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 4, 3);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeFirstThreeFourths(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 4, 0, 3);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 4, 0, 3);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeLastThreeFourths(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const { pos: x, size: w } = computeSlot(available.x, available.width, margin, 4, 1, 3);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const { pos: y, size: h } = computeSlot(available.y, available.height, margin, 4, 1, 3);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

// ---------------------------------------------------------------------------
// Maximize / center placements (BL-07)
// ---------------------------------------------------------------------------

/**
 * Fill the margin-adjusted available area exactly.
 */
export function placeMaximize(available: Rect): Rect {
  return clampRect(integerRect({ ...available }), available);
}

/**
 * Center the window with a fixed ALMOST_MAXIMIZE_INSET on each side.
 * Visibly distinct from maximize; size is predictable regardless of monitor size.
 */
export function placeAlmostMaximize(available: Rect): Rect {
  const rect: Rect = {
    x: available.x + ALMOST_MAXIMIZE_INSET,
    y: available.y + ALMOST_MAXIMIZE_INSET,
    width: available.width - 2 * ALMOST_MAXIMIZE_INSET,
    height: available.height - 2 * ALMOST_MAXIMIZE_INSET,
  };
  return clampRect(integerRect(rect), available);
}

/**
 * Center the window at its current size without resizing.
 * If the current size exceeds the available area, clampRect brings it in bounds.
 */
export function placeCenter(available: Rect, currentWidth: number, currentHeight: number): Rect {
  const rect: Rect = {
    x: available.x + Math.round((available.width - currentWidth) / 2),
    y: available.y + Math.round((available.height - currentHeight) / 2),
    width: currentWidth,
    height: currentHeight,
  };
  return clampRect(integerRect(rect), available);
}

/**
 * Resize to 70% × 70% of the available area and center.
 * The 70% is computed from the margin-adjusted area per PRODUCT.md.
 */
export function placeCenterProminently(available: Rect): Rect {
  const width = Math.round(available.width * 0.7);
  const height = Math.round(available.height * 0.7);
  const rect: Rect = {
    x: available.x + Math.round((available.width - width) / 2),
    y: available.y + Math.round((available.height - height) / 2),
    width,
    height,
  };
  return clampRect(integerRect(rect), available);
}
