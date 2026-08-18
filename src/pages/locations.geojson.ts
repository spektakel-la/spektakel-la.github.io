import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { festival } from '../data/festival';

export const prerender = true;

export const GET: APIRoute = async () => {
  const locations = await getCollection('locations');
  const features = locations
    .filter((location) => !location.data.organizational)
    .map((location) => ({
      type: 'Feature',
      id: location.data.location_id,
      properties: {
        id: location.data.location_id,
        label: location.data.location_label || location.data.location_id,
        name: location.data.description,
        sortOrder: location.data.sort_order,
        url: `${festival.siteUrl}/locations/#venue-${location.data.location_id}`,
      },
      geometry: {
        type: 'Point',
        coordinates: [location.data.gps[1], location.data.gps[0]],
      },
    }))
    .sort((a, b) => a.properties.sortOrder - b.properties.sortOrder);

  return new Response(JSON.stringify({
    type: 'FeatureCollection',
    name: 'Spektakel Landshut venues',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
      },
    },
    features,
  }, null, 2), {
    headers: {
      'Content-Type': 'application/geo+json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
