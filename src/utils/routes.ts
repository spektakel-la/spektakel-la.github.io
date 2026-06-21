/**
 * Zentrale Route-Definitionen für die gesamte Website.
 * Alle internen Links müssen von hier referenziert werden –
 * nie hartcodierte Pfad-Strings in Komponenten oder Pages.
 */
export const ROUTES = {
  home: '/',
  program: '/program/',
  artists: '/artists/',
  locations: '/locations/',
  impressions: '/impressions/',
  sponsors: '/sponsors/',
  imprint: '/imprint/',
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Gibt den Pfad für einen einzelnen Künstler zurück. */
export function artistPath(artistId: string): string {
  return `${ROUTES.artists}${artistId}/`;
}
