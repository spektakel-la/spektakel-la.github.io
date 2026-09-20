import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('gtm-consent', 'declined');
    Date.now = () => Date.parse('2026-09-18T10:00:00.000Z');
  });
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

test('Aktueller Festivaltag wird beim Öffnen automatisch ausgewählt', async ({ page }) => {
  await page.addInitScript(() => {
    Date.now = () => Date.parse('2026-09-19T10:00:00.000Z');
  });
  await page.reload({ waitUntil: 'load' });

  const friday = page.locator('#tab-2026-09-18');
  const saturday = page.locator('#tab-2026-09-19');

  await expect(saturday).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-2026-09-19')).toBeVisible();

  await friday.click();
  await expect(friday).toHaveAttribute('aria-selected', 'true');
  await expect(saturday).toHaveAttribute('aria-selected', 'false');
});

test('Listenansicht springt am aktuellen Festivaltag direkt zum ersten Live-Eintrag', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.addInitScript(() => {
    Date.now = () => Date.parse('2026-09-18T18:45:00+02:00');
  });
  await page.reload({ waitUntil: 'load' });

  const activePanel = page.locator('[data-day-panel]:not(.hidden)');
  const firstLiveEntry = activePanel.locator('.program-entry[data-live="true"]:not(.hidden)').first();
  const filters = page.locator('#program-filters');

  await expect(page.locator('#tab-2026-09-18')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#view-list-btn')).toHaveAttribute('aria-pressed', 'true');
  await expect(firstLiveEntry).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect.poll(async () => {
    const [entryBox, filterBox] = await Promise.all([
      firstLiveEntry.boundingBox(),
      filters.boundingBox(),
    ]);
    if (!entryBox || !filterBox) return Number.NEGATIVE_INFINITY;
    return entryBox.y - (filterBox.y + filterBox.height);
  }).toBeGreaterThanOrEqual(6);
  await expect.poll(async () => {
    const [entryBox, filterBox] = await Promise.all([
      firstLiveEntry.boundingBox(),
      filters.boundingBox(),
    ]);
    if (!entryBox || !filterBox) return Number.POSITIVE_INFINITY;
    return entryBox.y - (filterBox.y + filterBox.height);
  }).toBeLessThanOrEqual(10);
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
  await expect(halfHourEntry).toContainText('8\u00a0–\u00a0Obere Altstadt');
});

test('Listenansicht sortiert gleichzeitige Auftritte nach der Spielort-Reihenfolge', async ({ page }) => {
  await page.goto('/program/?day=2026-09-20&view=list');

  const simultaneousEntries = page.locator(
    '#panel-2026-09-20 .program-entry[data-time-start="2026-09-20T10:30:00.000Z"]',
  );

  await expect(simultaneousEntries).toHaveCount(4);
  await expect(simultaneousEntries.evaluateAll((entries) => (
    entries.map((entry) => entry.getAttribute('data-location'))
  ))).resolves.toEqual(['1', '6', '10', '12']);
});

