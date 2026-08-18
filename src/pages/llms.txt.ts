import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { agentResponseHeaders, createAgentLocations, createLlmsTxt } from '../utils/agentResources';

export const prerender = true;

export const GET: APIRoute = async () => {
  const locations = await getCollection('locations');
  const venueCoordinates = createAgentLocations(locations);

  return new Response(createLlmsTxt(venueCoordinates), {
    headers: {
      ...agentResponseHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
