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
// All functions accept the raw work area and margin; applyMargins is called
// internally. Tiling rule: first half = Math.round(dim / 2), second half =
// dim - first, so adjacent placements sum to the full dimension with no gap
// or overlap.
// ---------------------------------------------------------------------------

export function leftHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const w = Math.round(available.width / 2);
  return clampRect(
    integerRect({ x: available.x, y: available.y, width: w, height: available.height }),
    available,
  );
}

export function rightHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const w = Math.round(available.width / 2);
  return clampRect(
    integerRect({
      x: available.x + w,
      y: available.y,
      width: available.width - w,
      height: available.height,
    }),
    available,
  );
}

/** Centered, 50%-width column, full height. */
export function centerHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const w = Math.round(available.width / 2);
  const offset = Math.round((available.width - w) / 2);
  return clampRect(
    integerRect({ x: available.x + offset, y: available.y, width: w, height: available.height }),
    available,
  );
}

export function topHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const h = Math.round(available.height / 2);
  return clampRect(
    integerRect({ x: available.x, y: available.y, width: available.width, height: h }),
    available,
  );
}

export function bottomHalf(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const h = Math.round(available.height / 2);
  return clampRect(
    integerRect({
      x: available.x,
      y: available.y + h,
      width: available.width,
      height: available.height - h,
    }),
    available,
  );
}

// ---------------------------------------------------------------------------
// BL-04 — Corner placements (quarter-sized)
//
// halfW = Math.round(available.width / 2), halfH = Math.round(available.height / 2).
// Right/bottom variants use available.width - halfW / available.height - halfH so
// all four corners tile the available area exactly.
// ---------------------------------------------------------------------------

export function topLeft(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const w = Math.round(available.width / 2);
  const h = Math.round(available.height / 2);
  return clampRect(
    integerRect({ x: available.x, y: available.y, width: w, height: h }),
    available,
  );
}

export function topRight(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const w = Math.round(available.width / 2);
  const h = Math.round(available.height / 2);
  return clampRect(
    integerRect({ x: available.x + w, y: available.y, width: available.width - w, height: h }),
    available,
  );
}

export function bottomLeft(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const w = Math.round(available.width / 2);
  const h = Math.round(available.height / 2);
  return clampRect(
    integerRect({ x: available.x, y: available.y + h, width: w, height: available.height - h }),
    available,
  );
}

export function bottomRight(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  const w = Math.round(available.width / 2);
  const h = Math.round(available.height / 2);
  return clampRect(
    integerRect({
      x: available.x + w,
      y: available.y + h,
      width: available.width - w,
      height: available.height - h,
    }),
    available,
  );
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
export function placeFirstThird(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const b1 = Math.round(available.width / 3);
    rect = { x: available.x, y: available.y, width: b1, height: available.height };
  } else {
    const b1 = Math.round(available.height / 3);
    rect = { x: available.x, y: available.y, width: available.width, height: b1 };
  }
  return clampRect(integerRect(rect), available);
}

/** Center third of the work area. */
export function placeCenterThird(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const b1 = Math.round(available.width / 3);
    const b2 = Math.round((2 * available.width) / 3);
    rect = { x: available.x + b1, y: available.y, width: b2 - b1, height: available.height };
  } else {
    const b1 = Math.round(available.height / 3);
    const b2 = Math.round((2 * available.height) / 3);
    rect = { x: available.x, y: available.y + b1, width: available.width, height: b2 - b1 };
  }
  return clampRect(integerRect(rect), available);
}

/** Last third of the work area (right third on landscape, bottom third on portrait). */
export function placeLastThird(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const b2 = Math.round((2 * available.width) / 3);
    rect = {
      x: available.x + b2,
      y: available.y,
      width: available.width - b2,
      height: available.height,
    };
  } else {
    const b2 = Math.round((2 * available.height) / 3);
    rect = {
      x: available.x,
      y: available.y + b2,
      width: available.width,
      height: available.height - b2,
    };
  }
  return clampRect(integerRect(rect), available);
}

/** First two thirds of the work area (left two thirds on landscape, top two thirds on portrait). */
export function placeFirstTwoThirds(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const b2 = Math.round((2 * available.width) / 3);
    rect = { x: available.x, y: available.y, width: b2, height: available.height };
  } else {
    const b2 = Math.round((2 * available.height) / 3);
    rect = { x: available.x, y: available.y, width: available.width, height: b2 };
  }
  return clampRect(integerRect(rect), available);
}

/** Last two thirds of the work area (right two thirds on landscape, bottom two thirds on portrait). */
export function placeLastTwoThirds(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const b1 = Math.round(available.width / 3);
    rect = {
      x: available.x + b1,
      y: available.y,
      width: available.width - b1,
      height: available.height,
    };
  } else {
    const b1 = Math.round(available.height / 3);
    rect = {
      x: available.x,
      y: available.y + b1,
      width: available.width,
      height: available.height - b1,
    };
  }
  return clampRect(integerRect(rect), available);
}

// ---------------------------------------------------------------------------
// Fourths & three-fourths placements (BL-06)
//
// Orientation-aware: landscape divides horizontally, portrait vertically.
// Boundaries are computed with Math.round so adjacent slots share the same
// pixel edge — rounding error is at most 1px (satisfies acceptance criterion).
// ---------------------------------------------------------------------------

export function placeFirstFourth(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const w = Math.round(available.width / 4);
    rect = { x: available.x, y: available.y, width: w, height: available.height };
  } else {
    const h = Math.round(available.height / 4);
    rect = { x: available.x, y: available.y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeSecondFourth(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const x = available.x + Math.round(available.width / 4);
    const w = Math.round(available.width / 2) - Math.round(available.width / 4);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const y = available.y + Math.round(available.height / 4);
    const h = Math.round(available.height / 2) - Math.round(available.height / 4);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeThirdFourth(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const x = available.x + Math.round(available.width / 2);
    const w = Math.round((3 * available.width) / 4) - Math.round(available.width / 2);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const y = available.y + Math.round(available.height / 2);
    const h = Math.round((3 * available.height) / 4) - Math.round(available.height / 2);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeLastFourth(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const x = available.x + Math.round((3 * available.width) / 4);
    const w = available.width - Math.round((3 * available.width) / 4);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const y = available.y + Math.round((3 * available.height) / 4);
    const h = available.height - Math.round((3 * available.height) / 4);
    rect = { x: available.x, y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeFirstThreeFourths(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const w = Math.round((3 * available.width) / 4);
    rect = { x: available.x, y: available.y, width: w, height: available.height };
  } else {
    const h = Math.round((3 * available.height) / 4);
    rect = { x: available.x, y: available.y, width: available.width, height: h };
  }
  return clampRect(integerRect(rect), available);
}

export function placeLastThreeFourths(workArea: Rect, margin: number): Rect {
  const available = applyMargins(workArea, margin);
  let rect: Rect;
  if (isLandscape(available)) {
    const x = available.x + Math.round(available.width / 4);
    const w = available.width - Math.round(available.width / 4);
    rect = { x, y: available.y, width: w, height: available.height };
  } else {
    const y = available.y + Math.round(available.height / 4);
    const h = available.height - Math.round(available.height / 4);
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
