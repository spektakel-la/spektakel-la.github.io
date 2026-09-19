import type { CollectionEntry } from 'astro:content';
import { imagePositionToObjectPosition } from './imagePosition';
import { getArtistCardImageSrc } from './imageVariants';

export interface ArtistPreviewData {
  artistId: string;
  artistName: string;
  description: string;
  detailUrl?: string;
  imageFit: 'contain' | 'cover';
  imagePosition: string;
  imageSrc: string;
  templateId: string;
}

export function createArtistPreview(
  artist: CollectionEntry<'artists'>,
  locale: 'de' | 'en',
  basePath: string,
): ArtistPreviewData | null {
  const localizedArtistData = locale === 'en'
    ? (artist.data.en ?? artist.data.de)
    : artist.data.de;
  const description = localizedArtistData.description
    .split(/\n\s*\n/)[0]
    ?.trim() ?? '';
  const sourceImage = artist.data.images?.[0] ?? '';
  const imageSrc = sourceImage ? getArtistCardImageSrc(sourceImage) : '';

  if (!description && !imageSrc) return null;

  return {
    artistId: artist.data.artist_id,
    artistName: artist.data.name,
    description,
    detailUrl: artist.data.organizational
      ? undefined
      : `${basePath}/artists/${artist.data.artist_id}/`,
    imageFit: artist.data.organizational ? 'contain' : 'cover',
    imagePosition: imagePositionToObjectPosition(artist.data.image_position),
    imageSrc,
    templateId: `artist-preview-template-${artist.data.artist_id}`,
  };
}
