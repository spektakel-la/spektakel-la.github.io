import { festival } from '../data/festival';
import { ROUTES } from './routes';

export type AgentLocation = {
  id: string;
  label: string;
  name: string;
  latitude: number;
  longitude: number;
};

type LocationLike = {
  data: {
    location_id: string;
    location_label?: string;
    description: string;
    sort_order: number;
    gps: readonly [number, number];
    organizational?: boolean;
  };
};

export function createAgentLocations(locations: LocationLike[]): AgentLocation[] {
  return locations
    .filter((location) => !location.data.organizational)
    .map((location) => ({
      id: location.data.location_id,
      label: location.data.location_label || location.data.location_id,
      name: location.data.description,
      latitude: location.data.gps[0],
      longitude: location.data.gps[1],
    }))
    .sort((a, b) => Number(a.id) - Number(b.id));
}

const machineResources = [
  ['Sitemap', '/sitemap.xml'],
  ['Program JSON', '/program.json'],
  ['Artists JSON', '/artists.json'],
  ['Locations JSON', '/locations.json'],
  ['Locations GeoJSON', '/locations.geojson'],
] as const;

const importantPages = [
  ['Program', ROUTES.program],
  ['Artists', ROUTES.artists],
  ['Locations', ROUTES.locations],
  ['Impressions', ROUTES.impressions],
  ['Sponsors', ROUTES.sponsors],
  ['Imprint', ROUTES.imprint],
] as const;

function absoluteUrl(path: string): string {
  return new URL(path, festival.siteUrl).href;
}

function renderLocationCoordinates(locations: AgentLocation[]): string {
  if (locations.length === 0) return '';

  return `
## Venue Coordinates

Coordinate reference system: WGS84 / EPSG:4326.
Text and JSON resources use latitude, longitude.
GeoJSON uses the standard coordinate order longitude, latitude.

${locations
  .map((location) => `- ${location.label} / ${location.name}: latitude ${location.latitude}, longitude ${location.longitude} (${absoluteUrl(`${ROUTES.locations}#venue-${location.id}`)})`)
  .join('\n')}
`;
}

export function createLlmsTxt(locations: AgentLocation[] = []): string {
  return `# Spektakel Landshut

Official site: ${festival.siteUrl}
Production domain: ${festival.siteUrl}
Languages: de, en

Spektakel Landshut is an international street art festival in Landshut, Germany.
The ${festival.name} festival runs from ${festival.startDate} to ${festival.endDate} in Landshut's historic city centre.

## Important Pages

${importantPages.map(([label, path]) => `- ${label}: ${absoluteUrl(path)}`).join('\n')}

## Machine-Readable Resources

${machineResources.map(([label, path]) => `- ${label}: ${absoluteUrl(path)}`).join('\n')}
${renderLocationCoordinates(locations)}

## Notes For Agents

- Use the JSON resources above for schedule, artist, and venue lookups.
- Use ${absoluteUrl('/locations.geojson')} for map, routing, and distance tasks.
- Use German pages as canonical default pages.
- Use English pages under ${absoluteUrl('/en/')} when the user asks in English.
- Program entries are performances with stable fragment URLs on ${absoluteUrl(ROUTES.program)}.
`;
}

export function createAgentsTxt(locations: AgentLocation[] = []): string {
  return `# Spektakel Landshut

Site: ${festival.siteUrl}
Host: spektakel.la
Languages: de, en

Sitemap: ${absoluteUrl('/sitemap.xml')}
LLMS: ${absoluteUrl('/llms.txt')}

## Read-Only Data

${machineResources
  .filter(([label]) => label !== 'Sitemap')
  .map(([label, path]) => `${label}: ${absoluteUrl(path)}`)
  .join('\n')}
${renderLocationCoordinates(locations)}

## Agent Guidance

Use /program.json for performance lookups. It is generated from the canonical schedule data at build time and contains stable event ids, artist metadata, venue metadata, start/end times, venue coordinates, and fragment URLs.
Use /locations.geojson for map, routing, and distance tasks. GeoJSON coordinates are longitude, latitude.
`;
}
