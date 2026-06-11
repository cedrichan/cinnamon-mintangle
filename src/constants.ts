// Mintangle — product constants.
//
// Single source of truth for action IDs, default shortcuts, cycle groups, and
// cycle sequences. All downstream modules (actions, keybindings, settings)
// import from here. Do not scatter these values across unrelated files.

// ---------------------------------------------------------------------------
// Action IDs
// ---------------------------------------------------------------------------

/** All Mintangle action identifiers. Values are kebab-case and match PRODUCT.md exactly. */
export enum ActionId {
    LEFT_HALF             = 'left-half',
    CENTER_HALF           = 'center-half',
    RIGHT_HALF            = 'right-half',
    TOP_HALF              = 'top-half',
    BOTTOM_HALF           = 'bottom-half',
    TOP_LEFT              = 'top-left',
    TOP_RIGHT             = 'top-right',
    BOTTOM_LEFT           = 'bottom-left',
    BOTTOM_RIGHT          = 'bottom-right',
    FIRST_THIRD           = 'first-third',
    CENTER_THIRD          = 'center-third',
    LAST_THIRD            = 'last-third',
    FIRST_TWO_THIRDS      = 'first-two-thirds',
    LAST_TWO_THIRDS       = 'last-two-thirds',
    FIRST_FOURTH          = 'first-fourth',
    SECOND_FOURTH         = 'second-fourth',
    THIRD_FOURTH          = 'third-fourth',
    LAST_FOURTH           = 'last-fourth',
    FIRST_THREE_FOURTHS   = 'first-three-fourths',
    LAST_THREE_FOURTHS    = 'last-three-fourths',
    MAXIMIZE              = 'maximize',
    ALMOST_MAXIMIZE       = 'almost-maximize',
    CENTER                = 'center',
    CENTER_PROMINENTLY    = 'center-prominently',
    RESTORE               = 'restore',
    NEXT_DISPLAY          = 'next-display',
    PREVIOUS_DISPLAY      = 'previous-display',
}

// ---------------------------------------------------------------------------
// Cycle groups
// ---------------------------------------------------------------------------

/**
 * Position-cycle category for an action.
 *
 * Settings expose a per-category toggle ("Enable half position cycling", etc.).
 * NONE actions do not cycle — they reapply their own placement on repeated press.
 */
export enum CycleGroup {
    HALF          = 'half',
    CORNER        = 'corner',
    THIRD         = 'third',
    TWO_THIRDS    = 'two-thirds',
    FOURTH        = 'fourth',
    THREE_FOURTHS = 'three-fourths',
    NONE          = 'none',
}

/** Maps each action to its position-cycle category. */
export const ACTION_CYCLE_GROUP: Record<ActionId, CycleGroup> = {
    [ActionId.LEFT_HALF]:           CycleGroup.HALF,
    [ActionId.CENTER_HALF]:         CycleGroup.HALF,
    [ActionId.RIGHT_HALF]:          CycleGroup.HALF,
    [ActionId.TOP_HALF]:            CycleGroup.HALF,
    [ActionId.BOTTOM_HALF]:         CycleGroup.HALF,
    [ActionId.TOP_LEFT]:            CycleGroup.CORNER,
    [ActionId.TOP_RIGHT]:           CycleGroup.CORNER,
    [ActionId.BOTTOM_LEFT]:         CycleGroup.CORNER,
    [ActionId.BOTTOM_RIGHT]:        CycleGroup.CORNER,
    [ActionId.FIRST_THIRD]:         CycleGroup.THIRD,
    [ActionId.CENTER_THIRD]:        CycleGroup.THIRD,
    [ActionId.LAST_THIRD]:          CycleGroup.THIRD,
    [ActionId.FIRST_TWO_THIRDS]:    CycleGroup.TWO_THIRDS,
    [ActionId.LAST_TWO_THIRDS]:     CycleGroup.TWO_THIRDS,
    [ActionId.FIRST_FOURTH]:        CycleGroup.FOURTH,
    [ActionId.SECOND_FOURTH]:       CycleGroup.FOURTH,
    [ActionId.THIRD_FOURTH]:        CycleGroup.FOURTH,
    [ActionId.LAST_FOURTH]:         CycleGroup.FOURTH,
    [ActionId.FIRST_THREE_FOURTHS]: CycleGroup.THREE_FOURTHS,
    [ActionId.LAST_THREE_FOURTHS]:  CycleGroup.THREE_FOURTHS,
    [ActionId.MAXIMIZE]:            CycleGroup.NONE,
    [ActionId.ALMOST_MAXIMIZE]:     CycleGroup.NONE,
    [ActionId.CENTER]:              CycleGroup.NONE,
    [ActionId.CENTER_PROMINENTLY]:  CycleGroup.NONE,
    [ActionId.RESTORE]:             CycleGroup.NONE,
    [ActionId.NEXT_DISPLAY]:        CycleGroup.NONE,
    [ActionId.PREVIOUS_DISPLAY]:    CycleGroup.NONE,
};

