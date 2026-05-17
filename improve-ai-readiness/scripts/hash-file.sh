#!/usr/bin/env bash
set -euo pipefail

file="${1:-}"
if [ -z "$file" ] || [ ! -f "$file" ]; then
  echo "Usage: $0 path/to/file" >&2
  exit 2
fi

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$file" | awk '{print $1}'
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "$file" | awk '{print $1}'
else
  echo "No sha256sum or shasum available" >&2
  exit 2
fi
