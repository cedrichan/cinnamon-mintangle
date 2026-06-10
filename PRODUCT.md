# Mintangle PRD Updates — Position-Only Repeated Shortcut Cycling

## Decision Log Updates

The following decisions supersede earlier repeat-cycle behavior:

1. Repeated shortcuts should not cycle sizes for this iteration.
2. Repeated shortcuts should cycle positioning only.
3. Center Prominently should use 70% width and 70% height of the active monitor work area.
4. Center Half is included as a first-class v1 action.
5. Thirds, fourths, and three-fourths are orientation-aware.
6. Next Display shortcut is `Ctrl + Meta + Alt + Right`.
7. Previous Display shortcut is `Ctrl + Meta + Alt + Left`.

## Revised Repeat Behavior Principle

For this iteration, repeated shortcut presses should preserve the action’s size category and cycle only through related positions.

Examples:

* Repeating `Left Half` should cycle among half-sized positions.
* Repeating `First Third` should cycle among third-sized positions.
* Repeating `First Fourth` should cycle among fourth-sized positions.
* Repeating `Top Left` should cycle among corner positions.
* Repeating `First Three Fourths` should cycle among three-fourths positions.

Repeated shortcuts should not change from:

* Half to third
* Half to two-thirds
* Fourth to three-fourths
* Corner to half
* Maximize to almost maximize
* Center to almost maximize

Dedicated actions should be used for different size categories.

## Revised Repeated Press Cycles

### Horizontal / Vertical Half Actions

These actions cycle through half-sized placements only.

#### Left Half

Repeated `left-half` cycles:

1. Left Half
2. Center Half
3. Right Half
4. Repeat

#### Center Half

Repeated `center-half` cycles:

1. Center Half
2. Left Half
3. Right Half
4. Repeat

#### Right Half

Repeated `right-half` cycles:

1. Right Half
2. Center Half
3. Left Half
4. Repeat

#### Top Half

Repeated `top-half` cycles:

1. Top Half
2. Bottom Half
3. Repeat

#### Bottom Half

Repeated `bottom-half` cycles:

1. Bottom Half
2. Top Half
3. Repeat

### Corner Actions

These actions cycle through corner placements only.

#### Top Left

Repeated `top-left` cycles clockwise:

1. Top Left
2. Top Right
3. Bottom Right
4. Bottom Left
5. Repeat

#### Top Right

Repeated `top-right` cycles clockwise:

1. Top Right
2. Bottom Right
3. Bottom Left
4. Top Left
5. Repeat

#### Bottom Right

Repeated `bottom-right` cycles clockwise:

1. Bottom Right
2. Bottom Left
3. Top Left
4. Top Right
5. Repeat

#### Bottom Left

Repeated `bottom-left` cycles clockwise:

1. Bottom Left
2. Top Left
3. Top Right
4. Bottom Right
5. Repeat

### Third Actions

These actions cycle through third-sized placements only.

On landscape monitors:

* First Third = left third
* Center Third = center third
* Last Third = right third

On portrait monitors:

* First Third = top third
* Center Third = center third
* Last Third = bottom third

#### First Third

Repeated `first-third` cycles:

1. First Third
2. Center Third
3. Last Third
4. Repeat

#### Center Third

Repeated `center-third` cycles:

1. Center Third
2. Last Third
3. First Third
4. Repeat

#### Last Third

Repeated `last-third` cycles:

1. Last Third
2. Center Third
3. First Third
4. Repeat

### Two-Thirds Actions

These actions cycle through two-thirds-sized placements only.

#### First Two Thirds

Repeated `first-two-thirds` cycles:

1. First Two Thirds
2. Last Two Thirds
3. Repeat

#### Last Two Thirds

Repeated `last-two-thirds` cycles:

1. Last Two Thirds
2. First Two Thirds
3. Repeat

### Fourth Actions

These actions cycle through fourth-sized placements only.

On landscape monitors:

* First Fourth = leftmost fourth
* Second Fourth = second fourth from the left
* Third Fourth = third fourth from the left
* Last Fourth = rightmost fourth

On portrait monitors:

* First Fourth = top fourth
* Second Fourth = second fourth from the top
* Third Fourth = third fourth from the top
* Last Fourth = bottom fourth

#### First Fourth

Repeated `first-fourth` cycles:

1. First Fourth
2. Second Fourth
3. Third Fourth
4. Last Fourth
5. Repeat

#### Second Fourth

Repeated `second-fourth` cycles:

1. Second Fourth
2. Third Fourth
3. Last Fourth
4. First Fourth
5. Repeat

#### Third Fourth

Repeated `third-fourth` cycles:

1. Third Fourth
2. Last Fourth
3. First Fourth
4. Second Fourth
5. Repeat

#### Last Fourth

Repeated `last-fourth` cycles:

1. Last Fourth
2. Third Fourth
3. Second Fourth
4. First Fourth
5. Repeat

### Three-Fourths Actions

These actions cycle through three-fourths-sized placements only.

#### First Three Fourths

Repeated `first-three-fourths` cycles:

1. First Three Fourths
2. Last Three Fourths
3. Repeat

#### Last Three Fourths

Repeated `last-three-fourths` cycles:

1. Last Three Fourths
2. First Three Fourths
3. Repeat

