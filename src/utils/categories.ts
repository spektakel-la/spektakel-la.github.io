/**
 * Makro-Kategorien für Künstler.
 *
 * Einsatz als typsicherer Ersatz für Literal-Strings.
 * Das Objekt dient als Enum-Ersatz (idiomatisches TypeScript):
 *   - Keine Runtime-Overhead wie bei `enum`
 *   - Volle IDE-Autovervollständigung
 *   - Typsystem erzwingt Konsistenz über alle Dateien hinweg
 */
export const Category = {
  Akrobatik: 'akrobatik',
  Musik: 'musik',
  Comedy: 'comedy',
  Magie: 'magie',
  Sonstiges: 'sonstiges',
} as const;

/** Union aller gültigen Kategorie-Werte, z. B. `'akrobatik' | 'musik' | …` */
export type Category = (typeof Category)[keyof typeof Category];

/** Alle Kategorie-Keys als readonly-Array (z. B. für Iterationen). */
export const CATEGORIES = Object.values(Category) as readonly Category[];

/** Schlüsselwörter, die eine Kategorie triggern (Reihenfolge = Priorität). */
export const CATEGORY_KEYWORDS: ReadonlyArray<{ cat: Category; keywords: readonly string[] }> = [
  { cat: Category.Akrobatik, keywords: ['akrobatik', 'acrobatics', 'jonglage', 'juggling', 'tanz', 'dance'] },
  { cat: Category.Musik, keywords: ['musik', 'music'] },
  { cat: Category.Comedy, keywords: ['comedy', 'theater'] },
  { cat: Category.Magie, keywords: ['magie', 'magic', 'zauber'] },
  { cat: Category.Sonstiges, keywords: ['natur', 'nature', 'poesie', 'poetry', 'vortrag', 'talk'] },
];

export type Locale = 'de' | 'en';

type LocalizedCategoryData = {
  categories?: string[];
};

type ArtistCategoryData = {
  organizational?: boolean;
  de?: LocalizedCategoryData;
  en?: LocalizedCategoryData;
};

type CategoryLabelTranslations = {
  program: {
    catAkrobatik: string;
    catMusik: string;
    catComedy: string;
    catMagie: string;
    catSonstiges: string;
  };
};

export function getLocalizedArtistCategories(artist: ArtistCategoryData, locale: Locale): string[] {
  return locale === 'en'
    ? (artist.en?.categories ?? artist.de?.categories ?? [])
    : (artist.de?.categories ?? []);
}

export function getMacroCategoryFromRaw(raw: string): Category | undefined {
  const normalized = raw.toLowerCase();
  for (const { cat, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => normalized.includes(keyword))) return cat;
  }
  return undefined;
}

export function getMacroCategoryFromCategories(categories: readonly string[]): Category | '' {
  for (const category of categories) {
    const macro = getMacroCategoryFromRaw(category);
    if (macro) return macro;
  }
  return '';
}

export function getArtistMacroCategory(artist: ArtistCategoryData, locale: Locale): Category | '' {
  if (artist.organizational) return '';
  return getMacroCategoryFromCategories(getLocalizedArtistCategories(artist, locale));
}

export function getCategoryLabels(t: CategoryLabelTranslations): Record<Category, string> {
  return {
    [Category.Akrobatik]: t.program.catAkrobatik,
    [Category.Musik]: t.program.catMusik,
    [Category.Comedy]: t.program.catComedy,
    [Category.Magie]: t.program.catMagie,
    [Category.Sonstiges]: t.program.catSonstiges,
  };
}

export function getCategoryGenreLabel(category: Category, locale: Locale): string {
  const labels: Record<Locale, Record<Category, string>> = {
    de: {
      [Category.Akrobatik]: 'Akrobatik',
      [Category.Musik]: 'Musik',
      [Category.Comedy]: 'Comedy',
      [Category.Magie]: 'Magie',
      [Category.Sonstiges]: 'Sonstiges',
    },
    en: {
      [Category.Akrobatik]: 'Acrobatics',
      [Category.Musik]: 'Music',
      [Category.Comedy]: 'Comedy',
      [Category.Magie]: 'Magic',
      [Category.Sonstiges]: 'Other',
    },
  };
  return labels[locale][category];
}

/**
 * Kategorie-Farben als JS-Konstanten.
 * Spiegeln exakt die `--color-cat-*`-Tokens in `tokens.css`.
 * → Verwende diese Konstanten überall wo Farben programmatisch benötigt werden
 *   (z. B. Leaflet-Marker-Icons, SVG-Fills).
 * ACHTUNG: Änderungen hier immer synchron auch in tokens.css vornehmen.
 */
export const CATEGORY_COLORS: Readonly<Record<Category, string>> = {
  [Category.Akrobatik]: '#00b4db',
  [Category.Musik]: '#ff2d7a',
  [Category.Comedy]: '#b7ff00',
  [Category.Magie]: '#9b59b6',
  [Category.Sonstiges]: '#ff6b1a',
} as const;
