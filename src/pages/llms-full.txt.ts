import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { festival } from '../data/festival';
import {
  agentResponseHeaders,
  createAgentLocations,
  createLlmsFullTxt,
  type AgentPerformance,
} from '../utils/agentResources';
import { createPerformanceId, loadSchedule, mergeConsecutiveSlots } from '../utils/schedule';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [artists, locations] = await Promise.all([
    getCollection('artists'),
    getCollection('locations'),
  ]);
  const agentLocations = createAgentLocations(locations);
  const artistMap = Object.fromEntries(artists.map((artist) => [artist.data.artist_id, artist]));
  const locationMap = Object.fromEntries(locations.map((location) => [location.data.location_id, location]));
  const performances: AgentPerformance[] = mergeConsecutiveSlots(loadSchedule())
    .map((entry) => {
      const artist = artistMap[entry.artist_id];
      const location = locationMap[entry.location_id];
      if (!artist || artist.data.organizational || !location || location.data.organizational) return null;

      const eventId = createPerformanceId(entry);
      return {
        id: eventId,
        startDate: entry.startTime.toISOString(),
        endDate: entry.endTime.toISOString(),
        artistName: artist.data.name,
        locationName: location.data.description,
        latitude: location.data.gps[0],
        longitude: location.data.gps[1],
        url: `${festival.siteUrl}/program/#${eventId}`,
      } satisfies AgentPerformance;
    })
    .filter((performance): performance is AgentPerformance => performance !== null);

  return new Response(createLlmsFullTxt(agentLocations, performances), {
    headers: {
      ...agentResponseHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