test('Künstler-Kurzinfos öffnen sich mit Bild direkt in der Listenansicht', async ({ page }) => {
  const previewImageRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('/assets/img/artists/cards/companiaexpress.webp')) {
      previewImageRequests.push(request.url());
    }
  });
  await page.reload({ waitUntil: 'load' });
  await page.locator('#view-list-btn').click();
  const activePanel = page.locator('[data-day-panel]:not(.hidden)');
  const entry = activePanel.locator('.program-entry[data-artist="companiaexpress"]').first();
  const toggle = entry.locator('[data-program-preview-toggle]');
  const preview = entry.locator('[data-program-preview]');
  const previewImage = preview.locator('img');

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(preview).toBeHidden();
  await expect(previewImage).not.toHaveAttribute('src', /.+/);
  await expect(previewImage).toHaveAttribute(
    'data-src',
    '/assets/img/artists/cards/companiaexpress.webp',
  );
  expect(previewImageRequests).toHaveLength(0);

  const [toggleBox, summaryBox, timeBox] = await Promise.all([
    toggle.boundingBox(),
    entry.locator('.program-entry-summary').boundingBox(),
    entry.locator('.program-entry-time').boundingBox(),
  ]);
  expect(toggleBox).not.toBeNull();
  expect(summaryBox).not.toBeNull();
  expect(timeBox).not.toBeNull();
  expect(toggleBox!.width).toBeGreaterThan(summaryBox!.width - timeBox!.width - 50);

  await toggle.click({ position: { x: toggleBox!.width - 8, y: toggleBox!.height / 2 } });

  await expect(page).toHaveURL(/\/program\/$/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(preview).toBeVisible();

  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(preview).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(preview).toBeVisible();
  await expect(previewImage).toBeVisible();
  await expect(previewImage).toHaveAttribute(
    'src',
    '/assets/img/artists/cards/companiaexpress.webp',
  );
  await expect.poll(() => previewImageRequests).toHaveLength(1);
  await expect(preview).toContainText('zwei Detektive');
  await expect(preview.getByRole('link', { name: /Mehr über Cia Express/ })).toHaveAttribute(
    'href',
    '/artists/companiaexpress/',
  );

  const secondToggle = activePanel
    .locator('.program-entry:not([data-artist="companiaexpress"]) [data-program-preview-toggle]')
    .first();
  await secondToggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(preview).toBeHidden();
});

test('Organisatorische Termine verwenden dieselbe Kurzinfo ohne Detail-Link', async ({ page }) => {
  await page.locator('#tab-2026-09-19').click();
  await page.locator('#view-list-btn').click();
  const entry = page
    .locator('#panel-2026-09-19 .program-entry[data-artist="organization_vogelstimmen"]')
    .first();

  await entry.locator('[data-program-preview-toggle]').click();

  const preview = entry.locator('[data-program-preview]');
  await expect(preview).toBeVisible();
  await expect(preview).toContainText('Singen, piepen, zwitschern');
  await expect(preview.getByRole('link')).toHaveCount(0);
});

test('Live-Zustand verändert die Grid-Struktur der Programmeinträge nicht', async ({ page }) => {
  await expect(page.locator('.program-entry .live-dot')).toHaveCount(0);
  await expect(page.locator('.program-entry[data-live]').first()).toHaveAttribute(
    'data-live',
    /^(true|false)$/,
  );
});

test('Spielorte sind in Liste, Tabelle und Filter gekennzeichnet', async ({ page }) => {
  const activePanel = page.locator('[data-day-panel]:not(.hidden)');

  await expect(page.locator('#venue-filter option[value="1"]')).toHaveText('1\u00a0–\u00a0Jungheinrich Bühne');
  await expect(activePanel.locator('.program-entry[data-location="8"]').first()).toContainText('8\u00a0–\u00a0Obere Altstadt');

  await page.locator('#view-table-btn').click();
  await expect(activePanel.locator('th[data-col-id="1"]')).toContainText('1\u00a0–\u00a0Jungheinrich Bühne');
});

test('Favorisierte Künstler werden im Programm markiert', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('spektakel-favorites', JSON.stringify(['companiaexpress']));
  });
  await page.reload({ waitUntil: 'load' });

  const activePanel = page.locator('[data-day-panel]:not(.hidden)');
  const favoriteListEntry = activePanel.locator('.program-entry[data-artist="companiaexpress"]').filter({
    hasText: 'Cia Express',
  }).first();

  await page.locator('#view-list-btn').click();
  await expect(favoriteListEntry).toHaveAttribute('data-favorite', 'true');
  await expect(favoriteListEntry.locator('.program-favorite-star')).toBeVisible();

  await page.locator('#view-table-btn').click();
  await expect(activePanel.locator('[data-program-grid-entry][data-artist="companiaexpress"]').first()).toHaveAttribute('data-favorite', 'true');
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
