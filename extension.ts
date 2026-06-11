// Mintangle — Cinnamon extension lifecycle entrypoint.
//
// BL-01 scope: provide a minimal, safe skeleton so Cinnamon can detect, list,
// enable, and disable the extension. No window-management behavior is wired up
// here yet — the real enable/disable wiring (keybindings, settings, action
// dispatch) lands in BL-14.
//
// Cinnamon calls, in order:
//   init(metadata) — once when the extension is loaded.
//   enable()       — when the extension is turned on.
//   disable()      — when the extension is turned off.
//
// All three must no-op safely (never throw) for this task.
//
// These functions are `export`ed so the esbuild bundle can re-expose them as
// top-level `var init/enable/disable` in build/extension.js, which is how GJS's
// legacy module loader hands the lifecycle hooks to Cinnamon. See
// scripts/build.mjs and README.md.

// Stored so later tasks (BL-14) can read uuid/path without re-deriving them.
let extensionMeta: ExtensionMetadata | null = null;

export function init(metadata: ExtensionMetadata): void {
  // Cinnamon passes the parsed metadata.json. Keep a reference for later
  // wiring; do not perform any side effects during init.
  extensionMeta = metadata;
}

export function enable(): void {
  // Intentionally empty for BL-01. Real wiring lands in BL-14.
}

export function disable(): void {
  // Intentionally empty for BL-01. Must remain safe to call even if enable()
  // did nothing.
}
