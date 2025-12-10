#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

src_icons="$repo_root/packages/registry/lib/icons.ts"
dest_icons="$repo_root/apps/web/public/registry/lib/icons.ts"

if [ ! -f "$src_icons" ]; then
  echo "[sync-icons] Source file not found: $src_icons" >&2
  exit 1
fi

mkdir -p "$(dirname "$dest_icons")"

cp "$src_icons" "$dest_icons"

echo "[sync-icons] Updated $dest_icons from $src_icons"
