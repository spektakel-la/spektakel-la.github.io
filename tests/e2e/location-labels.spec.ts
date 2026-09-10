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
