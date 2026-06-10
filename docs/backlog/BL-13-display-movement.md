# BL-13 — Multi-monitor / display movement

- **Status:** Not started
- **Priority:** P1
- **Depends on:** BL-03, BL-10
- **Parallelizable with:** BL-15, BL-16
- **Affected files:** `src/actions.js`, `src/geometry.js`

## Summary

Implement `next-display` and `previous-display`, which move the focused window to
the adjacent monitor while preserving its relative frame geometry where practical.
Display movement is explicit and independent of left/right half repeats.

## Scope

- [ ] Enumerate monitors and determine the focused window's current monitor.
- [ ] Compute a target frame on the next/previous monitor that preserves relative
      position/size within that monitor's work area where practical.
- [ ] Apply via the BL-10 pipeline; respect work areas and clamp to the target
      monitor.
- [ ] Honor the "Enable display cycling" setting; gracefully no-op with a single
      monitor.
- [ ] Ensure repeated left/right half shortcuts never move the window across
      displays.

## Acceptance criteria

- `Ctrl+Meta+Alt+Right` moves the window to the next display; `…+Left` to previous.
- Relative geometry is preserved across the move where practical.
- Single-monitor setups do not crash and no-op sensibly.
- Repeating `Ctrl+Meta+Left` (Left Half) does not change displays.

## References

- `PRODUCT.md` → "Display Actions", acceptance tests 17–19, decisions #6/#7
- `AGENTS.md` → "Multi-Monitor Behavior", "Respect Work Areas"
