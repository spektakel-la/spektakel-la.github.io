# SPEKTAKEL! – Projekt-Plan: Neue Astro-Website

> Stand: Mai 2026 | Basis: Analyse Mockup + Exploration altes Jekyll-Projekt
> Daten: Zunächst aus altem Projekt (`/Users/Q367656/dev/misc/spektakel-la.github.io_old`), werden für 2026 aktualisiert.

---

## 1. Projektziele

| Ziel                   | Details                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Modernes Redesign      | Neues optisches Gewand nach Mockup (Farben, Typografie, Interaktion)                 |
| Voller Funktionsumfang | Programm, Künstler, Spielorte+Karte, Galerie, Nightlife, Info, Über uns, Sponsoren   |
| DSGVO-konform          | Cookie-Consent + GTM nur nach Zustimmung                                             |
| PWA / Offline          | Option C: Programm + Karte + Künstler offline, Galerie nur bei Bedarf                |
| Mehrsprachig           | `de` (Default) + `en` via Astro i18n-Routing                                         |
| Statisches Hosting     | GitHub Pages, 100 % statisch gebaut                                                  |
| SEO                    | Structured Data (Event/Schedule), Sitemap, OpenGraph, vollständige Google-Auswertung |

---

## 1.1 Arbeitsmodell & Zusammenarbeit

### Vorgehen: Phase-für-Phase

Copilot implementiert die Phasen aus §14 sequenziell. Nach jeder Phase **und** nach jeder neu gebauten Seite/Komponente pausiert Copilot und wartet auf explizites OK bevor es weitergeht.

> **Pflicht-Pause-Punkte:**
>
> 1. Am Ende jeder abgeschlossenen Phase (§14)
> 2. Nach jeder fertig gebauten Seite oder wesentlichen Komponente – auch innerhalb einer Phase

### Review-Verfahren

Nach jedem Pflicht-Pause-Punkt liefert Copilot einen **Screenshot / Browser-Preview** des Zwischenstands (Desktop + Mobile) – zusätzlich eine kurze Beschreibung was implementiert wurde.

Erst nach explizitem `✅ weiter` oder Korrekturfeedback wird die nächste Phase oder Seite begonnen.

### Entscheidungen & Plan-Aktualität

- Alle Architektur- und Design-Entscheidungen werden **sofort im Plan dokumentiert** (dieser Datei).
- Offene Punkte aus §15 werden bei ihrer Klärung hier und in den betroffenen Abschnitten aktualisiert.
- Der Plan ist die einzige Wahrheitsquelle – kein Code weicht stillschweigend davon ab. Wenn Abweichungen nötig sind, wird das vorher besprochen.

### Veto-Recht

Du kannst jederzeit Implementierungsdetails anpassen, Abschnitte zurücksetzen oder die Reihenfolge ändern. Copilot setzt solche Anpassungen minimal-invasiv um und protokolliert die Änderung kurz im Chat.

---

## 2. Design-System

### 2.1 Farbpalette „3C – Day Vibes"

| Token              | Hex       | Verwendung                              |
| ------------------ | --------- | --------------------------------------- |
| `--color-bg`       | `#F6F7FB` | Seitenhintergrund                       |
| `--color-bg-light` | `#E7F3F5` | Karten-Backgrounds, Chips               |
| `--color-primary`  | `#FF2D7A` | Primär-Akzent (Logo, CTA, aktive Links) |
| `--color-lime`     | `#B7FF00` | Orts-Badge, Highlights                  |
| `--color-cyan`     | `#00B4DB` | Karten-Pins, sekundäre Akzente          |
| `--color-dark`     | `#1A1A1A` | Texte, Hintergründe dark-mode           |

**Kategorie-Farben** (Programm-Grid, Karten-Pins, Filter-Chips):

| Kategorie  | Farbe                                      |
| ---------- | ------------------------------------------ |
| Akrobatik  | `#00B4DB` (Cyan)                           |
| Musik      | `#FF2D7A` (Magenta)                        |
| Comedy     | `#B7FF00` (Lime)                           |
| Street Art | `#FF6B1A` (Orange – aus Mockup abgeleitet) |
| Magie      | `#9B59B6` (Lila – aus Mockup abgeleitet)   |
| Nightlife  | `#1A1A1A` (Dunkel)                         |

> **Zentrale Theme-Verwaltung**: Alle Tokens sind ausschließlich in `src/styles/tokens.css` als CSS Custom Properties definiert. Das ist die **einzige Stelle** für Farb-, Typo- und Spacing-Änderungen. Tailwind-Klassen und Komponenten referenzieren nur diese Tokens – nie Hex-Werte direkt im Code.

### 2.2 Typografie

**Zwei-Font-System**: expressiver Festival-Display-Font (brush-artig, festivalartig) + moderner, mobil-lesbarer Body-Font.

| Rolle               | Font                                     | Paket                    | Quelle                        |
| ------------------- | ---------------------------------------- | ------------------------ | ----------------------------- |
| Display / Hero      | **Bebas Neue** (kondensiert, Versalien)  | `@fontsource/bebas-neue` | Self-hosted via `@fontsource` |
| Überschriften H2–H3 | **Bebas Neue Bold**                      | `@fontsource/bebas-neue` | Self-hosted via `@fontsource` |
| Fließtext           | **Inter** (neutral, maximale Lesbarkeit) | `@fontsource/inter`      | Self-hosted via `@fontsource` |
| Akzente / Badges    | **Inter SemiBold**                       | `@fontsource/inter`      | Self-hosted via `@fontsource` |

> **DSGVO-Entscheidung**: Alle Fonts werden **self-hosted** via `@fontsource` eingebunden – kein Request an Google-Server. Pakete: `@fontsource/bebas-neue` + `@fontsource/inter`.

### 2.3 Designelemente

- **Paint-Splatter**: Dekorative SVG-Elemente in Primärfarben, als `<picture>`/SVG hinter Headline-Sektionen
- **Badges**: Pill-förmige, farbige Badges für Ort (`LANDSHUT`) und Kategorien
- **Karten**: Subtiler Drop-Shadow, weiß, border-radius
- **Buttons**: Gefüllt (primär: `#FF2D7A`), Ghost-Variante, Icon+Text
- **Grid**: 12-spaltig, responsive mit CSS Grid / Flexbox

### 2.4 Design-Vorlage & Abgleichpflicht

> **Verbindliche Referenz**: `00_website_planning/design_concept.png`
> **Verbindliche Referenz**: `00_website_planning/design_concept_artists.png` (Künstler-Grid + Künstler-Detailseite, Desktop + Mobile)

Die Dateien zeigen alle Hauptseiten in Desktop- **und** Mobile-Ansicht als Mockup.

