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
