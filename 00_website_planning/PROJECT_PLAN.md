# SPEKTAKEL! – Projekt-Plan: Neue Astro-Website

> Stand: Mai 2026 | Basis: Analyse Mockup + Exploration altes Jekyll-Projekt
> Daten: Zunächst aus altem Projekt (`/Users/Q367656/dev/misc/spektakel-la.github.io_old`), werden für 2026 aktualisiert.

---

## 1. Projektziele

| Ziel                   | Details                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Modernes Redesign      | Neues optisches Gewand nach Mockup (Farben, Typografie, Interaktion)                 |
| Voller Funktionsumfang | Programm, Künstler, Spielorte+Karte, Galerie, Sponsoren, Impressum                   |
| DSGVO-konform          | Cookie-Consent + GTM nur nach Zustimmung                                             |
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

### Entwicklungsserver (`astro dev`)

- Standard-Workflow: `npm run dev` (Port 4321, HMR)
- **Bekanntes Problem**: `astro dev` kann nach längerer Laufzeit oder vielen Dateiänderungen „hängen" – Änderungen sind dann nicht mehr im Browser sichtbar, obwohl die Datei gespeichert wurde
- **Lösung**: Terminal-Prozess killen (`Ctrl+C`) und `npm run dev` neu starten
- Falls ein Prozess auf einem Port hängt: `lsof -ti:<PORT> | xargs kill -9` → dann neu starten (Port variiert: 4321, 4322, 4323, …)

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
PROGRAMM | KÜNSTLER | SPIELORTE | GALERIE
                                      [Hamburger auf Mobile]
```

> **Sponsoren** und **Impressum** sind im Footer verlinkt, nicht in der Hauptnavigation.
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
| `/sponsors`       | `/en/sponsors`       | Sponsoren                             | P1           |
| `/imprint`        | `/en/imprint`        | Impressum                             | P0 (Pflicht) |
| `/404`            | (global)             | 404-Fehlerseite (Theming-passend)     | P0 (Pflicht) |

> **Scope-Entscheidung (21.06.2026):** `/info`, `/about` und `/privacy` werden vorerst nicht umgesetzt, auch wenn sie im Designkonzept vorgesehen sind.

### 3.3 URL-Kontinuität & Redirect-Strategie

Die Astro-URLs sind **bewusst identisch** mit den alten Jekyll-URLs gewählt – keine Redirects erforderlich für Hauptseiten.

| Alter Jekyll-Pfad     | Neuer Astro-Pfad  | Handlung                                     |
| --------------------- | ----------------- | -------------------------------------------- |
| `/`                   | `/`               | ✅ Identisch                                 |
| `/program`            | `/program`        | ✅ Identisch                                 |
| `/artists`            | `/artists`        | ✅ Identisch                                 |
| `/locations`          | `/locations`      | ✅ Identisch                                 |
| `/impressions`        | `/impressions`    | ✅ Identisch                                 |
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

| Paket                                          | Zweck                                                     |
| ---------------------------------------------- | --------------------------------------------------------- |
| `@astrojs/sitemap`                             | Sitemap-Generierung                                       |
| `@astrojs/image`                               | Bild-Optimierung (WebP, AVIF, responsive sizes)           |
| `@fontsource/bebas-neue` + `@fontsource/inter` | Self-hosted Fonts (DSGVO-konform, kein Google-Request)    |
| Astro i18n (built-in)                          | Mehrsprachigkeit de/en                                    |
| `leaflet` + `@types/leaflet`                   | Interaktive Karte (CSR)                                   |
| `astro-seo` oder manuell                       | Meta-Tags, OpenGraph, LD+JSON                             |

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
│   │       └── logo.webp
│   └── robots.txt
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
│   │       │   └── Lightbox                # nativ in Gallery.astro
│   │       ├── artists/
│   │       │   ├── ArtistCard.astro
│   │       │   └── ArtistCategoryFilter.astro
│   │       └── consent/
│   │           └── CookieBanner.astro      # Vanilla-JS, global in Page.astro
│   ├── content/
│   │   ├── config.ts                       # Collection-Schemas (Zod)
│   │   ├── artists/                        # .md pro Künstler (aus altem Projekt)
│   │   ├── locations/                      # .md pro Spielort
│   │   └── sponsors/                       # .md pro Sponsor
│   ├── data/
│   │   └── schedule.csv                    # Vollständiger Spielplan aller Auftritte
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
│   │   ├── program.astro
│   │   ├── impressions.astro
│   │   ├── sponsors.astro
│   │   ├── imprint.astro
│   │   ├── artists/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── locations/
│   │   │   ├── index.astro
│   │   │   └── [id].astro
│   │   └── en/                             # Englische Routen (Astro i18n)
│   │       ├── index.astro
│   │       ├── program.astro
│   │       ├── impressions.astro
│   │       ├── sponsors.astro
│   │       ├── imprint.astro
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
// src/data/impressions.ts
export interface GalleryItem {
  file: string; // Pfad relativ zu public/assets/img/impressions/
  thumbnail: string;
  caption?: string;
  type: 'image' | 'youtube';
  youtubeId?: string; // nur wenn type === "youtube"
}

export const impressions: GalleryItem[] = [
  // Lokale Bilder werden beim Build automatisch erkannt,
  // Videos werden mit Thumbnail, Caption und YouTube-ID ergänzt.
];
```

