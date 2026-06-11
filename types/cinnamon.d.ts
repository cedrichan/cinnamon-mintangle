// Minimal ambient declarations for the GJS / Cinnamon runtime.
//
// Cinnamon does not ship TypeScript types. Rather than pull in heavy GI typing
// packages, we hand-declare only what the extension actually touches and grow
// this file as later backlog items (BL-03+) consume real Muffin/Cinnamon APIs.
//
// `imports` is a GJS global, not an ES/Node module. It is referenced directly
// (e.g. `imports.gi.Meta`) and must NOT be `import`ed, so esbuild leaves it
// untouched in the bundle.

/** Parsed contents of metadata.json, passed to `init()` by Cinnamon. */
interface ExtensionMetadata {
    uuid: string;
    name: string;
    description: string;
    version: string;
    "cinnamon-version": string[];
    /** Absolute path to the installed extension directory (added by Cinnamon). */
    path?: string;
    [key: string]: unknown;
}

/**
 * The GJS legacy import namespace. Typed loosely for now; tighten per-namespace
 * (gi.Meta, ui.main, misc.extensionUtils, ...) as the extension starts calling
 * real APIs.
 */
declare const imports: {
    /** GObject-introspection bindings, e.g. imports.gi.Meta, imports.gi.Gio. */
    gi: Record<string, any>;
    /** Cinnamon UI modules, e.g. imports.ui.main. */
    ui: Record<string, any>;
    /** Cinnamon misc helpers, e.g. imports.misc.extensionUtils. */
    misc: Record<string, any>;
    [key: string]: any;
};
