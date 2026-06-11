# BL-12 — Keybinding registration / unregistration

- **Status:** Done
- **Priority:** P1
- **Depends on:** BL-02, BL-11
- **Parallelizable with:** BL-09, BL-10
- **Affected files:** `src/keybindings.js`

## Summary

Register every action's shortcut with Cinnamon/Muffin, route presses to the
action dispatcher, and support clean unregistration and rebinding when settings
change. Hotkey callbacks must be synchronous and fast.

## Scope

- [ ] Register each action's shortcut (from settings, defaulting to BL-02) using
      Cinnamon/Muffin keybinding APIs (no external shell commands).
- [ ] Route each keybinding callback to BL-10 action dispatch.
- [ ] Unregister all keybindings cleanly on disable.
- [ ] Rebind when a shortcut setting changes (unregister old, register new).
- [ ] Detect and report registration failures / conflicts so BL-16 can surface
      them in settings.

## Acceptance criteria

- All default shortcuts register on enable.
- Disable removes every registered keybinding (none leak).
- Editing a shortcut in settings rebinds without restart.
- A failed registration does not crash the extension and is reported.

## References

- `PRODUCT.md` → "Revised Default Shortcut Table", display shortcuts
- `AGENTS.md` → "keybindings.js" responsibility, "Fail Safely", "Do Not Poll"
