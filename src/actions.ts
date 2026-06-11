// Mintangle — action dispatch.
//
// Responsibility (AGENTS.md): action dispatch and mapping between action IDs
// and geometry operations.
//
// Executes the standard AGENTS.md pipeline per keypress:
//   1. Resolve focused window.
//   2. Determine active monitor work area.
//   3. Determine action + repeat-cycle state.
//   4. Calculate target rectangle.
//   5. Validate and clamp rectangle (done inside geometry functions).
//   6. Apply move/resize.
//   7. Update runtime state.

import { ActionId } from './constants';
import {
  applyMargins,
  leftHalf,
  rightHalf,
  centerHalf,
  topHalf,
  bottomHalf,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  placeFirstThird,
  placeCenterThird,
  placeLastThird,
  placeFirstTwoThirds,
  placeLastTwoThirds,
  placeFirstFourth,
  placeSecondFourth,
  placeThirdFourth,
  placeLastFourth,
  placeFirstThreeFourths,
  placeLastThreeFourths,
  placeMaximize,
  placeAlmostMaximize,
  placeCenter,
  placeCenterProminently,
  mapRectBetweenWorkAreas,
  type Rect,
} from './geometry';
import { resolveCycle } from './cycle';
import type { WindowStateManager } from './state';
import type { MintangleSettings } from './settings';
import { log, logError } from './debug';

// ---------------------------------------------------------------------------
// Window type constants (Meta.WindowType enum values)
// ---------------------------------------------------------------------------

const META_WINDOW_DESKTOP = 1;
const META_WINDOW_DOCK = 2;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Executes the full dispatch pipeline for the given action ID.
 *
 * Called by the keybinding handler (BL-12) once per keypress.
 * Fails safely on no focused window, unsupported window type, non-resizable
 * window, unavailable work-area geometry, or move failure.
 */
export function dispatchAction(
  actionId: ActionId,
  stateManager: WindowStateManager,
  settings: MintangleSettings,
): void {
  log(`Mintangle: dispatch '${actionId}'`);

  // 1. Resolve focused window.
  const win = global.display.get_focus_window();
  if (!win) {
    log(`Mintangle: no focused window, skipping action '${actionId}'`);
    return;
  }

  // Skip desktop and dock windows — repositioning them is never the intent.
  const winType = win.get_window_type();
  if (winType === META_WINDOW_DESKTOP || winType === META_WINDOW_DOCK) {
    log(`Mintangle: skipping unsupported window type ${winType} for action '${actionId}'`);
    return;
  }

  // Skip windows that can't be maximized (fixed-size dialogs, etc.).
  // Muffin does not expose is_resizable(); can_maximize() is the supported proxy.
  if (!win.can_maximize()) {
    log(`Mintangle: window cannot be maximized, skipping action '${actionId}'`);
    return;
  }

  stateManager.register(win);
  const windowId = win.get_stable_sequence();
  const currentState = stateManager.get(windowId);

  // 2. Determine active monitor work area and current frame.
  const frameRaw = win.get_frame_rect();
  const currentFrame: Rect = {
    x: frameRaw.x,
    y: frameRaw.y,
    width: frameRaw.width,
    height: frameRaw.height,
  };

  const workArea = _resolveWorkArea(win);
  if (!workArea) return;

  const margin = settings.margin();

  // --- Special cases --------------------------------------------------------

  // Restore: reapply the stored previous frame if one exists.
  if (actionId === ActionId.RESTORE) {
    _handleRestore(win, windowId, currentState, stateManager);
    return;
  }

  if (actionId === ActionId.NEXT_DISPLAY || actionId === ActionId.PREVIOUS_DISPLAY) {
    _handleDisplayMovement(win, windowId, actionId, currentFrame, workArea, stateManager);
    return;
  }

  // --- Cycle resolution (step 3) --------------------------------------------

  const { effectiveAction, nextCycleIndex, nextTimestamp } = resolveCycle(
    actionId,
    currentState,
    settings,
    Date.now(),
  );
  if (effectiveAction !== actionId) {
    log(`Mintangle: cycle resolved '${actionId}' → '${effectiveAction}' (index ${nextCycleIndex})`);
  }

  // 4. Calculate target rectangle.
  const targetRect = _computeRect(
    effectiveAction,
    workArea,
    margin,
    currentFrame.width,
    currentFrame.height,
  );
  if (!targetRect) {
    log(`Mintangle: no geometry handler for action '${effectiveAction}'`);
    return;
  }

  // 5. Rect is already validated and clamped by the geometry functions.

  // 6. Apply move/resize.
  log(`Mintangle: applying '${effectiveAction}' → {x:${targetRect.x}, y:${targetRect.y}, w:${targetRect.width}, h:${targetRect.height}}`);
  try {
    win.move_resize_frame(false, targetRect.x, targetRect.y, targetRect.width, targetRect.height);
  } catch (e) {
    logError(`Mintangle: failed to apply '${actionId}': ${e}`);
    return;
  }

  // 7. Update runtime state.
  stateManager.update(windowId, {
    lastActionId: actionId,
    lastCycleIndex: nextCycleIndex,
    lastTimestamp: nextTimestamp,
    previousFrame: currentFrame,
    lastAppliedFrame: targetRect,
  });
}

