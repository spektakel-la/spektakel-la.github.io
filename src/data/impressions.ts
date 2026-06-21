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
  .filter((file) => /\.(avif|jpe?g|png|webp)$/i.test(file))
  .sort((a, b) => b.localeCompare(a, 'de'))
  .map((file) => ({
    file: `/assets/img/impressions/${file}`,
    thumbnail: `/assets/img/impressions/thumbs/${file}`,
    type: 'image',
  }));

const videos: GalleryItem[] = [
  {
    file: '/assets/img/impressions/videos/D3KfsBdXNYs.jpg',
    thumbnail: '/assets/img/impressions/videos/D3KfsBdXNYs.jpg',
    caption: 'Spektakel Landshut 2025',
    type: 'youtube',
    youtubeId: 'D3KfsBdXNYs',
  },
  {
    file: '/assets/img/impressions/videos/JLMxkFEwCkI.jpg',
    thumbnail: '/assets/img/impressions/videos/JLMxkFEwCkI.jpg',
    caption: 'Spektakel Landshut 2024',
    type: 'youtube',
    youtubeId: 'JLMxkFEwCkI',
  },
  {
    file: '/assets/img/impressions/videos/DeXdXV5E7XQ.jpg',
    thumbnail: '/assets/img/impressions/videos/DeXdXV5E7XQ.jpg',
    caption: 'Spektakel Landshut 2023',
    type: 'youtube',
    youtubeId: 'DeXdXV5E7XQ',
  },
];

export const impressions: GalleryItem[] = [...videos, ...images];
