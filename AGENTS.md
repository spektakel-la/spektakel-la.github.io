# AGENTS.md

Arbeitsanweisungen fuer Codex und andere Coding-Agents in diesem Repository.

## Projektkontext

- Projekt: Spektakel Landshut Website.
- Stack: Astro, TypeScript, Tailwind CSS, Vitest und Playwright.
- Package Manager: npm.
- Lockfile: `package-lock.json`.
- Node-Version: `>=24.0.0` laut `package.json`.
- Produktionsdomain: `https://spektakel.la`.
- SEO-, Canonical-, Sitemap-, robots.txt- und JSON-LD-URLs sollen diese Domain verwenden.
- Die Website ist statisch gebaut und verwendet produktiv WebP-only-Bildpfade.

## Laufzeit und Package Manager

- Kein pnpm verwenden.
- Kein yarn verwenden, solange nicht explizit anders entschieden.
- npm ist der Package Manager fuer Installation, Skripte und Lockfile-Pflege.
- Keine globale Node.js-Installation voraussetzen oder empfehlen.
- Node.js ueber FNM (Fast Node Manager) verwenden.
- Wenn `fnm` nicht im aktuellen `PATH` liegt, den Homebrew-Pfad `/opt/homebrew/bin/fnm` verwenden.
- Fuer npm-, Build- und Test-Kommandos in zsh die FNM-Umgebung explizit laden und das eigentliche Kommando in derselben Shell-Kette ausfuehren:

```sh
eval "$(/opt/homebrew/bin/fnm env --shell zsh)" && /opt/homebrew/bin/fnm use 24 && npm run build
```

- `npm run build` im Beispiel durch das benoetigte Kommando ersetzen, z. B. `npm install`, `npm run dev`, `npm run test` oder `npm run build`.
- Wenn eine passende Node-Version fehlt, FNM verwenden, z. B.:

```sh
fnm install 24
fnm use 24
```

- Danach Abhaengigkeiten mit npm installieren:

```sh
npm install
```

## Wichtige Kommandos

```sh
npm run dev
npm run build
npm run test:unit
npm run test:e2e
npm run test
npm run images:check
npm run hooks:install
```

- `npm run build` fuehrt vor dem Astro-Build `npm run images:check` aus.
- `npm run test` fuehrt Unit-/Integrationstests und Playwright-End-to-End-Tests aus.
- Fuer lokale Entwicklung startet `npm run dev` den Astro-Server standardmaessig unter `http://localhost:4321`.

## Bild- und Asset-Regeln

- Produktive Bildpfade sollen WebP-only bleiben.
- Neue JPG/PNG-Bilder erst lokal nach WebP konvertieren:

```sh
npm run images:webp
```

- Danach Dubletten bereinigen:

```sh
npm run images:clean:dry
npm run images:clean
```

- Vor Build oder Push bei Bildaenderungen `npm run images:check` ausfuehren.
- ImageMagick mit dem `magick`-Kommando wird fuer Bildkonvertierungen vorausgesetzt.
- Eigene Font-Dateien unter `public/assets/fonts/` ablegen, damit sie statisch mit stabilen `/assets/fonts/...`-URLs ausgeliefert werden.
- Eigene Fonts zentral in `src/styles/global.css` per `@font-face` registrieren; bevorzugt `woff2`, dann `woff`, optional `ttf` als Fallback.

## Arbeitsweise im Repository

- Bestehende Patterns, Komponenten und Datenstrukturen bevorzugen.
- Keine unaufgeforderten Framework-, Tooling- oder Package-Manager-Wechsel vornehmen.
- `package-lock.json` erhalten und bei Dependency-Aenderungen mit npm aktualisieren.
- Unrelated Changes im Working Tree nicht zuruecksetzen oder umformatieren.
- Aenderungen moeglichst klein und nachvollziehbar halten.
- Code-Duplikation vermeiden: gemeinsam genutzte Logik, Datenstrukturen, Mapping-Tabellen und Browser-Helfer in passende Komponenten-, Daten- oder `src/utils`-Dateien auslagern statt sie mehrfach lokal zu definieren.
- Bei UI-Aenderungen responsive Darstellung und bestehende Gestaltung pruefen.
- Bei Content-Aenderungen deutsche und englische Seiten bzw. i18n-Daten im Blick behalten.
- Contents aus 2025 ignorieren, es sei denn sie werden explizit gefordert.

## Tests und Verifikation

- Fuer reine Content-Aenderungen mindestens die betroffenen Seiten lokal plausibilisieren.
- Fuer Logik- oder Datenstruktur-Aenderungen relevante Vitest-Tests ausfuehren.
- Fuer Navigation, Consent, Programm, Galerie oder SEO relevante Playwright-Tests ausfuehren.
- Bei Browser-Plugin-Pruefungen fuer diese statisch gebaute Astro-Seite `load` statt `networkidle` als Wait-State verwenden; der Browser-Wrapper unterstuetzt `networkidle` hier nicht.
- Vor groesseren Abschluessen bevorzugt `npm run build` ausfuehren.
- Wenn Tests nicht ausgefuehrt werden koennen, im Ergebnis klar sagen, was nicht geprueft wurde.

## Wiederkehrende Konventionen festhalten

Wenn waehrend einer Aufgabe wiederkehrende Projektregeln, bevorzugte Tools, lokale Setup-Details oder Stilentscheidungen besprochen werden, soll der Agent aktiv rueckfragen, ob diese Information in `AGENTS.md` aufgenommen werden soll.

Beispiele:

- bevorzugte Node-/Tool-Versionen
- verbotene oder unerwuenschte Tools
- lokale Setup-Schritte
- Deployment- oder Hosting-Konventionen
- Teststrategie
- Content-, i18n- oder Asset-Regeln
- wiederkehrende Coding- oder Designentscheidungen

Neue Eintraege sollen knapp, konkret und handlungsorientiert formuliert werden.
