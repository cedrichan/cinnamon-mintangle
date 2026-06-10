# BL-15 — Settings UI (prefs)

- **Status:** Not started
- **Priority:** P2
- **Depends on:** BL-11
- **Parallelizable with:** BL-13, BL-16, BL-17
- **Affected files:** `prefs.js`

## Summary

Provide the settings UI so users can view and manage shortcuts and cycling
options. The UI must make shortcuts recoverable: view, capture, clear, reset, and
reset-all, following Cinnamon settings conventions.

## Scope

- [ ] Render all action shortcuts with current bindings (view).
- [ ] Capture a new shortcut for an action.
- [ ] Clear a single shortcut and reset a single shortcut to default.
- [ ] Reset all shortcuts and reset all settings.
- [ ] Expose the v1 toggles + repeat timeout (BL-11) with sensible controls.
- [ ] Where practical, show shortcut registration errors/conflicts (from BL-16).

## Acceptance criteria

- Settings page opens from Cinnamon.
- Capture, clear, reset, and reset-all all work and persist.
- Conflicts/registration errors are visible where practical.

## References

- `PRODUCT.md` → "Settings Changes" (kept settings)
- `AGENTS.md` → "Settings Should Be User-Recoverable", "prefs.js" responsibility
