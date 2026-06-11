// Mintangle — Cinnamon extension lifecycle entrypoint.
//
// Cinnamon calls, in order:
//   init(metadata) — once when the extension is loaded.
//   enable()       — when the extension is turned on.
//   disable()      — when the extension is turned off.
//
// These functions are `export`ed so the esbuild bundle can re-expose them as
// top-level `var init/enable/disable` in build/extension.js, which is how GJS's
// legacy module loader hands the lifecycle hooks to Cinnamon. See
// scripts/build.mjs and README.md.

import { dispatchAction } from './src/actions';
import { KeybindingManager } from './src/keybindings';
import { MintangleSettings } from './src/settings';
import { WindowStateManager } from './src/state';

let extensionMeta: ExtensionMetadata | null = null;

let _settings: MintangleSettings | null = null;
let _stateManager: WindowStateManager | null = null;
let _keybindingManager: KeybindingManager | null = null;
let _enabled = false;

export function init(metadata: ExtensionMetadata): void {
  extensionMeta = metadata;
}

export function enable(): void {
  if (_enabled) return;

  const uuid = extensionMeta?.uuid ?? '';
  _settings = new MintangleSettings({}, uuid);
  _stateManager = new WindowStateManager();

  const dispatch = (actionId: Parameters<typeof dispatchAction>[0]) =>
    dispatchAction(actionId, _stateManager!, _settings!);

  _keybindingManager = new KeybindingManager(_settings, dispatch);
  _keybindingManager.enable();

  _enabled = true;
}

export function disable(): void {
  if (!_enabled) return;

  _keybindingManager!.destroy();
  _stateManager!.clear();
  _settings!.destroy();

  _keybindingManager = null;
  _stateManager = null;
  _settings = null;

  _enabled = false;
}