// ---------------------------------------------------------------------------
// Private: display movement handler
// ---------------------------------------------------------------------------

function _handleDisplayMovement(
  win: MetaWindow,
  windowId: number,
  actionId: ActionId.NEXT_DISPLAY | ActionId.PREVIOUS_DISPLAY,
  currentFrame: Rect,
  currentWorkArea: Rect,
  stateManager: WindowStateManager,
): void {
  const monitorCount = global.display.get_n_monitors();
  if (monitorCount < 2) return;

  const currentMonitor = win.get_monitor();
  if (currentMonitor < 0 || currentMonitor >= monitorCount) {
    log(`Mintangle: invalid current monitor index '${currentMonitor}'`);
    return;
  }

  const direction = actionId === ActionId.NEXT_DISPLAY ? 1 : -1;
  const targetMonitor = (currentMonitor + direction + monitorCount) % monitorCount;

  let targetWorkArea: Rect;
  try {
    const raw = win.get_work_area_for_monitor(targetMonitor);
    targetWorkArea = {
      x: raw.x,
      y: raw.y,
      width: raw.width,
      height: raw.height,
    };
  } catch (e) {
    logError(`Mintangle: failed to resolve work area for monitor ${targetMonitor}: ${e}`);
    return;
  }

  const targetRect = mapRectBetweenWorkAreas(currentFrame, currentWorkArea, targetWorkArea);

  try {
    win.move_resize_frame(false, targetRect.x, targetRect.y, targetRect.width, targetRect.height);
  } catch (e) {
    logError(`Mintangle: failed to apply '${actionId}': ${e}`);
    return;
  }

  stateManager.update(windowId, {
    lastActionId: actionId,
    lastCycleIndex: 0,
    lastTimestamp: Date.now(),
    previousFrame: currentFrame,
    lastAppliedFrame: targetRect,
  });
}

// ---------------------------------------------------------------------------
// Private: restore handler
// ---------------------------------------------------------------------------

function _handleRestore(
  win: MetaWindow,
  windowId: number,
  state: ReturnType<WindowStateManager['get']>,
  stateManager: WindowStateManager,
): void {
  if (!state?.previousFrame) return;

  const frame = state.previousFrame;
  try {
    win.move_resize_frame(false, frame.x, frame.y, frame.width, frame.height);
  } catch (e) {
    logError(`Mintangle: failed to apply restore frame: ${e}`);
    return;
  }

  // Keep previousFrame unchanged so repeated restore reapplies the same
  // pre-Mintangle frame (PRODUCT.md: "reapply Restore only if a stored frame exists").
  stateManager.update(windowId, {
    lastActionId: ActionId.RESTORE,
    lastCycleIndex: 0,
    lastTimestamp: Date.now(),
    lastAppliedFrame: frame,
  });
}

