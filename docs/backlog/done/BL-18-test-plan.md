# BL-18 — Manual test plan / acceptance checklist

- **Status:** Not started
- **Priority:** P2
- **Depends on:** —
- **Parallelizable with:** BL-15, BL-16, BL-17
- **Affected files:** `docs/test-plan.md` (new)

## Summary

Capture the manual verification checklist for Linux Mint Cinnamon, encoding the
20 acceptance tests from `PRODUCT.md` plus the lifecycle/settings checks from
`AGENTS.md`. This is the gate used before considering behavior changes complete.

## Scope

- [ ] Transcribe the 20 acceptance tests from `PRODUCT.md` as a checklist
      (half/corner/third/fourth cycling, no size-category change, center
      prominently 70%, next/previous display, left-half does not change display).
- [ ] Add `AGENTS.md` manual checks: enable/disable, settings page opens, default
      shortcuts register, capture/reset works, margins apply consistently, restore
      works, non-resizable windows do not crash.
- [ ] Note expectations for landscape vs portrait orientation-aware placements.
- [ ] Provide a place to record pass/fail per build.

## Acceptance criteria

- Every `PRODUCT.md` acceptance test (1–20) is represented.
- Every `AGENTS.md` "Testing and Verification" item is represented.
- Checklist is runnable by hand on a Cinnamon machine without ambiguity.

## References

- `PRODUCT.md` → "Acceptance Test Updates" (tests 1–20)
- `AGENTS.md` → "Testing and Verification", "Before Completing a Change"
