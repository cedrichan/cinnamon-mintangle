# Mintangle Manual Test Plan

This checklist covers every acceptance test and lifecycle check required before
considering a behavior change complete. Run through the applicable sections on a
Linux Mint Cinnamon machine and record results in the build log below.

**How to use:**
1. Build the extension (`npm run build`).
2. Install/reload the extension in Cinnamon.
3. Work through each section, checking off items that pass.
4. Add a row to the build log with the date, git hash, and overall result.
5. Any failing item blocks the change from being considered complete.

---

## Build Log

| Date | Git Hash | Tester | Result | Notes |
|------|----------|--------|--------|-------|
|      |          |        |        |       |

---

## A — Extension Lifecycle

- [ ] **Enable:** Extension loads without error (no Cinnamon notifications or Looking Glass errors).
- [ ] **Settings page opens:** Opening extension preferences does not crash.
- [ ] **Default shortcuts register:** All shortcuts from the default shortcut table are active immediately after enabling.
- [ ] **Disable:** Extension unloads cleanly; all registered keybindings are removed (shortcuts no longer fire after disable).

---

## B — Settings UI

- [ ] **Shortcut capture:** Clicking a shortcut field and pressing a key combination captures and saves the new shortcut.
- [ ] **Shortcut clear:** Clearing a shortcut field removes the binding; the action no longer fires.
- [ ] **Shortcut reset:** Resetting a shortcut restores the default binding.
- [ ] **Settings persistence:** Shortcut and margin changes persist after closing and reopening preferences, and after a Cinnamon restart.

---

## C — Core Layout Behavior

These are the 20 acceptance tests from `PRODUCT.md`.

### C.1 — Half cycling

- [ ] **Test 1:** Repeating `Left Half` (`Ctrl+Meta+Left`) cycles: Left Half → Center Half → Right Half → repeat.
- [ ] **Test 2:** Repeating `Right Half` (`Ctrl+Meta+Right`) cycles: Right Half → Center Half → Left Half → repeat.
- [ ] **Test 3:** Repeating `Top Half` (`Ctrl+Meta+Up`) cycles: Top Half → Bottom Half → repeat.
- [ ] **Test 4:** Repeating `Bottom Half` (`Ctrl+Meta+Down`) cycles: Bottom Half → Top Half → repeat.

### C.2 — Corner cycling

- [ ] **Test 5:** Repeating `Top Left` (`Ctrl+Meta+U`) cycles clockwise through all four corners: Top Left → Top Right → Bottom Right → Bottom Left → repeat.
- [ ] **Test 6:** Repeating `Bottom Right` (`Ctrl+Meta+K`) cycles clockwise through all four corners: Bottom Right → Bottom Left → Top Left → Top Right → repeat.

### C.3 — Third cycling

- [ ] **Test 7:** Repeating `First Third` (`Ctrl+Meta+D`) cycles: First Third → Center Third → Last Third → repeat.
- [ ] **Test 8:** Repeating `Center Third` (`Ctrl+Meta+F`) cycles: Center Third → Last Third → First Third → repeat.

### C.4 — Two-thirds cycling

- [ ] **Test 9:** Repeating `First Two Thirds` (`Ctrl+Meta+E`) alternates: First Two Thirds → Last Two Thirds → repeat.

### C.5 — Fourth cycling

- [ ] **Test 10:** Repeating `First Fourth` (`Ctrl+Meta+1`) cycles: First → Second → Third → Last Fourth → repeat.
- [ ] **Test 11:** Repeating `Second Fourth` (`Ctrl+Meta+2`) cycles: Second → Third → Last → First Fourth → repeat.

### C.6 — Three-fourths cycling

- [ ] **Test 12:** Repeating `First Three Fourths` (`Ctrl+Meta+5`) alternates: First Three Fourths → Last Three Fourths → repeat.

### C.7 — Maximize and center do not cross size categories

- [ ] **Test 13:** Repeating `Maximize` (`Ctrl+Meta+Enter`) does not resize to Almost Maximize.
- [ ] **Test 14:** Repeating `Almost Maximize` (`Ctrl+Meta+M`) does not resize to Maximize.
- [ ] **Test 15:** Repeating `Center` (`Ctrl+Meta+C`) does not resize the window.

### C.8 — Center Prominently geometry

- [ ] **Test 16:** `Center Prominently` (`Ctrl+Meta+P`) resizes the window to 70% of the work-area width and 70% of the work-area height, centered.

### C.9 — Display movement

- [ ] **Test 17:** `Ctrl+Meta+Alt+Right` moves the focused window to the next display.
- [ ] **Test 18:** `Ctrl+Meta+Alt+Left` moves the focused window to the previous display.

### C.10 — Repeat does not move display or change size category

- [ ] **Test 19:** Repeating `Ctrl+Meta+Left` (Left Half) does not move the window to another display.
- [ ] **Test 20:** Repeating any layout shortcut does not change the window's size category (e.g., half stays half, third stays third).

---

## D — Orientation-Aware Layouts

These checks apply to monitors in portrait orientation (height > width). Skip if
only landscape monitors are available.

### D.1 — Thirds (portrait)

- [ ] `First Third` places the window in the **top** third of the work area.
- [ ] `Center Third` places the window in the **center** third.
- [ ] `Last Third` places the window in the **bottom** third.

### D.2 — Fourths (portrait)

- [ ] `First Fourth` places the window in the **top** fourth.
- [ ] `Second Fourth` places the window in the second-from-top fourth.
- [ ] `Third Fourth` places the window in the third-from-top fourth.
- [ ] `Last Fourth` places the window in the **bottom** fourth.

### D.3 — Thirds and fourths (landscape, for reference)

- [ ] `First Third` places the window in the **left** third.
- [ ] `Last Third` places the window in the **right** third.
- [ ] `First Fourth` places the window in the **leftmost** fourth.
- [ ] `Last Fourth` places the window in the **rightmost** fourth.

---

## E — Margins

- [ ] **Consistent application:** Margins are applied uniformly to all layout actions (halves, corners, thirds, fourths, maximize, center).
- [ ] **Center Prominently with margins:** When margins are enabled, the 70% size is calculated from the margin-adjusted available work area.
- [ ] **No margin on maximize:** If the margin setting is 0, Maximize fills the full work area.
- [ ] **Margin setting change:** Changing the margin value in preferences takes effect on the next shortcut press without requiring an extension reload.

---

## F — Edge Cases

- [ ] **Restore:** `Ctrl+Meta+Backspace` restores the window to its position before Mintangle moved it. Repeating restore when no stored frame exists does not crash.
- [ ] **Non-resizable window:** Pressing any layout shortcut on a non-resizable window (e.g., a fixed-size dialog) does not crash the extension.
- [ ] **Unsupported window type:** Pressing a shortcut when no window is focused, or when a desktop/dock window is focused, does not crash the extension.
- [ ] **No focused window:** Pressing a shortcut with no window focused does not crash the extension.
- [ ] **Single monitor:** All shortcuts work correctly on a single-monitor setup. Next/previous display actions are no-ops or fail silently.

---

## G — Pre-Completion Checklist (from AGENTS.md)

Run this checklist before marking any behavior change complete:

- [ ] Implementation still matches `PRODUCT.md`.
- [ ] Plan file has been followed to completion.
- [ ] Default shortcuts and action IDs are consistent.
- [ ] Enable/disable cleans up registered keybindings.
- [ ] Extension fails safely (no crashes on bad input or missing resources).
- [ ] Settings are persisted correctly.
- [ ] User-facing documentation is updated if behavior changed.
- [ ] A manual test note exists for the changed behavior.
