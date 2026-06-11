// Minimal ambient declarations for the GJS / Cinnamon runtime.
//
// Cinnamon does not ship TypeScript types. Rather than pull in heavy GI typing
// packages, we hand-declare only what the extension actually touches and grow
// this file as later backlog items (BL-03+) consume real Muffin/Cinnamon APIs.
//
// `imports` is a GJS global, not an ES/Node module. It is referenced directly
// (e.g. `imports.gi.Meta`) and must NOT be `import`ed, so esbuild leaves it
// untouched in the bundle.

/** Parsed contents of metadata.json, passed to `init()` by Cinnamon. */
interface ExtensionMetadata {
  uuid: string;
  name: string;
  description: string;
  version: string;
  'cinnamon-version': string[];
  /** Absolute path to the installed extension directory (added by Cinnamon). */
  path?: string;
  [key: string]: unknown;
}


/**
 * A rectangle returned by Muffin/Meta geometry APIs.
 * Fields are integers in screen pixels.
 */
interface MetaRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Minimal interface for the Meta.Display singleton (BL-10+).
 * Accessed via `global.display`.
 */
interface MetaDisplay {
  /** Returns the currently focused window, or null if none. */
  get_focus_window(): MetaWindow | null;
  /** Returns the number of connected monitors. */
  get_n_monitors(): number;
  /**
   * Returns the raw geometry for a monitor (no panel exclusion).
   * Used as a fallback when get_work_area_current_monitor() is unavailable.
   */
  get_monitor_geometry(monitorIndex: number): MetaRectangle;
  [key: string]: any;
}

/**
 * The GJS `global` object provided by Cinnamon.
 * `global.display` is the Meta.Display singleton.
 */
declare const global: {
  display: MetaDisplay;
  /** Logs a message to Looking Glass (Cinnamon's built-in debugger). */
  log(message: string): void;
  logError(message: string): void;
  logWarning(message: string): void;
  [key: string]: any;
};

/** Wraps Cinnamon's ExtensionSettings backend (imports.ui.settings). */
interface CinnamonExtensionSettings {
  getValue(key: string): unknown;
  setValue(key: string, value: unknown): void;
  connect(signal: string, callback: (...args: any[]) => void): number;
  disconnect(id: number): void;
  /** Removes all bindings and signal connections. Call on extension disable. */
  finalize(): void;
}

/**
 * Minimal interface for a Muffin/Meta window object.
 * Grown as backlog items consume real APIs (BL-08+).
 */
interface MetaWindow {
  /** Returns a stable integer that uniquely identifies this window for its lifetime. */
  get_stable_sequence(): number;
  /** Connects a GObject signal; returns the handler ID. */
  connect(signal: string, callback: (...args: any[]) => void): number;
  /** Disconnects a handler by ID returned from connect(). */
  disconnect(handlerId: number): void;
  /** Returns the window's current frame rectangle (position + size in screen pixels). */
  get_frame_rect(): MetaRectangle;
  /**
   * Returns the work area for the monitor the window is currently on.
   * Excludes panels and other reserved areas — prefer this over raw monitor geometry.
   */
  get_work_area_current_monitor(): MetaRectangle;
  /** Returns the work area for the monitor at the given Muffin monitor index. */
  get_work_area_for_monitor(monitorIndex: number): MetaRectangle;
  /**
   * Moves and resizes the window frame.
   * userOp should be false for programmatic placements (not user-initiated drags).
   */
  move_resize_frame(userOp: boolean, x: number, y: number, width: number, height: number): void;
  /**
   * Returns the Meta.WindowType enum value.
   * 0 = NORMAL, 1 = DESKTOP, 2 = DOCK, 3 = DIALOG, etc.
   */
  get_window_type(): number;
  /** Returns the index of the monitor the window is currently on. */
  get_monitor(): number;
  /** Returns true if the window supports maximize (used as a proxy for "manageable by tiling"). */
  can_maximize(): boolean;
}

/**
 * Cinnamon's global keybinding manager (imports.ui.main.keybindingManager).
 *
 * addHotKey returns true on success, false if the binding could not be
 * registered (e.g. conflict with another binding).
 */
interface CinnamonKeybindingManager {
  addHotKey(name: string, binding: string, callback: () => void): boolean;
  removeHotKey(name: string): void;
}

/**
 * The GJS legacy import namespace. Typed loosely for now; tighten per-namespace
 * (gi.Meta, ui.main, misc.extensionUtils, ...) as the extension starts calling
 * real APIs.
 */
declare const imports: {
  /** GObject-introspection bindings, e.g. imports.gi.Meta, imports.gi.Gio. */
  gi: Record<string, any>;
  /** Cinnamon UI modules, e.g. imports.ui.main. */
  ui: {
    settings: {
      ExtensionSettings: new (bindObject: object, uuid: string) => CinnamonExtensionSettings;
    };
    main: {
      keybindingManager: CinnamonKeybindingManager;
      [key: string]: any;
    };
    [key: string]: any;
  };
  /** Cinnamon misc helpers, e.g. imports.misc.extensionUtils. */
  misc: Record<string, any>;
  [key: string]: any;
};
