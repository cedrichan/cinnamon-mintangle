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

// Stored so later tasks (BL-14) can read uuid/path without re-deriving them.
let extensionMeta = null;

function init(metadata) {
    // Cinnamon passes the parsed metadata.json. Keep a reference for later
    // wiring; do not perform any side effects during init.
    extensionMeta = metadata;
}

function enable() {
    // Intentionally empty for BL-01. Real wiring lands in BL-14.
}

function disable() {
    // Intentionally empty for BL-01. Must remain safe to call even if enable()
    // did nothing.
}
