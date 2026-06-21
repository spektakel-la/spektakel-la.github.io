import { expect, test } from '@playwright/test';

const localizedRoutes = [
  '/',
  '/program/',
  '/artists/',
  '/artists/alikindoi/',
  '/locations/',
  '/impressions/',
  '/sponsors/',
  '/imprint/',
  '/impressum/',
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gtm-consent', 'declined'));
});

for (const route of localizedRoutes) {
  for (const localePrefix of ['', '/en']) {
    const path = localePrefix ? `${localePrefix}${route}` : route;

    test(`${path} ist erreichbar`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', localePrefix ? 'en' : 'de');
      await expect(page.locator('main')).toBeVisible();
    });
  }
}

test('Sprachwechsel behält die entsprechende Route bei', async ({ page }) => {
  await page.goto('/artists/alikindoi/');
  await page.getByRole('link', { name: 'Switch to English' }).first().click();

  await expect(page).toHaveURL(/\/en\/artists\/alikindoi\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.getByRole('link', { name: 'Zu Deutsch wechseln' }).first().click();
  await expect(page).toHaveURL(/\/artists\/alikindoi\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});
