#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

src_css="$repo_root/apps/web/app/global.css"
dest_css="$repo_root/apps/web/public/registry/css/index.css"

if [ ! -f "$src_css" ]; then
  echo "[sync-css-tokens] Source file not found: $src_css" >&2
  exit 1
fi

if [ ! -f "$dest_css" ]; then
  echo "[sync-css-tokens] Destination file not found: $dest_css" >&2
  exit 1
fi

tokens_block=$(awk '
  /NOCTA CSS THEME VARIABLES START/ {capture=1; next}
  /NOCTA CSS THEME VARIABLES END/ {capture=0; next}
  capture && $0 !~ /\/\*/ && $0 !~ /\*\// {print}
' "$src_css")

if [ -z "$tokens_block" ]; then
  echo "[sync-css-tokens] Failed to extract theme tokens from $src_css" >&2
  exit 1
fi

{
  printf '%s\n\n' '@import "tailwindcss";'
  printf '%s\n' "$tokens_block"
} > "$dest_css"

echo "[sync-css-tokens] Updated $dest_css from $src_css"
