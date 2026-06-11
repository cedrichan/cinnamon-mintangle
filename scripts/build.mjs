// Mintangle build script.
//
// Bundles the TypeScript source into a single GJS-loadable extension.js and
// copies the static extension assets into build/. The output of this script is
// exactly what gets installed into Cinnamon's extensions directory.
//
// Why an IIFE + globalName + footer:
//   Cinnamon loads extension.js through GJS's legacy `imports` module system and
//   reads `init` / `enable` / `disable` as top-level declarations on the file.
//   esbuild wraps the bundle in an IIFE, so we capture the entry's exports via
//   `globalName` and then a footer re-declares them as top-level `var`s, which
//   is what the legacy loader exposes to Cinnamon.

import { build } from 'esbuild';
import { rm, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(repoRoot, 'build');

// Static files copied verbatim into the build.
const staticAssets = ['metadata.json', 'settings-schema.json'];

// Top-level globals the legacy GJS loader hands to Cinnamon.
const lifecycleHooks = ['init', 'enable', 'disable'];

async function main() {
  // Start from a clean build directory so stale files never ship.
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  await build({
    entryPoints: [join(repoRoot, 'extension.ts')],
    outfile: join(outDir, 'extension.js'),
    bundle: true,
    // GJS is neither a browser nor Node; "neutral" stops esbuild injecting
    // platform-specific shims.
    platform: 'neutral',
    target: 'es2022',
    format: 'iife',
    globalName: '__mintangle',
    legalComments: 'none',
    footer: {
      js: lifecycleHooks.map((hook) => `var ${hook} = __mintangle.${hook};`).join('\n'),
    },
  });

  for (const asset of staticAssets) {
    await copyFile(join(repoRoot, asset), join(outDir, asset));
  }

  console.log(`Built extension into ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
