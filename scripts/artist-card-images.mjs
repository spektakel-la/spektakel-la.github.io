import { mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { basename, join } from 'node:path';
import sharp from 'sharp';

const sourceDir = 'public/assets/img/artists';
const targetDir = join(sourceDir, 'cards');

export async function generateArtistCardImages({ force = false, quiet = false } = {}) {
  mkdirSync(targetDir, { recursive: true });

  const sources = readdirSync(sourceDir)
    .filter((entry) => entry.endsWith('.webp'))
    .map((entry) => join(sourceDir, entry))
    .filter((path) => statSync(path).isFile());
  const sourceNames = new Set(sources.map((source) => basename(source)));
  let removed = 0;
  let generated = 0;
  let reused = 0;

  for (const entry of readdirSync(targetDir)) {
    const target = join(targetDir, entry);
    if (entry.endsWith('.webp') && !sourceNames.has(entry)) {
      unlinkSync(target);
      removed += 1;
    }
  }

  for (const source of sources) {
    const target = join(targetDir, basename(source));

    if (!force) {
      try {
        if (statSync(target).mtimeMs >= statSync(source).mtimeMs) {
          reused += 1;
          continue;
        }
      } catch {
        // Missing target; generate below.
      }
    }

    await sharp(source)
      .rotate()
      .resize({ width: 720, height: 720, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(target);
    generated += 1;
  }

  if (!quiet) {
    console.log(`Artist card images: ${generated} generated, ${reused} reused, ${removed} removed.`);
  }

  return { generated, reused, removed, total: sources.length, targetDir };
}
