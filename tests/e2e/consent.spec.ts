import { expect, test } from '@playwright/test';

const consentKey = 'gtm-consent';
const gtmSelector = 'head script[src*="googletagmanager.com/gtm.js?id=GTM-TK5422TV"]';

test.beforeEach(async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
});

test('zeigt den Banner beim Erstbesuch und lädt GTM erst nach Zustimmung', async ({ page }) => {
  await page.goto('/');

  const banner = page.locator('[data-cookie-banner]');
  await expect(banner).toBeVisible();
  await expect(page.locator(gtmSelector)).toHaveCount(0);

  await banner.getByRole('button', { name: 'Ja, gerne' }).click();

  await expect(banner).toBeHidden();
  await expect(page.locator(gtmSelector)).toHaveCount(1);
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), consentKey)).toBe('accepted');
});

test('speichert eine Ablehnung, ohne GTM zu laden', async ({ page }) => {
  await page.goto('/en/');

  const banner = page.locator('[data-cookie-banner]');
  await expect(banner).toBeVisible();
  await banner.getByRole('button', { name: 'No, thanks' }).click();

  await expect(banner).toBeHidden();
  await expect(page.locator(gtmSelector)).toHaveCount(0);
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), consentKey)).toBe('declined');

  await page.reload();
  await expect(banner).toBeHidden();
  await expect(page.locator(gtmSelector)).toHaveCount(0);
});

test('lädt GTM bei bereits erteilter Zustimmung genau einmal', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, 'accepted'), consentKey);
  await page.goto('/');

  await expect(page.locator('[data-cookie-banner]')).toBeHidden();
  await expect(page.locator(gtmSelector)).toHaveCount(1);
});

test('stellt den Consent-Status für Analytics bereit und erlaubt den Widerruf im Footer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ja, gerne' }).click();

  await expect.poll(() => page.evaluate(() => window.spektakel.consent.getStatus())).toBe('accepted');
  await expect.poll(() => page.evaluate(() => window.spektakel.consent.isAnalyticsGranted())).toBe(true);

  await page.getByRole('button', { name: 'Cookie-Einstellungen' }).click();
  await expect(page.locator('[data-cookie-banner]')).toBeVisible();
  await page.getByRole('button', { name: 'Nein, danke' }).click();

  await page.waitForLoadState('domcontentloaded');
  await expect.poll(() => page.evaluate(() => window.spektakel.consent.getStatus())).toBe('declined');
  await expect(page.locator(gtmSelector)).toHaveCount(0);
});