> **Entscheidung (aktualisiert 21.06.2026)**: `src/data/impressions.ts` ist die zentrale, typisierte Datenquelle. Lokale Bilder in `public/assets/img/impressions/` werden beim Build automatisch erkannt; YouTube-Videos werden explizit ergänzt. Die Galerie wird bewusst nicht kategorisiert oder gefiltert.

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
- Wird in `program.astro` und `locations/[id].astro` genutzt
- Alle Auftritte werden unabhängig von Uhrzeit und Spielort im regulären Spielplan angezeigt
- **Organizational-Filter**: Artists mit `organizational: true` erscheinen im Spielplan ohne klickbaren Detaillink
- **Slot-Merging** (`mergeConsecutiveSlots`): aufeinanderfolgende 30-min-Slots desselben Künstlers an derselben Location werden zur Build-Zeit zu einem `MergedEntry` zusammengefasst

```typescript
export interface MergedEntry {
  artist_id: string;
  location_id: string;
  startTime: Date; // erster Slot
  endTime: Date; // letzter Slot + 30 min
  slotCount: number; // Anzahl gemergter Slots (= rowspan im Grid)
  notes: string;
  festivalDay: string;
}
```

- **Listen-Ansicht**: zeigt `startTime – endTime` wenn `slotCount > 1`, sonst nur `startTime`
- **Tabellen-Ansicht**: gemergete Zelle erhält `rowspan={slotCount}`; überdeckte Folgezeilen werden nicht als `<td>` gerendert
- Zwei Auftritte desselben Künstlers mit Pause dazwischen bleiben getrennte Einträge

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
2. **Kategorie-Icons**: Horizontale Icon-Leiste (Akrobatik, Musik, Comedy, Magie, Street Art) mit Hover-Animationen
3. **Hut-Box**: Dunkles Panel „KÜNSTLER SPIELEN FÜR DEN HUT" mit Erklärtext
4. **Teaser-Slider**: 3–4 Featured Artists (Carousel)
5. **Vorschau Spielplan**: Aktueller/nächster Festivaldag-Auszug
6. **Orte auf einen Blick**: Mini-Map oder Location-Kacheln
7. **Footer**: Social-Links, Sponsoren, Impressum

### 9.2 Programm (`/program`)

**Features:**

- **Tag-Tabs**: Freitag / Samstag / Sonntag (Datum als Chip, aktiv = Magenta)
- **Spielort-Filter**: Dropdown „Alle Spielorte"
- **View-Toggle**: Tabellen-Ansicht (Desktop default) ↔ Listen-Ansicht (Mobile default)
- **Tabellen-Ansicht**: Zeilen = Zeitslots (30-min-Raster), Spalten = Spielorte, Zellen farbkodiert nach Kategorie
- **Listen-Ansicht**: Sortiert nach Zeit, Künstler + Spielort + Kategorie-Chip
- **Live-Indikator**: Wenn Serverzeit im Zeitfenster → Zelle hervorheben (nur Client-side via `Date.now()`)
- **Kategorie-Filter**: Filter-Chips (Alle / Musik / Akrobatik / Comedy / Magie / Street Art); kombinierbar mit Spielort-Filter und Tages-Tab
- **Favoriten** (♥): Button auf jeder Karte / Timetable-Zelle; gespeichert in `localStorage`, kein Login erforderlich; Filter „Nur meine Favoriten“; **Bonus-Feature**: eigene Festivalplan-Ansicht mit allen gemerkten Acts (Komponente `FavoritesButton.astro`, Logik in `utils/favorites.ts`)- Hinweis „Änderungen vorbehalten"

