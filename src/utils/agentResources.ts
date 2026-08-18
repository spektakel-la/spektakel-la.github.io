import { festival } from '../data/festival';
import { ROUTES } from './routes';

const machineResources = [
  ['Sitemap', '/sitemap.xml'],
  ['Program JSON', '/program.json'],
  ['Artists JSON', '/artists.json'],
  ['Locations JSON', '/locations.json'],
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

export function createLlmsTxt(): string {
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

## Notes For Agents

- Use the JSON resources above for schedule, artist, and venue lookups.
- Use German pages as canonical default pages.
- Use English pages under ${absoluteUrl('/en/')} when the user asks in English.
- Program entries are performances with stable fragment URLs on ${absoluteUrl(ROUTES.program)}.
`;
}

export function createAgentsTxt(): string {
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

## Agent Guidance

Use /program.json for performance lookups. It is generated from the canonical schedule data at build time and contains stable event ids, artist metadata, venue metadata, start/end times, and fragment URLs.
`;
}
