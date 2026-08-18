import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  agentResponseHeaders,
  createAgentLocations,
  createAgentsJson,
} from '../utils/agentResources';

export const prerender = true;

export const GET: APIRoute = async () => {
  const locations = await getCollection('locations');

  return new Response(JSON.stringify(createAgentsJson(createAgentLocations(locations)), null, 2), {
    headers: {
      ...agentResponseHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
