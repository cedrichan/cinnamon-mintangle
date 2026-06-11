# Plan: BL-09 — Repeat-Cycle Resolution

**Date:** 2026-06-10
**Backlog item:** BL-09-repeat-cycle.md
**Status:** In progress

## Goal

Implement `resolveCycle` — a pure function that, given an action ID, per-window
state, settings, and the current timestamp, returns which action to apply and
what state to write back.

## Approach

New file: `src/cycle.ts`. No Cinnamon dependencies; fully testable in isolation.

### Interface

```typescript
interface CycleResult {
  effectiveAction: ActionId;
  nextCycleIndex: number;
  nextTimestamp: number;
}

function resolveCycle(
  actionId: ActionId,
  state: WindowState | null,
  settings: MintangleSettings,
  now: number
): CycleResult
```

### Logic

1. Look up `CYCLE_SEQUENCES[actionId]` and `ACTION_CYCLE_GROUP[actionId]`.
2. A press is a **repeat** if:
   - `state.lastActionId === actionId` AND
   - `(now - state.lastTimestamp) <= settings.repeatTimeout()`
3. Cycling is **active** if:
   - `settings.enableCycling()` AND
   - the group's per-category toggle is enabled (see table below)
4. If cycling is active AND this is a repeat:
   `nextIndex = (state.lastCycleIndex + 1) % sequence.length`
5. Otherwise: `nextIndex = 0`
6. Return `{ effectiveAction: sequence[nextIndex], nextCycleIndex: nextIndex, nextTimestamp: now }`

### Per-category toggle lookup

| CycleGroup                  | Setting method           |
|-----------------------------|--------------------------|
| HALF                        | `enableHalfCycling()`    |
| CORNER                      | `enableCornerCycling()`  |
| THIRD, TWO_THIRDS           | `enableThirdCycling()`   |
| FOURTH, THREE_FOURTHS       | `enableFourthCycling()`  |
| NONE                        | n/a (single-element seq) |

Note: `enableDisplayCycling()` is retained in the settings schema per PRODUCT.md
but has no CycleGroup mapping in v1 (display actions are NONE). It will be wired
when display cycling behavior is specified.

## Files changed

- `src/cycle.ts` — new, contains `CycleResult` and `resolveCycle`
- `src/actions.ts` — updated comment referencing cycle.ts
- `docs/plans/2026-06-10-bl-09-repeat-cycle.md` — this file
- `docs/backlog/done/BL-09-repeat-cycle.md` — archived on completion

## Checklist

- [x] Plan saved
- [x] `src/cycle.ts` implemented
- [x] `src/actions.ts` updated
- [x] TypeScript compiles clean
- [x] Backlog item archived
