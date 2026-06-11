// Mintangle — keybinding registration.
//
// Responsibility (AGENTS.md): shortcut registration, unregistration, and
// rebinding.

import { ActionId, DEFAULT_SHORTCUTS } from './constants.js';
import { MintangleSettings, shortcutKey } from './settings.js';

// Prefix for all keybinding names registered with Cinnamon.
// Unique per extension to avoid conflicts with other extensions or desktop bindings.
const NAME_PREFIX = 'mintangle-';

/** All action IDs in a stable iteration order. */
const ALL_ACTIONS = Object.values(ActionId) as ActionId[];

export class KeybindingManager {
  private _settings: MintangleSettings;
  private _dispatch: (action: ActionId) => void;

  // action → currently-registered shortcut string
  private _registered: Map<ActionId, string> = new Map();
  // action → error message from the last failed registration attempt
  private _errors: Map<ActionId, string> = new Map();
  // settings connection IDs, tracked for cleanup in destroy()
  private _listenerIds: number[] = [];

  constructor(settings: MintangleSettings, dispatch: (action: ActionId) => void) {
    this._settings = settings;
    this._dispatch = dispatch;
  }

  /**
   * Register all action shortcuts with Cinnamon and connect settings listeners
   * for live rebinding. Safe to call from extension enable().
   */
  enable(): void {
    for (const action of ALL_ACTIONS) {
      const shortcut = this._settings.shortcut(action);
      this._register(action, shortcut);

      // Connect a change listener so edits in settings rebind without restart.
      const id = this._settings.connect(shortcutKey(action), () => {
        this._rebind(action);
      });
      if (id !== 0) this._listenerIds.push(id);
    }
  }

  /**
   * Unregister all keybindings and disconnect settings listeners.
   * Safe to call from extension disable() even if enable() was never called.
   */
  destroy(): void {
    for (const action of ALL_ACTIONS) {
      this._unregister(action);
    }

    for (const id of this._listenerIds) {
      this._settings.disconnect(id);
    }
    this._listenerIds = [];
    this._errors.clear();
  }

  /**
   * Returns a snapshot of registration failures.
   * BL-16 (fail-safe / settings UI) reads this to surface conflicts.
   */
  registrationErrors(): Map<ActionId, string> {
    return new Map(this._errors);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private _register(action: ActionId, shortcut: string): void {
    if (!shortcut) {
      // Empty shortcut means the action is intentionally unbound.
      return;
    }

    const name = NAME_PREFIX + action;
    try {
      const ok = imports.ui.main.keybindingManager.addHotKey(
        name,
        shortcut,
        () => this._dispatch(action),
      );
      if (ok) {
        this._registered.set(action, shortcut);
        this._errors.delete(action);
      } else {
        const msg = `addHotKey returned false for "${name}" (binding: ${shortcut})`;
        log(`Mintangle: ${msg}`);
        this._errors.set(action, msg);
      }
    } catch (e) {
      const msg = `addHotKey threw for "${name}" (binding: ${shortcut}): ${e}`;
      logError(e as object, `Mintangle: failed to register keybinding for ${action}`);
      this._errors.set(action, msg);
    }
  }

  private _unregister(action: ActionId): void {
    if (!this._registered.has(action)) return;

    const name = NAME_PREFIX + action;
    try {
      imports.ui.main.keybindingManager.removeHotKey(name);
    } catch (e) {
      logError(e as object, `Mintangle: failed to unregister keybinding for ${action}`);
    }
    this._registered.delete(action);
  }

  private _rebind(action: ActionId): void {
    this._unregister(action);
    const shortcut = this._settings.shortcut(action);
    this._register(action, shortcut);
  }
}
