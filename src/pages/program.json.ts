import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { festival } from '../data/festival';
import { getArtistMacroCategory } from '../utils/categories';
import { preferWebp } from '../utils/imageVariants';
import {
  createPerformanceId,
  formatTime,
  loadSchedule,
  mergeConsecutiveSlots,
} from '../utils/schedule';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [artists, locations] = await Promise.all([
    getCollection('artists'),
    getCollection('locations'),
  ]);
  const artistMap = Object.fromEntries(artists.map((artist) => [artist.data.artist_id, artist]));
  const locationMap = Object.fromEntries(locations.map((location) => [location.data.location_id, location]));
  const events = mergeConsecutiveSlots(loadSchedule())
    .map((entry) => {
      const artist = artistMap[entry.artist_id];
      const location = locationMap[entry.location_id];
      if (!artist || artist.data.organizational || !location || location.data.organizational) return null;

      const id = createPerformanceId(entry);
      const artistImage = artist.data.images?.[0]
        ? new URL(preferWebp(artist.data.images[0]), festival.siteUrl).href
        : null;

      return {
        id,
        type: 'performance',
        url: `${festival.siteUrl}/program/#${id}`,
        festivalDay: entry.festivalDay,
        startDate: entry.startTime.toISOString(),
        endDate: entry.endTime.toISOString(),
        startTime: formatTime(entry.startTime),
        endTime: formatTime(entry.endTime),
        label: {
          de: entry.label_de || null,
          en: entry.label_en || null,
        },
        notes: entry.notes || null,
        artist: {
          id: artist.data.artist_id,
          name: artist.data.name,
          url: `${festival.siteUrl}/artists/${artist.data.artist_id}/`,
          image: artistImage,
          category: {
            de: getArtistMacroCategory(artist.data, 'de') || null,
            en: getArtistMacroCategory(artist.data, 'en') || null,
          },
          description: {
            de: artist.data.de.description,
            en: artist.data.en.description,
          },
        },
        location: {
          id: location.data.location_id,
          name: location.data.description,
          geo: {
            latitude: location.data.gps[0],
            longitude: location.data.gps[1],
          },
        },
      };
    })
    .filter(Boolean);

  return new Response(JSON.stringify({
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: `${festival.siteUrl}/program/`,
    festival: {
      name: festival.name,
      url: festival.siteUrl,
      startDate: festival.startDate,
      endDate: festival.endDate,
      locationName: festival.locationName,
      admissionPrice: festival.admissionPrice,
      currency: festival.currency,
    },
    events,
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
