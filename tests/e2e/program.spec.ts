import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gtm-consent', 'declined'));
  await page.goto('/program/');
});

test('Tagesauswahl wechselt das sichtbare Programm', async ({ page }) => {
  const tabs = page.getByRole('tab');
  const firstTab = tabs.nth(0);
  const secondTab = tabs.nth(1);
  const firstPanelId = await firstTab.getAttribute('aria-controls');
  const secondPanelId = await secondTab.getAttribute('aria-controls');

  await expect(firstTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator(`#${firstPanelId}`)).toBeVisible();

  await secondTab.click();

  await expect(secondTab).toHaveAttribute('aria-selected', 'true');
  await expect(firstTab).toHaveAttribute('aria-selected', 'false');
  await expect(page.locator(`#${secondPanelId}`)).toBeVisible();
  await expect(page.locator(`#${firstPanelId}`)).toBeHidden();
});

test('Kategorie-Filter zeigt nur passende Programmeinträge', async ({ page }) => {
  const activePanel = page.locator('[data-day-panel]:not(.hidden)');
  const filterCategory = await activePanel.locator('.program-entry[data-category]:not([data-category=""])').first().getAttribute('data-category');
  expect(filterCategory).toBeTruthy();

  const filter = page.locator(`#program-filters button[data-category="${filterCategory}"]`);
  await filter.click();

  await expect(filter).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#program-filters button[data-category=""]')).toHaveAttribute('aria-pressed', 'false');
  await expect(activePanel.locator(`.program-entry[data-category="${filterCategory}"]:not(.hidden)`).first()).toBeAttached();
  await expect(activePanel.locator(`.program-entry:not([data-category="${filterCategory}"]).hidden`).first()).toBeAttached();
});