### 9.3 Künstler (`/artists`, `/artists/[slug]`)

**Listing-Seite `/artists`:**

- **Hero-Sektion**: Headline „ALLE KÜNSTLER AUF EINEN BLICK", Tagline, Performer-Foto rechts, Paint-Splatter-Dekoration, „Künstler spielen für den Hut!"-Badge
- **Filter Zeile 1**: Kategorie-Chips (ALLE | ARTISTIK | MUSIK | COMEDY | MAGIE | STREET ART)
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
- OSM-Tiles werden lokal aus `public/assets/img/map/tiles/` ausgeliefert
- **Mobile**: Karte nimmt Vollbreite; Spielort-Panel erscheint unterhalb der Karte beim Marker-Click (kein Bottom-Sheet-Pattern)

**Spielort-Detailseite:**

- Name, GPS-Koordinaten
- Vollständiges Programm an diesem Ort (alle Tage)
- Mini-Leaflet-Karte (nur dieser Ort, zentriert)

### 9.5 Impressionen / Galerie (`/impressions`)

**Features:**

- Visuell abwechslungsreiches Masonry-Grid (3 Spalten Desktop, 2 Tablet, 1 Mobile)
- Bilder aus `public/assets/img/impressions/` (bestehende Assets)
- Lokale 300-px-Thumbnails + Lazy-Loading; Originale werden erst in der Vollbildansicht geladen
- Native `<dialog>`-Lightbox: Vollbild, Vor/Zurück, Tastatursteuerung, Counter und Caption

**YouTube-Videos (DSGVO-konform – kein iFrame):**

- Darstellung mit lokal gespeichertem Original-YouTube-Thumbnail, Play-Symbol und Video-Caption
- Klick öffnet `youtube.com/watch?v=...` in neuem Tab
- **Kein iFrame** auf unserer Seite → kein Third-Party-Tracking → **kein Consent erforderlich**

**Bild-Metadaten:**

- Typisierte Datenquelle `src/data/impressions.ts` – automatische Bilderkennung plus Video-Metadaten (`file`, `caption?`, `type`, `youtubeId?`) – s. §6.4
- Ermöglicht Captions und YouTube-Kacheln ohne CMS, Kategorien oder leere Markdown-Hüllen

### 9.6 Abendprogramm

> **Entscheidung (21.06.2026)**: Nightlife wird nicht als eigenes Feature, eigene Kategorie oder eigene Route umgesetzt. Späte Auftritte und die zugehörigen Spielorte erscheinen ohne Sonderbehandlung im regulären Spielplan.

