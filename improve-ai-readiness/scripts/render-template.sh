#!/usr/bin/env bash
set -euo pipefail

template="${1:-}"
env_file="${2:-}"

if [ -z "$template" ] || [ ! -f "$template" ]; then
  echo "Usage: $0 template-file [KEY=VALUE.env]" >&2
  exit 2
fi

if [ -n "$env_file" ]; then
  if [ ! -f "$env_file" ]; then
    echo "Env file not found: $env_file" >&2
    exit 2
  fi
  set -a
  # shellcheck disable=SC1090
  . "$env_file"
  set +a
fi

content="$(cat "$template")"

tokens="$(printf '%s\n' "$content" | grep -o '{{[A-Z0-9_]*}}' | sort -u || true)"
for token in $tokens; do
  name="${token#\{\{}"
  name="${name%\}\}}"
  value="${!name-}"
  content="${content//$token/$value}"
done

printf '%s\n' "$content"
