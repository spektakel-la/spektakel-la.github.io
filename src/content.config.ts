import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const imagePositionSchema = z.union([
  z.enum(['top', 'center', 'bottom']),
  z.number().int().min(0).max(100),
]);

const localizedArtistSchema = z.object({
  country: z.string().optional(),
  description: z.string(),
  highlight: z.string().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).optional(),
  age_recommendation: z.string().optional(),
  language: z.string().optional(),
  special: z.string().optional(),
});

const artists = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/artists' }),
  schema: z.object({
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
    tiktok: z.string().url().nullish(),
    homepage: z.string().url().nullish(),
    organizational: z.boolean().optional(),
    de: localizedArtistSchema,
    en: localizedArtistSchema,
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    location_id: z.string(),
    sort_order: z.number(),
    description: z.string(),
    gps: z.tuple([z.number(), z.number()]),
    marker_color: z.string(),
    /** "i" für Info-Standorte; sonst wird location_id als Label verwendet */
    location_label: z.string().optional(),
    organizational: z.boolean().optional(),
  }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sponsors' }),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().url().optional(),
  }),
});

export const collections = { artists, locations, sponsors };