**Regel: Jede fertig gebaute Seite ist zwingend mit der Vorlage abzugleichen – sowohl Desktop als auch Mobile – bevor sie als abgeschlossen gilt.**

Checkliste pro Seite:

- [ ] Layout/Struktur stimmt mit Mockup überein (Desktop)
- [ ] Layout/Struktur stimmt mit Mockup überein (Mobile)
- [ ] Farben, Typografie und Abstände passen zum Design-System aus Abschnitt 2.1–2.3
- [ ] Interaktive Elemente (Filter, Tabs, Toggle) verhalten sich wie im Mockup gezeigt
- [ ] Paint-Splatter, Badges und Icons sind korrekt platziert

---

## 3. Seitenstruktur & Navigation

### 3.1 Navigationsitems

```
PROGRAMM | KÜNSTLER | SPIELORTE | GALERIE | INFOS | NIGHTLIFE
                                              [Hamburger auf Mobile]
```

> **Über uns** und **Sponsoren** sind im Footer verlinkt, nicht in der Hauptnavigation.
> NEWS wird in einem späteren Release ergänzt.

### 3.2 Seiten-Inventar

| Route (de)        | Route (en)           | Seite                                 | Priorität    |
| ----------------- | -------------------- | ------------------------------------- | ------------ |
| `/`               | `/en/`               | Landingpage                           | P0           |
| `/program`        | `/en/program`        | Spielplan (Tabelle + Liste)           | P0           |
| `/artists`        | `/en/artists`        | Künstler-Grid                         | P0           |
| `/artists/[slug]` | `/en/artists/[slug]` | Künstler-Detailseite                  | P0           |
| `/locations`      | `/en/locations`      | Karte + Spielortliste                 | P0           |
| `/locations/[id]` | `/en/locations/[id]` | Spielort-Detailseite                  | P0           |
| `/impressions`    | `/en/impressions`    | Foto-Galerie                          | P0           |
| `/nightlife`      | `/en/nightlife`      | Nachtprogramm                         | P0           |
| `/info`           | `/en/info`           | Festival-Infos (Anfahrt, Parken, FAQ) | P1           |
| `/about`          | `/en/about`          | Über das Festival / Team              | P1           |
| `/sponsors`       | `/en/sponsors`       | Sponsoren                             | P1           |
| `/imprint`        | `/en/imprint`        | Impressum                             | P0 (Pflicht) |
| `/privacy`        | `/en/privacy`        | Datenschutz                           | P0 (Pflicht) |
| `/404`            | (global)             | 404-Fehlerseite (Theming-passend)     | P0 (Pflicht) |
| `/offline`        | (global)             | PWA-Offline-Fallback-Seite            | P1           |

### 3.3 URL-Kontinuität & Redirect-Strategie

Die Astro-URLs sind **bewusst identisch** mit den alten Jekyll-URLs gewählt – keine Redirects erforderlich für Hauptseiten.

| Alter Jekyll-Pfad     | Neuer Astro-Pfad  | Handlung                                     |
| --------------------- | ----------------- | -------------------------------------------- |
| `/`                   | `/`               | ✅ Identisch                                 |
| `/program`            | `/program`        | ✅ Identisch                                 |
| `/artists`            | `/artists`        | ✅ Identisch                                 |
| `/locations`          | `/locations`      | ✅ Identisch                                 |
| `/impressions`        | `/impressions`    | ✅ Identisch                                 |
| `/nightlife`          | `/nightlife`      | ✅ Identisch                                 |
| `/sponsors`           | `/sponsors`       | ✅ Identisch                                 |
| `/artists/[slug]`     | `/artists/[slug]` | ✅ Neu (kein Konflikt mit alten URLs)        |
| `/locations/[id]`     | `/locations/[id]` | ✅ Neu (kein Konflikt mit alten URLs)        |
| Externe `.html`-Links | –                 | → `404.astro` fängt ab, zeigt Hinweis + Link |

> GitHub Pages erkennt `404.html` automatisch. Externe oder gecachte Links mit `.html`-Suffix landen auf der 404-Seite, die einen freundlichen Hinweis mit Link zur Startseite enthält.

---

## 4. Technologie-Stack

### 4.1 Core

| Technologie               | Version | Zweck                               |
| ------------------------- | ------- | ----------------------------------- |
| **Astro**                 | ^6.x    | Static Site Generator, SSG          |
| **TypeScript**            | strict  | Typensicherheit                     |
| **Tailwind CSS**          | ^4.x    | Utility-First CSS (Layout, Spacing) |
| **CSS Custom Properties** | –       | Design-Tokens, Farben, Typo         |

### 4.2 Astro-Integrationen & Pakete

| Paket                                          | Zweck                                                  |
| ---------------------------------------------- | ------------------------------------------------------ |
| `@astrojs/sitemap`                             | Sitemap-Generierung                                    |
| `@astrojs/image`                               | Bild-Optimierung (WebP, AVIF, responsive sizes)        |
| `@fontsource/bebas-neue` + `@fontsource/inter` | Self-hosted Fonts (DSGVO-konform, kein Google-Request) |
| `@vite-pwa/astro`                              | Service Worker / PWA-Manifest                          |
| `vite-plugin-pwa`                              | Workbox-Konfiguration                                  |
| Astro i18n (built-in)                          | Mehrsprachigkeit de/en                                 |
| `leaflet` + `@types/leaflet`                   | Interaktive Karte (CSR)                                |
| `workbox-precaching`                           | Offline-Caching                                        |
| `astro-seo` oder manuell                       | Meta-Tags, OpenGraph, LD+JSON                          |

### 4.3 Testing

| Paket                 | Zweck                                                            |
| --------------------- | ---------------------------------------------------------------- |
| **Vitest**            | Unit- und Integrationstests (läuft nativ in Vite/Astro-Umgebung) |
| `@vitest/coverage-v8` | Code-Coverage-Reports                                            |
| **Playwright**        | End-to-End-Tests (Browser-basiert, Desktop + Mobile)             |
| `@playwright/test`    | Playwright Test-Runner                                           |

**Teststrategie im Überblick:**

| Ebene            | Werkzeug                                           | Was wird getestet                                                    |
| ---------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| Unit             | Vitest                                             | Utility-Funktionen (`schedule.ts`, `i18n/utils.ts`)                  |
| Integration      | Vitest                                             | Content-Collection-Schemas (Zod-Validierung), CSV-Parser-Logik       |
| E2E              | Playwright                                         | Seitenrouting, Interaktionen (Filter, Tabs, Lightbox), Cookie-Banner |
| Visual (manuell) | `design_concept.png`, `design_concept_artists.png` | Design-Abgleich Desktop + Mobile (Abschnitt 2.4)                     |

