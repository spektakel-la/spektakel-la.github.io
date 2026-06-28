import matter from 'gray-matter';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

// ─── Schemas (gespiegelt aus src/content.config.ts) ──────────────────────────

const imagePositionSchema = z.union([
  z.enum(['top', 'center', 'bottom']),
  z.number().int().min(0).max(100),
]);

const artistSchema = z.object({
  artist_id: z.string(),
  name: z.string(),
  images: z.array(z.string()).min(1).optional(),
  image_position: imagePositionSchema.optional(),
  duration: z.string().optional(),
  hut_act: z.boolean().optional(),
  facebook: z.string().url().nullish(),
  instagram: z.string().url().nullish(),
  youtube: z.string().url().nullish(),
  vimeo: z.string().url().nullish(),
  homepage: z.string().url().nullish(),
  organizational: z.boolean().optional(),
  de: z.object({
    country: z.string().optional(),
    description: z.string(),
    highlight: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).optional(),
    age_recommendation: z.string().optional(),
    language: z.string().optional(),
    special: z.string().optional(),
  }),
  en: z.object({
    country: z.string().optional(),
    description: z.string(),
    highlight: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).optional(),
    age_recommendation: z.string().optional(),
    language: z.string().optional(),
    special: z.string().optional(),
  }),
});

const locationSchema = z.object({
  location_id: z.string(),
  sort_order: z.number(),
  description: z.string(),
  gps: z.tuple([z.number(), z.number()]),
  marker_color: z.string(),
  organizational: z.boolean().optional(),
});

const sponsorSchema = z.object({
  name: z.string(),
  logo: z.string(),
  url: z.string().url().optional(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadMarkdowns(dir: string) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  return files.map((file) => {
    const raw = readFileSync(resolve(dir, file), 'utf-8');
    const { data } = matter(raw);
    return { file, data };
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Artist-Collection', () => {
  const dir = resolve(process.cwd(), 'src/content/artists');
  const docs = loadMarkdowns(dir);

  it('findet mind. 1 Artist-Markdown', () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  for (const { file, data } of docs) {
    it(`${file} – Zod-Schema gültig`, () => {
      const result = artistSchema.safeParse(data);
      if (!result.success) {
        console.error(file, result.error.format());
      }
      expect(result.success).toBe(true);
    });
  }
});

describe('Location-Collection', () => {
  const dir = resolve(process.cwd(), 'src/content/locations');
  const docs = loadMarkdowns(dir);

  it('findet mind. 1 Location-Markdown', () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  for (const { file, data } of docs) {
    it(`${file} – Zod-Schema gültig`, () => {
      const result = locationSchema.safeParse(data);
      if (!result.success) {
        console.error(file, result.error.format());
      }
      expect(result.success).toBe(true);
    });
  }
});

describe('Sponsor-Collection', () => {
  const dir = resolve(process.cwd(), 'src/content/sponsors');
  const docs = loadMarkdowns(dir);

  it('findet mind. 1 Sponsor-Markdown', () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  for (const { file, data } of docs) {
    it(`${file} – Zod-Schema gültig`, () => {
      const result = sponsorSchema.safeParse(data);
      if (!result.success) {
        console.error(file, result.error.format());
      }
      expect(result.success).toBe(true);
    });
  }
});
