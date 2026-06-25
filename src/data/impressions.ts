import { readdirSync } from 'node:fs';
import { getImageVariants } from '../utils/imageVariants';

export interface GalleryItem {
  file: string;
  thumbnail: string;
  webpFile?: string;
  webpThumbnail?: string;
  caption?: string;
  type: 'image' | 'youtube';
  youtubeId?: string;
}

const imageDirectory = new URL('../../public/assets/img/impressions/', import.meta.url);

const images: GalleryItem[] = readdirSync(imageDirectory)
  .filter((file) => /\.(avif|jpe?g|png)$/i.test(file))
  .sort((a, b) => b.localeCompare(a, 'de'))
  .map((file) => {
    const image = getImageVariants(`/assets/img/impressions/${file}`);
    const thumbnail = getImageVariants(`/assets/img/impressions/thumbs/${file}`);
    return {
      file: image.src,
      thumbnail: thumbnail.src,
      webpFile: image.webpSrc,
      webpThumbnail: thumbnail.webpSrc,
      type: 'image',
    };
  });

function video(id: string, caption: string, youtubeId: string): GalleryItem {
  const image = getImageVariants(`/assets/img/impressions/videos/${id}.jpg`);
  return {
    file: image.src,
    thumbnail: image.src,
    webpFile: image.webpSrc,
    webpThumbnail: image.webpSrc,
    caption,
    type: 'youtube',
    youtubeId,
  };
}

const videos: GalleryItem[] = [
  video('D3KfsBdXNYs', 'Spektakel Landshut 2025', 'D3KfsBdXNYs'),
  video('JLMxkFEwCkI', 'Spektakel Landshut 2024', 'JLMxkFEwCkI'),
  video('DeXdXV5E7XQ', 'Spektakel Landshut 2023', 'DeXdXV5E7XQ'),
];

export const impressions: GalleryItem[] = [...videos, ...images];
