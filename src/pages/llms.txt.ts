import type { APIRoute } from 'astro';
import { createLlmsTxt } from '../utils/agentResources';

export const prerender = true;

export const GET: APIRoute = () => new Response(createLlmsTxt(), {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
  },
});