### 9.7 Sponsoren (`/sponsors`)

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
<CookieBanner locale={locale} />
<!-- GTM-Snippet wird via CookieBanner nach Consent injiziert -->
```

**CookieBanner.astro** (Vanilla-JS):

1. Prüft `localStorage.getItem('gtm-consent')`
2. Falls null → Banner anzeigen
3. Bei Akzeptieren: Consent speichern + GTM-Script dynamisch laden
4. Bei Ablehnen: Nur Consent speichern, kein GTM
5. Sprache: über i18n-Strings

### 10.3 Consent-Schnittstelle für Analytics

In Anlehnung an das alte Jekyll-Projekt stellt `Base.astro` den aktuellen Zustand zentral bereit:

- `window.spektakel.consent.getStatus()` → `pending | accepted | declined`
- `window.spektakel.consent.isAnalyticsGranted()` → boolescher Status für Analytics-Code
- `window.spektakel.consent.setStatus(...)` → speichert die Auswahl und löst `spektakel:consent-changed` aus
- „Cookie-Einstellungen“ im Footer öffnet den Banner erneut; ein Widerruf beendet bereits geladenes Tracking durch einen Reload

Phase 12 darf Google-Analytics-Code ausschließlich ausführen, wenn `isAnalyticsGranted()` wahr ist, oder auf `spektakel:consent-changed` mit `detail.analytics === true` reagieren. Der GTM-Container wird – anders als im alten Projekt mit Consent Mode – selbst erst nach Zustimmung geladen.

### 10.4 YouTube-Videos & DSGVO

YouTube-Videos in der Galerie (`/impressions`) werden **ohne iFrame** eingebunden:

- Darstellung als Kachel mit statischem YouTube-Thumbnail
- Klick öffnet `youtube.com/watch?v=...` in neuem Tab
- **Kein YouTube-iFrame** auf unserer Seite → kein Third-Party-Tracking → **kein Consent erforderlich**

> **Entscheidung**: Link-statt-iFrame-Ansatz. DSGVO-sauber, ohne Consent-Gate, ohne Facade-Komplexität.

### 10.5 Consent-Scope (GTM)

Der GTM-Container `GTM-TK5422TV` enthält ausschließlich Analytics-Tags (kein Marketing-/Retargeting-Tracking). Eine **einfache binäre Zustimmung** (Akzeptieren / Ablehnen) ist ausreichend und DSGVO-konform. Keine granulare Kategorisierung erforderlich.

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

- [x] `npm install` (Astro, Tailwind, Leaflet, Sitemap)
- [x] `npm install -D vitest @vitest/coverage-v8 @playwright/test` (Test-Dependencies)
- [x] `astro.config.mjs` vollständig konfigurieren (i18n, sitemap, output)
- [x] `vitest.config.ts` anlegen (include: `tests/unit/**`, `tests/integration/**`)
- [x] `playwright.config.ts` anlegen (baseURL, Projektprofile: Desktop Chrome, Mobile Chrome)
- [x] `package.json` – npm-Scripts: `test`, `test:unit`, `test:e2e`, `test:coverage`
- [x] `tailwind.config.mjs` mit Design-Tokens
- [x] `tsconfig.json` – strict mode
- [x] `src/styles/tokens.css` – CSS Custom Properties

### Phase 1 – Content-Foundation (2–3 h) ✅

- [x] `src/content/config.ts` – alle Collections + Schemas
- [x] Assets-Migration: `public/assets/img/artists/`, `impressions/`
- [x] Markdown-Migration: `_artists/` → `src/content/artists/`
- [x] Markdown-Migration: `_locations/` → `src/content/locations/`
- [x] Markdown-Migration: `_sponsors/` → `src/content/sponsors/`
- [x] `data/schedule.csv` kopieren
- [x] `src/utils/schedule.ts` – CSV-Parser
- [x] **Unit-Tests**: `tests/unit/schedule.test.ts` (CSV-Parser, Tagesgruppierung, Nacht-Logik 0–3 Uhr)
- [x] **Unit-Tests**: `tests/unit/i18n.test.ts` (Sprach-Fallback, alle Schlüssel vorhanden)
- [x] **Integrationstests**: `tests/integration/collections.test.ts` (Zod-Schema gegen echte Markdown-Dateien)

### Phase 2 – Layout & i18n (2–3 h) ✅

- [x] ⚠️ **Asset-Request**: Logo-PNG vorhanden (`/assets/img/logo/logo.png`); OG-Social-Image fehlt noch → siehe §18 Technical Debt
- [x] `src/layouts/Base.astro` (HTML-Shell, Meta, GTM-Placeholder)
- [x] `src/layouts/Page.astro` (Header/Footer-Wrapper)
- [x] `src/components/layout/Header.astro` (Logo, Navigation, Sprachwechsler)
- [x] `src/components/layout/Navigation.astro` (Desktop + Mobile Hamburger)
- [x] `src/components/layout/Footer.astro` (Social, Links)
- [x] `src/i18n/de.ts` + `en.ts` – alle UI-Strings

### Phase 3 – Design-System-Komponenten (2–3 h) ✅

- [x] ⚠️ **Asset-Request**: Paint-Splatter-PNGs (5 Varianten) + Kategorie-Icons (5 Stück als PNG) unter `src/assets/splatter/` und `src/assets/categories/` abgelegt
- [x] `Badge.astro`, `Button.astro`, `CategoryChip.astro`
- [x] `PaintSplatter.astro` – dekoratives PNG-Element via Astro `<Image>`
- [x] Globales CSS (Typografie, Farben, Reset)

### Phase 4 – Landingpage (2 h) ✅

- [x] ⚠️ **Asset-Request**: Hero-Bild (`hero1.png` ✅) + Hut-Illustration (→ TD2: SVG-Platzhalter)
- [x] Hero-Sektion (Logo, Datum-Badge, Subtext, CTAs, Juggler-Figur, Paint-Splatter)
- [x] Kategorie-Icon-Leiste (5 Icons mit Hover-Animation)
- [x] Hut-Panel (SVG-Platzhalter, TD2)
- [x] Featured-Artists-Slider (4 Artists mit Bild + Kategorie-Badge)
- [x] Spielplan-Vorschau (Freitag, 5 Einträge)
- [x] i18n-Strings `home.*` in de.ts + en.ts ergänzt
- [x] **Design-Abgleich Desktop + Mobile** (`design_concept.png`) ✅ – bestätigt 16.06.2026

### Phase 5 – Programmseite (3–4 h)

- [x] `DayTabs.astro`
- [x] `VenueFilter.astro`
- [x] `ProgramGrid.astro` (Tabellenansicht)
- [x] `ProgramList.astro` (Listenansicht)
- [x] `CategoryFilter.astro` (Kategorie-Filter-Chips)
- [x] `ProgramPage.astro` (Orchestrator: Hero, Filter-Bar, Day-Panels, Client-Script)
- [x] `src/pages/program.astro` + `src/pages/en/program.astro`
- [x] i18n-Keys `program.*` in `de.ts` + `en.ts`
- [x] View-Toggle (Icon-Buttons, List/Grid)
- [x] Structured Data (JSON-LD EventSeries + 362 subEvents, via `slot="head"`)
- [x] Routen zentral in `src/utils/routes.ts` (kein hardcoded `/programm/` mehr)
- [x] Slot-Merging: aufeinanderfolgende 30-min-Slots → ein Block (s. §7)
- [ ] **Design-Abgleich Desktop + Mobile** (`design_concept.png`)

> **Offene Abweichungen vom Mockup (vor Phasen-Abschluss zu beheben):**
>
> 1. **Standard-Ansicht**: Mockup → Tabellenansicht auf Desktop, Listenansicht auf Mobile. Aktuell: immer Liste.
> 2. **Tab-Labels Mobile**: Mockup → kurze Labels „FR 19.09." auf schmalen Screens. Aktuell: immer voller Wochentag.

### Phase 6 – Künstler (2–3 h)

- [x] `ArtistCard.astro` (Foto, Favorit-Stern, Name, Spielzeiten, Kategorie-Chip; kein Spielort – variiert je Uhrzeit)
- [x] `ArtistPage.astro` (Hero 2-Spalten mit `hero4.png` Hula-Hoop-Performerin, Für-den-Hut-Badge, Filter-Bar horizontal-scrollbar)
- [x] `CATEGORY_COLORS` in `categories.ts` – JS-Konstante als Single Source of Truth; `CategoryChip` importiert daraus
- [x] Kategorien auf Detailseite: `CategoryChip` statt grauer Spans, Mapping raw → Makro-Kategorie via `mapToCategory()`
- [x] `/artists/index.astro` + `/en/artists/index.astro`
- [x] `/artists/[slug].astro` (Detailseite) + `/en/artists/[slug].astro`
- [x] Structured Data (Person + performerIn Events inkl. `duration` als ISO 8601 wenn gesetzt)
- [x] `src/components/ui/MapPin.astro` – wiederverwendbarer SVG-Pin (Farbe via `color`-Prop)
- [x] Spielzeiten-Karten: MapPin mit `marker_color` aus Location-Frontmatter
- [x] Highlight-Text: `class="highlight"` (CSS in `global.css`), Beschreibung normal getrennt
- [x] Zeitangaben in Cards: kein `truncate`, Text bricht natürlich um
- [x] Kategorie-Chips: Filter-Bar wrappend (alle Chips immer sichtbar, kein hidden overflow) – Fix 06.06.2026
- [x] Spielort aus Artist-Cards entfernt (variiert je nach Uhrzeit, kein sinnvoller Einzel-Ort darstellbar)
- [x] ~~⚠️ **Asset-Request: Hero-Bild für Künstlerliste**~~ → erledigt mit `hero4.png` (Hula-Hoop-Performerin, freigestellt)
- [ ] Galerie-Vorschau auf Detailseite (3 Thumbnails + Lightbox) – **offen: Bilder fehlen noch** (mehrere `images[]`-Einträge in Artist-Frontmattern nötig)
- [x] **Design-Abgleich Desktop** (`design_concept_artists.png`) ✅ – Stand 04.06.2026
- [x] **Mobile-Abgleich** ✅ – Stand 06.06.2026 (390 px, Playwright CLI)

> **Offene Abweichungen / bekannte Einschränkungen:**
>
> - Galerie-Vorschau auf Detailseite fehlt (kein Asset-Problem, sondern fehlende Zusatzbilder in `images[]`)
> - Navigation Desktop zeigt Hamburger (globales Layout-Thema, Phase 2 – separates Issue)

### Phase 7 – Spielorte & Karte (3–4 h) ✅

- [x] Map-Assets migriert: `public/assets/img/map/tiles/` (Zoom 16–19, lokale OSM-Vorrendierung), `marker-*.{png,webp}`, `schedule-pink.{png,webp}`
- [x] `content.config.ts` – `location_label`-Feld in Location-Schema ergänzt
- [x] `LocationMap.astro` – Leaflet-Karte mit lokalen Kacheln (`/assets/img/map/tiles/{z}/{x}/{y}.webp`, Fallback .jpg)
  - `L.divIcon` mit CSS-Klasse `spk-marker-{color}` (analog altem Projekt)
  - Marker-Label: `location_id` als Zahl, oder "i"-Icon für Info-Standorte
  - Popup: Spielplan des Spielorts (zukünftige Einträge, dedupliziert, nach Festivaltag gruppiert)
  - URL-Hash: beim Popup-Öffnen wird `#location_id` gesetzt
  - Bounding Box: `[[48.5261029,12.1322959],[48.549313,12.169414]]`
  - Icon-Größe: `[35, 46]`, Anker: `[15, 46]`
- [x] `LocationsPage.astro` – Hero, Karte, Spielortliste (Cards mit Marker-Icon)
- [x] `LocationDetail.astro` – Mini-Karte (Leaflet), Hero mit GPS-Link, vollständiges Programm mit Zeitspannen + Kategorie-Chips, Back-Link
- [x] `src/utils/routes.ts` – `locationPath()`-Funktion ergänzt
- [x] i18n-Strings `locations.*` in `de.ts` + `en.ts` erweitert
- [x] `/locations/index.astro` + `/en/locations/index.astro`
- [x] `/locations/[id].astro` + `/en/locations/[id].astro`
- [x] **Design-Abgleich Desktop + Mobile** (`design_concept.png`) ✅ – bestätigt 21.06.2026

> **Tile-Strategie**: Keine Online-OSM-Kacheln – alle Tiles sind lokal vorgerendert und liegen in `public/assets/img/map/tiles/`. OSM-Attribution gemäß Lizenz im Leaflet-Layer vorhanden.

### Phase 8 – Galerie (2–3 h) ✅

- [x] `src/data/impressions.ts` (Metadaten-Manifest)
- [x] `Gallery.astro` (Masonry-Grid + native Lightbox)
- [x] `/impressions` + `/en/impressions`
- [x] **Design-Abgleich Desktop + Mobile** (`design_concept.png`) ✅ – bestätigt 21.06.2026

### Phase 9 – Restliche Seiten (2 h) ✅

> **Scope-Hinweis**: Die ehemals geplante Nightlife-Seite entfällt. Sämtliche Abendauftritte bleiben Bestandteil des regulären Spielplans. `/info`, `/about` und `/privacy` werden vorerst ebenfalls nicht umgesetzt, unabhängig von ihrer Darstellung im Designkonzept.

- [x] Sponsor-Logos geprüft: 25 Content-Einträge, alle referenzierten WebP-Dateien vorhanden; einheitliche Darstellung über `object-contain` und maximale Logo-Höhe
- [x] `/sponsors`
- [x] `/imprint` (`/impressum` bleibt als kompatibler Altpfad erhalten)
- [x] `404.astro` – zweisprachige, Theming-passende 404-Seite mit Heimlinks (GitHub Pages erkennt `404.html` automatisch)
- [x] EN-Pendants aller Seiten

### Phase 10 – DSGVO (2 h) ✅

- [x] `CookieBanner.astro` – zweisprachig, responsive und im Festival-Design
- [x] GTM-Integration (consent-gesteuert; Entscheidung in `localStorage` unter `gtm-consent`)
- [x] **E2E-Test**: `tests/e2e/consent.spec.ts` (Banner erscheint, Ablehnung lädt kein GTM, Zustimmung und persistierte Zustimmung laden das GTM-Script genau einmal, Status-API und Widerruf funktionieren)
- [x] **Design-Abgleich Desktop + Mobile** (`design_concept.png`) ✅ – geprüft 21.06.2026

### Phase 11 – Kritische E2E-Smoke-Tests (1–2 h) ✅

> **Reduzierter Scope (21.06.2026):** Keine vollständige E2E-Abdeckung. Getestet werden nur kritische Nutzerpfade und die Erreichbarkeit aller veröffentlichten Sprachvarianten.

- [x] `tests/e2e/navigation.spec.ts` – alle veröffentlichten DE-/EN-Routen erreichbar; Sprachwechsel führt zur entsprechenden Route
- [x] `tests/e2e/program.spec.ts` – Tagesauswahl und Kategorie-Filter funktionieren
- [x] `tests/e2e/impressions.spec.ts` – Lightbox öffnen, navigieren und schließen
- [x] Smoke-Tests im Desktop-Chrome- und Mobile-Chrome-Profil (375 px) ausführen

**Bewusst nicht enthalten:** vollständige Künstler-, Karten- und Filterabdeckung sowie ein verpflichtender Coverage-Schwellwert.

### Phase 12 – SEO & QA (2 h)

- [ ] Google-Analytics-Tracking über `GTM-TK5422TV` prüfen; Ausführung ausschließlich bei `window.spektakel.consent.isAnalyticsGranted()`
- [ ] **Finaler Design-Abgleich aller Seiten** gegen `design_concept.png` (Desktop + Mobile)
- [ ] Structured Data für alle Seiten prüfen (Google Rich Results Test)
- [ ] Lighthouse-Audit (Performance, Accessibility, SEO)
- [ ] `robots.txt`, Sitemap-Validierung
- [ ] hreflang-Tags prüfen

### Phase 13 – Deployment (1 h)

- [ ] `astro.config.mjs` – `site` URL setzen
- [ ] GitHub Actions Workflow
- [ ] Erst-Deployment + Smoke-Test

---

## 15. Offene Punkte / Abhängigkeiten

| #   | Thema                                             | Status                                                       |
| --- | ------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Festival-Termin 2026 (Datum, Spielplan, Künstler) | ⏳ Kommt in den nächsten Wochen                              |
| 2   | Neue Künstler-Fotos / Assets für 2026             | ⏳ Kommt mit Termin                                          |
| 3   | Font-System: Display- und Body-Font wählen        | ✅ Bebas Neue + Inter (s. §2.2, §4.2)                        |
| 4   | Impressionen: zentrale Datenquelle                | ✅ Typisierte Datenquelle `src/data/impressions.ts` (s. §6.4) |
| 5   | INFO-Seite                                       | ➖ Vorerst aus dem Scope gestrichen                           |
| 6   | ÜBER UNS                                         | ➖ Vorerst aus dem Scope gestrichen                           |
| 7   | NEWS: Feature-Scope wird später definiert         | 🔲 Zurückgestellt                                            |
| 9   | Display-Font: Bebas Neue                          | ✅ `@fontsource/bebas-neue` (s. §2.2)                        |
| 10  | Body-Font: Inter                                  | ✅ `@fontsource/inter` (s. §2.2)                             |

---

## 18. Technical Debt

Hier landen bekannte Lücken, die bewusst zurückgestellt wurden und **vor dem Go-Live geschlossen** werden müssen.

| #   | Asset / Aufgabe                        | Beschreibung                                                                                                          | Benötigt von                           | Priorität |
| --- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------- |
| TD1 | **OG-Social-Image** (1200×630 px WebP) | Fehlt vollständig. Aktuell Fallback auf `jonglage.png` (falsches Seitenverhältnis). Muss vor Go-Live erstellt werden. | `Base.astro` `og:image` / Twitter Card | 🔴 Hoch   |
| TD2 | **Hut-Illustration / Icon**            | Aktuell Platzhalter (einfaches SVG + Text). Soll durch echte Illustration ersetzt werden (Hutmotiv, festivalig).      | Landingpage Hut-Box-Sektion            | 🟡 Mittel |

---

## 16. Referenzen

- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
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
| 2   | **Kategorie-Icons** (Akrobatik, Musik, Comedy, Magie, Street Art) als SVG            | Landingpage Icon-Leiste, Filter-Chips              | Teilweise als PNG in `assets/img/icons/`                                                           | Phase 3                 |
| 3   | **Logo** „Spektakel!“ im neuen Stil (SVG + WebP)                                     | Header, OG-Bild                                    | `assets/img/spektakel-logo.webp` vorhanden – ggf. anpassen                                         | Phase 2                 |
| 4   | **Hero-Bild / Festival-Hauptmotiv** (mind. 1920×1080 px, WebP)                       | Landingpage-Hero, OG-Image                         | `assets/img/plakat2025.webp` vorhanden – 2026 benötigt                                             | Phase 4                 |
| 5   | **„Hut“-Illustration oder Icon** für die Hut-Panel-Sektion                           | Hut-Box auf Landingpage                            | Nein                                                                                               | Phase 4                 |
| 7   | **OG-Social-Image** (1200×630 px, WebP)                                              | OpenGraph / Twitter Card                           | Platzhalter: `jonglage.png` (1536×1024, falsches Seitenverhältnis) → Screenshot der fertigen Seite | Phase 13                |
| 9   | **Karten-Marker-Icons** (SVG, farbkodiert je Spielort)                               | Leaflet-Map, Legende                               | `assets/img/map/` vorhanden – Format prüfen                                                        | Phase 7                 |
| 10  | **Sponsor-Logos** (WebP, einheitliche Höhe ~80 px)                                   | Sponsoren-Seite                                    | `assets/img/sponsors/` vorhanden – Vollständigkeit prüfen                                          | Phase 9                 |
| 11  | **Artist-Fotos 2026** (WebP, mind. 800×800 px, quadratisch oder 4:3)                 | Künstler-Grid, Detailseiten                        | Nur 2025-Assets vorhanden                                                                          | Nach Termin-Bekanntgabe |
| 12  | **Impressions-Fotos 2026**                                                           | Galerie                                            | Nur bis 2025 vorhanden                                                                             | Nach Festival 2026      |

### 17.3 Asset-Anforderungs-Checkpoints im Ablauf

Die folgenden Phasen enthalten explizite **„⚠️ Asset-Request“**-Einträge (in den Phasen-Checklisten markiert). Ich werde dort **vor Beginn der eigentlichen Implementierung** eine detaillierte Liste mit exakten Spezifikationen liefern:

| Phase    | Asset-Request-Zeitpunkt | Betrifft                                                                                    |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| Phase 2  | Vor Header-Bau          | Logo-SVG                                                                                    |
| Phase 3  | Vor Komponenten-Bau     | Paint-Splatter-SVGs, Kategorie-Icons                                                        |
| Phase 4  | Vor Landingpage-Bau     | Hero-Bild, Hut-Illustration                                                                 |
| Phase 7  | Vor Karten-Bau          | Marker-Icons (SVG, Farben)                                                                  |
| Phase 9  | Vor Sponsoren-Seite     | Sponsor-Logos Vollständigkeitsprüfung                                                       |
| Phase 13 | Nach Deployment         | OG-Social-Image (Screenshot der fertigen Seite, 1200×630 px)                                |