### 4.4 Build & Deployment

| Aspekt          | Lösung                                               |
| --------------- | ---------------------------------------------------- |
| Build           | `astro build` → statische HTML/CSS/JS                |
| Output          | GitHub Pages (`/docs`-Ordner oder `gh-pages`-Branch) |
| CI/CD           | GitHub Actions (`.github/workflows/deploy.yml`)      |
| Node-Version    | `>=22.12.0` (aus `.node-version`)                    |
| Package-Manager | npm (`.npmrc` mit `registry.npmjs.org`)              |

---

## 5. Astro-Projektstruktur

```
spektakel-la.github.io/
├── 00_website_planning/          # Planung (nicht im Build)
├── public/
│   ├── assets/
│   │   └── img/
│   │       ├── artists/          # ← aus altem Projekt
│   │       ├── impressions/      # ← aus altem Projekt
│   │       ├── icons/            # PWA-Icons
│   │       └── logo.webp
│   ├── manifest.webmanifest      # PWA-Manifest
│   ├── robots.txt
│   └── sw.js                     # (wird von Workbox generiert)
├── src/
│   ├── assets/                   # Astro-managed Assets (Logo, Paint-Splatter SVGs)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Navigation.astro
│   │   │   └── MobileNav.astro
│   │   ├── ui/
│   │   │   ├── Button.astro
│   │   │   ├── Badge.astro
│   │   │   ├── CategoryChip.astro
│   │   │   └── PaintSplatter.astro
│   │   └── features/
│   │       ├── program/
│   │       │   ├── ProgramGrid.astro       # Desktop Tabellen-Ansicht
│   │       │   ├── ProgramList.astro       # Mobile / Liste
│   │       │   ├── DayTabs.astro
│   │       │   ├── VenueFilter.astro
│   │       │   ├── CategoryFilter.astro    # Kategorie-Filter-Chips
│   │       │   └── FavoritesButton.astro   # ♥ Merken via localStorage
│   │       ├── map/
│   │       │   ├── LocationMap.astro       # client:only="svelte" / vanilla
│   │       │   └── VenuePanel.astro        # Sidebar-Detailpanel
│   │       ├── gallery/
│   │       │   ├── Gallery.astro
│   │       │   ├── GalleryFilter.astro
│   │       │   └── Lightbox.astro          # client:load
│   │       ├── artists/
│   │       │   ├── ArtistCard.astro
│   │       │   └── ArtistCategoryFilter.astro
│   │       └── consent/
│   │           └── CookieBanner.astro      # client:load
│   ├── content/
│   │   ├── config.ts                       # Collection-Schemas (Zod)
│   │   ├── artists/                        # .md pro Künstler (aus altem Projekt)
│   │   ├── locations/                      # .md pro Spielort
│   │   └── sponsors/                       # .md pro Sponsor
│   ├── data/
│   │   └── schedule.csv                    # Spielplan; Nightlife via Location-Flag `nightlife: true`
│   ├── i18n/
│   │   ├── de.ts                           # Deutsche UI-Strings
│   │   ├── en.ts                           # Englische UI-Strings
│   │   └── utils.ts                        # useTranslations()-Helper
│   ├── utils/
│   │   ├── schedule.ts                     # CSV-Parser, Tagesgruppierung, Nacht-Logik
│   │   └── favorites.ts                    # LocalStorage-Favoriten, Festivalplan-Logik
│   ├── layouts/
│   │   ├── Base.astro                      # HTML-Grundstruktur, Meta, GTM, SW
│   │   └── Page.astro                      # Seiten-Layout mit Header/Footer
│   ├── pages/
│   │   ├── index.astro                     # de Default → Landingpage
│   │   ├── 404.astro                       # GitHub Pages: 404.html (Theming-passend, mit Heimlink)
│   │   ├── offline.astro                   # PWA-Offline-Fallback-Seite
│   │   ├── program.astro
│   │   ├── nightlife.astro
│   │   ├── impressions.astro
│   │   ├── info.astro
│   │   ├── about.astro
│   │   ├── sponsors.astro
│   │   ├── imprint.astro
│   │   ├── privacy.astro
│   │   ├── artists/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── locations/
│   │   │   ├── index.astro
│   │   │   └── [id].astro
│   │   └── en/                             # Englische Routen (Astro i18n)
│   │       ├── index.astro
│   │       ├── program.astro
│   │       ├── nightlife.astro
│   │       ├── impressions.astro
│   │       ├── info.astro
│   │       ├── about.astro
│   │       ├── sponsors.astro
│   │       ├── imprint.astro
│   │       ├── privacy.astro
│   │       ├── artists/
│   │       │   ├── index.astro
│   │       │   └── [slug].astro
│   │       └── locations/
│   │           ├── index.astro
│   │           └── [id].astro
│   └── styles/
│       ├── global.css                      # Tailwind + Custom Properties
│       ├── tokens.css                      # Design-Token-Definitionen
│       └── typography.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── vitest.config.ts
├── playwright.config.ts
├── tests/
│   ├── unit/
│   │   ├── schedule.test.ts          # CSV-Parser, Tagesgruppierung, Zeitfenster-Logik
│   │   └── i18n.test.ts              # useTranslations()-Helper, Fallback-Verhalten
│   ├── integration/
│   │   └── collections.test.ts       # Zod-Schema-Validierung der Content Collections
│   └── e2e/
│       ├── navigation.spec.ts        # Routing de/en, aktive Nav-Links
│       ├── program.spec.ts           # Tag-Tabs, Spielort-Filter, View-Toggle
│       ├── artists.spec.ts           # Grid, Kategorie-Filter, Detailseite
│       ├── locations.spec.ts         # Karte lädt, Marker-Click, Panel
│       ├── impressions.spec.ts       # Galerie-Filter, Lightbox öffnen/schließen
│       └── consent.spec.ts           # Cookie-Banner, GTM nur nach Consent
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 6. Content Collections (Zod-Schemas)

### 6.1 Artists

```typescript
// src/content/config.ts
const artists = defineCollection({
  type: 'content',
  schema: z.object({
    artist_id: z.string(),
    name: z.string(),
    images: z.array(z.string()).min(1), // mind. 1 Bild; weitere Bilder für Galerie auf Detailseite
    duration: z.string().optional(), // z. B. "45 Minuten" – sprachunabhängig
    hut_act: z.boolean().optional(), // true → Badge "Künstler spielen für den Hut!"
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
    homepage: z.string().url().optional(),
    organizational: z.boolean().optional(), // Org-Events (Eröffnung, Finale): Spielplan ja, Grid + Detailseite nein
    de: z.object({
      country: z.string(),
      description: z.string(),
      highlight: z.string().optional(),
      categories: z.array(z.string()),
      tags: z.array(z.string()).optional(), // Stilmittel-Chips, z. B. ["Hand auf Hand", "Luftakrobatik"]
      age_recommendation: z.string().optional(), // z. B. "Ab 6 Jahren"
      language: z.string().optional(), // z. B. "Nonverbal"
      special: z.string().optional(), // Besonderes / Hinweise
    }),
    en: z.object({
      country: z.string(),
      description: z.string(),
      highlight: z.string().optional(),
      categories: z.array(z.string()),
      tags: z.array(z.string()).optional(),
      age_recommendation: z.string().optional(),
      language: z.string().optional(),
      special: z.string().optional(),
    }),
  }),
});
```

> **Organizational-Regel**: Einträge mit `organizational: true` (z. B. `organization_opening`, `organization_finale`) erscheinen im Spielplan, aber **nicht** im Künstler-Grid und erhalten **keine eigene Detailseite**. `getStaticPaths` in `[slug].astro` überspringt sie.

### 6.2 Locations

```typescript
const locations = defineCollection({
  type: 'content',
  schema: z.object({
    location_id: z.string(),
    sort_order: z.number(),
    description: z.string(),
    gps: z.tuple([z.number(), z.number()]),
    marker_color: z.string(),
    nightlife: z.boolean().optional(),
    organizational: z.boolean().optional(),
  }),
});
```

### 6.3 Sponsors

```typescript
const sponsors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().url().optional(),
    // Kein tier-Feld: alle Sponsoren sind gleichgestellt
  }),
});
```

> **Datenmigration Sponsors**: Die alten Sponsor-Markdowns haben nur `image` und `link`. Migration (Phase 1): `image` → `logo`, `link` → `url`, `name` aus Dateinamen ableiten.

### 6.4 Gallery (Impressionen)

```typescript
const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    file: z.string(), // Pfad relativ zu public/assets/img/impressions/
    category: z.enum(['akrobatik', 'musik', 'comedy', 'street_art', 'nightlife']),
    year: z.number(),
    caption: z.string().optional(),
    type: z.enum(['image', 'youtube']).default('image'),
    youtubeId: z.string().optional(), // nur wenn type === "youtube"
  }),
});
```

> **Entscheidung**: Eine Markdown-Datei pro Bild/Video in `src/content/gallery/`. Ermöglicht Filter-Chips (Kategorie + Jahr), YouTube-Link-Kacheln (kein iFrame → kein Consent) und Captions – wartbar ohne Code-Änderungen. Astro Content Collections übernehmen Zod-Validierung.

---

## 7. Spielplan-Datenverarbeitung

Das CSV `data/schedule.csv` wird **zur Build-Zeit** in TypeScript eingelesen und geparst:

```
time,location_id,artist_id,notes
2025-09-19T16:00:00+02:00,4,mekks,
```

**Utility `src/utils/schedule.ts`**:

- Lädt CSV, parst Zeilen
- Verknüpft `artist_id` → Artist-Collection-Eintrag
- Verknüpft `location_id` → Location-Collection-Eintrag
- Gruppiert nach Festivaltag (Events 0–3 Uhr → Vortag, wie im alten Projekt)
- Gibt typisierte `ScheduleEntry[]`-Daten zurück
- Wird in `program.astro`, `nightlife.astro` und `locations/[id].astro` genutzt
- **Nightlife-Filter**: Keine separate CSV – Nightlife-Events sind Einträge, deren Location `nightlife: true` gesetzt hat
- **Organizational-Filter**: Artists mit `organizational: true` erscheinen im Spielplan ohne klickbaren Detaillink

---

## 8. Internationalisierung (i18n)

Astro Built-in i18n:

```javascript
// astro.config.mjs
i18n: {
  defaultLocale: 'de',
  locales: ['de', 'en'],
  routing: {
    prefixDefaultLocale: false, // de = /, en = /en/
  },
}
```

UI-Strings in `src/i18n/de.ts` / `src/i18n/en.ts`:

- Alle Button-Labels, Überschriften, Placeholder
- Analog zur alten `_i18n/de.yml` / `en.yml`

Artist- und Location-Inhalte bleiben mehrsprachig in den `.md`-Frontmatters (Felder `de.description`, `en.description`).

---

## 9. Seiten-Konzepte im Detail

### 9.1 Landingpage (`/`)

**Sektionen:**

1. **Hero**: Vollbild-Hintergrund mit Artist-Foto, Paint-Splatter-SVGs, Headline, Datum-Badge, Subtext, CTA „Zum Programm"
2. **Kategorie-Icons**: Horizontale Icon-Leiste (Akrobatik, Musik, Comedy, Magie, Street Art, Nightlife) mit Hover-Animations
3. **Hut-Box**: Dunkles Panel „KÜNSTLER SPIELEN FÜR DEN HUT" mit Erklärtext
4. **Teaser-Slider**: 3–4 Featured Artists (Carousel)
5. **Vorschau Spielplan**: Aktueller/nächster Festivaldag-Auszug
6. **Orte auf einen Blick**: Mini-Map oder Location-Kacheln
7. **Footer**: Social-Links, Impressum, Datenschutz

### 9.2 Programm (`/program`)

**Features:**

- **Tag-Tabs**: Freitag / Samstag / Sonntag (Datum als Chip, aktiv = Magenta)
- **Spielort-Filter**: Dropdown „Alle Spielorte"
- **View-Toggle**: Tabellen-Ansicht (Desktop default) ↔ Listen-Ansicht (Mobile default)
- **Tabellen-Ansicht**: Zeilen = Zeitslots (30-min-Raster), Spalten = Spielorte, Zellen farbkodiert nach Kategorie
- **Listen-Ansicht**: Sortiert nach Zeit, Künstler + Spielort + Kategorie-Chip
- **Live-Indikator**: Wenn Serverzeit im Zeitfenster → Zelle hervorheben (nur Client-side via `Date.now()`)- **Kategorie-Filter**: Filter-Chips (Alle / Musik / Akrobatik / Comedy / Magie / Street Art / Nightlife); kombinierbar mit Spielort-Filter und Tages-Tab
- **Favoriten** (♥): Button auf jeder Karte / Timetable-Zelle; gespeichert in `localStorage`, kein Login erforderlich; Filter „Nur meine Favoriten“; **Bonus-Feature**: eigene Festivalplan-Ansicht mit allen gemerkten Acts (Komponente `FavoritesButton.astro`, Logik in `utils/favorites.ts`)- Hinweis „Änderungen vorbehalten"

### 9.3 Künstler (`/artists`, `/artists/[slug]`)

**Listing-Seite `/artists`:**

- **Hero-Sektion**: Headline „ALLE KÜNSTLER AUF EINEN BLICK", Tagline, Performer-Foto rechts, Paint-Splatter-Dekoration, „Künstler spielen für den Hut!"-Badge
- **Filter Zeile 1**: Kategorie-Chips (ALLE | ARTISTIK | MUSIK | COMEDY | MAGIE | STREET ART | NIGHTLIFE)
- **Filter Zeile 2**: Suchfeld „Künstler suchen…" | Dropdown „Alle Kategorien" | Dropdown „Alle Spielorte" | Dropdown Sortierung (A–Z)
- **Mobile Filter**: Klick auf Filter-Button öffnet Fullscreen-Drawer mit Kategorie-Chips, Spielort-Dropdown, Sortierung, Zurücksetzen + Anwenden
- **Künstler-Cards**: Foto, Stern-Icon (Favorit) oben rechts, Name, Kategorie-Label, Spielort-Icon + Spielortname, Spielplan-Kurzform (Fr 16:00 | Sa 18:00 | So 16:00)
- **Load More**: „MEHR ANZEIGEN ↓"-Button (kein Infinite Scroll – ARIA-freundlicher)
- Kein Grid-Eintrag für `organizational: true`-Künstler

**Detailseite `/artists/[slug]`:**

- Zurück-Link: „← ZURÜCK ZUR KÜNSTLERÜBERSICHT"
- Stern-Icon (Favorit) oben rechts
- **Hero**: großes Vollbild-Foto (erstes aus `images[]`), darauf: Name (Bebas Neue, groß), Kategorie-Badge
- **Meta-Zeile**: Herkunftsland | Dauer (`duration`) | „Künstler spielen für den Hut!"-Badge (nur wenn `hut_act: true`)
- **3-Spalten-Layout (Desktop)**:
  - _Links_ – **SPIELZEITEN**: alle Auftritte aus dem Spielplan (Datum + Uhrzeit + Spielort mit Map-Pin)
  - _Mitte_ – **ÜBER [NAME]**: Beschreibungstext | Stilmittel-Chips (`tags[]`) | Galerie-Vorschau (3 Thumbnails) + „MEHR BILDER ANSEHEN →" (Lightbox)
  - _Rechts_ – **INFOS**: Altersempfehlung, Sprache, Besonderes, Webseite (Link), Social Media (Icons)
- **Mobile**: einspaltig; Galerie als Vollbild-Lightbox mit Pfeil-Navigation und Zähler „1/16"
- Structured Data: `Person` + verlinkte `Event`s

### 9.4 Spielorte & Karte (`/locations`, `/locations/[id]`)

**Map-Seite:**

- Leaflet-Karte, client:only, OSM-Tiles
- Farbige Marker pro Spielort (analog `marker_color` aus Frontmatter)
- Click → öffnet Spielort-Panel (wie im Mockup)
- Panel: Aktuelles Programm + nächste 3 Stunden
- „Mehr Infos" → Detailseite
- Legende: Spielortname + Farbe + Kategorie-Punkte
- Offline: OSM-Tiles werden gecacht (Workbox TileCache-Strategie)
- **Mobile**: Karte nimmt Vollbreite; Spielort-Panel erscheint unterhalb der Karte beim Marker-Click (kein Bottom-Sheet-Pattern)

**Spielort-Detailseite:**

- Name, GPS-Koordinaten
- Vollständiges Programm an diesem Ort (alle Tage)
- Mini-Leaflet-Karte (nur dieser Ort, zentriert)

### 9.5 Impressionen / Galerie (`/impressions`)

**Features:**

- Filter-Chips: ALLE, AKROBATIK, MUSIK, COMEDY, STREET ART, NIGHTLIFE
- Masonry-Grid (3 Spalten Desktop, 2 Tablet, 1 Mobile)
- Bilder aus `public/assets/img/impressions/` (bestehende Assets)
- Lazy-Loading mit `loading="lazy"` + Astro `<Image>`
- Lightbox (z. B. **GLightbox** oder **PhotoSwipe**): Vollbild, Vor/Zurück, Counter „1/24", Caption

**YouTube-Videos (DSGVO-konform – kein iFrame):**

- Darstellung als Kachel mit statischem YouTube-Thumbnail
- Klick öffnet `youtube.com/watch?v=...` in neuem Tab
- **Kein iFrame** auf unserer Seite → kein Third-Party-Tracking → **kein Consent erforderlich**

**Bild-Metadaten:**

- Astro Content Collection `src/content/gallery/` – eine `.md`-Datei pro Bild/Video (Frontmatter: `file`, `category`, `year`, `caption?`, `type`, `youtubeId?`) – s. §6.4
- Ermöglicht Filter + Captions + YouTube-Kacheln ohne CMS, mit Zod-Validierung

### 9.6 Info-Seite (`/info`)

Statischer Content (Markdown oder Astro):

- Anfahrt (ÖPNV, Auto, Fahrrad)
- Parken
- Barrierefreiheit
- FAQ
- Kontakt

### 9.7 Nightlife (`/nightlife`)

- Analog zur Programmseite, gefiltert aus dem Haupt-Spielplan (`schedule.csv`)
- Filter-Kriterium: Die verknüpfte Location hat `nightlife: true` im Frontmatter
- Keine separate `nightlife.csv` – Datenquelle ist `src/utils/schedule.ts` mit Nightlife-Filter
- Spezifische Spielorte (nur Nightlife-Locations aus der Location-Collection)

> **Offen**: Das Metadaten-Format wird spätestens in Phase 1 mit den echten 2026-Spielplan-Daten finalisiert.

### 9.8 Sponsoren (`/sponsors`)

- Grid aller Sponsor-Logos gleichgestellt (aus `content/sponsors/`)
- Kein Tier-System – alle Sponsoren erscheinen gleichberechtigt
- Klick auf Logo → öffnet Sponsor-URL in neuem Tab (falls vorhanden)

---

## 10. DSGVO & Cookie-Consent

### 10.1 Strategie

- **Eigene leichtgewichtige Cookie-Banner-Komponente** (kein schweres Paket)
- Consent wird in `localStorage` gespeichert
- GTM (`GTM-TK5422TV`) wird **nur nach Consent** in den `<head>` injiziert
- Astro `Base.astro`: GTM-Snippet als `<script>` nur wenn `consent === 'accepted'`

### 10.2 Implementierung

```astro
<!-- Base.astro -->
<CookieBanner client:load />
<!-- GTM-Snippet wird via CookieBanner nach Consent injiziert -->
```

**CookieBanner.astro** (client:load):

1. Prüft `localStorage.getItem('gtm-consent')`
2. Falls null → Banner anzeigen
3. Bei Akzeptieren: Consent speichern + GTM-Script dynamisch laden
4. Bei Ablehnen: Nur Consent speichern, kein GTM
5. Datenschutz-Link im Banner
6. Sprache: über i18n-Strings

### 10.3 YouTube-Videos & DSGVO

YouTube-Videos in der Galerie (`/impressions`) werden **ohne iFrame** eingebunden:

- Darstellung als Kachel mit statischem YouTube-Thumbnail
- Klick öffnet `youtube.com/watch?v=...` in neuem Tab
- **Kein YouTube-iFrame** auf unserer Seite → kein Third-Party-Tracking → **kein Consent erforderlich**

> **Entscheidung**: Link-statt-iFrame-Ansatz. DSGVO-sauber, ohne Consent-Gate, ohne Facade-Komplexität.

### 10.4 Consent-Scope (GTM)

Der GTM-Container `GTM-TK5422TV` enthält ausschließlich Analytics-Tags (kein Marketing-/Retargeting-Tracking). Eine **einfache binäre Zustimmung** (Akzeptieren / Ablehnen) ist ausreichend und DSGVO-konform. Keine granulare Kategorisierung erforderlich.

---

## 11. PWA & Service Worker

### 11.1 Konfiguration (`vite-plugin-pwa` via `@vite-pwa/astro`)

**Cache-Strategie Option C:**

| Asset-Typ          | Strategie                | Details                         |
| ------------------ | ------------------------ | ------------------------------- |
| HTML-Seiten        | `NetworkFirst`           | Immer aktuell, Fallback offline |
| CSS / JS           | `CacheFirst`             | Versioniert (Content-Hash)      |
| Künstler-Bilder    | `CacheFirst`             | Precache bei Install            |
| Spielplan-Daten    | In HTML eingebettet      | Kein separater Fetch nötig      |
| Karten-Tiles (OSM) | `CacheFirst` + TileCache | Bounding Box Landshut           |
| Impressionen-Fotos | `StaleWhileRevalidate`   | Kein Precache, bei Bedarf       |

> **OSM-Tile-Migration**: Das alte Projekt enthält bereits gerenderte Offline-Tiles unter `assets/img/map/tiles/` (Zoomstufen 16–19, Bounding Box Landshut). Diese werden direkt nach `public/assets/img/map/tiles/` übernommen und vom Service Worker per `CacheFirst` aus dem Build-Output bedient.

### 11.2 Manifest (`manifest.webmanifest`)

```json
{
  "name": "Spektakel Landshut",
  "short_name": "Spektakel",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#FF2D7A",
  "background_color": "#F6F7FB",
  "lang": "de",
  "icons": [...]
}
```

---

## 12. SEO & Structured Data

### 12.1 Meta-Tags (pro Seite)

- `<title>` – seitenspezifisch
- `<meta name="description">` – seitenspezifisch
- `<link rel="canonical">` – inkl. Sprach-Variante
- `<link rel="alternate" hreflang="de|en">` – beide Sprachen
- OpenGraph: `og:title`, `og:description`, `og:image`, `og:type`
- Twitter Card

### 12.2 Structured Data (JSON-LD)

**Festival-Event** (Landingpage):

```json
{
  "@type": "Festival",
  "name": "Spektakel Landshut",
  "startDate": "...",
  "endDate": "...",
  "location": { "@type": "Place", "name": "Landshut", ... },
  "subEvent": [ ... ]  // alle Auftritte
}
```

**Einzelne Auftritte** (`/program`):

```json
{
  "@type": "Event",
  "name": "Alikindoi Flamenco",
  "startDate": "...",
  "endDate": "...",
  "performer": { "@type": "PerformingGroup", ... },
  "location": { "@type": "Place", ... }
}
```

**Artist-Seiten** (`/artists/[slug]`):

```json
{
  "@type": "Person",
  "name": "...",
  "description": "...",
  "sameAs": [ instagram, facebook, ... ]
}
```

### 12.3 Sitemap

- `@astrojs/sitemap` mit i18n-Support
- Enthält alle Seiten, Artist-Detailseiten, Location-Detailseiten

---

## 13. GitHub Pages Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit # Vitest Unit + Integration
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e # Playwright E2E gegen gebauten Output
      - uses: actions/deploy-pages@v4
        with:
          folder: dist
```

