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

test('Listenansicht zeigt bei 30-Minuten-Auftritten Endzeit und Spielort', async ({ page }) => {
  const activePanel = page.locator('[data-day-panel]:not(.hidden)');
  const halfHourEntry = activePanel.locator('.program-entry[data-artist="companiaexpress"]').filter({
    hasText: 'Cia Express',
  }).first();

  await expect(halfHourEntry).toContainText('18:30 – 19:00');
  await expect(halfHourEntry).toContainText('Obere Altstadt');
});

test('Tabellenansicht hält die Zeitspalte beim horizontalen Scrollen sichtbar', async ({ page }) => {
  await page.locator('#view-table-btn').click();

  const activePanel = page.locator('[data-day-panel]:not(.hidden)');
  const tablePanel = activePanel.locator('[data-view-panel="table"]');
  const scroller = tablePanel.locator('[data-program-grid-scroll]');
  const timeCell = scroller.locator('tbody tr:not(.hidden) .program-grid-time-cell').first();

  await expect(tablePanel).toBeVisible();
  await expect(timeCell).toBeVisible();

  const before = await timeCell.boundingBox();
  expect(before).not.toBeNull();

  await scroller.evaluate((element) => {
    element.scrollLeft = 320;
  });
  await expect.poll(() => scroller.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  const after = await timeCell.boundingBox();
  expect(after).not.toBeNull();
  expect(Math.abs(after!.x - before!.x)).toBeLessThan(2);
});

test('Mobile Sticky-Filter bleiben unter dem Seitenkopf', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  const header = page.locator('header[role="banner"]');
  const filters = page.locator('#program-filters');

  await page.evaluate(() => window.scrollTo(0, 480));

  await expect(header).toBeVisible();
  await expect(filters).toBeVisible();
  await expect.poll(async () => {
    const boxes = await Promise.all([
      header.boundingBox(),
      filters.boundingBox(),
    ]);
    if (!boxes[0] || !boxes[1]) return Number.NEGATIVE_INFINITY;
    return boxes[1].y - (boxes[0].y + boxes[0].height);
  }).toBeGreaterThanOrEqual(-1);
});

test('Tabellenansicht zeigt horizontale Scroll-Hinweise nur bei weiterem Inhalt', async ({ page }) => {
  await page.locator('#view-table-btn').click();

  const activePanel = page.locator('[data-day-panel]:not(.hidden)');
  const tablePanel = activePanel.locator('[data-view-panel="table"]');
  const scroller = tablePanel.locator('[data-program-grid-scroll]');

  await expect(tablePanel).toBeVisible();
  await expect(tablePanel).toHaveAttribute('data-scroll-left', 'false');
  await expect(tablePanel).toHaveAttribute('data-scroll-right', 'true');

  await scroller.evaluate((element) => {
    element.scrollLeft = 320;
  });

  await expect(tablePanel).toHaveAttribute('data-scroll-left', 'true');
  await expect(tablePanel).toHaveAttribute('data-scroll-right', 'true');

  await scroller.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });

  await expect(tablePanel).toHaveAttribute('data-scroll-left', 'true');
  await expect(tablePanel).toHaveAttribute('data-scroll-right', 'false');
});

test('URL-Parameter öffnen einen konkreten Tag und Spielort', async ({ page }) => {
  await page.goto('/program/?day=2026-09-19&venue=1&view=list&artist=organization_vogelstimmen');

  await expect(page.locator('#tab-2026-09-19')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-2026-09-19')).toBeVisible();
  await expect(page.locator('#venue-filter')).toHaveValue('1');
  await expect(page.locator('#view-list-btn')).toHaveAttribute('aria-pressed', 'true');
  const linkedEntry = page.locator('#panel-2026-09-19 .program-entry[data-location="1"][data-artist="organization_vogelstimmen"]:not(.hidden)').filter({
    hasText: 'Vogelstimmen-Imitationswettbewerb',
  });
  await expect(linkedEntry).toBeAttached();
  await expect(linkedEntry).toHaveAttribute('data-deep-link-highlight', 'true');
});
