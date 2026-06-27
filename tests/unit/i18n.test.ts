import { de } from '@i18n/de';
import { en } from '@i18n/en';
import { getLocale, localePath, useTranslations } from '@i18n/utils';
import { describe, expect, it } from 'vitest';

describe('useTranslations', () => {
  it('gibt das deutsche Objekt für "de" zurück', () => {
    const t = useTranslations('de');
    expect(t.nav.artists).toBe('Künstler');
    expect(t.nav.sponsors).toBe('Sponsoren');
  });

  it('gibt das englische Objekt für "en" zurück', () => {
    const t = useTranslations('en');
    expect(t.nav.artists).toBe('Artists');
    expect(t.nav.sponsors).toBe('Sponsors');
  });

  it('fällt auf Deutsch zurück für unbekannte Locale', () => {
    const t = useTranslations('fr');
    expect(t.nav.artists).toBe('Künstler');
  });
});

describe('Vollständigkeit der Übersetzungsschlüssel', () => {
  function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    return Object.entries(obj).flatMap(([key, val]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        return getKeys(val as Record<string, unknown>, fullKey);
      }
      return [fullKey];
    });
  }

  it('en hat alle Schlüssel wie de', () => {
    const deKeys = getKeys(de as unknown as Record<string, unknown>).sort();
    const enKeys = getKeys(en as unknown as Record<string, unknown>).sort();
    expect(enKeys).toEqual(deKeys);
  });

  it('kein Schlüssel in de ist leer oder undefined', () => {
    const deKeys = getKeys(de as unknown as Record<string, unknown>);
    for (const key of deKeys) {
      const parts = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any = de;
      for (const p of parts) val = val?.[p];
      expect(val).toBeTruthy();
    }
  });
});

describe('getLocale', () => {
  it('gibt "en" für /en/artists zurück', () => {
    const url = new URL('https://spektakel-la.github.io/en/artists');
    expect(getLocale(url)).toBe('en');
  });

  it('gibt "de" für /artists zurück', () => {
    const url = new URL('https://spektakel-la.github.io/artists');
    expect(getLocale(url)).toBe('de');
  });

  it('gibt "de" für / zurück', () => {
    const url = new URL('https://spektakel-la.github.io/');
    expect(getLocale(url)).toBe('de');
  });
});

describe('localePath', () => {
  it('gibt für "de" den unveränderten Pfad zurück', () => {
    expect(localePath('/artists', 'de')).toBe('/artists');
  });

  it('gibt für "en" den Pfad mit /en/ Präfix zurück', () => {
    expect(localePath('/artists', 'en')).toBe('/en/artists');
  });
});
