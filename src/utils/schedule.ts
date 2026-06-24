/**
 * SPEKTAKEL! – Spielplan-Utilities
 *
 * Lädt und parst schedule.csv zur Build-Zeit.
 * Verknüpft artist_id / location_id mit den Content-Collections.
 * Gruppiert nach Festivaltag (Events 0–3 Uhr zählen zum Vortag).
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ─── Typen ──────────────────────────────────────────────────────────────────

export interface RawScheduleRow {
  time: string; // ISO 8601
  location_id: string;
  artist_id: string;
  notes: string;
}

export interface ScheduleEntry {
  /** ISO-Datumstring des Auftritts */
  time: Date;
  /** Festivaltag-Key: z. B. "2026-09-18" */
  festivalDay: string;
  location_id: string;
  artist_id: string;
  notes: string;
}

export type ScheduleByDay = Record<string, ScheduleEntry[]>;

// ─── Konstanten ─────────────────────────────────────────────────────────────

/**
 * Festival-Zeitzone (Deutschland). Hardcodiert damit GitHub-Actions
 * (UTC) keine abweichenden Ergebnisse liefert.
 */
export const FESTIVAL_TZ = 'Europe/Berlin';

/**
 * Events bis 3 Uhr morgens zählen noch zum Vortag
 * (Mitternachtslogik aus dem alten Projekt).
 */
export const NIGHT_CUTOFF_HOUR = 3;

// ─── Parser ─────────────────────────────────────────────────────────────────

/**
 * Parst eine CSV-Zeile nach dem Format:
 * time,location_id,artist_id,notes
 */
function parseRow(line: string): RawScheduleRow | null {
  const parts = line.split(',');
  if (parts.length < 3) return null;
  const [time, location_id, artist_id, ...notesParts] = parts;
  if (!time || !location_id || !artist_id) return null;
  return {
    time: time.trim(),
    location_id: location_id.trim(),
    artist_id: artist_id.trim(),
    notes: notesParts.join(',').trim(),
  };
}

/**
 * Gibt die lokale Stunde (0–23) einer UTC-Zeit in der Festival-Zeitzone zurück.
 * Timezone-sicher: funktioniert unabhängig vom System-TZ des Build-Servers.
 */
function getBerlinHour(date: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      hourCycle: 'h23',
      timeZone: FESTIVAL_TZ,
    }).format(date),
  ) % 24;
}

/**
 * Gibt das Kalenderdatum (yyyy-mm-dd) einer UTC-Zeit in der Festival-Zeitzone zurück.
 * en-CA liefert zuverlässig ISO-Datumsformat.
 */
function getBerlinDateString(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: FESTIVAL_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Berechnet den Festivaltag-Key für einen Zeitpunkt.
 * Events von 00:00–02:59 Uhr Berlin-Zeit werden dem Vortag zugerechnet.
 * Timezone-sicher: nutzt Intl statt getHours() (System-TZ-unabhängig).
 */
function getFestivalDay(date: Date): string {
  const berlinHour = getBerlinHour(date);
  if (berlinHour < NIGHT_CUTOFF_HOUR) {
    // Einen Kalendertag zurück (in Berlin-Zeit)
    const prevDay = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    return getBerlinDateString(prevDay);
  }
  return getBerlinDateString(date);
}

/**
 * Sortiert Uhrzeitstrings (HH:MM) in chronologischer Reihenfolge.
 * Stunden < NIGHT_CUTOFF_HOUR (0–2 Uhr Berlin) werden als "nach Mitternacht"
 * behandelt und erscheinen nach 23:xx – korrekte Reihenfolge für Festivaltage.
 */
export function sortFestivalTimeSlots(slots: string[]): string[] {
  return [...slots].sort((a, b) => {
    const toMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      // 0–2 Uhr → 24–26 Uhr (erscheint nach Mitternacht)
      return (h < NIGHT_CUTOFF_HOUR ? h + 24 : h) * 60 + m;
    };
    return toMin(a) - toMin(b);
  });
}

/**
 * Lädt und parst die schedule.csv.
 * @param csvPath Absoluter Pfad zur CSV-Datei (default: src/data/schedule.csv)
 */
