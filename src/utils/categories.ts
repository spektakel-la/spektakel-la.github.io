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
  StreetArt: 'street-art',
  Nightlife: 'nightlife',
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
  {
    cat: Category.StreetArt,
    keywords: ['street art', 'fotographie', 'photography', 'lightshow', 'speedpainting', 'graffiti'],
  },
];
