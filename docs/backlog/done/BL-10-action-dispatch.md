# BL-10 — Action dispatch

- **Status:** Done
- **Priority:** P1
- **Depends on:** BL-02, BL-04, BL-05, BL-06, BL-07, BL-09
- **Parallelizable with:** BL-11, BL-12
- **Affected files:** `src/actions.js`

## Summary

Wire action IDs to geometry operations and execute the standard flow per the
`AGENTS.md` pipeline: resolve focused window → active monitor/work area →
action + repeat-cycle state → target rect → validate/clamp → apply move/resize →
update state. Keep calculation separate from the Cinnamon mutation step.

## Scope

- [ ] Map every action ID (BL-02) to its geometry function (BL-04..07) and to
      display movement (BL-13) and restore.
- [ ] Resolve the focused window and its active monitor work area via Muffin APIs
      (no external shell commands).
- [ ] Use BL-09 to resolve the effective placement before computing the rect.
- [ ] Apply move/resize through Muffin, then record the applied frame and update
      per-window state (BL-08), including saving the previous frame for restore.
- [ ] Implement `restore`: reapply the stored previous frame if one exists.

## Acceptance criteria

- Each action moves/resizes the focused window to the expected rect.
- The pipeline order from `AGENTS.md` is followed (calc before mutation).
- `restore` returns the window to its pre-Mintangle frame when available.
- No external shell commands are used for core behavior.

## References

- `PRODUCT.md` → all action sections, "Restore"
- `AGENTS.md` → "Separate Calculation from Side Effects", "actions.js"
  responsibility, "Prefer Cinnamon and Muffin APIs directly"