**`astro.config.mjs`:**

```javascript
export default defineConfig({
  site: 'https://spektakel-la.github.io',
  base: '/',
  output: 'static',
  // ...
});
```

---

## 14. Implementierungs-Reihenfolge (Phasen)

### Phase 0 – Projekt-Setup (1–2 h) ✅

- [x] `npm install` (Astro, Tailwind, vite-plugin-pwa, Leaflet, Sitemap)
- [x] `npm install -D vitest @vitest/coverage-v8 @playwright/test` (Test-Dependencies)
- [x] `astro.config.mjs` vollständig konfigurieren (i18n, sitemap, pwa, output)
- [x] `vitest.config.ts` anlegen (include: `tests/unit/**`, `tests/integration/**`)
- [x] `playwright.config.ts` anlegen (baseURL, Projektprofile: Desktop Chrome, Mobile Chrome)
- [x] `package.json` – npm-Scripts: `test`, `test:unit`, `test:e2e`, `test:coverage`
- [x] `tailwind.config.mjs` mit Design-Tokens
- [x] `tsconfig.json` – strict mode
- [x] `src/styles/tokens.css` – CSS Custom Properties
- [x] ⚠️ **Asset-Request**: PWA-Icons aus altem Projekt prüfen (Größe, Maskability) – ggf. Neuerstellung anfordern (siehe Abschnitt 17)

