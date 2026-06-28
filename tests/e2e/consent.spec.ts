import { expect, type Locator, type Page, test } from '@playwright/test';

const consentKey = 'gtm-consent';
const gtmSelector = 'head script[src*="googletagmanager.com/gtm.js?id=GTM-TK5422TV"]';
const productionOrigin = 'https://spektakel.la';
const localOrigin = 'http://localhost:4322';

test.describe.configure({ timeout: 60_000 });

const clickElement = async (locator: Locator) => {
  await locator.evaluate((element) => {
    if (element instanceof HTMLElement) element.click();
  });
};
const routeProductionDomainToLocal = async (page: Page) => {
  await page.route(`${productionOrigin}/**`, async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === '/sw.js') {
      await route.fulfill({ status: 404, body: '' });
      return;
    }

    if (['font', 'image'].includes(route.request().resourceType())) {
      await route.fulfill({ status: 204, body: '' });
      return;
    }

    const response = await route.fetch({ url: `${localOrigin}${url.pathname}${url.search}` });
    await route.fulfill({ response });
  });
};

test.beforeEach(async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
});

test('zeigt den Banner beim Erstbesuch und lädt GTM auf localhost auch nach Zustimmung nicht', async ({ page }) => {
  const googleRequests: string[] = [];
  page.on('request', (request) => {
    if (/google(?:tagmanager|-analytics)\.com/.test(request.url())) googleRequests.push(request.url());
  });
  await page.goto('/');

  const banner = page.locator('[data-cookie-banner]');
  await expect(banner).toBeVisible();
  await expect(page.locator(gtmSelector)).toHaveCount(0);
  expect(googleRequests).toEqual([]);

  await clickElement(banner.getByRole('button', { name: 'Ja, ich helfe gerne' }));

  await expect(banner).toBeHidden();
  await expect(page.locator(gtmSelector)).toHaveCount(0);
  expect(googleRequests).toEqual([]);
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), consentKey)).toBe('accepted');
});

test('lädt GTM nach Zustimmung auf der Produktionsdomain', async ({ page }) => {
  const googleRequests: string[] = [];
  await routeProductionDomainToLocal(page);
  page.on('request', (request) => {
    if (/google(?:tagmanager|-analytics)\.com/.test(request.url())) googleRequests.push(request.url());
  });

  await page.goto(`${productionOrigin}/`);
  const banner = page.locator('[data-cookie-banner]');
  await expect(banner).toBeVisible();

  await clickElement(banner.getByRole('button', { name: 'Ja, ich helfe gerne' }));

  await expect(banner).toBeHidden();
  await expect(page.locator(gtmSelector)).toHaveCount(1);
  await expect.poll(() => googleRequests.some((url) => url.includes('GTM-TK5422TV'))).toBe(true);
});

test('speichert eine Ablehnung, ohne GTM zu laden', async ({ page }) => {
  await page.goto('/en/');

  const banner = page.locator('[data-cookie-banner]');
  await expect(banner).toBeVisible();
  await clickElement(banner.getByRole('button', { name: 'No, thanks' }));

  await expect(banner).toBeHidden();
  await expect(page.locator(gtmSelector)).toHaveCount(0);
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), consentKey)).toBe('declined');

  await page.reload();
  await expect(page.locator('[data-cookie-banner]')).toBeHidden();
  await expect(page.locator(gtmSelector)).toHaveCount(0);
});

test('lädt GTM bei bereits erteilter Zustimmung genau einmal', async ({ page }) => {
  await routeProductionDomainToLocal(page);
  await page.addInitScript((key) => localStorage.setItem(key, 'accepted'), consentKey);
  await page.goto(`${productionOrigin}/`);

  await expect(page.locator('[data-cookie-banner]')).toBeHidden();
  await expect(page.locator(gtmSelector)).toHaveCount(1);
});

test('schreibt eigene Analytics-Events auf localhost auch nach Zustimmung nicht in die Data Layer', async ({ page }) => {
  await page.goto('/program/');

  await page.locator('#program-filters [data-category="akrobatik"]').evaluate((element) => {
    if (element instanceof HTMLElement) element.click();
  });
  await expect.poll(() => page.evaluate(() => window.dataLayer?.some((item) => item.event === 'program_category_filtered') ?? false)).toBe(false);

  await clickElement(page.locator('[data-cookie-banner]').getByRole('button', { name: 'Ja, ich helfe gerne' }));
  await page.locator('#program-filters [data-category="musik"]').evaluate((element) => {
    if (element instanceof HTMLElement) element.click();
  });

  await expect.poll(() => page.evaluate(() => window.dataLayer?.some((item) => item.event === 'program_category_filtered') ?? false)).toBe(false);
});

test('schreibt eigene Analytics-Events nach Zustimmung auf der Produktionsdomain in die Data Layer', async ({ page }) => {
  await routeProductionDomainToLocal(page);
  await page.goto(`${productionOrigin}/program/`);

  await clickElement(page.locator('[data-cookie-banner]').getByRole('button', { name: 'Ja, ich helfe gerne' }));
  await page.locator('#program-filters [data-category="musik"]').evaluate((element) => {
    if (element instanceof HTMLElement) element.click();
  });

  await expect.poll(() => page.evaluate(() => window.dataLayer?.some((item) => item.event === 'program_category_filtered') ?? false)).toBe(true);
  const event = await page.evaluate(() => window.dataLayer?.find((item) => item.event === 'program_category_filtered'));
  expect(event).toMatchObject({
    event: 'program_category_filtered',
    category: 'musik',
    page_path: '/program/',
    page_language: 'de',
  });
});

test('stellt den Consent-Status für Analytics bereit und erlaubt den Widerruf im Footer', async ({ page }) => {
  await page.goto('/');
  await clickElement(page.locator('[data-cookie-banner]').getByRole('button', { name: 'Ja, ich helfe gerne' }));

  await expect.poll(() => page.evaluate(() => window.spektakel.consent.getStatus())).toBe('accepted');
  await expect.poll(() => page.evaluate(() => window.spektakel.consent.isAnalyticsGranted())).toBe(false);
  await page.evaluate(() => {
    document.cookie = '_ga=GA1.1.123.456; path=/';
    document.cookie = '_gid=GA1.1.789.012; path=/';
  });

  await clickElement(page.getByRole('button', { name: 'Cookie-Einstellungen' }));
  await expect(page.locator('[data-cookie-banner]')).toBeVisible();
  await clickElement(page.locator('[data-cookie-banner]').getByRole('button', { name: 'Nein, danke' }));

  await expect.poll(async () => {
    try {
      return await page.evaluate(() => window.spektakel.consent.getStatus());
    } catch {
      return undefined;
    }
  }).toBe('declined');
  await expect(page.locator(gtmSelector)).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.cookie)).not.toContain('_ga=');
  await expect.poll(() => page.evaluate(() => document.cookie)).not.toContain('_gid=');
});
