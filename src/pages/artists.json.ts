import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { agentResponseHeaders } from '../utils/agentResources';
import { festival } from '../data/festival';
import { getArtistMacroCategory } from '../utils/categories';
import { preferWebp } from '../utils/imageVariants';

export const prerender = true;

export const GET: APIRoute = async () => {
  const artists = await getCollection('artists');
  const data = artists
    .filter((artist) => !artist.data.organizational)
    .map((artist) => ({
      id: artist.data.artist_id,
      name: artist.data.name,
      url: `${festival.siteUrl}/artists/${artist.data.artist_id}/`,
      image: artist.data.images?.[0]
        ? new URL(preferWebp(artist.data.images[0]), festival.siteUrl).href
        : null,
      categories: {
        de: artist.data.de.categories,
        en: artist.data.en.categories,
      },
      macroCategory: {
        de: getArtistMacroCategory(artist.data, 'de') || null,
        en: getArtistMacroCategory(artist.data, 'en') || null,
      },
      country: {
        de: artist.data.de.country || null,
        en: artist.data.en.country || null,
      },
      description: {
        de: artist.data.de.description,
        en: artist.data.en.description,
      },
      links: {
        homepage: artist.data.homepage || null,
        instagram: artist.data.instagram || null,
        facebook: artist.data.facebook || null,
        youtube: artist.data.youtube || null,
        vimeo: artist.data.vimeo || null,
        tiktok: artist.data.tiktok || null,
      },
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));

  return new Response(JSON.stringify({
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: `${festival.siteUrl}/artists/`,
    artists: data,
  }, null, 2), {
    headers: {
      ...agentResponseHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