### Phase 1 – Content-Foundation (2–3 h) ✅

- [x] `src/content/config.ts` – alle Collections + Schemas
- [x] Assets-Migration: `public/assets/img/artists/`, `impressions/`
- [x] Markdown-Migration: `_artists/` → `src/content/artists/`
- [x] Markdown-Migration: `_locations/` → `src/content/locations/`
- [x] Markdown-Migration: `_sponsors/` → `src/content/sponsors/`
- [x] `data/schedule.csv` + `nightlife.csv` kopieren
- [x] `src/utils/schedule.ts` – CSV-Parser
- [x] **Unit-Tests**: `tests/unit/schedule.test.ts` (CSV-Parser, Tagesgruppierung, Nacht-Logik 0–3 Uhr)
- [x] **Unit-Tests**: `tests/unit/i18n.test.ts` (Sprach-Fallback, alle Schlüssel vorhanden)
- [x] **Integrationstests**: `tests/integration/collections.test.ts` (Zod-Schema gegen echte Markdown-Dateien)

### Phase 2 – Layout & i18n (2–3 h)

- [ ] ⚠️ **Asset-Request**: Logo-SVG + OG-Social-Image (1200×630 px) – genaue Spezifikation folgt zu Beginn dieser Phase
- [ ] `src/layouts/Base.astro` (HTML-Shell, Meta, GTM-Placeholder, SW-Registration)
- [ ] `src/layouts/Page.astro` (Header/Footer-Wrapper)
- [ ] `src/components/layout/Header.astro` (Logo, Navigation, Sprachwechsler)
- [ ] `src/components/layout/Navigation.astro` (Desktop + Mobile Hamburger)
- [ ] `src/components/layout/Footer.astro` (Social, Links)
- [ ] `src/i18n/de.ts` + `en.ts` – alle UI-Strings

