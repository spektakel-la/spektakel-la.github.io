import { Category, getArtistMacroCategory } from '@utils/categories';
import { describe, expect, it } from 'vitest';

describe('Artist-Makrokategorien', () => {
  it('ordnet Theater ohne Override weiterhin Comedy zu', () => {
    expect(getArtistMacroCategory({
      de: { categories: ['Theater'] },
      en: { categories: ['Theatre'] },
    }, 'de')).toBe(Category.Comedy);
  });

  it('verwendet filter_category als explizite Filter-Kategorie', () => {
    expect(getArtistMacroCategory({
      filter_category: Category.Sonstiges,
      de: {
        categories: ['Theater'],
      },
      en: {
        categories: ['Theatre'],
      },
    }, 'de')).toBe(Category.Sonstiges);
  });
});
