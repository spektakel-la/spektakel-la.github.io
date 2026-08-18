import type { APIRoute } from 'astro';
import { agentResponseHeaders, createRobotsTxt } from '../utils/agentResources';

export const prerender = true;

export const GET: APIRoute = () => new Response(createRobotsTxt(), {
  headers: {
    ...agentResponseHeaders,
    'Content-Type': 'text/plain; charset=utf-8',
  },
});
