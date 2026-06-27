#!/usr/bin/env node
import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const roots = [];
let dryRun = false;

for (const arg of args) {
  if (arg === '--dry-run' || arg === '-n') {
    dryRun = true;
  } else if (arg === '--help' || arg === '-h') {
    console.log(`Usage: scripts/clean-webp-duplicates.mjs [--dry-run] [path ...]

Deletes .jpg, .jpeg, and .png files only when a same-directory .webp file
with the same basename exists.

Default paths:
  public/assets/img
  src/assets`);
    process.exit(0);
  } else {
    roots.push(arg);
  }
}

const cleanupRoots = roots.length > 0 ? roots : ['public/assets/img', 'src/assets'];
const sourceExtensions = new Set(['.jpg', '.jpeg', '.png']);
const candidates = [];

function extensionOf(file) {
  const index = file.lastIndexOf('.');
  return index === -1 ? '' : file.slice(index).toLowerCase();
}

function basenameWithoutExtension(file) {
  const index = file.lastIndexOf('.');
  return index === -1 ? file : file.slice(0, index);
}

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      walk(path);
      continue;
    }

    if (!sourceExtensions.has(extensionOf(path))) continue;

    const webp = `${basenameWithoutExtension(path)}.webp`;
    if (existsSync(webp)) {
      candidates.push(path);
    }
  }
}

for (const root of cleanupRoots) {
  try {
    if (statSync(root).isDirectory()) {
      walk(root);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

let bytes = 0;
for (const file of candidates) {
  bytes += statSync(file).size;
  const displayPath = relative(process.cwd(), file);
  if (dryRun) {
    console.log(`would remove: ${displayPath}`);
  } else {
    unlinkSync(file);
    console.log(`removed: ${displayPath}`);
  }
}

const mb = (bytes / 1024 / 1024).toFixed(1);
const action = dryRun ? 'Would remove' : 'Removed';
console.log(`${action} ${candidates.length} duplicate file(s), ${mb} MB.`);
