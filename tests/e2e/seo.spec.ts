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
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow, max-image-preview:large');
    await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute('content', 'index, follow, max-image-preview:large');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteUrl}${pathname}`);
    await expect(page.locator('link[rel="llms"]')).toHaveAttribute('href', `${siteUrl}/llms.txt`);
    await expect(page.locator('link[rel="agent"]')).toHaveAttribute('href', `${siteUrl}/agents.txt`);
    await expect(page.locator('link[rel="alternate"][type="text/plain"][title="LLMS full text"]')).toHaveAttribute('href', `${siteUrl}/llms-full.txt`);
    await expect(page.locator('link[rel="alternate"][type="application/json"][title="Agents JSON"]')).toHaveAttribute('href', `${siteUrl}/agents.json`);
    await expect(page.locator('link[rel="alternate"][type="application/json"][title="Program JSON"]')).toHaveAttribute('href', `${siteUrl}/program.json`);
    await expect(page.locator('link[rel="alternate"][type="application/geo+json"]')).toHaveAttribute('href', `${siteUrl}/locations.geojson`);
    await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute('href', `${siteUrl}${pathname}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${siteUrl}/en${pathname}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', `${siteUrl}${pathname}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /\S+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
    await expect(page.getByRole('navigation', { name: 'Maschinenlesbare Daten und LLM-Informationen' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Maschinenlesbare Daten und LLM-Informationen' })).toHaveAttribute('href', '/llms.txt');
    await expect(page.getByRole('link', { name: 'Maschinenlesbare Daten und LLM-Informationen' })).toHaveAttribute('type', 'text/plain');
    await expect(page.getByRole('link', { name: 'Maschinenlesbare Daten und LLM-Informationen' })).toHaveAttribute('data-agent-discovery', 'llms');
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
  expect(robotsText).toContain('Allow: /llms-full.txt');
  expect(robotsText).toContain('Allow: /agents.txt');
  expect(robotsText).toContain('Allow: /agents.json');
  expect(robotsText).toContain('Allow: /locations.geojson');

  // Der Dev-Server generiert keine Sitemap; deren Existenz und Inhalte werden im Build geprüft.
});

test('stellt agentenfreundliche Discovery- und JSON-Ressourcen bereit', async ({ request }) => {
  const llms = await request.get('/llms.txt');
  expect(llms.ok()).toBe(true);
  expect(llms.headers()['access-control-allow-origin']).toBe('*');
  const llmsText = await llms.text();
  expect(llmsText).toContain('Program JSON: https://spektakel.la/program.json');
  expect(llmsText).toContain('Agents JSON: https://spektakel.la/agents.json');
  expect(llmsText).toContain('LLMS Full Text: https://spektakel.la/llms-full.txt');
  expect(llmsText).toContain('Locations GeoJSON: https://spektakel.la/locations.geojson');
  expect(llmsText).toContain('Coordinate reference system: WGS84 / EPSG:4326.');
  expect(llmsText).toContain('Jungheinrich Bühne: latitude 48.53734783, longitude 12.15219281');

  const llmsFull = await request.get('/llms-full.txt');
  expect(llmsFull.ok()).toBe(true);
  expect(llmsFull.headers()['access-control-allow-origin']).toBe('*');
  await expect(llmsFull.text()).resolves.toContain('## Performances');

  const agents = await request.get('/agents.txt');
  expect(agents.ok()).toBe(true);
  expect(agents.headers()['access-control-allow-origin']).toBe('*');
  const agentsText = await agents.text();
  expect(agentsText).toContain('# JSON: https://spektakel.la/agents.json');
  expect(agentsText).toContain('Use /program.json for performance lookups.');
  expect(agentsText).toContain('GeoJSON coordinates are longitude, latitude.');

  const agentsJson = await request.get('/agents.json');
  expect(agentsJson.ok()).toBe(true);
  expect(agentsJson.headers()['access-control-allow-origin']).toBe('*');
  const agentsJsonData = await agentsJson.json();
  expect(agentsJsonData.discovery.llmsFull).toBe(`${siteUrl}/llms-full.txt`);
  expect(agentsJsonData.data.locationsGeoJson.coordinateOrder).toBe('longitude, latitude');

  const program = await request.get('/program.json');
  expect(program.ok()).toBe(true);
  expect(program.headers()['access-control-allow-origin']).toBe('*');
  expect(program.headers()['content-type']).toContain('application/json');
  const programJson = await program.json();
  expect(programJson.festival.name).toBe('Spektakel Landshut 2026');
  expect(programJson.events.length).toBeGreaterThan(0);
  expect(programJson.events[0].id).toMatch(/^event-/);
  expect(programJson.events[0].url).toMatch(/^https:\/\/spektakel\.la\/program\/#event-/);
  expect(programJson.events[0].artist.description.de.length).toBeGreaterThan(20);
  expect(programJson.events[0].location.geo.latitude).toBeTruthy();
  expect(programJson.events[0].location.geo.longitude).toBeTruthy();

  const artists = await request.get('/artists.json');
  expect(artists.ok()).toBe(true);
  const artistsJson = await artists.json();
  expect(artistsJson.artists.find((artist: { id: string }) => artist.id === 'adamkadabra')).toBeTruthy();

  const locations = await request.get('/locations.json');
  expect(locations.ok()).toBe(true);
  const locationsJson = await locations.json();
  expect(locationsJson.locations.length).toBeGreaterThan(0);
  expect(locationsJson.locations[0].geo).toEqual({
    latitude: 48.53734783,
    longitude: 12.15219281,
  });

  const geojson = await request.get('/locations.geojson');
  expect(geojson.ok()).toBe(true);
  expect(geojson.headers()['content-type']).toContain('application/geo+json');
  const geojsonData = await geojson.json();
  expect(geojsonData.features[0].properties.name).toBe('Jungheinrich Bühne');
  expect(geojsonData.features[0].geometry.coordinates).toEqual([12.15219281, 48.53734783]);
});

test('liefert Spielorte als Place-JSON-LD mit Koordinaten aus', async ({ page }) => {
  await page.goto('/locations/');
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const itemList = scripts.map((script) => JSON.parse(script)).find((jsonLd) => jsonLd['@type'] === 'ItemList');
  expect(itemList).toBeTruthy();
  expect(itemList.itemListElement[0].item['@type']).toBe('Place');
  expect(itemList.itemListElement[0].item['@id']).toBe(`${siteUrl}/locations/#venue-1`);
  expect(itemList.itemListElement[0].item.geo).toEqual({
    '@type': 'GeoCoordinates',
    latitude: 48.53734783,
    longitude: 12.15219281,
  });
});
