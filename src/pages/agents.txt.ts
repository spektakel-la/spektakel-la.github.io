import type { APIRoute } from 'astro';
import { createAgentsTxt } from '../utils/agentResources';

export const prerender = true;

export const GET: APIRoute = () => new Response(createAgentsTxt(), {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
  },
});