### Maximize and Center Actions

For this iteration, maximize and center actions do not cycle sizes.

#### Maximize

Repeated `maximize` should reapply Maximize only.

#### Almost Maximize

Repeated `almost-maximize` should reapply Almost Maximize only.

#### Center

Repeated `center` should reapply Center only.

#### Center Prominently

Repeated `center-prominently` should reapply Center Prominently only.

#### Restore

Repeated `restore` should reapply Restore only if a stored frame exists.

### Display Actions

Display movement remains explicit and does not depend on repeated left/right half shortcuts.

#### Next Display

Repeated `next-display` should move to the next display each time.

Default shortcut:

```text id="8b6nf6"
Ctrl + Meta + Alt + Right
```

#### Previous Display

Repeated `previous-display` should move to the previous display each time.

Default shortcut:

```text id="k1d1xk"
Ctrl + Meta + Alt + Left
```

## Center Prominently Geometry

`center-prominently` should resize and center the focused window to:

```text id="kqeuhh"
width = 70% of active monitor work-area width
height = 70% of active monitor work-area height
```

Margins should still be respected.

If margins are enabled, the 70% size should be calculated from the margin-adjusted available work area.

## Revised Default Shortcut Table

All shortcuts use `Ctrl + Meta`, except display movement, which also uses `Alt`.

| Action              | Default Shortcut          |
| ------------------- | ------------------------- |
| Left Half           | Ctrl + Meta + Left        |
| Right Half          | Ctrl + Meta + Right       |
| Top Half            | Ctrl + Meta + Up          |
| Bottom Half         | Ctrl + Meta + Down        |
| Center Half         | Ctrl + Meta + H           |
| Top Left            | Ctrl + Meta + U           |
| Top Right           | Ctrl + Meta + I           |
| Bottom Left         | Ctrl + Meta + J           |
| Bottom Right        | Ctrl + Meta + K           |
| First Third         | Ctrl + Meta + D           |
| Center Third        | Ctrl + Meta + F           |
| Last Third          | Ctrl + Meta + G           |
| First Two Thirds    | Ctrl + Meta + E           |
| Last Two Thirds     | Ctrl + Meta + T           |
| First Fourth        | Ctrl + Meta + 1           |
| Second Fourth       | Ctrl + Meta + 2           |
| Third Fourth        | Ctrl + Meta + 3           |
| Last Fourth         | Ctrl + Meta + 4           |
| First Three Fourths | Ctrl + Meta + 5           |
| Last Three Fourths  | Ctrl + Meta + 6           |
| Maximize            | Ctrl + Meta + Enter       |
| Almost Maximize     | Ctrl + Meta + M           |
| Center              | Ctrl + Meta + C           |
| Center Prominently  | Ctrl + Meta + P           |
| Restore             | Ctrl + Meta + Backspace   |
| Next Display        | Ctrl + Meta + Alt + Right |
| Previous Display    | Ctrl + Meta + Alt + Left  |

## Settings Changes

Remove or defer settings that imply size cycling.

Do not include these v1 settings:

* Half cycle mode
* Enable half-size cycling
* Allow left/right to cycle displays

Keep these settings:

| Setting                         |       Type | Default |
| ------------------------------- | ---------: | ------: |
| Enable repeated command cycling |    boolean |    true |
| Repeat timeout                  | integer ms |    1500 |
| Enable half position cycling    |    boolean |    true |
| Enable third position cycling   |    boolean |    true |
| Enable fourth position cycling  |    boolean |    true |
| Enable corner position cycling  |    boolean |    true |
| Enable display cycling          |    boolean |    true |

If a position-cycling category is disabled, repeated shortcuts should reapply the first/default placement for that action.

## Acceptance Test Updates

Replace earlier size-cycling tests with the following:

1. Repeating `Left Half` cycles Left Half, Center Half, Right Half.
2. Repeating `Right Half` cycles Right Half, Center Half, Left Half.
3. Repeating `Top Half` cycles Top Half, Bottom Half.
4. Repeating `Bottom Half` cycles Bottom Half, Top Half.
5. Repeating `Top Left` cycles clockwise through the four corners.
6. Repeating `Bottom Right` cycles clockwise through the four corners.
7. Repeating `First Third` cycles First Third, Center Third, Last Third.
8. Repeating `Center Third` cycles Center Third, Last Third, First Third.
9. Repeating `First Two Thirds` alternates First Two Thirds and Last Two Thirds.
10. Repeating `First Fourth` cycles First, Second, Third, Last Fourth.
11. Repeating `Second Fourth` cycles Second, Third, Last, First Fourth.
12. Repeating `First Three Fourths` alternates First Three Fourths and Last Three Fourths.
13. Repeating `Maximize` does not resize to Almost Maximize.
14. Repeating `Almost Maximize` does not resize to Maximize.
15. Repeating `Center` does not resize the window.
16. `Center Prominently` resizes to 70% width and 70% height.
17. `Ctrl + Meta + Alt + Right` moves the focused window to the next display.
18. `Ctrl + Meta + Alt + Left` moves the focused window to the previous display.
19. Repeating `Ctrl + Meta + Left` does not move the window to another display.
20. Repeating shortcuts should not change size category.
