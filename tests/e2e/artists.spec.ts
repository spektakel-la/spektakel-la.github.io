import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gtm-consent', 'declined'));
});

test('hält Filter und Spielzeiten auf kleinen Displays kompakt', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/artists/');

  const filters = page.locator('#artists-filters');
  const search = page.locator('#artist-search');
  const categories = filters.getByRole('group', { name: 'Kategorie-Filter' });

  const [filterBox, searchBox, categoryBox] = await Promise.all([
    filters.boundingBox(),
    search.boundingBox(),
    categories.boundingBox(),
  ]);

  expect(filterBox?.height).toBeLessThanOrEqual(135);
  expect(categoryBox?.y).toBeGreaterThan(searchBox?.y ?? 0);

  const timeSlots = page.locator('[data-time-slot]');
  await expect(timeSlots.first()).toBeVisible();
  expect(await timeSlots.first().evaluate((element) => getComputedStyle(element).whiteSpace)).toBe('nowrap');
  expect((await timeSlots.first().textContent())?.trim()).toMatch(/^(?:Fr|Sa|So)\u00a0\d{2}:\d{2}(?: \|)?$/);

  const overflowingTimeLines = await page.locator('[data-time-slot]').evaluateAll((slots) => {
    const lines = new Set(slots.map((slot) => slot.parentElement).filter(Boolean));
    return [...lines].filter((line) => line.scrollWidth > line.clientWidth).length;
  });
  expect(overflowingTimeLines).toBe(0);
});
