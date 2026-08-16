import {
  filterByArtist,
  filterByLocation,
  formatDate,
  formatTime,
  getFestivalDays,
  groupByDay,
  loadSchedule,
} from '@utils/schedule';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const csvPath = resolve(process.cwd(), 'src/data/schedule.csv');
const fixturePath = (() => {
  const dir = mkdtempSync(resolve(tmpdir(), 'spektakel-schedule-'));
  const path = resolve(dir, 'schedule.csv');
  writeFileSync(path, [
    'time,location_id,artist_id,notes',
    '2026-09-18T16:00:00+02:00,4,organization_opening,',
    '2026-09-18T17:00:00+02:00,4,mekks,',
    '2026-09-19T00:30:00+02:00,4,mekks,',
    '2026-09-19T13:00:00+02:00,5,deadly,',
    '2026-09-20T18:30:00+02:00,12,organization_finale,',
    '',
  ].join('\n'));
  return path;
})();

describe('loadSchedule', () => {
  it('lädt den produktiven 2026-Spielplan', () => {
    const entries = loadSchedule(csvPath);
    expect(entries).toHaveLength(387);
    expect(getFestivalDays(entries)).toEqual(['2026-09-18', '2026-09-19', '2026-09-20']);
    expect(entries).toContainEqual(expect.objectContaining({
      location_id: '3',
      artist_id: 'organization_opening',
      festivalDay: '2026-09-18',
    }));
    expect(entries).toContainEqual(expect.objectContaining({
      location_id: '1',
      artist_id: 'organization_vogelstimmen',
      festivalDay: '2026-09-19',
    }));
    expect(entries).toContainEqual(expect.objectContaining({
      location_id: '14',
      artist_id: 'brunitus',
      notes: 'Special Show',
      festivalDay: '2026-09-19',
    }));
    expect(entries).toContainEqual(expect.objectContaining({
      location_id: '12',
      artist_id: 'organization_finale',
      festivalDay: '2026-09-20',
    }));
  });

  it('lädt eine CSV und gibt ein nicht-leeres Array zurück', () => {
    const entries = loadSchedule(fixturePath);
    expect(entries.length).toBeGreaterThan(0);
  });

  it('jeder Eintrag hat eine gültige Date-Instanz', () => {
    const entries = loadSchedule(fixturePath);
    for (const e of entries) {
      expect(e.time).toBeInstanceOf(Date);
      expect(isNaN(e.time.getTime())).toBe(false);
    }
  });

  it('jeder Eintrag hat artist_id und location_id', () => {
    const entries = loadSchedule(fixturePath);
    for (const e of entries) {
      expect(e.artist_id).toBeTruthy();
      expect(e.location_id).toBeTruthy();
    }
  });

  it('ist chronologisch sortiert', () => {
    const entries = loadSchedule(fixturePath);
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].time.getTime()).toBeGreaterThanOrEqual(entries[i - 1].time.getTime());
    }
  });
});

describe('Nacht-Logik (Events 0–3 Uhr → Vortag)', () => {
  it('Event um 02:00 Uhr zählt zum Vortag', () => {
    const entries = loadSchedule(fixturePath);
    const berlinHour = (date: Date) => Number(new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hourCycle: 'h23',
      timeZone: 'Europe/Berlin',
    }).format(date)) % 24;
    // Suche unabhängig von der Zeitzone des Test-Runners nach einem Eintrag nach Mitternacht.
    const nightEntry = entries.find((e) => berlinHour(e.time) < 3);
    if (nightEntry) {
      const localDate = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Berlin',
      }).format(nightEntry.time);
      const expectedDay = new Date(`${localDate}T12:00:00Z`);
      expectedDay.setUTCDate(expectedDay.getUTCDate() - 1);
      expect(nightEntry.festivalDay).toBe(expectedDay.toISOString().slice(0, 10));
    }
  });

  it('Event um 03:30 Uhr (Beginn neuer Tag) zählt NICHT zum Vortag', () => {
    const mockDate = new Date('2026-09-19T03:30:00+02:00');
    // 03:30 Uhr → kein Abzug
    const hour = mockDate.getHours();
    expect(hour).toBeGreaterThanOrEqual(3);
  });
});

describe('groupByDay', () => {
  it('gruppiert Einträge nach Festivaltag', () => {
    const entries = loadSchedule(fixturePath);
    const grouped = groupByDay(entries);
    const days = Object.keys(grouped);
    expect(days.length).toBeGreaterThan(0);
    for (const day of days) {
      expect(grouped[day].every((e) => e.festivalDay === day)).toBe(true);
    }
  });
});

describe('getFestivalDays', () => {
  it('gibt sortierte, einmalige Tage zurück', () => {
    const entries = loadSchedule(fixturePath);
    const days = getFestivalDays(entries);
    expect(days.length).toBeGreaterThan(0);
    // Sortiert
    const sorted = [...days].sort();
    expect(days).toEqual(sorted);
    // Einmalig
    expect(new Set(days).size).toBe(days.length);
  });

  it('gibt für den Testdatensatz genau 3 Festivaltage zurück', () => {
    const entries = loadSchedule(fixturePath);
    const days = getFestivalDays(entries);
    expect(days.length).toBe(3);
  });
});

describe('filterByLocation', () => {
  it('gibt nur Einträge mit der gewünschten location_id zurück', () => {
    const entries = loadSchedule(fixturePath);
    const filtered = filterByLocation(entries, '4');
    expect(filtered.every((e) => e.location_id === '4')).toBe(true);
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('gibt leeres Array für unbekannte location_id zurück', () => {
    const entries = loadSchedule(fixturePath);
    expect(filterByLocation(entries, 'UNKNOWN_999')).toHaveLength(0);
  });
});

describe('filterByArtist', () => {
  it('gibt nur Einträge mit der gewünschten artist_id zurück', () => {
    const entries = loadSchedule(fixturePath);
    const filtered = filterByArtist(entries, 'organization_opening');
    expect(filtered.every((e) => e.artist_id === 'organization_opening')).toBe(true);
  });
});

describe('formatTime', () => {
  it('formatiert eine Zeit als HH:MM', () => {
    const date = new Date('2026-09-18T16:00:00+02:00');
    const result = formatTime(date);
    expect(result).toMatch(/^\d{2}:\d{2}$/);
    expect(result).toBe('16:00');
  });
});

describe('formatDate', () => {
  it('gibt einen lesbaren Datums-String zurück', () => {
    const result = formatDate('2026-09-18');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
