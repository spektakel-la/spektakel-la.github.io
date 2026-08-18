import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { agentResponseHeaders } from '../utils/agentResources';
import { festival } from '../data/festival';

export const prerender = true;

export const GET: APIRoute = async () => {
  const locations = await getCollection('locations');
  const data = locations
    .filter((location) => !location.data.organizational)
    .map((location) => ({
      id: location.data.location_id,
      label: location.data.location_label || location.data.location_id,
      name: location.data.description,
      sortOrder: location.data.sort_order,
      url: `${festival.siteUrl}/locations/#venue-${location.data.location_id}`,
      geo: {
        latitude: location.data.gps[0],
        longitude: location.data.gps[1],
      },
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return new Response(JSON.stringify({
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: `${festival.siteUrl}/locations/`,
    locations: data,
  }, null, 2), {
    headers: {
      ...agentResponseHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
