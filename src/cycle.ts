// Mintangle — repeat-cycle resolution.
//
// Responsibility (AGENTS.md / BL-09): Given an action ID, the per-window state,
// settings, and the current timestamp, decide the effective placement to apply
// and the updated cycle index to store.
//
// Pure function with no Cinnamon dependencies — testable outside Cinnamon.

import { ActionId, ACTION_CYCLE_GROUP, CYCLE_SEQUENCES, CycleGroup } from './constants';
import type { WindowState } from './state';
import type { MintangleSettings } from './settings';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CycleResult {
  effectiveAction: ActionId;
  nextCycleIndex: number;
  nextTimestamp: number;
}

// ---------------------------------------------------------------------------
// resolveCycle
// ---------------------------------------------------------------------------

/**
 * Determines which action to apply on a keypress and what cycle state to store.
 *
 * @param actionId  The action ID that was triggered.
 * @param state     Current per-window state, or null if the window is new/unknown.
 * @param settings  Live settings (cycling toggles, repeat timeout).
 * @param now       Current timestamp in milliseconds (e.g. Date.now()).
 */
export function resolveCycle(
  actionId: ActionId,
  state: WindowState | null,
  settings: MintangleSettings,
  now: number,
): CycleResult {
  const sequence = CYCLE_SEQUENCES[actionId];
  const group = ACTION_CYCLE_GROUP[actionId];

  const isRepeat =
    state !== null &&
    state.lastActionId === actionId &&
    now - state.lastTimestamp <= settings.repeatTimeout();

  const cyclingActive = settings.enableCycling() && _isCategoryEnabled(group, settings);

  const nextCycleIndex =
    cyclingActive && isRepeat
      ? (state!.lastCycleIndex + 1) % sequence.length
      : 0;

  return {
    effectiveAction: sequence[nextCycleIndex],
    nextCycleIndex,
    nextTimestamp: now,
  };
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function _isCategoryEnabled(group: CycleGroup, settings: MintangleSettings): boolean {
  switch (group) {
    case CycleGroup.HALF:
      return settings.enableHalfCycling();
    case CycleGroup.CORNER:
      return settings.enableCornerCycling();
    case CycleGroup.THIRD:
    case CycleGroup.TWO_THIRDS:
      return settings.enableThirdCycling();
    case CycleGroup.FOURTH:
    case CycleGroup.THREE_FOURTHS:
      return settings.enableFourthCycling();
    case CycleGroup.NONE:
      // Single-element sequences — cycling category doesn't apply.
      return true;
  }
}
