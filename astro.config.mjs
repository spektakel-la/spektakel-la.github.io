// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { generateArtistCardImages } from './scripts/artist-card-images.mjs';

const buildTimestamp = new Date();
const lastmodCache = new Map();

function gitLastModified(paths) {
  const existingPaths = paths.filter((path) => existsSync(path));
  if (existingPaths.length === 0) return buildTimestamp.toISOString();

  const cacheKey = existingPaths.join('\0');
  const cached = lastmodCache.get(cacheKey);
  if (cached) return cached;

  try {
    const output = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...existingPaths], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const lastmod = output || buildTimestamp.toISOString();
    lastmodCache.set(cacheKey, lastmod);
    return lastmod;
  } catch {
    const fallback = buildTimestamp.toISOString();
    lastmodCache.set(cacheKey, fallback);
    return fallback;
  }
}

function sourcePathsForPage(url) {
  const pathname = new URL(url).pathname;
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const localePath = normalizedPath.startsWith('/en/') ? normalizedPath.slice(3) : normalizedPath;
  const commonPaths = [
    'src/layouts/Base.astro',
    'src/layouts/Page.astro',
    'src/styles/global.css',
  ];
  const currentArtistContentPaths = readdirSync('src/content/artists')
    .filter((file) => file.endsWith('.md'))
    .map((file) => `src/content/artists/${file}`);

  if (localePath.startsWith('/artists/') && localePath !== '/artists/') {
    const artistId = decodeURIComponent(localePath.replace(/^\/artists\//, '').replace(/\/$/, ''));
    return [
      ...commonPaths,
      'src/components/features/artists/ArtistDetail.astro',
      'src/components/features/artists/ArtistCard.astro',
      'src/utils/jsonLd.ts',
      `src/content/artists/${artistId}.md`,
    ];
  }

  const routeSources = {
    '/': ['src/pages/index.astro'],
    '/artists/': [
      'src/pages/artists.astro',
      'src/components/features/artists/ArtistPage.astro',
      'src/components/features/artists/ArtistCard.astro',
      ...currentArtistContentPaths,
    ],
    '/program/': ['src/pages/program.astro', 'src/components/features/program/ProgramPage.astro', 'src/data/schedule.csv'],
    '/locations/': ['src/pages/locations/index.astro', 'src/components/features/locations/LocationsPage.astro', 'src/content/locations'],
    '/impressions/': ['src/pages/impressions.astro', 'src/components/features/gallery/Gallery.astro', 'src/data/impressions.ts'],
    '/sponsors/': ['src/pages/sponsors.astro', 'src/components/features/sponsors/SponsorsPage.astro', 'src/content/sponsors'],
    '/imprint/': ['src/pages/imprint.astro', 'src/components/features/legal/ImprintPage.astro', 'src/data/imprint.ts'],
  };

  return [...commonPaths, ...(routeSources[localePath] ?? [`src/pages${localePath}index.astro`])];
}

function artistCardImageIntegration() {
  let pendingGeneration = Promise.resolve();
  const generate = () => {
    pendingGeneration = pendingGeneration.then(() => generateArtistCardImages());
    return pendingGeneration;
  };

  return {
    name: 'artist-card-images',
    hooks: {
      'astro:build:start': generate,
      'astro:server:setup': async ({ server }) => {
        await generate();
        server.watcher.add('public/assets/img/artists/*.webp');
        server.watcher.on('add', (path) => {
          if (path.includes('/public/assets/img/artists/') && path.endsWith('.webp')) void generate();
        });
        server.watcher.on('change', (path) => {
          if (path.includes('/public/assets/img/artists/') && path.endsWith('.webp')) void generate();
        });
        server.watcher.on('unlink', (path) => {
          if (path.includes('/public/assets/img/artists/') && path.endsWith('.webp')) void generate();
        });
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://spektakel.la',
  output: 'static',
  devToolbar: {
    enabled: process.env.PLAYWRIGHT !== '1',
  },

  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    artistCardImageIntegration(),
    sitemap({
      // Alte /impressum-Aliasse haben /imprint als Canonical und gehören
      // deshalb nicht als eigenständige URLs in den Sitemap-Index.
      filter: (page) => !new URL(page).pathname.match(/^\/(?:en\/)?impressum\/?$/),
      i18n: {
        defaultLocale: 'de',
        locales: {
          de: 'de-DE',
          en: 'en-US',
        },
      },
      serialize: (item) => ({
        ...item,
        lastmod: gitLastModified(sourcePathsForPage(item.url)),
      }),
    }),
  ],

  vite: {
    // @ts-expect-error – Vite-Typ-Konflikt zwischen astro/node_modules/vite und top-level vite
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['leaflet'],
    },
  },
});
