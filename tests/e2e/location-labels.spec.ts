import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gtm-consent', 'declined'));
});

for (const [locale, path] of [
  ['de', '/artists/companiaexpress/'],
  ['en', '/en/artists/companiaexpress/'],
] as const) {
  test(`Künstler-Spielzeiten zeigen die Kennzeichnung des Spielorts (${locale})`, async ({ page }) => {
    await page.goto(path);

    const performance = page.locator('main').getByText('18:30 – 19:00').first().locator('..');
    await expect(performance).toContainText('8\u00a0–\u00a0Obere Altstadt');
  });
}

async function openVenue(page: import('@playwright/test').Page, projectName: string, venueId: string) {
  if (projectName === 'Mobile Chrome') {
    await page.locator('#mobile-list-btn').click();
    await page.locator(`#mobile-overlay button[data-venue-id="${venueId}"]`).click();
    return page.locator('#mobile-panel-content');
  }

  await page.locator(`section button[data-venue-id="${venueId}"]`).click();
  return page.locator('#venue-panel-content');
}

test('während des Festivals blendet ein Spielort vergangene Termine aus und zeigt alle noch kommenden', async ({ page }, testInfo) => {
  await page.clock.install({ time: new Date('2026-09-19T15:00:00+02:00') });
  await page.goto('/locations/');

  const panel = await openVenue(page, testInfo.project.name, '2');

  await expect(panel).toContainText('Später heute');
  await expect(panel).toContainText('16:30 – 17:00');
  await expect(panel).toContainText('21:00 – 22:00');
  await expect(panel).not.toContainText('14:00 – 14:30');
  await expect(panel).not.toContainText('Gerade kein Programm.');
});

test('der Festivaltag wechselt um 03:00 Uhr', async ({ page }, testInfo) => {
  await page.clock.install({ time: new Date('2026-09-20T03:00:00+02:00') });
  await page.goto('/locations/');

  const panel = await openVenue(page, testInfo.project.name, '2');

  await expect(panel).toContainText('Später heute');
  await expect(panel).toContainText('15:00 – 15:30');
  await expect(panel).toContainText('16:30 – 17:00');
  await expect(panel).not.toContainText('21:00 – 22:00');
});

test('außerhalb der Festivaltage bleiben alle Termine nach Tagen gruppiert sichtbar', async ({ page }, testInfo) => {
  await page.clock.install({ time: new Date('2026-09-17T12:00:00+02:00') });
  await page.goto('/locations/');

  const panel = await openVenue(page, testInfo.project.name, '2');

  await expect(panel).toContainText('Freitag, 18.09.');
  await expect(panel).toContainText('Samstag, 19.09.');
  await expect(panel).toContainText('Sonntag, 20.09.');
  await expect(panel).toContainText('17:00 – 18:00');
  await expect(panel).toContainText('21:00 – 22:00');
  await expect(panel).toContainText('15:00 – 15:30');
});

test('organisatorische Termine sind im Spielort-Panel typografisch gleichwertig', async ({ page }, testInfo) => {
  await page.clock.install({ time: new Date('2026-09-19T10:09:00+02:00') });
  await page.goto('/locations/');

  const panel = await openVenue(page, testInfo.project.name, '1');
  const artist = panel.getByRole('link').first();
  const organizational = panel.getByText('Vogelstimmen-Imitationswettbewerb', { exact: true });

  await expect(artist).toBeVisible();
  await expect(organizational).toBeVisible();
  await expect(organizational).toHaveCSS('font-weight', '600');
  await expect(organizational).toHaveCSS('font-style', 'normal');
  await expect(organizational).toHaveCSS('color', await artist.evaluate((element) => getComputedStyle(element).color));
});

for (const [locale, path] of [
  ['de', '/locations/'],
  ['en', '/en/locations/'],
] as const) {
  test(`Karte, Spielortauswahl und Panel verwenden dieselbe Kennzeichnung (${locale})`, async ({ page }, testInfo) => {
    await page.goto(path);
    await expect(page.locator('.spk-marker-label-svg text').first()).toHaveText('1');

    if (testInfo.project.name === 'Mobile Chrome') {
      await page.locator('#mobile-list-btn').click();
      const locationButton = page.locator('#mobile-overlay button[data-venue-id="1"]');
      await expect(locationButton).toContainText('1\u00a0–\u00a0Jungheinrich Bühne');
      await locationButton.click();
      await expect(page.locator('#mobile-panel-content h2')).toHaveText('1\u00a0–\u00a0Jungheinrich Bühne');
      return;
    }

    const locationButton = page.locator('section button[data-venue-id="1"]');
    await expect(locationButton).toContainText('1\u00a0–\u00a0Jungheinrich Bühne');
    await locationButton.click();
    await expect(page.locator('#venue-panel-content h2')).toHaveText('1\u00a0–\u00a0Jungheinrich Bühne');
  });
}
