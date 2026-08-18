import { expect, test } from '@playwright/test';

const siteUrl = 'https://spektakel.la';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gtm-consent', 'declined'));
});

for (const route of ['/', '/program/', '/artists/', '/artists/adamkadabra/', '/locations/', '/impressions/', '/sponsors/', '/imprint/']) {
  test(`liefert vollständige SEO-Metadaten für ${route}`, async ({ page }) => {
    await page.goto(route);
    const pathname = route === '/' ? '/' : route;

    await expect(page).toHaveTitle(/\S+/);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.trim().length).toBeGreaterThanOrEqual(20);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteUrl}${pathname}`);
    await expect(page.locator('link[rel="llms"]')).toHaveAttribute('href', `${siteUrl}/llms.txt`);
    await expect(page.locator('link[rel="agent"]')).toHaveAttribute('href', `${siteUrl}/agents.txt`);
    await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute('href', `${siteUrl}${pathname}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${siteUrl}/en${pathname}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', `${siteUrl}${pathname}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /\S+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
  });
}

test('verknüpft englische Seiten reziprok mit der deutschen Variante', async ({ page }) => {
  await page.goto('/en/program/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteUrl}/en/program/`);
  await expect(page.locator('link[hreflang="de"]')).toHaveAttribute('href', `${siteUrl}/program/`);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `${siteUrl}/en/program/`);
});

test('liefert valides Festival-, Event- und Künstler-JSON-LD', async ({ page }) => {
  for (const [route, expectedType] of [['/', 'Festival'], ['/program/', 'EventSeries'], ['/artists/adamkadabra/', 'Person']] as const) {
    await page.goto(route);
    const data = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(data).toBeTruthy();
    const jsonLd = JSON.parse(data!);
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe(expectedType);
    expect(jsonLd.name).toBeTruthy();
    if (route !== '/artists/adamkadabra/') {
      expect(jsonLd.startDate).toBeTruthy();
      expect(Array.isArray(jsonLd.subEvent)).toBe(true);
      if (jsonLd.subEvent.length > 0) {
        expect(jsonLd.subEvent[0]['@id']).toMatch(/^https:\/\/spektakel\.la\/program\/#event-/);
        expect(jsonLd.subEvent[0].url).toMatch(/^https:\/\/spektakel\.la\/program\/#event-/);
        expect(jsonLd.subEvent[0].location['@type']).toBe('Place');
        expect(jsonLd.subEvent[0].performer.name).toBeTruthy();
        expect(jsonLd.subEvent[0].description.trim().length).toBeGreaterThanOrEqual(20);
        expect(jsonLd.subEvent[0].offers.validFrom).toBeTruthy();
      }
    }
    if (route === '/artists/adamkadabra/') {
      expect(jsonLd.performerIn[0].description.trim().length).toBeGreaterThanOrEqual(20);
      expect(jsonLd.performerIn[0].offers.validFrom).toBeTruthy();
    }
    if (route === '/') {
      expect(jsonLd.endDate).toBeTruthy();
      expect(jsonLd.performer.length).toBeGreaterThan(0);
      expect(jsonLd.offers.price).toBe(0);
      expect(jsonLd.offers.validFrom).toBeTruthy();
    }
  }
});

test('stellt robots.txt und Sitemap bereit', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  const robotsText = await robots.text();
  expect(robotsText).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  expect(robotsText).toContain('Allow: /llms.txt');
  expect(robotsText).toContain('Allow: /agents.txt');

  // Der Dev-Server generiert keine Sitemap; deren Existenz und Inhalte werden im Build geprüft.
});

test('stellt agentenfreundliche Discovery- und JSON-Ressourcen bereit', async ({ request }) => {
  const llms = await request.get('/llms.txt');
  expect(llms.ok()).toBe(true);
  await expect(llms.text()).resolves.toContain('Program JSON: https://spektakel.la/program.json');

  const agents = await request.get('/agents.txt');
  expect(agents.ok()).toBe(true);
  await expect(agents.text()).resolves.toContain('Use /program.json for performance lookups.');

  const program = await request.get('/program.json');
  expect(program.ok()).toBe(true);
  expect(program.headers()['content-type']).toContain('application/json');
  const programJson = await program.json();
  expect(programJson.festival.name).toBe('Spektakel Landshut 2026');
  expect(programJson.events.length).toBeGreaterThan(0);
  expect(programJson.events[0].id).toMatch(/^event-/);
  expect(programJson.events[0].url).toMatch(/^https:\/\/spektakel\.la\/program\/#event-/);
  expect(programJson.events[0].artist.description.de.length).toBeGreaterThan(20);
  expect(programJson.events[0].location.geo.latitude).toBeTruthy();

  const artists = await request.get('/artists.json');
  expect(artists.ok()).toBe(true);
  const artistsJson = await artists.json();
  expect(artistsJson.artists.find((artist: { id: string }) => artist.id === 'adamkadabra')).toBeTruthy();

  const locations = await request.get('/locations.json');
  expect(locations.ok()).toBe(true);
  const locationsJson = await locations.json();
  expect(locationsJson.locations.length).toBeGreaterThan(0);
});
