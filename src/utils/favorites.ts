/**
 * SPEKTAKEL! – Favoriten-Utilities
 *
 * Verwaltet gemerkten Artists und Shows via localStorage.
 * Kein Login erforderlich.
 */

const STORAGE_KEY = 'spektakel-favorites';

export interface FavoriteEntry {
  artist_id: string;
  /** Optionaler spezifischer Auftritt (location_id + ISO-time) */
  showKey?: string;
}

/** Liest alle Favoriten aus localStorage. */
export function getFavorites(): Set<string> {
  if (typeof localStorage === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: string[] = raw ? JSON.parse(raw) : [];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

/** Prüft ob ein Artist gemerkt ist. */
export function isFavorite(artist_id: string): boolean {
  return getFavorites().has(artist_id);
}

/** Fügt einen Artist zu den Favoriten hinzu. */
export function addFavorite(artist_id: string): void {
  const favs = getFavorites();
  favs.add(artist_id);
  saveFavorites(favs);
}

/** Entfernt einen Artist aus den Favoriten. */
export function removeFavorite(artist_id: string): void {
  const favs = getFavorites();
  favs.delete(artist_id);
  saveFavorites(favs);
}

/** Wechselt den Favoriten-Status. Gibt neuen Status zurück. */
export function toggleFavorite(artist_id: string): boolean {
  if (isFavorite(artist_id)) {
    removeFavorite(artist_id);
    return false;
  } else {
    addFavorite(artist_id);
    return true;
  }
}

function saveFavorites(favs: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs]));
  } catch {
    // localStorage nicht verfügbar (z. B. Private Mode mit vollem Speicher)
  }
}