// ---------------------------------------------------------------------------
// Default shortcuts
// ---------------------------------------------------------------------------

/**
 * Default keyboard shortcut for each action in GDK accelerator format.
 *
 * Source of truth: "Revised Default Shortcut Table" in PRODUCT.md.
 * BL-12 (keybindings) consumes these strings for registration with Cinnamon.
 */
export const DEFAULT_SHORTCUTS: Record<ActionId, string> = {
    [ActionId.LEFT_HALF]:           '<Primary><Super>Left',
    [ActionId.RIGHT_HALF]:          '<Primary><Super>Right',
    [ActionId.TOP_HALF]:            '<Primary><Super>Up',
    [ActionId.BOTTOM_HALF]:         '<Primary><Super>Down',
    [ActionId.CENTER_HALF]:         '<Primary><Super>h',
    [ActionId.TOP_LEFT]:            '<Primary><Super>u',
    [ActionId.TOP_RIGHT]:           '<Primary><Super>i',
    [ActionId.BOTTOM_LEFT]:         '<Primary><Super>j',
    [ActionId.BOTTOM_RIGHT]:        '<Primary><Super>k',
    [ActionId.FIRST_THIRD]:         '<Primary><Super>d',
    [ActionId.CENTER_THIRD]:        '<Primary><Super>f',
    [ActionId.LAST_THIRD]:          '<Primary><Super>g',
    [ActionId.FIRST_TWO_THIRDS]:    '<Primary><Super>e',
    [ActionId.LAST_TWO_THIRDS]:     '<Primary><Super>t',
    [ActionId.FIRST_FOURTH]:        '<Primary><Super>1',
    [ActionId.SECOND_FOURTH]:       '<Primary><Super>2',
    [ActionId.THIRD_FOURTH]:        '<Primary><Super>3',
    [ActionId.LAST_FOURTH]:         '<Primary><Super>4',
    [ActionId.FIRST_THREE_FOURTHS]: '<Primary><Super>5',
    [ActionId.LAST_THREE_FOURTHS]:  '<Primary><Super>6',
    [ActionId.MAXIMIZE]:            '<Primary><Super>Return',
    [ActionId.ALMOST_MAXIMIZE]:     '<Primary><Super>m',
    [ActionId.CENTER]:              '<Primary><Super>c',
    [ActionId.CENTER_PROMINENTLY]:  '<Primary><Super>p',
    [ActionId.RESTORE]:             '<Primary><Super>BackSpace',
    [ActionId.NEXT_DISPLAY]:        '<Primary><Super><Alt>Right',
    [ActionId.PREVIOUS_DISPLAY]:    '<Primary><Super><Alt>Left',
};

// ---------------------------------------------------------------------------
// Cycle sequences
// ---------------------------------------------------------------------------

/**
 * Ordered cycle sequence for each action's repeated-press behavior.
 *
 * Source of truth: "Revised Repeated Press Cycles" in PRODUCT.md.
 *
 * Cycling actions: the array lists positions visited in order, starting with
 * the action's own placement. The sequence wraps back to index 0.
 * Non-cycling actions (CycleGroup.NONE): single-element array — the action
 * reapplies itself on repeated press.
 */
