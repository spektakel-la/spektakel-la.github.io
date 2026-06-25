#!/usr/bin/env bash
set -euo pipefail

QUALITY=84
FORCE=0
DRY_RUN=0
ROOTS=()

usage() {
  cat <<'EOF'
Usage: scripts/convert-webp.sh [options] [path ...]

Converts JPG, JPEG, and PNG files to same-directory WebP files with ImageMagick.
Existing .webp files are skipped unless --force is used.

Options:
  -q, --quality <1-100>  WebP quality (default: 84)
  -f, --force            Recreate existing .webp files
  -n, --dry-run          Print what would be converted
  -h, --help             Show this help

Default paths:
  public/assets/img
  src/assets
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -q|--quality)
      if [[ $# -lt 2 || ! "$2" =~ ^[0-9]+$ || "$2" -lt 1 || "$2" -gt 100 ]]; then
        echo "Invalid quality. Use a number from 1 to 100." >&2
        exit 2
      fi
      QUALITY="$2"
      shift 2
      ;;
    -f|--force)
      FORCE=1
      shift
      ;;
    -n|--dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      while [[ $# -gt 0 ]]; do
        ROOTS+=("$1")
        shift
      done
      ;;
    -*)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      ROOTS+=("$1")
      shift
      ;;
  esac
done

if [[ ${#ROOTS[@]} -eq 0 ]]; then
  ROOTS=(public/assets/img src/assets)
fi

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required. Install it and make sure 'magick' is in PATH." >&2
  exit 1
fi

converted=0
skipped=0

for root in "${ROOTS[@]}"; do
  if [[ ! -d "$root" ]]; then
    echo "Skipping missing directory: $root" >&2
    continue
  fi

  while IFS= read -r -d '' input; do
    output="${input%.*}.webp"

    if [[ -f "$output" && "$FORCE" -ne 1 ]]; then
      ((skipped += 1))
      continue
    fi

    if [[ "$DRY_RUN" -eq 1 ]]; then
      printf 'would convert: %s -> %s\n' "$input" "$output"
    else
      printf 'convert: %s -> %s\n' "$input" "$output"
      magick "$input" \
        -auto-orient \
        -strip \
        -quality "$QUALITY" \
        -define webp:method=6 \
        "$output"
    fi

    ((converted += 1))
  done < <(
    find "$root" \
      -path '*/node_modules/*' -prune -o \
      -path '*/dist/*' -prune -o \
      -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) \
      -print0
  )
done

if [[ "$DRY_RUN" -eq 1 ]]; then
  printf 'Would convert %d file(s); skipped %d existing WebP file(s).\n' "$converted" "$skipped"
else
  printf 'Converted %d file(s); skipped %d existing WebP file(s).\n' "$converted" "$skipped"
fi
