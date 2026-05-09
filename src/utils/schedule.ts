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
  /** Festivaltag-Key: z. B. "2025-09-19" */
  festivalDay: string;
  location_id: string;
  artist_id: string;
  notes: string;
}

export type ScheduleByDay = Record<string, ScheduleEntry[]>;

// ─── Konstanten ─────────────────────────────────────────────────────────────

/**
 * Events bis 3 Uhr morgens zählen noch zum Vortag
 * (Nachtprogramm-Logik aus altem Projekt).
 */
const NIGHT_CUTOFF_HOUR = 3;

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
 * Berechnet den Festivaltag-Key für einen Zeitpunkt.
 * Events von 00:00–02:59 Uhr werden dem Vortag zugerechnet.
 */
function getFestivalDay(date: Date): string {
  const d = new Date(date);
  if (d.getHours() < NIGHT_CUTOFF_HOUR) {
    d.setDate(d.getDate() - 1);
  }
  return d.toISOString().slice(0, 10);
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
