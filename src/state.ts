// Mintangle — runtime per-window state.
//
// Responsibility (AGENTS.md): in-memory per-window state for repeated commands
// and restore behavior. Not persisted across Cinnamon restarts.
//
// Key design:
//   - State is keyed by stable window sequence number (no Cinnamon types in
//     the read/write path — cycle logic can call get/update cleanly).
//   - register() connects the MetaWindow 'unmanaged' signal so entries are
//     pruned automatically when windows close.
//   - clear() disconnects all handlers and drops both maps; call on disable().

import { ActionId } from './constants';
import type { Rect } from './geometry';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WindowState {
  lastActionId: ActionId | null;
  lastCycleIndex: number;
  lastTimestamp: number;
  previousFrame: Rect | null;
  lastAppliedFrame: Rect | null;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

function defaultState(): WindowState {
  return {
    lastActionId: null,
    lastCycleIndex: 0,
    lastTimestamp: 0,
    previousFrame: null,
    lastAppliedFrame: null,
  };
}

// ---------------------------------------------------------------------------
// WindowStateManager
// ---------------------------------------------------------------------------

export class WindowStateManager {
  private _state: Map<number, WindowState> = new Map();
  // Tracks signal connections so we can disconnect them on clear().
  private _cleanup: Map<number, { window: MetaWindow; handlerId: number }> = new Map();

  /** Returns the stored state for a window, or null if unknown. */
  get(windowId: number): WindowState | null {
    return this._state.get(windowId) ?? null;
  }

  /**
   * Merges patch into the stored state for windowId (creating a default entry
   * if none exists). Returns the resulting state.
   */
  update(windowId: number, patch: Partial<WindowState>): WindowState {
    const current = this._state.get(windowId) ?? defaultState();
    const next = { ...current, ...patch };
    this._state.set(windowId, next);
    return next;
  }

  /**
   * Connects to the window's 'unmanaged' signal to automatically prune its
   * state entry when the window closes. Safe to call multiple times for the
   * same window (re-registers only if not already tracked).
   */
  register(window: MetaWindow): void {
    const id = window.get_stable_sequence();
    if (this._cleanup.has(id)) return;

    const handlerId = window.connect('unmanaged', () => {
      this._state.delete(id);
      this._cleanup.delete(id);
    });

    this._cleanup.set(id, { window, handlerId });
  }

  /** Disconnects all signal handlers and clears all state. Call on disable(). */
  clear(): void {
    for (const { window, handlerId } of this._cleanup.values()) {
      window.disconnect(handlerId);
    }
    this._cleanup.clear();
    this._state.clear();
  }
}
