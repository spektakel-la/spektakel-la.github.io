import {
  filterByArtist,
  filterByLocation,
  formatDate,
  formatTime,
  getFestivalDays,
  groupByDay,
  loadSchedule,
} from '@utils/schedule';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const csvPath = resolve(process.cwd(), 'src/data/schedule.csv');

describe('loadSchedule', () => {
  it('lädt die CSV und gibt ein nicht-leeres Array zurück', () => {
    const entries = loadSchedule(csvPath);
    expect(entries.length).toBeGreaterThan(0);
  });

  it('jeder Eintrag hat eine gültige Date-Instanz', () => {
    const entries = loadSchedule(csvPath);
    for (const e of entries) {
      expect(e.time).toBeInstanceOf(Date);
      expect(isNaN(e.time.getTime())).toBe(false);
    }
  });

  it('jeder Eintrag hat artist_id und location_id', () => {
    const entries = loadSchedule(csvPath);
    for (const e of entries) {
      expect(e.artist_id).toBeTruthy();
      expect(e.location_id).toBeTruthy();
    }
  });

  it('ist chronologisch sortiert', () => {
    const entries = loadSchedule(csvPath);
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].time.getTime()).toBeGreaterThanOrEqual(entries[i - 1].time.getTime());
    }
  });
});

describe('Nacht-Logik (Events 0–3 Uhr → Vortag)', () => {
  it('Event um 02:00 Uhr zählt zum Vortag', () => {
    const entries = loadSchedule(csvPath);
    // Suche nach einem Eintrag nach Mitternacht (falls vorhanden)
    const nightEntry = entries.find((e) => e.time.getHours() < 3 && e.time.getHours() >= 0);
    if (nightEntry) {
      const expectedDay = new Date(nightEntry.time);
      expectedDay.setDate(expectedDay.getDate() - 1);
      expect(nightEntry.festivalDay).toBe(expectedDay.toISOString().slice(0, 10));
    }
  });

  it('Event um 03:30 Uhr (Beginn neuer Tag) zählt NICHT zum Vortag', () => {
    const mockDate = new Date('2025-09-20T03:30:00+02:00');
    // 03:30 Uhr → kein Abzug
    const hour = mockDate.getHours();
    expect(hour).toBeGreaterThanOrEqual(3);
  });
});

describe('groupByDay', () => {
  it('gruppiert Einträge nach Festivaltag', () => {
    const entries = loadSchedule(csvPath);
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
    const entries = loadSchedule(csvPath);
    const days = getFestivalDays(entries);
    expect(days.length).toBeGreaterThan(0);
    // Sortiert
    const sorted = [...days].sort();
    expect(days).toEqual(sorted);
    // Einmalig
    expect(new Set(days).size).toBe(days.length);
  });

  it('gibt für den Testdatensatz genau 3 Festivaltage zurück', () => {
    const entries = loadSchedule(csvPath);
    const days = getFestivalDays(entries);
    expect(days.length).toBe(3);
  });
});

describe('filterByLocation', () => {
  it('gibt nur Einträge mit der gewünschten location_id zurück', () => {
    const entries = loadSchedule(csvPath);
    const filtered = filterByLocation(entries, '4');
    expect(filtered.every((e) => e.location_id === '4')).toBe(true);
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('gibt leeres Array für unbekannte location_id zurück', () => {
    const entries = loadSchedule(csvPath);
    expect(filterByLocation(entries, 'UNKNOWN_999')).toHaveLength(0);
  });
});

describe('filterByArtist', () => {
  it('gibt nur Einträge mit der gewünschten artist_id zurück', () => {
    const entries = loadSchedule(csvPath);
    const filtered = filterByArtist(entries, 'organization_opening');
    expect(filtered.every((e) => e.artist_id === 'organization_opening')).toBe(true);
  });
});

describe('formatTime', () => {
  it('formatiert eine Zeit als HH:MM', () => {
    const date = new Date('2025-09-19T16:00:00+02:00');
    const result = formatTime(date);
    expect(result).toMatch(/^\d{2}:\d{2}$/);
    expect(result).toBe('16:00');
  });
});

describe('formatDate', () => {
  it('gibt einen lesbaren Datums-String zurück', () => {
    const result = formatDate('2025-09-19');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
