import { festival } from '../data/festival';
import { ROUTES } from './routes';

export const agentResponseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=300',
} as const;

export type AgentLocation = {
  id: string;
  label: string;
  name: string;
  sortOrder: number;
  latitude: number;
  longitude: number;
};

export type AgentPerformance = {
  id: string;
  startDate: string;
  endDate: string;
  artistName: string;
  locationName: string;
  latitude: number;
  longitude: number;
  url: string;
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
      sortOrder: location.data.sort_order,
      latitude: location.data.gps[0],
      longitude: location.data.gps[1],
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

const machineResources = [
  ['Sitemap', '/sitemap.xml', 'XML sitemap for discoverable website pages.'],
  ['Program JSON', '/program.json', 'Generated performance schedule with stable event ids, artist metadata, venue metadata, times, and geo coordinates.'],
  ['Artists JSON', '/artists.json', 'Generated artist catalog with localized descriptions and links.'],
  ['Locations JSON', '/locations.json', 'Generated venue catalog with named geo.latitude and geo.longitude fields.'],
  ['Locations GeoJSON', '/locations.geojson', 'Generated GeoJSON FeatureCollection for map, route, and distance tasks.'],
  ['Agents JSON', '/agents.json', 'Structured companion file for agent discovery.'],
  ['LLMS Full Text', '/llms-full.txt', 'Generated full text context for LLMs.'],
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

function siteHost(): string {
  return new URL(festival.siteUrl).host;
}

function defaultLanguageName(): string {
  return festival.defaultLocale === 'de' ? 'German' : festival.defaultLocale;
}

function renderLocationCoordinates(locations: AgentLocation[]): string {
  if (locations.length === 0) return '';

  return `
## Venue Coordinates

Coordinate reference system: WGS84 / EPSG:4326.
JSON-LD uses schema.org GeoCoordinates with named latitude and longitude fields.
Program JSON and Locations JSON use named geo.latitude and geo.longitude fields.
GeoJSON uses RFC 7946 coordinate order: [longitude, latitude].

${locations
  .map((location) => `- ${location.label} / ${location.name}: latitude ${location.latitude}, longitude ${location.longitude} (${absoluteUrl(`${ROUTES.locations}#venue-${location.id}`)})`)
  .join('\n')}
`;
}

export function createLlmsTxt(locations: AgentLocation[] = []): string {
  return `# ${festival.siteName}

Official site: ${festival.siteUrl}
Production domain: ${festival.siteUrl}
Languages: ${festival.languages.join(', ')}

${festival.fullDescription.en}
The ${festival.name} festival runs from ${festival.startDate} to ${festival.endDate} ${festival.locationDescription.en}.

## Important Pages

${importantPages.map(([label, path]) => `- ${label}: ${absoluteUrl(path)}`).join('\n')}

## Machine-Readable Resources

${machineResources.map(([label, path]) => `- ${label}: ${absoluteUrl(path)}`).join('\n')}
${renderLocationCoordinates(locations)}

## Notes For Agents

- Use the JSON resources above for schedule, artist, and venue lookups.
- Use ${absoluteUrl('/locations.geojson')} for map, routing, and distance tasks.
- Use ${defaultLanguageName()} pages as canonical default pages.
- Use English pages under ${absoluteUrl('/en/')} when the user asks in English.
- Program entries are performances with stable fragment URLs on ${absoluteUrl(ROUTES.program)}.
`;
}

export function createAgentsTxt(locations: AgentLocation[] = []): string {
  return `# agents.txt
# Standard: https://agents-txt.com
# JSON: ${absoluteUrl('/agents.json')}

# ${festival.siteName}

Site: ${festival.siteUrl}
Host: ${siteHost()}
Languages: ${festival.languages.join(', ')}

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

export function createRobotsTxt(): string {
  return `User-agent: *
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /agents.txt
Allow: /agents.json
Allow: /program.json
Allow: /artists.json
Allow: /locations.json
Allow: /locations.geojson
Disallow: /assets/img/artists/2025/

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;
}

export function createAgentsJson(locations: AgentLocation[]): Record<string, unknown> {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    site: {
      name: festival.siteName,
      url: festival.siteUrl,
      description: festival.shortDescription.en,
      languages: festival.languages,
    },
    discovery: {
      robots: absoluteUrl('/robots.txt'),
      sitemap: absoluteUrl('/sitemap.xml'),
      llms: absoluteUrl('/llms.txt'),
      llmsFull: absoluteUrl('/llms-full.txt'),
      agents: absoluteUrl('/agents.txt'),
      agentsJson: absoluteUrl('/agents.json'),
    },
    data: {
      program: {
        url: absoluteUrl('/program.json'),
        description: machineResources.find(([label]) => label === 'Program JSON')?.[2],
      },
      artists: {
        url: absoluteUrl('/artists.json'),
        description: machineResources.find(([label]) => label === 'Artists JSON')?.[2],
      },
      locations: {
        url: absoluteUrl('/locations.json'),
        description: machineResources.find(([label]) => label === 'Locations JSON')?.[2],
      },
      locationsGeoJson: {
        url: absoluteUrl('/locations.geojson'),
        contentType: 'application/geo+json',
        coordinateOrder: 'longitude, latitude',
        description: machineResources.find(([label]) => label === 'Locations GeoJSON')?.[2],
      },
    },
    coordinates: {
      crs: 'WGS84 / EPSG:4326',
      jsonFields: 'Named geo.latitude and geo.longitude fields.',
      geojsonOrder: '[longitude, latitude]',
      venues: locations,
    },
  };
}

export function createLlmsFullTxt(locations: AgentLocation[], performances: AgentPerformance[]): string {
  return `# ${festival.siteName} Full Agent Context

Generated from canonical build-time data sources.

## Festival

- Name: ${festival.name}
- URL: ${festival.siteUrl}
- Dates: ${festival.startDate} to ${festival.endDate}
- Location: ${festival.locationName}, ${festival.addressLocality}, ${festival.addressCountry}
- Admission price: ${festival.admissionPrice} ${festival.currency}

${renderLocationCoordinates(locations)}

## Performances

${performances
  .map((performance) => `- ${performance.startDate} to ${performance.endDate}: ${performance.artistName} at ${performance.locationName}; latitude ${performance.latitude}, longitude ${performance.longitude}; ${performance.url}`)
  .join('\n')}
`;
}
