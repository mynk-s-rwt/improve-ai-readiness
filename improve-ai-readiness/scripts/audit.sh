#!/usr/bin/env bash
set -euo pipefail

url="${1:-}"
format="${2:-json}"

if [ -z "$url" ]; then
  echo "Usage: $0 https://example.com [json|agent]" >&2
  exit 2
fi

response="$(curl -sS -X POST "https://isitagentready.com/api/scan" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"$url\",\"format\":\"$format\"}")"

if [ "$format" = "agent" ]; then
  printf '%s\n' "$response"
  exit 0
fi

if command -v jq >/dev/null 2>&1; then
  printf '%s\n' "$response" | jq '{
    url,
    redirectedFrom,
    scannedAt,
    level,
    levelName,
    nextLevel,
    isCommerce,
    commerceSignals,
    failed: (.checks as $checks | [
      $checks
      | paths as $p
      | select(($checks | getpath($p) | type) == "object")
      | select(($checks | getpath($p).status?) == "fail")
      | {
          path: ($p | join(".")),
          message: (($checks | getpath($p).message) // ""),
          evidence: (($checks | getpath($p).evidence) // [])
        }
    ]),
    neutral: (.checks as $checks | [
      $checks
      | paths as $p
      | select(($checks | getpath($p) | type) == "object")
      | select(($checks | getpath($p).status?) == "neutral")
      | {
          path: ($p | join(".")),
          message: (($checks | getpath($p).message) // "")
        }
    ])
  }'
else
  printf '%s\n' "$response"
fi
