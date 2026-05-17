// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://spektakel-la.github.io',
  output: 'static',

  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: {
          de: 'de-DE',
          en: 'en-US',
        },
      },
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: null, // manuelle Registrierung via virtual:pwa-register in Base.astro
      manifest: {
        name: 'SPEKTAKEL! Landshut',
        short_name: 'SPEKTAKEL!',
        description: 'Das Straßenkunstfestival in Landshut',
        theme_color: '#FF2D7A',
        background_color: '#F6F7FB',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/assets/img/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/img/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/assets/img/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        clientsClaim: true, // neuer SW übernimmt sofort alle Tabs nach Aktivierung
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MiB (splatter3.png ist 3 MB)

        // Precache: App-Shell (HTML, CSS, JS, Fonts) + Logo & Icons (klein, auf jeder Seite)
        // Keine Bulk-Bilder im Precache – das würde den SW-Install blockieren
        globPatterns: ['**/*.{html,js,css,woff2}', 'assets/img/icons/**', 'assets/img/logo/**'],
        globIgnores: [
          // Alle Bild-Assets außer Icons/Logo: Runtime-Caching on demand
          '_astro/**',
          'assets/img/artists/**',
          'assets/img/impressions/**',
          'assets/img/sponsors/**',
          'assets/img/hero/**',
          // i18n-Duplikate (en/ spiegelt de/ für Assets)
          'en/assets/js/**',
          'en/assets/css/**',
        ],

        runtimeCaching: [
          // Logo + PWA-Icons: CacheFirst
          // Doppelsicherung: Precache greift im Prod-Build, Runtime-Regel im Dev-Mode
          // (globPatterns scannt nur das Build-Output-Verzeichnis, nicht den Dev-Server)
          {
            urlPattern: /\/assets\/img\/(logo|icons)\/.+\.(webp|png|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-shell-images',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 Jahr (unveränderlich)
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Künstler-Bilder: CacheFirst on demand
          // → werden beim ersten Besuch der Künstler-Seite gecacht, nicht beim SW-Install
          {
            urlPattern: /\/assets\/img\/artists\/.+\.(webp|png|svg|jpg|jpeg|avif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Tage
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Sponsor-Logos: StaleWhileRevalidate (nice-to-have, kein Offline-Muss)
          {
            urlPattern: /\/assets\/img\/sponsors\/.+$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'sponsors-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Tage
              },
            },
          },
          // OSM-Kartenkacheln: CacheFirst on demand (wie im alten Projekt)
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.+$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Tage
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Impressions-Bilder: bewusst KEIN Eintrag → kein Caching
        ],
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
