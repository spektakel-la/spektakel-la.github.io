import { copyFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const source = join(distDir, 'sitemap-0.xml');
const target = join(distDir, 'sitemap.xml');

await stat(source);
await copyFile(source, target);

console.log('Created dist/sitemap.xml from dist/sitemap-0.xml.');