### Phase 3 – Design-System-Komponenten (2–3 h)

- [ ] ⚠️ **Asset-Request**: Paint-Splatter-SVGs (4–6 Varianten) + Kategorie-Icons (6 Stück als SVG) – genaue Spezifikation folgt zu Beginn dieser Phase
- [ ] `Badge.astro`, `Button.astro`, `CategoryChip.astro`
- [ ] `PaintSplatter.astro` – SVG-Dekoelemente
- [ ] Globales CSS (Typografie, Farben, Reset)

### Phase 4 – Landingpage (2 h)

- [ ] ⚠️ **Asset-Request**: Hero-Bild (mind. 1920×1080 px, WebP) + Hut-Illustration/Icon – genaue Spezifikation folgt zu Beginn dieser Phase
- [ ] Hero-Sektion
- [ ] Kategorie-Icon-Leiste
- [ ] Hut-Panel
- [ ] Featured-Artists-Slider
- [ ] **Design-Abgleich Desktop + Mobile** (`design_concept.png`)

### Phase 5 – Programmseite (3–4 h)

- [ ] `DayTabs.astro`
- [ ] `VenueFilter.astro`
- [ ] `ProgramGrid.astro` (Tabellenansicht)
- [ ] `ProgramList.astro` (Listenansicht)
- [ ] View-Toggle
- [ ] Structured Data (JSON-LD Events)
- [ ] **Design-Abgleich Desktop + Mobile** (`design_concept.png`)