export function loadSchedule(csvPath?: string): ScheduleEntry[] {
  const path = csvPath ?? resolve(process.cwd(), 'src/data/schedule.csv');
  const raw = readFileSync(path, 'utf-8');
  const lines = raw.split('\n').filter(Boolean);

  // Erste Zeile ist Header
  const [, ...dataLines] = lines;

  const entries: ScheduleEntry[] = [];

  for (const line of dataLines) {
    const row = parseRow(line);
    if (!row) continue;

    const time = new Date(row.time);
    if (isNaN(time.getTime())) continue;

    entries.push({
      time,
      festivalDay: getFestivalDay(time),
      location_id: row.location_id,
      artist_id: row.artist_id,
      notes: row.notes,
    });
  }

  // Chronologisch sortieren
  return entries.sort((a, b) => a.time.getTime() - b.time.getTime());
}

/**
 * Gruppiert ScheduleEntries nach Festivaltag.
 */
export function groupByDay(entries: ScheduleEntry[]): ScheduleByDay {
  return entries.reduce<ScheduleByDay>((acc, entry) => {
    const day = entry.festivalDay;
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {});
}

/**
 * Gibt alle distinkten Festivaltage zurück, sortiert aufsteigend.
 */
export function getFestivalDays(entries: ScheduleEntry[]): string[] {
  return [...new Set(entries.map((e) => e.festivalDay))].sort();
}

/**
 * Filtert Einträge nach location_id.
 */
export function filterByLocation(entries: ScheduleEntry[], location_id: string): ScheduleEntry[] {
  return entries.filter((e) => e.location_id === location_id);
}

/**
 * Filtert Einträge nach artist_id.
 */
export function filterByArtist(entries: ScheduleEntry[], artist_id: string): ScheduleEntry[] {
  return entries.filter((e) => e.artist_id === artist_id);
}

/**
 * Prüft ob ein Eintrag gerade live ist (clientseitig, via Date.now()).
 */
export function isLive(entry: ScheduleEntry, durationMinutes = 45): boolean {
  const now = Date.now();
  const start = entry.time.getTime();
  const end = start + durationMinutes * 60 * 1000;
  return now >= start && now < end;
}

/**
 * Formatiert eine Zeit als "HH:MM".
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
  });
}

/**
 * Formatiert ein Datum als "Fr 19.09." o.ä. (de-DE).
 */
export function formatDate(dateStr: string, locale: 'de' | 'en' = 'de'): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
}

// ─── Slot-Merging ────────────────────────────────────────────────────────────

/** Dauer eines Planungs-Slots in Millisekunden (30 Minuten). */
const SLOT_MS = 30 * 60 * 1000;

/**
 * Ein gemergter Auftritt: ein oder mehrere aufeinanderfolgende 30-min-Slots
 * desselben Künstlers an derselben Location.
 */
export interface MergedEntry {
  artist_id: string;
  location_id: string;
  /** Beginn des ersten Slots */
  startTime: Date;
  /** Ende des letzten Slots (= startTime des letzten + 30 min) */
  endTime: Date;
  /** Anzahl gemergter Slots – dient als rowspan im Tabellen-Grid */
  slotCount: number;
  notes: string;
  festivalDay: string;
}

/**
 * Fasst aufeinanderfolgende 30-min-Slots desselben Künstlers an derselben
 * Location zu einem MergedEntry zusammen.
 *
 * Zwei Auftritte desselben Künstlers mit einer Lücke (≥ 1 Slot) dazwischen
 * bleiben getrennte Einträge.
 */
export function mergeConsecutiveSlots(entries: ScheduleEntry[]): MergedEntry[] {
  // Aufsteigend sortieren (loadSchedule liefert bereits sorted, aber sicher ist sicher)
  const sorted = [...entries].sort((a, b) => a.time.getTime() - b.time.getTime());

  // Aktive Runs: key = `${location_id}__${artist_id}`
  const runs = new Map<string, MergedEntry>();
  const result: MergedEntry[] = [];

  for (const entry of sorted) {
    const key = `${entry.location_id}__${entry.artist_id}`;
    const existing = runs.get(key);

    if (existing && entry.time.getTime() === existing.endTime.getTime()) {
      // Nahtlose Fortsetzung → Run verlängern
      existing.endTime = new Date(entry.time.getTime() + SLOT_MS);
      existing.slotCount++;
    } else {
      // Lücke oder neuer Eintrag → alten Run committen, neuen starten
      if (existing) result.push(existing);
      runs.set(key, {
        artist_id: entry.artist_id,
        location_id: entry.location_id,
        startTime: entry.time,
        endTime: new Date(entry.time.getTime() + SLOT_MS),
        slotCount: 1,
        notes: entry.notes,
        festivalDay: entry.festivalDay,
      });
    }
  }

  // Verbleibende offene Runs committen
  for (const run of runs.values()) result.push(run);

  return result.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}
