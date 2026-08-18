import { extname } from 'node:path';

export interface ImageVariants {
  src: string;
}

function replaceExtension(src: string, extension: string): string {
  return src.slice(0, -extname(src).length) + extension;
}

export function getImageVariants(src: string): ImageVariants {
  const ext = extname(src).toLowerCase();

  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    return { src: replaceExtension(src, '.webp') };
  }

  return { src };
}

export function preferWebp(src: string): string {
  return getImageVariants(src).src;
}

export function getArtistCardImageSrc(src: string): string {
  const webpSrc = preferWebp(src);
  const artistImagePrefix = '/assets/img/artists/';

  if (!webpSrc.startsWith(artistImagePrefix) || webpSrc.includes('/2025/')) {
    return webpSrc;
  }

  return webpSrc.replace(artistImagePrefix, `${artistImagePrefix}cards/`);
}
