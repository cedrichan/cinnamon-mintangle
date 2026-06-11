# Plan: BL-02 — Product Constants Module

**Date:** 2026-06-10  
**Backlog item:** BL-02

## Goal

Create `src/constants.ts` as the single source of truth for action IDs, default shortcuts, cycle groups, and cycle sequences. Every downstream task (actions, keybindings, settings) imports from here.

## Approach

Create one new file: `src/constants.ts`.

No existing files need modification for this task — all source files are stubs.

## Implementation Steps

### 1. `ActionId` enum

String enum with SCREAMING_SNAKE_CASE keys and kebab-case values that match `PRODUCT.md` exactly:

```
LEFT_HALF = 'left-half', CENTER_HALF = 'center-half', RIGHT_HALF = 'right-half',
TOP_HALF = 'top-half', BOTTOM_HALF = 'bottom-half',
TOP_LEFT = 'top-left', TOP_RIGHT = 'top-right', BOTTOM_LEFT = 'bottom-left', BOTTOM_RIGHT = 'bottom-right',
FIRST_THIRD = 'first-third', CENTER_THIRD = 'center-third', LAST_THIRD = 'last-third',
FIRST_TWO_THIRDS = 'first-two-thirds', LAST_TWO_THIRDS = 'last-two-thirds',
FIRST_FOURTH = 'first-fourth', SECOND_FOURTH = 'second-fourth', THIRD_FOURTH = 'third-fourth', LAST_FOURTH = 'last-fourth',
FIRST_THREE_FOURTHS = 'first-three-fourths', LAST_THREE_FOURTHS = 'last-three-fourths',
MAXIMIZE = 'maximize', ALMOST_MAXIMIZE = 'almost-maximize',
CENTER = 'center', CENTER_PROMINENTLY = 'center-prominently',
RESTORE = 'restore', NEXT_DISPLAY = 'next-display', PREVIOUS_DISPLAY = 'previous-display'
```

### 2. `CycleGroup` enum

String enum categorizing each action for cycling toggling (see PRODUCT.md settings):

```
HALF = 'half', CORNER = 'corner', THIRD = 'third', TWO_THIRDS = 'two-thirds',
FOURTH = 'fourth', THREE_FOURTHS = 'three-fourths', NONE = 'none'
```

### 3. `ACTION_CYCLE_GROUP`

`Record<ActionId, CycleGroup>` mapping every action to its group.

- HALF: LEFT_HALF, CENTER_HALF, RIGHT_HALF, TOP_HALF, BOTTOM_HALF
- CORNER: TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT
- THIRD: FIRST_THIRD, CENTER_THIRD, LAST_THIRD
- TWO_THIRDS: FIRST_TWO_THIRDS, LAST_TWO_THIRDS
- FOURTH: FIRST_FOURTH, SECOND_FOURTH, THIRD_FOURTH, LAST_FOURTH
- THREE_FOURTHS: FIRST_THREE_FOURTHS, LAST_THREE_FOURTHS
- NONE: MAXIMIZE, ALMOST_MAXIMIZE, CENTER, CENTER_PROMINENTLY, RESTORE, NEXT_DISPLAY, PREVIOUS_DISPLAY

### 4. `DEFAULT_SHORTCUTS`

`Record<ActionId, string>` using GDK accelerator format (`<Primary><Super>Left`, etc.) matching the PRODUCT.md table.

### 5. `CYCLE_SEQUENCES`

`Record<ActionId, readonly ActionId[]>` — the ordered cycle for each action per PRODUCT.md "Revised Repeated Press Cycles". Non-cycling actions (group NONE) have a single-element array `[actionId]`.

## Verification

Run `npm run build` (or `npm run typecheck` if available) to confirm no TypeScript errors.

## Deviations from BL-02 spec

The backlog references `src/constants.js` (pre-TypeScript naming). The project was converted to TypeScript in the most recent commit, so the file is `src/constants.ts`.

## Status

- [x] Plan written
- [x] `src/constants.ts` created
- [x] Build verified (manual cross-check; node not available in background session)
- [x] BL-02 archived to docs/backlog/done/