### Phase 6 – Künstler (2–3 h)

- [ ] `ArtistCard.astro`
- [ ] `ArtistCategoryFilter.astro`
- [ ] `/artists/index.astro`
- [ ] `/artists/[slug].astro` (Detailseite)
- [ ] Structured Data (Person)
- [ ] **Design-Abgleich Desktop + Mobile** (`design_concept.png` + `design_concept_artists.png`)

- [ ] ⚠️ **Asset-Request**: Karten-Marker-Icons (SVG, je Spielort-Farbe) – genaue Spezifikation folgt zu Beginn dieser Phase
- [ ] `LocationMap.astro` (Leaflet, client:only)
- [ ] Marker-Rendering mit Kategoriefarben
- [ ] `VenuePanel.astro` (Sidebar: Aktuell + nächste 3h)
- [ ] `/locations/index.astro`
- [ ] `/locations/[id].astro`
- [ ] Offline-Tile-Caching (Workbox)
- [ ] **Design-Abgleich Desktop + Mobile** (`design_concept.png`)

### Phase 8 – Galerie (2–3 h)

- [ ] `src/data/impressions.ts` (Metadaten-Manifest)
- [ ] `GalleryFilter.astro`
- [ ] `Gallery.astro` (Masonry-Grid)
- [ ] `Lightbox.astro` (GLightbox)
- [ ] **Design-Abgleich Desktop + Mobile** (`design_concept.png`)

### Phase 9 – Restliche Seiten (2 h)

- [ ] ⚠️ **Asset-Request**: Sponsor-Logos prüfen (Vollständigkeit, einheitliche Höhe ~80 px, WebP) – Spezifikation folgt zu Beginn dieser Phase
- [ ] `/nightlife`
- [ ] `/info`
- [ ] `/about`
- [ ] `/sponsors`
- [ ] `/imprint`
- [ ] `/privacy`
- [ ] `404.astro` – Theming-passende 404-Seite mit Heimlink (GitHub Pages erkennt `404.html` automatisch)
- [ ] `offline.astro` – PWA-Offline-Fallback-Seite
- [ ] EN-Pendants aller Seiten

### Phase 10 – DSGVO & PWA (2–3 h)

- [ ] `CookieBanner.astro`
- [ ] GTM-Integration (consent-gesteuert)
- [ ] `vite-plugin-pwa` Konfiguration (Workbox)
- [ ] `manifest.webmanifest`
- [ ] SW-Registrierung im Layout
- [ ] **E2E-Test**: `tests/e2e/consent.spec.ts` (Banner erscheint, GTM-Script nur nach Consent im DOM)

### Phase 11 – E2E-Tests (2–3 h)

- [ ] `tests/e2e/navigation.spec.ts` – Routing de/en, alle Seiten erreichbar (200), aktive Nav-Links
- [ ] `tests/e2e/program.spec.ts` – Tag-Tabs wechseln, Spielort-Filter, Tabellen- vs. Listen-View-Toggle
- [ ] `tests/e2e/artists.spec.ts` – Grid rendert, Kategorie-Filter reduziert Einträge, Detailseite öffnet
- [ ] `tests/e2e/locations.spec.ts` – Karte lädt, Marker-Click öffnet Panel, Panel-Inhalt korrekt
- [ ] `tests/e2e/impressions.spec.ts` – Galerie-Filter, Lightbox öffnen/schließen, Counter korrekt
- [ ] **Mobile-Viewports**: Alle E2E-Tests laufen auch im Mobile-Chrome-Profil (375 px)
- [ ] `npm run test:coverage` – Unit/Integration-Coverage-Report prüfen

### Phase 12 – SEO & QA (2 h)

- [ ] **Finaler Design-Abgleich aller Seiten** gegen `design_concept.png` (Desktop + Mobile)
- [ ] Structured Data für alle Seiten prüfen (Google Rich Results Test)
- [ ] Lighthouse-Audit (Performance, PWA, Accessibility, SEO)
- [ ] `robots.txt`, Sitemap-Validierung
- [ ] hreflang-Tags prüfen
- [ ] Offline-Test im DevTools

### Phase 13 – Deployment (1 h)

- [ ] `astro.config.mjs` – `site` URL setzen
- [ ] GitHub Actions Workflow
- [ ] Erst-Deployment + Smoke-Test
- [ ] ⚠️ **Asset-Request**: PWA-Screenshots nach Redesign neu erstellen (Desktop 2880×1800, Mobile 750×1334) und in `manifest.webmanifest` aktualisieren

---

## 15. Offene Punkte / Abhängigkeiten

