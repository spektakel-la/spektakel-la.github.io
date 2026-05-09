import { de } from './de';
import { en } from './en';

export type Locale = 'de' | 'en';

const translations = { de, en } as const;

/**
 * Gibt das Übersetzungsobjekt für die angegebene Locale zurück.
 * Fällt auf Deutsch zurück, wenn die Locale unbekannt ist.
 */
export function useTranslations(locale: string): typeof de {
  const lang = (locale in translations ? locale : 'de') as Locale;
  return translations[lang];
}

/**
 * Gibt die aktuelle Locale aus einem Astro-Request zurück.
 * Default: 'de'
 */
export function getLocale(url: URL): Locale {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments[0] === 'en') return 'en';
  return 'de';
}

/**
 * Gibt den lokalisierten Pfad für einen gegebenen Basispfad zurück.
 */
export function localePath(path: string, locale: Locale): string {
  if (locale === 'de') return path;
  return `/en${path}`;
}
