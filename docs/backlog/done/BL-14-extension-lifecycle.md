# BL-14 — Extension lifecycle wiring

- **Status:** Not started
- **Priority:** P1
- **Depends on:** BL-10, BL-11, BL-12
- **Affected files:** `extension.js`

## Summary

Wire the modules together through the Cinnamon extension lifecycle: `init`,
`enable`, and `disable`. Enable constructs settings, keybindings, and dispatch;
disable tears everything down cleanly with no leaks.

## Scope

- [ ] `init`: light setup only, no side effects on the desktop.
- [ ] `enable`: load settings (BL-11), register keybindings (BL-12), wire dispatch
      (BL-10), subscribe to settings change listeners.
- [ ] `disable`: unregister keybindings, remove listeners, clear runtime state
      (BL-08), release all resources.
- [ ] Guard against double-enable / double-disable.

## Acceptance criteria

- Enable then disable leaves no registered keybindings, listeners, or state.
- Re-enabling after disable works without restarting Cinnamon.
- No errors thrown on enable/disable cycles.

## References

- `AGENTS.md` → "extension.js" responsibility, "Before Completing a Change"
  (enable/disable cleanup), "Fail Safely"
