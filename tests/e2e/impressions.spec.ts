import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gtm-consent', 'declined'));
  await page.goto('/impressions/');
});

test('Lightbox lässt sich öffnen, navigieren und schließen', async ({ page }) => {
  const lightbox = page.getByRole('dialog', { name: 'Vollbildgalerie' });

  await page.getByRole('button', { name: 'Bild öffnen 4', exact: true }).click();
  await expect(lightbox).toBeVisible();
  const initialCounter = await lightbox.locator('.lightbox__counter').textContent();
  const imageCount = initialCounter?.match(/^1 \/ (\d+)$/)?.[1];
  expect(imageCount).toBeTruthy();

  await lightbox.getByRole('button', { name: 'Nächstes Bild' }).click();
  await expect(lightbox.locator('.lightbox__counter')).toHaveText(`2 / ${imageCount}`);

  await lightbox.getByRole('button', { name: 'Galerie schließen' }).click();
  await expect(lightbox).toBeHidden();
});
