import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gtm-consent', 'declined'));
  await page.goto('/impressions/');
});

test('zeigt das Video von 2026 als erstes Galerieelement', async ({ page }) => {
  const firstTile = page.locator('#gallery-grid > *').first();

  await expect(firstTile).toHaveAttribute('href', 'https://www.youtube.com/watch?v=TvI-kyNMxKQ');
  await expect(firstTile).toContainText('Spektakel Landshut 2026');
});

test('Lightbox lässt sich öffnen, navigieren und schließen', async ({ page }) => {
  const lightbox = page.getByRole('dialog', { name: 'Vollbildgalerie' });

  await page.getByRole('button', { name: 'Bild öffnen 5', exact: true }).click();
  await expect(lightbox).toBeVisible();
  const initialCounter = await lightbox.locator('.lightbox__counter').textContent();
  const imageCount = initialCounter?.match(/^1 \/ (\d+)$/)?.[1];
  expect(imageCount).toBeTruthy();

  await lightbox.getByRole('button', { name: 'Nächstes Bild' }).click();
  await expect(lightbox.locator('.lightbox__counter')).toHaveText(`2 / ${imageCount}`);

  await lightbox.getByRole('button', { name: 'Galerie schließen' }).click();
  await expect(lightbox).toBeHidden();
});
