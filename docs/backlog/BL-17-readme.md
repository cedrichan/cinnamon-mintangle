# BL-17 — README user documentation

- **Status:** Not started
- **Priority:** P2
- **Depends on:** —
- **Parallelizable with:** BL-15, BL-16, BL-18
- **Affected files:** `README.md`

## Summary

Write the user-facing README: what Mintangle does, how to install it on Linux
Mint Cinnamon, the full default shortcut table, and how repeated-shortcut position
cycling behaves. Keep it user-facing only — product spec stays in `PRODUCT.md`,
agent/dev notes stay in `AGENTS.md`.

## Scope

- [ ] Overview: Rectangle.app-style keyboard window management for Cinnamon.
- [ ] Installation / enable instructions for Linux Mint Cinnamon.
- [ ] Full default shortcut table (mirroring `PRODUCT.md`).
- [ ] Explain position-only repeat cycling per category (halves, corners, thirds,
      fourths, three-fourths) and that sizes do not cycle.
- [ ] Document settings users can change (toggles, repeat timeout).
- [ ] Keep it in sync with behavior changes (update alongside code).

## Acceptance criteria

- README is user-facing and does not duplicate the full product spec.
- Shortcut table matches `PRODUCT.md` exactly.
- Repeat-cycling explanation matches actual behavior.

## References

- `PRODUCT.md` → "Revised Default Shortcut Table", repeat-cycle behavior
- `AGENTS.md` → "Documentation" (README user-facing; update with behavior changes)
