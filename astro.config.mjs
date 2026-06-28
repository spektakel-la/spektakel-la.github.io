// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

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
