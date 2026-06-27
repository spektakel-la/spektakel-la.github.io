import { readdirSync } from 'node:fs';

export interface GalleryItem {
  file: string;
  thumbnail: string;
  caption?: string;
  type: 'image' | 'youtube';
  youtubeId?: string;
}

const imageDirectory = new URL('../../public/assets/img/impressions/', import.meta.url);

const images: GalleryItem[] = readdirSync(imageDirectory)
  .filter((file) => /\.webp$/i.test(file))
  .sort((a, b) => b.localeCompare(a, 'de'))
  .map((file) => ({
    file: `/assets/img/impressions/${file}`,
    thumbnail: `/assets/img/impressions/thumbs/${file}`,
    type: 'image',
  }));

function video(id: string, caption: string, youtubeId: string): GalleryItem {
  const image = `/assets/img/impressions/videos/${id}.webp`;
  return {
    file: image,
    thumbnail: image,
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
