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

// ---------------------------------------------------------------------------
// BL-04 — Half placements
//
// All functions accept a margin-adjusted area (apply applyMargins first).
// Tiling rule: first half = Math.floor(dim / 2), second half = dim - first,
// so adjacent placements sum to the full dimension with no gap or overlap.
// ---------------------------------------------------------------------------

export function leftHalf(area: Rect): Rect {
  const w = Math.floor(area.width / 2);
  return integerRect({ x: area.x, y: area.y, width: w, height: area.height });
}

export function rightHalf(area: Rect): Rect {
  const w = Math.floor(area.width / 2);
  return integerRect({
    x: area.x + w,
    y: area.y,
    width: area.width - w,
    height: area.height,
  });
}

/** Centered, 50%-width column, full height. */
export function centerHalf(area: Rect): Rect {
  const w = Math.floor(area.width / 2);
  const offset = Math.floor((area.width - w) / 2);
  return integerRect({ x: area.x + offset, y: area.y, width: w, height: area.height });
}

export function topHalf(area: Rect): Rect {
  const h = Math.floor(area.height / 2);
  return integerRect({ x: area.x, y: area.y, width: area.width, height: h });
}

export function bottomHalf(area: Rect): Rect {
  const h = Math.floor(area.height / 2);
  return integerRect({
    x: area.x,
    y: area.y + h,
    width: area.width,
    height: area.height - h,
  });
}

// ---------------------------------------------------------------------------
// BL-04 — Corner placements (quarter-sized)
//
// halfW = Math.floor(area.width / 2), halfH = Math.floor(area.height / 2).
// Right/bottom variants use area.width - halfW / area.height - halfH so all
// four corners tile the available area exactly.
// ---------------------------------------------------------------------------

export function topLeft(area: Rect): Rect {
  const w = Math.floor(area.width / 2);
  const h = Math.floor(area.height / 2);
  return integerRect({ x: area.x, y: area.y, width: w, height: h });
}

export function topRight(area: Rect): Rect {
  const w = Math.floor(area.width / 2);
  const h = Math.floor(area.height / 2);
  return integerRect({ x: area.x + w, y: area.y, width: area.width - w, height: h });
}

export function bottomLeft(area: Rect): Rect {
  const w = Math.floor(area.width / 2);
  const h = Math.floor(area.height / 2);
  return integerRect({ x: area.x, y: area.y + h, width: w, height: area.height - h });
}

export function bottomRight(area: Rect): Rect {
  const w = Math.floor(area.width / 2);
  const h = Math.floor(area.height / 2);
  return integerRect({
    x: area.x + w,
    y: area.y + h,
    width: area.width - w,
    height: area.height - h,
  });
}

// ---------------------------------------------------------------------------
// Thirds and two-thirds placements (BL-05)
//
// Boundary points are computed with Math.round so the sub-pixel remainder
// spreads across slots (max 1px difference between any two slots).
//
// Landscape: divides horizontally (left/center/right).
// Portrait:  divides vertically   (top/center/bottom).
// ---------------------------------------------------------------------------

/** First third of the work area (left third on landscape, top third on portrait). */
export function placeFirstThird(workArea: Rect): Rect {
  if (isLandscape(workArea)) {
    const b1 = Math.round(workArea.width / 3);
    return { x: workArea.x, y: workArea.y, width: b1, height: workArea.height };
  } else {
    const b1 = Math.round(workArea.height / 3);
    return { x: workArea.x, y: workArea.y, width: workArea.width, height: b1 };
  }
}

/** Center third of the work area. */
export function placeCenterThird(workArea: Rect): Rect {
  if (isLandscape(workArea)) {
    const b1 = Math.round(workArea.width / 3);
    const b2 = Math.round((2 * workArea.width) / 3);
    return { x: workArea.x + b1, y: workArea.y, width: b2 - b1, height: workArea.height };
  } else {
    const b1 = Math.round(workArea.height / 3);
    const b2 = Math.round((2 * workArea.height) / 3);
    return { x: workArea.x, y: workArea.y + b1, width: workArea.width, height: b2 - b1 };
  }
}

