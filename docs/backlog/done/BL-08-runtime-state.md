# BL-08 — Runtime per-window state

- **Status:** Not started
- **Priority:** P1
- **Depends on:** —
- **Parallelizable with:** BL-01, BL-02, BL-03
- **Affected files:** `src/state.js`

## Summary

Provide lightweight, in-memory, per-window state used for repeat cycling and
restore. State is not persisted across Cinnamon restarts. This module is storage
only; cycle resolution logic lives in BL-09 and consumes it.

## Scope

- [ ] Track per window: last action ID, last cycle index, last applied timestamp,
      previous frame (for restore), and last Mintangle-applied frame.
- [ ] Key state by a stable window identity; clean up entries when windows close.
- [ ] Provide accessors to read/update state without leaking Cinnamon globals
      into the cycle logic where avoidable.
- [ ] Ensure state is fully cleared on extension disable.

## Acceptance criteria

- No persistence to disk; state is empty after Cinnamon restart.
- Closing a window does not leak its state entry.
- Disable clears all tracked state.

## References

- `PRODUCT.md` → "Restore", repeat-cycle behavior (needs last action + index)
- `AGENTS.md` → "Runtime State Should Be Lightweight", "Do Not Poll"
