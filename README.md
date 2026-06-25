# Spektakel Landshut

Astro-Website fuer das Spektakel Landshut.

## Entwicklung

Voraussetzungen:

- Node.js `>=22.12.0`
- npm

```sh
npm install
npm run dev
```

Der Entwicklungsserver ist anschliessend unter `http://localhost:4321` erreichbar.

| Kommando                | Aufgabe                                      |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Lokalen Entwicklungsserver starten           |
| `npm run build`         | Statischen Produktions-Build erzeugen        |
| `npm run preview`       | Produktions-Build lokal anzeigen             |
| `npm run test:unit`     | Unit- und Integrationstests ausfuehren       |
| `npm run test:e2e`      | Playwright-End-to-End-Tests ausfuehren       |
| `npm run test:coverage` | Test-Coverage erzeugen                       |
| `npm run images:webp`   | JPG/PNG-Assets lokal nach WebP konvertieren  |

## WebP-Bilder erzeugen

WebP-Dateien werden lokal erzeugt und mit eingecheckt. Der GitHub-Actions-Build muss dadurch keine Bildkonvertierung ausfuehren.

Voraussetzung ist ImageMagick mit dem `magick`-Kommando:

```sh
magick -version
```

Das Script konvertiert standardmaessig alle JPG/JPEG/PNG-Dateien unter `public/assets/img` und `src/assets` in gleichnamige `.webp`-Dateien. Bereits vorhandene WebP-Dateien werden uebersprungen:

```sh
npm run images:webp
```

Nuetzliche Varianten:

```sh
npm run images:webp -- --dry-run
npm run images:webp -- --force
npm run images:webp -- --quality 88 public/assets/img/artists
```

Aktueller Bestand: Map-Tiles und Sponsorenlogos haben bereits WebP-Pendants. Noch zu konvertieren sind vor allem aktuelle Kuenstlerbilder, Galerie-Originale, Galerie-Thumbnails, Video-Thumbnails, Logo-PNGs und importierte `src/assets`-PNG-Dateien.

## Galerie-Bilder

Originalbilder liegen unter:

```text
public/assets/img/impressions/
```

Die Galerie erkennt neue Bilder in diesem Verzeichnis beim Build automatisch. Fuer das Masonry-Raster werden separate Vorschaubilder aus `public/assets/img/impressions/thumbs/` geladen; die Originale werden erst beim Oeffnen der Lightbox angefordert.

### Thumbnails erzeugen

Voraussetzung ist ImageMagick mit dem `magick`-Kommando:

```sh
magick -version
```

Das folgende Kommando wird im Projektverzeichnis ausgefuehrt. Es erzeugt fuer alle unterstuetzten Originalbilder Thumbnails mit maximal 1000 x 1000 Pixeln, behaelt das Seitenverhaeltnis bei und skaliert kleine Bilder nicht hoch:

```sh
mkdir -p public/assets/img/impressions/thumbs

find public/assets/img/impressions \
  -maxdepth 1 \
  -type f \
  \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' -o -iname '*.avif' \) \
  -exec magick mogrify \
    -path public/assets/img/impressions/thumbs \
    -auto-orient \
    -thumbnail '1000x1000>' \
    -strip \
    -quality 84 \
    {} +
```

Die Zielgroesse von 1000 Pixeln deckt die maximale Kachelbreite von etwa 500 CSS-Pixeln auch auf Displays mit Device-Pixel-Ratio 2 ab. `-strip` entfernt unnoetige EXIF-Metadaten; `-quality 84` bietet fuer JPEG/WebP einen guten Kompromiss zwischen Schaerfe und Dateigroesse.

Bei neuen Bildern genuegt es, die Originaldateien in den Ordner zu legen und das Kommando erneut auszufuehren. Vorhandene Thumbnails werden dabei aktualisiert.

Anzahl und Abmessungen lassen sich anschliessend pruefen:

```sh
find public/assets/img/impressions/thumbs -maxdepth 1 -type f | wc -l
magick identify -format '%f: %wx%h\n' public/assets/img/impressions/thumbs/*
```
