// Mintangle — settings loader.
//
// Wraps Cinnamon's ExtensionSettings with typed getters, range coercion, and
// change-listener support. Fails safely if the settings backend is unavailable.

import { ActionId, DEFAULT_SHORTCUTS } from './constants.js';
import { logError } from './debug.js';

// ---------------------------------------------------------------------------
// Setting key constants
// ---------------------------------------------------------------------------
//
// Single source of truth for schema key names. Import these in BL-09/BL-12
// rather than hardcoding strings when connecting change listeners.

export const KEY_ENABLE_CYCLING = 'enable-cycling';
export const KEY_REPEAT_TIMEOUT = 'repeat-timeout';

/** Returns the settings key for a per-action shortcut binding. */
export function shortcutKey(action: ActionId): string {
  return `shortcut-${action}`;
}

export const REPEAT_TIMEOUT_MIN = 100;
export const REPEAT_TIMEOUT_MAX = 10000;
const REPEAT_TIMEOUT_DEFAULT = 1500;

// ---------------------------------------------------------------------------
// MintangleSettings
// ---------------------------------------------------------------------------

export class MintangleSettings {
  private _settings: CinnamonExtensionSettings | null = null;
  private _connections: number[] = [];

  constructor(bindObject: object, uuid: string) {
    try {
      this._settings = new imports.ui.settings.ExtensionSettings(bindObject, uuid);
    } catch (e) {
      logError(`MintangleSettings: ExtensionSettings unavailable, using defaults: ${e}`);
    }
  }

  // ---- typed getters -------------------------------------------------------

  enableCycling(): boolean {
    return this._getBool(KEY_ENABLE_CYCLING, true);
  }

  repeatTimeout(): number {
    return this._getInt(KEY_REPEAT_TIMEOUT, REPEAT_TIMEOUT_DEFAULT, REPEAT_TIMEOUT_MIN, REPEAT_TIMEOUT_MAX);
  }

  shortcut(action: ActionId): string {
    return this._getString(shortcutKey(action), DEFAULT_SHORTCUTS[action]);
  }

  // ---- change listeners ----------------------------------------------------

  /** Connect a callback fired when `key` changes. Returns a connection ID. */
  connect(key: string, callback: () => void): number {
    if (!this._settings) return 0;
    const id = this._settings.connect(`changed::${key}`, callback);
    this._connections.push(id);
    return id;
  }

  /** Disconnect a previously connected listener by its ID. */
  disconnect(id: number): void {
    if (!this._settings || id === 0) return;
    this._settings.disconnect(id);
    const idx = this._connections.indexOf(id);
    if (idx !== -1) this._connections.splice(idx, 1);
  }

  // ---- lifecycle -----------------------------------------------------------

  /** Remove all bindings and signals. Call from extension disable(). */
  destroy(): void {
    if (this._settings) {
      this._settings.finalize();
      this._settings = null;
    }
    this._connections = [];
  }

  // ---- private helpers -----------------------------------------------------

  private _getBool(key: string, fallback: boolean): boolean {
    if (!this._settings) return fallback;
    try {
      const v = this._settings.getValue(key);
      return typeof v === 'boolean' ? v : fallback;
    } catch {
      return fallback;
    }
  }

  private _getInt(key: string, fallback: number, min: number, max: number): number {
    if (!this._settings) return fallback;
    try {
      const v = Number(this._settings.getValue(key));
      if (!isFinite(v)) return fallback;
      return Math.max(min, Math.min(max, Math.round(v)));
    } catch {
      return fallback;
    }
  }

  private _getString(key: string, fallback: string): string {
    if (!this._settings) return fallback;
    try {
      const v = this._settings.getValue(key);
      return typeof v === 'string' && v.length > 0 ? v : fallback;
    } catch {
      return fallback;
    }
  }
}
