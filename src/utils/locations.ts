/**
 * Sichtbares Spielort-Label für Programm und Spielort-Auswahl.
 * Die Kennzeichnung stammt aus den zentralen Location-Daten und kann daher
 * neben Nummern auch Buchstaben oder ein eigenes Label enthalten.
 */
export function formatLocationLabel(
  locationId: string,
  description: string,
  locationLabel?: string,
): string {
  return `${locationLabel ?? locationId}\u00a0–\u00a0${description}`;
}

/** Zerlegt das Label am ersten sinnvollen Umbruchpunkt für schmale Tabellenköpfe. */
export function splitLocationLabel(
  locationId: string,
  description: string,
  locationLabel?: string,
): { nonBreakingPrefix: string; remainder: string; breakAtSlash: boolean } {
  const match = description.match(/^([^/\s]+)(\/|\s+)(.*)$/);
  if (!match) {
    return {
      nonBreakingPrefix: formatLocationLabel(locationId, description, locationLabel),
      remainder: '',
      breakAtSlash: false,
    };
  }

  const [, firstWord, separator, remainder] = match;
  const breakAtSlash = separator === '/';
  return {
    nonBreakingPrefix: `${locationLabel ?? locationId}\u00a0–\u00a0${firstWord}${breakAtSlash ? '/' : ''}`,
    remainder,
    breakAtSlash,
  };
}
