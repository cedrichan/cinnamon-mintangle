# Plan: BL-08 — Runtime per-window state

**Date:** 2026-06-10  
**Status:** Approved — in progress

## Goal

Implement `src/state.ts` — in-memory, per-window state store for repeat cycling
and restore. No persistence; cleared on extension disable.

## Data model

```typescript
export interface WindowState {
  lastActionId: ActionId | null;      // last Mintangle action applied
  lastCycleIndex: number;             // current index into CYCLE_SEQUENCES[lastActionId]
  lastTimestamp: number;              // Date.now() when last action ran
  previousFrame: Rect | null;         // frame before Mintangle first touched the window (for restore)
  lastAppliedFrame: Rect | null;      // frame Mintangle last set (lets BL-09 detect external moves)
}
```

## API — `WindowStateManager` class

| Method   | Signature                                           | Notes                                                      |
| -------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `get`    | `(windowId: number): WindowState \| null`           | Returns null for unknown windows                           |
| `update` | `(windowId: number, patch: Partial<WindowState>): WindowState` | Creates entry with defaults if missing; returns merged state |
| `register` | `(window: MetaWindow): void`                    | Connects to `unmanaged` signal; auto-prunes on window close |
| `clear`  | `(): void`                                          | Disconnects all `unmanaged` handlers, clears both maps     |

Window identity: `number` (stable sequence from `meta_window.get_stable_sequence()`).
`get`/`update` only take a number — Cinnamon objects stay out of the read/write path.

## File changes

- **`src/state.ts`** — full implementation replacing the placeholder
- **`types/cinnamon.d.ts`** — add minimal `MetaWindow` interface for BL-08's
  signal registration (`get_stable_sequence`, `connect`, `disconnect`)

## Out of scope

- Cycle resolution logic (BL-09)
- Action dispatch (BL-10)

## Acceptance criteria (from BL-08)

- [ ] No persistence to disk; state is empty after Cinnamon restart.
- [ ] Closing a window does not leak its state entry.
- [ ] Disable clears all tracked state.

## Deviations

_None yet._
