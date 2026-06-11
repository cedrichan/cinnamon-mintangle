# BL-16 — Fail-safe handling & error notifications

- **Status:** Done
- **Priority:** P2
- **Depends on:** BL-10, BL-11, BL-12
- **Parallelizable with:** BL-13, BL-15, BL-17
- **Affected files:** `src/actions.js`, `src/keybindings.js`, `extension.js`

## Summary

Make the extension fail safely across the documented failure modes and provide
developer logging plus user-visible notifications per settings. This is a
cross-cutting hardening task layered onto dispatch, keybindings, and lifecycle.

## Scope

- [ ] Handle gracefully: no focused window, unsupported window type, non-resizable
      window, failed keybinding registration, unavailable monitor/work-area geometry.
- [ ] Fall back to raw monitor geometry only when work-area geometry is unavailable.
- [ ] Log actionable developer errors for each failure path.
- [ ] Show user-visible notifications according to the settings defined in
      `PRODUCT.md` (do not over-notify).
- [ ] Ensure no failure path crashes or disables the extension unexpectedly.

## Acceptance criteria

- Acting with no focused window does nothing harmful and logs a clear message.
- A non-resizable/unsupported window does not crash the extension.
- Keybinding registration failure is handled and surfaced (ties into BL-15).
- Work-area geometry is preferred; raw monitor bounds used only as fallback.

## References

- `PRODUCT.md` → error/notification behavior referenced by settings
- `AGENTS.md` → "Fail Safely", "Respect Work Areas"