/** Last third of the work area (right third on landscape, bottom third on portrait). */
export function placeLastThird(workArea: Rect): Rect {
  if (isLandscape(workArea)) {
    const b2 = Math.round((2 * workArea.width) / 3);
    return {
      x: workArea.x + b2,
      y: workArea.y,
      width: workArea.width - b2,
      height: workArea.height,
    };
  } else {
    const b2 = Math.round((2 * workArea.height) / 3);
    return {
      x: workArea.x,
      y: workArea.y + b2,
      width: workArea.width,
      height: workArea.height - b2,
    };
  }
}

/** First two thirds of the work area (left two thirds on landscape, top two thirds on portrait). */
export function placeFirstTwoThirds(workArea: Rect): Rect {
  if (isLandscape(workArea)) {
    const b2 = Math.round((2 * workArea.width) / 3);
    return { x: workArea.x, y: workArea.y, width: b2, height: workArea.height };
  } else {
    const b2 = Math.round((2 * workArea.height) / 3);
    return { x: workArea.x, y: workArea.y, width: workArea.width, height: b2 };
  }
}

/** Last two thirds of the work area (right two thirds on landscape, bottom two thirds on portrait). */
export function placeLastTwoThirds(workArea: Rect): Rect {
  if (isLandscape(workArea)) {
    const b1 = Math.round(workArea.width / 3);
    return {
      x: workArea.x + b1,
      y: workArea.y,
      width: workArea.width - b1,
      height: workArea.height,
    };
  } else {
    const b1 = Math.round(workArea.height / 3);
    return {
      x: workArea.x,
      y: workArea.y + b1,
      width: workArea.width,
      height: workArea.height - b1,
    };
  }
}

// ---------------------------------------------------------------------------
// Fourths & three-fourths placements (BL-06)
//
// Orientation-aware: landscape divides horizontally, portrait vertically.
// Boundaries are computed with Math.round so adjacent slots share the same
// pixel edge — rounding error is at most 1px (satisfies acceptance criterion).
// ---------------------------------------------------------------------------

/**
 * Compute the four slot boundaries along the primary axis.
 *
 * Returns an array of 5 values [b0, b1, b2, b3, b4] where b0 = origin offset
 * and b4 = origin offset + total extent. Each slot i spans [b[i], b[i+1]).
 */
function fourthBoundaries(origin: number, extent: number): [number, number, number, number, number] {
  return [
    origin,
    origin + Math.round(extent / 4),
    origin + Math.round(extent / 2),
    origin + Math.round((3 * extent) / 4),
    origin + extent,
  ];
}

function placeFourthSlot(workArea: Rect, margin: number, slot: 0 | 1 | 2 | 3): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const b = fourthBoundaries(available.x, available.width);
    rect = { x: b[slot], y: available.y, width: b[slot + 1] - b[slot], height: available.height };
  } else {
    const b = fourthBoundaries(available.y, available.height);
    rect = { x: available.x, y: b[slot], width: available.width, height: b[slot + 1] - b[slot] };
  }
  return clampRect(integerRect(rect), available);
}

export function placeFirstFourth(workArea: Rect, margin: number): Rect {
  return placeFourthSlot(workArea, margin, 0);
}

export function placeSecondFourth(workArea: Rect, margin: number): Rect {
  return placeFourthSlot(workArea, margin, 1);
}

export function placeThirdFourth(workArea: Rect, margin: number): Rect {
  return placeFourthSlot(workArea, margin, 2);
}

export function placeLastFourth(workArea: Rect, margin: number): Rect {
  return placeFourthSlot(workArea, margin, 3);
}

export function placeFirstThreeFourths(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const b = fourthBoundaries(available.x, available.width);
    // Slots 0–2: from b[0] to b[3]
    rect = { x: b[0], y: available.y, width: b[3] - b[0], height: available.height };
  } else {
    const b = fourthBoundaries(available.y, available.height);
    rect = { x: available.x, y: b[0], width: available.width, height: b[3] - b[0] };
  }
  return clampRect(integerRect(rect), available);
}

export function placeLastThreeFourths(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const b = fourthBoundaries(available.x, available.width);
    // Slots 1–3: from b[1] to b[4]
    rect = { x: b[1], y: available.y, width: b[4] - b[1], height: available.height };
  } else {
    const b = fourthBoundaries(available.y, available.height);
    rect = { x: available.x, y: b[1], width: available.width, height: b[4] - b[1] };
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
