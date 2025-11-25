#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
components_dir="$repo_root/registry/ui"

if [ ! -d "$components_dir" ]; then
  echo "[build-components] Components directory not found: $components_dir" >&2
  exit 1
fi

echo "[1/4] Preparing output file..."
mkdir -p "$repo_root/public/registry"
output_file="$repo_root/public/registry/components.json"
echo "{" > "$output_file"
first=true

echo "[2/4] Preparing import rewrites..."
rewrite_script="$(mktemp -t rewrite.XXXXXX.pl)"
cat > "$rewrite_script" <<'PERL'
s#@/registry/ui/#@/components/ui/#g;
PERL

echo "[3/4] Encoding TSX components to Base64 JSON..."
find "$components_dir" -maxdepth 1 -type f -name '*.tsx' \
  ! -name '*-demos*' | sort | while read -r file; do
    filename=$(basename "$file")

    fixed_content=$(perl -0p "$rewrite_script" "$file")

    encoded=$(printf "%s" "$fixed_content" | base64 | tr -d '\n')

    if [ "$first" = true ]; then
      first=false
    else
      echo "," >> "$output_file"
    fi
    echo "  \"${filename}\": \"${encoded}\"" >> "$output_file"
done

echo "" >> "$output_file"
echo "}" >> "$output_file"

rm -f "$rewrite_script"

echo "[4/4] Done! Components registry written to $output_file"
