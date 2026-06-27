#!/usr/bin/env node
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const roots = process.argv.slice(2);
const checkRoots = roots.length > 0 ? roots : ['public/assets/img', 'src/assets'];
const forbiddenExtensions = new Set(['.jpg', '.jpeg', '.png']);
const offenders = [];

function extensionOf(file) {
  const index = file.lastIndexOf('.');
  return index === -1 ? '' : file.slice(index).toLowerCase();
}

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      walk(path);
      continue;
    }

    if (forbiddenExtensions.has(extensionOf(path))) {
      offenders.push(relative(process.cwd(), path));
    }
  }
}

for (const root of checkRoots) {
  try {
    if (statSync(root).isDirectory()) {
      walk(root);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

if (offenders.length > 0) {
  console.error('WebP-only check failed. Remove or convert these files:');
  for (const file of offenders.slice(0, 200)) {
    console.error(`- ${file}`);
  }
  if (offenders.length > 200) {
    console.error(`... and ${offenders.length - 200} more`);
  }
  process.exit(1);
}

console.log(`WebP-only check passed for ${checkRoots.join(', ')}.`);
