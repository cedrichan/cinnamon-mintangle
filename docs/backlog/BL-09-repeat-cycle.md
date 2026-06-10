# BL-09 — Repeat-cycle resolution (position-only)

- **Status:** Not started
- **Priority:** P1
- **Depends on:** BL-02, BL-08
- **Parallelizable with:** BL-11, BL-12
- **Affected files:** `src/actions.js` (or a small `src/cycle.js` helper)

## Summary

Given an action ID, the per-window state, the repeat timeout, and which cycle
categories are enabled, decide the effective placement for this press. Repeated
presses preserve the action's size category and advance only through related
positions. Size never changes on repeat.

## Scope

- [ ] On repeat within the timeout for the same cycling action, advance to the
      next position in that action's cycle table (BL-02).
- [ ] On a new action, a timed-out repeat, or a different window, reset to the
      action's first placement.
- [ ] Never cross size categories on repeat (half→third, fourth→three-fourths,
      corner→half, maximize→almost-maximize, center→almost-maximize all forbidden).
- [ ] If the action's position-cycle category is disabled in settings, always
      reapply the first/default placement.
- [ ] Non-cycling actions (maximize, almost-maximize, center, center-prominently,
      restore, next/previous-display) simply reapply.

## Acceptance criteria

- Repeating `left-half` cycles Left → Center → Right → Left.
- Repeating `top-left` cycles clockwise through the four corners.
- Repeating `first-fourth` cycles First → Second → Third → Last.
- After the repeat timeout, the same shortcut restarts at the first placement.
- Disabling a category makes that action's repeats reapply the first placement.
- No repeat ever changes the size category.

## References

- `PRODUCT.md` → "Revised Repeat Behavior Principle", "Revised Repeated Press
  Cycles", "Settings Changes" (per-category toggles + timeout), acceptance tests
  1–12, 20
- `AGENTS.md` → "Separate Calculation from Side Effects"
