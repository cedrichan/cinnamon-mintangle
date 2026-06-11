# BL-15: Settings UI

**Date:** 2026-06-11  
**Status:** In progress

## Goal

Provide an organized Cinnamon settings UI for Mintangle. Expanded scope: collapse
all per-category cycling flags into the single existing `enable-cycling` flag.

## Behavioral change

Remove `enable-half-cycling`, `enable-third-cycling`, `enable-fourth-cycling`,
`enable-corner-cycling`, and `enable-display-cycling`. Keep only `enable-cycling`
as the single cycling control.

- Cycling on → all position cycling works; display movement always available.
- Cycling off → all repeated presses reapply the same position; next/previous
  display still fires (not gated on the cycling flag).

## Approach

Cinnamon's XletSettings auto-generates the settings dialog from
`settings-schema.json`. No `prefs.js` is created. The `keybinding` widget type
provides capture, clear, and reset-to-default per binding.

Note: the BL-15 backlog lists `prefs.js` as the affected file, but that reflects
a GNOME Shell convention. Cinnamon's auto-generated XletSettings UI is sufficient
and more idiomatic.

## Files changed

| File | Change |
|------|--------|
| `settings-schema.json` | Remove 5 per-category keys; add section headers |
| `src/settings.ts` | Remove 5 key constants + 5 getter methods |
| `src/cycle.ts` | Remove `_isCategoryEnabled()`; simplify `cyclingActive` |
| `src/actions.ts` | Remove `enableDisplayCycling()` guard in display movement |
| `PRODUCT.md` | Update settings table to remove per-category rows |

## Schema layout

```
[header] Cycling
  enable-cycling
  repeat-timeout

[header] Shortcuts: Halves
  shortcut-left/center/right/top/bottom-half

[header] Shortcuts: Corners
  shortcut-top-left / top-right / bottom-left / bottom-right

[header] Shortcuts: Thirds & Two-Thirds
  shortcut-first/center/last-third
  shortcut-first/last-two-thirds

[header] Shortcuts: Fourths & Three-Fourths
  shortcut-first/second/third/last-fourth
  shortcut-first/last-three-fourths

[header] Shortcuts: Maximize & Center
  shortcut-maximize / almost-maximize / center / center-prominently

[header] Shortcuts: Utility
  shortcut-restore

[header] Shortcuts: Display
  shortcut-next-display / shortcut-previous-display
```

## Verification

1. `npm run build` succeeds; `build/settings-schema.json` present.
2. `npm run typecheck` passes with no references to removed methods.
3. Manual: cycling toggle off → all repeated presses reapply same position;
   next/previous display still fires.
