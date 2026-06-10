# BL-01 — Extension scaffolding & metadata.json

- **Status:** Not started
- **Priority:** P0
- **Depends on:** —
- **Parallelizable with:** BL-02, BL-03, BL-08, BL-17, BL-18
- **Affected files:** `metadata.json`, directory layout (`src/`)

## Summary

Create the minimal Cinnamon extension skeleton so the extension can be detected,
listed, enabled, and disabled by Cinnamon. This establishes the file layout
prescribed in `AGENTS.md` and a valid `metadata.json`, without implementing any
window-management behavior yet.

## Scope

- [ ] Add `metadata.json` with `uuid`, `name`, `description`, `version`, and
      supported Cinnamon versions.
- [ ] Choose and document the extension `uuid` (used by settings + keybindings).
- [ ] Create the directory layout from `AGENTS.md` (`src/` with placeholder
      modules so other tasks can land independently).
- [ ] Add empty/placeholder `extension.js` exporting `init`, `enable`, `disable`
      that no-op safely (real wiring lands in BL-14).

## Acceptance criteria

- Extension appears in Cinnamon's extension list.
- Enable/disable does not throw.
- File layout matches the structure in `AGENTS.md`.

## References

- `AGENTS.md` → "Repository Structure"
- `AGENTS.md` → "extension.js: Cinnamon extension lifecycle"