| #   | Thema                                             | Status                                                       |
| --- | ------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Festival-Termin 2026 (Datum, Spielplan, Künstler) | ⏳ Kommt in den nächsten Wochen                              |
| 2   | Neue Künstler-Fotos / Assets für 2026             | ⏳ Kommt mit Termin                                          |
| 3   | Font-System: Display- und Body-Font wählen        | ✅ Bebas Neue + Inter (s. §2.2, §4.2)                        |
| 4   | Impressionen: Kategorisierungs-Datei erstellen    | ✅ Content Collection `src/content/gallery/` (s. §6.4)       |
| 5   | INFO-Seite: Texte (Anfahrt, Parken, FAQ)          | 🔲 Seite wird mit Platzhaltern gebaut; echter Content später |
| 6   | ÜBER UNS: Text + Teamfotos                        | 🔲 Seite wird mit Platzhaltern gebaut; echter Content später |
| 7   | NEWS: Feature-Scope wird später definiert         | 🔲 Zurückgestellt                                            |
| 8   | Nightlife: Metadaten-Format im Spielplan          | 🔲 In Phase 1 mit echten 2026-Daten finalisieren             |
| 9   | Display-Font: Bebas Neue                          | ✅ `@fontsource/bebas-neue` (s. §2.2)                        |
| 10  | Body-Font: Inter                                  | ✅ `@fontsource/inter` (s. §2.2)                             |

---

## 16. Referenzen

- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [vite-plugin-pwa für Astro](https://vite-pwa-org.netlify.app/frameworks/astro.html)
- [Workbox Strategies](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/)
- [Leaflet Offline](https://github.com/allartk/leaflet.offline)
- [Google Rich Results: Event](https://developers.google.com/search/docs/appearance/structured-data/event)
- [Astro Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

---

## 17. Grafik-Assets: Human-in-the-Loop

### 17.1 Prinzip

Nicht alle benötigten Grafiken sind im alten Projekt vorhanden. Bevor eine Phase umgesetzt wird, die neue oder angepasste Assets erfordert, **werde ich explizit eine Asset-Anforderungsliste liefern** – mit genauer Beschreibung von Zweck, Format, empfohlener Größe und Hinweisen zur Erstellung (KI-Generator, Designer, Foto).

> **Regel**: Keine Phase wird begonnen, die auf fehlende Pflicht-Assets angewiesen ist. Ich zeige die Anforderung rechtzeitig an, damit du die Assets erstellen/generieren kannst, bevor wir fortfahren.

### 17.2 Bekannte fehlende / neue Assets (Stand Planung)

| #   | Asset                                                                                | Zweck                                              | Vorhandenes Pendant?                                                                               | Wann benötigt           |
| --- | ------------------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------- |
| 1   | **Paint-Splatter-SVGs** (4–6 Varianten, Farben: Magenta, Lime, Cyan, Orange)         | Dekorative Elemente hinter Headlines, Hero-Sektion | Nein                                                                                               | Phase 3                 |
| 2   | **Kategorie-Icons** (Akrobatik, Musik, Comedy, Magie, Street Art, Nightlife) als SVG | Landingpage Icon-Leiste, Filter-Chips              | Teilweise als PNG in `assets/img/icons/`                                                           | Phase 3                 |
| 3   | **Logo** „Spektakel!“ im neuen Stil (SVG + WebP)                                     | Header, PWA-Manifest, OG-Bild                      | `assets/img/spektakel-logo.webp` vorhanden – ggf. anpassen                                         | Phase 2                 |
| 4   | **Hero-Bild / Festival-Hauptmotiv** (mind. 1920×1080 px, WebP)                       | Landingpage-Hero, OG-Image                         | `assets/img/plakat2025.webp` vorhanden – 2026 benötigt                                             | Phase 4                 |
| 5   | **„Hut“-Illustration oder Icon** für die Hut-Panel-Sektion                           | Hut-Box auf Landingpage                            | Nein                                                                                               | Phase 4                 |
| 6   | **PWA-Icons** (192×192 px, 512×512 px, maskable)                                     | Web App Manifest                                   | `assets/img/icons/icon_192.png`, `icon_512.png` – prüfen ob aktuell                                | Phase 0                 |
| 7   | **OG-Social-Image** (1200×630 px, WebP)                                              | OpenGraph / Twitter Card                           | Platzhalter: `jonglage.png` (1536×1024, falsches Seitenverhältnis) → Screenshot der fertigen Seite | Phase 13                |
| 8   | **PWA-Screenshots** (Desktop 2880×1800, Mobile 750×1334)                             | `manifest.webmanifest`                             | Alte Screenshots vorhanden – müssen nach Redesign neu erstellt werden                              | Phase 13                |
| 9   | **Karten-Marker-Icons** (SVG, farbkodiert je Spielort)                               | Leaflet-Map, Legende                               | `assets/img/map/` vorhanden – Format prüfen                                                        | Phase 7                 |
| 10  | **Sponsor-Logos** (WebP, einheitliche Höhe ~80 px)                                   | Sponsoren-Seite                                    | `assets/img/sponsors/` vorhanden – Vollständigkeit prüfen                                          | Phase 9                 |
| 11  | **Artist-Fotos 2026** (WebP, mind. 800×800 px, quadratisch oder 4:3)                 | Künstler-Grid, Detailseiten                        | Nur 2025-Assets vorhanden                                                                          | Nach Termin-Bekanntgabe |
| 12  | **Impressions-Fotos 2026**                                                           | Galerie                                            | Nur bis 2025 vorhanden                                                                             | Nach Festival 2026      |

### 17.3 Asset-Anforderungs-Checkpoints im Ablauf

Die folgenden Phasen enthalten explizite **„⚠️ Asset-Request“**-Einträge (in den Phasen-Checklisten markiert). Ich werde dort **vor Beginn der eigentlichen Implementierung** eine detaillierte Liste mit exakten Spezifikationen liefern:

| Phase    | Asset-Request-Zeitpunkt | Betrifft                                                                                    |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| Phase 0  | Vor Projektstart        | PWA-Icons prüfen (Größe, Maskability)                                                       |
| Phase 2  | Vor Header-Bau          | Logo-SVG                                                                                    |
| Phase 3  | Vor Komponenten-Bau     | Paint-Splatter-SVGs, Kategorie-Icons                                                        |
| Phase 4  | Vor Landingpage-Bau     | Hero-Bild, Hut-Illustration                                                                 |
| Phase 7  | Vor Karten-Bau          | Marker-Icons (SVG, Farben)                                                                  |
| Phase 9  | Vor Sponsoren-Seite     | Sponsor-Logos Vollständigkeitsprüfung                                                       |
| Phase 13 | Nach Deployment         | PWA-Screenshots neu erstellen; OG-Social-Image (Screenshot der fertigen Seite, 1200×630 px) |
