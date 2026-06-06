import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const artists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artists' }),
  schema: z.object({
    artist_id: z.string(),
    name: z.string(),
    images: z.array(z.string()).min(1).optional(),
    image_position: z.enum(['top', 'center', 'bottom']).optional(),
    duration: z.string().optional(),
    hut_act: z.boolean().optional(),
    facebook: z.string().url().nullish(),
    instagram: z.string().url().nullish(),
    youtube: z.string().url().nullish(),
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
    nightlife: z.boolean().optional(),
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

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    file: z.string(),
    category: z.enum(['akrobatik', 'musik', 'comedy', 'street_art', 'nightlife']),
    year: z.number(),
    caption: z.string().optional(),
    type: z.enum(['image', 'youtube']).default('image'),
    youtubeId: z.string().optional(),
  }),
});

export const collections = { artists, locations, sponsors, gallery };