export const CYCLE_SEQUENCES: Record<ActionId, readonly ActionId[]> = {
    // Horizontal halves
    [ActionId.LEFT_HALF]:   [ActionId.LEFT_HALF,  ActionId.CENTER_HALF,  ActionId.RIGHT_HALF],
    [ActionId.CENTER_HALF]: [ActionId.CENTER_HALF, ActionId.LEFT_HALF,   ActionId.RIGHT_HALF],
    [ActionId.RIGHT_HALF]:  [ActionId.RIGHT_HALF,  ActionId.CENTER_HALF, ActionId.LEFT_HALF],

    // Vertical halves
    [ActionId.TOP_HALF]:    [ActionId.TOP_HALF,    ActionId.BOTTOM_HALF],
    [ActionId.BOTTOM_HALF]: [ActionId.BOTTOM_HALF, ActionId.TOP_HALF],

    // Corners — clockwise
    [ActionId.TOP_LEFT]:     [ActionId.TOP_LEFT,     ActionId.TOP_RIGHT,    ActionId.BOTTOM_RIGHT, ActionId.BOTTOM_LEFT],
    [ActionId.TOP_RIGHT]:    [ActionId.TOP_RIGHT,    ActionId.BOTTOM_RIGHT, ActionId.BOTTOM_LEFT,  ActionId.TOP_LEFT],
    [ActionId.BOTTOM_RIGHT]: [ActionId.BOTTOM_RIGHT, ActionId.BOTTOM_LEFT,  ActionId.TOP_LEFT,     ActionId.TOP_RIGHT],
    [ActionId.BOTTOM_LEFT]:  [ActionId.BOTTOM_LEFT,  ActionId.TOP_LEFT,     ActionId.TOP_RIGHT,    ActionId.BOTTOM_RIGHT],

    // Thirds
    [ActionId.FIRST_THIRD]:  [ActionId.FIRST_THIRD,  ActionId.CENTER_THIRD, ActionId.LAST_THIRD],
    [ActionId.CENTER_THIRD]: [ActionId.CENTER_THIRD,  ActionId.LAST_THIRD,  ActionId.FIRST_THIRD],
    [ActionId.LAST_THIRD]:   [ActionId.LAST_THIRD,    ActionId.CENTER_THIRD, ActionId.FIRST_THIRD],

    // Two-thirds
    [ActionId.FIRST_TWO_THIRDS]: [ActionId.FIRST_TWO_THIRDS, ActionId.LAST_TWO_THIRDS],
    [ActionId.LAST_TWO_THIRDS]:  [ActionId.LAST_TWO_THIRDS,  ActionId.FIRST_TWO_THIRDS],

    // Fourths
    [ActionId.FIRST_FOURTH]:  [ActionId.FIRST_FOURTH,  ActionId.SECOND_FOURTH, ActionId.THIRD_FOURTH, ActionId.LAST_FOURTH],
    [ActionId.SECOND_FOURTH]: [ActionId.SECOND_FOURTH, ActionId.THIRD_FOURTH,  ActionId.LAST_FOURTH,  ActionId.FIRST_FOURTH],
    [ActionId.THIRD_FOURTH]:  [ActionId.THIRD_FOURTH,  ActionId.LAST_FOURTH,   ActionId.FIRST_FOURTH, ActionId.SECOND_FOURTH],
    [ActionId.LAST_FOURTH]:   [ActionId.LAST_FOURTH,   ActionId.THIRD_FOURTH,  ActionId.SECOND_FOURTH, ActionId.FIRST_FOURTH],

    // Three-fourths
    [ActionId.FIRST_THREE_FOURTHS]: [ActionId.FIRST_THREE_FOURTHS, ActionId.LAST_THREE_FOURTHS],
    [ActionId.LAST_THREE_FOURTHS]:  [ActionId.LAST_THREE_FOURTHS,  ActionId.FIRST_THREE_FOURTHS],

    // Non-cycling
    [ActionId.MAXIMIZE]:           [ActionId.MAXIMIZE],
    [ActionId.ALMOST_MAXIMIZE]:    [ActionId.ALMOST_MAXIMIZE],
    [ActionId.CENTER]:             [ActionId.CENTER],
    [ActionId.CENTER_PROMINENTLY]: [ActionId.CENTER_PROMINENTLY],
    [ActionId.RESTORE]:            [ActionId.RESTORE],
    [ActionId.NEXT_DISPLAY]:       [ActionId.NEXT_DISPLAY],
    [ActionId.PREVIOUS_DISPLAY]:   [ActionId.PREVIOUS_DISPLAY],
};
