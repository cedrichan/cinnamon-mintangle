# BL-11 — Settings loading, validation & schema

- **Status:** Not started
- **Priority:** P1
- **Depends on:** BL-02
- **Parallelizable with:** BL-09, BL-10, BL-12
- **Affected files:** `settings-schema.json`, `src/settings.js`

## Summary

Define the settings schema and a loader that validates values, supplies defaults,
and notifies listeners on change. Only the v1 settings from `PRODUCT.md` are
included; deferred size-cycling settings are explicitly excluded.

## Scope

- [ ] `settings-schema.json` with the kept v1 settings:
      Enable repeated command cycling (bool, true),
      Repeat timeout (int ms, 1500),
      Enable half / third / fourth / corner position cycling (bool, true each),
      Enable display cycling (bool, true), plus per-action shortcut bindings.
- [ ] Do NOT include deferred settings: Half cycle mode, Enable half-size
      cycling, Allow left/right to cycle displays.
- [ ] `src/settings.js`: load with defaults, validate/coerce ranges (e.g. timeout),
      expose typed getters, and register/unregister change listeners (no polling).
- [ ] Surface default shortcuts from BL-02 as the schema defaults.

## Acceptance criteria

- Settings load with correct defaults on first run.
- Out-of-range / invalid values are coerced or fall back to defaults safely.
- Changing a setting fires listeners; listeners are removed on disable.
- No deferred size-cycling settings appear in the schema.

## References

- `PRODUCT.md` → "Settings Changes" (kept vs deferred settings table)
- `AGENTS.md` → "settings.js" responsibility, "Do Not Poll",
  "Settings Should Be User-Recoverable"