// ---------------------------------------------------------------------------
// Private: work-area resolution with raw-geometry fallback
// ---------------------------------------------------------------------------

/**
 * Returns the work area for the window's current monitor.
 * Falls back to raw monitor geometry if the work-area API is unavailable.
 * Returns null (and logs) if both attempts fail.
 */
function _resolveWorkArea(win: MetaWindow): Rect | null {
  try {
    const raw = win.get_work_area_current_monitor();
    return { x: raw.x, y: raw.y, width: raw.width, height: raw.height };
  } catch (e) {
    log('Mintangle: get_work_area_current_monitor failed, falling back to raw monitor geometry');
  }

  // Fallback: raw monitor bounds (no panel exclusion).
  try {
    const monitorIndex = win.get_monitor();
    const raw = global.display.get_monitor_geometry(monitorIndex);
    return { x: raw.x, y: raw.y, width: raw.width, height: raw.height };
  } catch (e) {
    logError(`Mintangle: failed to resolve monitor geometry, skipping action: ${e}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Private: geometry dispatch
// ---------------------------------------------------------------------------

/**
 * Maps an effective action ID to a target rectangle.
 *
 * Halves, corners, thirds, and fourths call their geometry function directly
 * with (workArea, margin) — those functions apply margins internally.
 *
 * Maximize and center functions expect the already-margined available area,
 * so applyMargins is called here before forwarding.
 *
 * Returns null for restore and display actions (handled above).
 */
function _computeRect(
  action: ActionId,
  workArea: Rect,
  margin: number,
  currentWidth: number,
  currentHeight: number,
): Rect | null {
  switch (action) {
    // Halves
    case ActionId.LEFT_HALF:           return leftHalf(workArea, margin);
    case ActionId.CENTER_HALF:         return centerHalf(workArea, margin);
    case ActionId.RIGHT_HALF:          return rightHalf(workArea, margin);
    case ActionId.TOP_HALF:            return topHalf(workArea, margin);
    case ActionId.BOTTOM_HALF:         return bottomHalf(workArea, margin);
    // Corners
    case ActionId.TOP_LEFT:            return topLeft(workArea, margin);
    case ActionId.TOP_RIGHT:           return topRight(workArea, margin);
    case ActionId.BOTTOM_LEFT:         return bottomLeft(workArea, margin);
    case ActionId.BOTTOM_RIGHT:        return bottomRight(workArea, margin);
    // Thirds
    case ActionId.FIRST_THIRD:         return placeFirstThird(workArea, margin);
    case ActionId.CENTER_THIRD:        return placeCenterThird(workArea, margin);
    case ActionId.LAST_THIRD:          return placeLastThird(workArea, margin);
    case ActionId.FIRST_TWO_THIRDS:    return placeFirstTwoThirds(workArea, margin);
    case ActionId.LAST_TWO_THIRDS:     return placeLastTwoThirds(workArea, margin);
    // Fourths
    case ActionId.FIRST_FOURTH:        return placeFirstFourth(workArea, margin);
    case ActionId.SECOND_FOURTH:       return placeSecondFourth(workArea, margin);
    case ActionId.THIRD_FOURTH:        return placeThirdFourth(workArea, margin);
    case ActionId.LAST_FOURTH:         return placeLastFourth(workArea, margin);
    case ActionId.FIRST_THREE_FOURTHS: return placeFirstThreeFourths(workArea, margin);
    case ActionId.LAST_THREE_FOURTHS:  return placeLastThreeFourths(workArea, margin);
    // Maximize / center (these functions take the margin-adjusted area directly)
    case ActionId.MAXIMIZE:
      return placeMaximize(applyMargins(workArea, margin));
    case ActionId.ALMOST_MAXIMIZE:
      return placeAlmostMaximize(applyMargins(workArea, margin));
    case ActionId.CENTER:
      return placeCenter(applyMargins(workArea, margin), currentWidth, currentHeight);
    case ActionId.CENTER_PROMINENTLY:
      return placeCenterProminently(applyMargins(workArea, margin));
    // Restore and display actions are handled before _computeRect is called.
    default:
      return null;
  }
}
