# BL-02 — Product constants module

- **Status:** Not started
- **Priority:** P0
- **Depends on:** —
- **Parallelizable with:** BL-01, BL-03, BL-08
- **Affected files:** `src/constants.js` (new central module)

## Summary

Centralize all product constants in one module so action IDs, default shortcuts,
and repeat-cycle ordering are defined exactly once. `AGENTS.md` requires product
constants to be centralized and not scattered across files. Every downstream task
(actions, keybindings, settings, prefs) imports from here.

## Scope

- [ ] Define the full action ID list exactly as in `PRODUCT.md` (kebab-case),
      e.g. `left-half`, `center-half`, `right-half`, `top-half`, `bottom-half`,
      `top-left`, `top-right`, `bottom-left`, `bottom-right`, `first-third`,
      `center-third`, `last-third`, `first-two-thirds`, `last-two-thirds`,
      `first-fourth`, `second-fourth`, `third-fourth`, `last-fourth`,
      `first-three-fourths`, `last-three-fourths`, `maximize`, `almost-maximize`,
      `center`, `center-prominently`, `restore`, `next-display`,
      `previous-display`.
- [ ] Define the default shortcut for each action from the "Revised Default
      Shortcut Table".
- [ ] Define repeat-cycle ordering tables for each cycling action (position-only)
      from "Revised Repeated Press Cycles".
- [ ] Tag each action with its position-cycle category (half / corner / third /
      two-thirds / fourth / three-fourths / none) so cycling can be toggled by
      settings category.

## Acceptance criteria

- All action IDs match `PRODUCT.md` exactly (no renames).
- Default shortcuts match the table exactly.
- Cycle tables reproduce the ordering in `PRODUCT.md` verbatim.

## References

- `PRODUCT.md` → "Revised Repeated Press Cycles", "Revised Default Shortcut Table"
- `AGENTS.md` → "Action IDs", "Keep product constants centralized"
