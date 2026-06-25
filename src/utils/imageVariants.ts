import { existsSync } from 'node:fs';
import { extname, join } from 'node:path';

export interface ImageVariants {
  src: string;
  webpSrc?: string;
}

const PUBLIC_DIR = join(process.cwd(), 'public');
const FALLBACK_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

function publicPathExists(src: string): boolean {
  if (!src.startsWith('/')) return false;
  return existsSync(join(PUBLIC_DIR, src));
}

function replaceExtension(src: string, extension: string): string {
  return src.slice(0, -extname(src).length) + extension;
}

export function getImageVariants(src: string): ImageVariants {
  const ext = extname(src).toLowerCase();

  if (ext === '.webp') {
    const fallback = FALLBACK_EXTENSIONS.map((candidateExt) => replaceExtension(src, candidateExt)).find(publicPathExists);
    return fallback ? { src: fallback, webpSrc: src } : { src };
  }

  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    const webpSrc = replaceExtension(src, '.webp');
    return publicPathExists(webpSrc) ? { src, webpSrc } : { src };
  }

  return { src };
}

export function preferWebp(src: string): string {
  return getImageVariants(src).webpSrc ?? src;
}
