import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gtm-consent', 'declined'));
});

test('bettet die Impressionen 2026 unter dem Dankesgruß ein', async ({ page }) => {
  await page.goto('/');

  const thankYouSection = page.getByRole('heading', { name: 'Danke für ein unvergessliches Spektakel!' }).locator('..').locator('..');
  await expect(thankYouSection).toContainText('Impressionen des Spektakels 2026');
  await expect(thankYouSection.locator('iframe')).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/TvI-kyNMxKQ',
  );
});
