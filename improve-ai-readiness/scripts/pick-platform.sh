#!/usr/bin/env bash
set -euo pipefail

root="${1:-.}"
pkg="$root/package.json"

has_file() {
  [ -e "$root/$1" ]
}

pkg_has() {
  [ -f "$pkg" ] && grep -q "\"$1\"" "$pkg"
}

platform="plain-html"
overlays=""

if pkg_has "next"; then
  if has_file "app"; then
    platform="nextjs-app-router"
  elif has_file "pages"; then
    platform="nextjs-pages-router"
  else
    platform="nextjs"
  fi
elif pkg_has "astro" || has_file "astro.config.mjs" || has_file "astro.config.ts"; then
  platform="astro"
elif pkg_has "@sveltejs/kit" || has_file "svelte.config.js" || has_file "svelte.config.ts"; then
  platform="sveltekit"
elif pkg_has "@remix-run" || pkg_has "react-router"; then
  platform="remix-react-router"
elif has_file "wrangler.toml"; then
  if grep -q "pages_build_output_dir" "$root/wrangler.toml" 2>/dev/null; then
    platform="cloudflare-pages"
  else
    platform="cloudflare-workers"
  fi
elif has_file "netlify.toml"; then
  platform="netlify"
fi

if has_file "vercel.json"; then
  overlays="${overlays:+$overlays,}vercel"
fi
if has_file "netlify.toml"; then
  overlays="${overlays:+$overlays,}netlify"
fi
if has_file "wrangler.toml"; then
  overlays="${overlays:+$overlays,}cloudflare"
fi

printf '{"platform":"%s","overlays":[' "$platform"
if [ -n "$overlays" ]; then
  old_ifs="$IFS"
  IFS=","
  i=0
  for overlay in $overlays; do
    [ "$i" -gt 0 ] && printf ','
    printf '"%s"' "$overlay"
    i=$((i + 1))
  done
  IFS="$old_ifs"
fi
printf ']}\n'
