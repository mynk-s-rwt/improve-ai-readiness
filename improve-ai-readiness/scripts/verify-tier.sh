#!/usr/bin/env bash
set -euo pipefail

url="${1:-}"
target="${2:-}"

if [ -z "$url" ] || [ -z "$target" ]; then
  echo "Usage: $0 https://example.com 1|2|3|4|5" >&2
  exit 2
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "verify-tier.sh requires jq" >&2
  exit 2
fi

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

curl -sS -X POST "https://isitagentready.com/api/scan" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"$url\"}" > "$tmp"

level="$(jq -r '.level' "$tmp")"
name="$(jq -r '.levelName' "$tmp")"
printf 'Level: %s (%s)\n' "$level" "$name"

if [ "$level" -lt "$target" ]; then
  echo "Target not reached. Failing checks:"
  jq -r '
    paths(.checks) as $p
    | select(getpath($p).status? == "fail")
    | "- " + ($p | join(".")) + ": " + (getpath($p).message // "")
  ' "$tmp"
  exit 1
fi

check_status() {
  path="$1"
  expected="$2"
  actual="$(jq -r "$path.status // empty" "$tmp")"
  if [ "$actual" != "$expected" ]; then
    echo "Expected $path.status to be $expected, got ${actual:-missing}" >&2
    exit 1
  fi
}

if [ "$target" -ge 1 ]; then
  passed="$(jq '[.checks.discoverability.robotsTxt, .checks.discoverability.sitemap, .checks.discoverability.linkHeaders] | map(select(.status == "pass")) | length' "$tmp")"
  if [ "$passed" -lt 2 ]; then
    echo "Level 1 requires 2 of 3 discoverability checks; got $passed" >&2
    exit 1
  fi
fi

if [ "$target" -ge 2 ]; then
  check_status '.checks.botAccessControl.robotsTxtAiRules' pass
  check_status '.checks.botAccessControl.contentSignals' pass
fi

if [ "$target" -ge 3 ]; then
  check_status '.checks.contentAccessibility.markdownNegotiation' pass
fi

if [ "$target" -ge 4 ]; then
  integrations="$(jq '[.checks.discovery.mcpServerCard, .checks.discovery.a2aAgentCard, .checks.discovery.agentSkills, .checks.discovery.apiCatalog] | map(select(.status == "pass")) | length' "$tmp")"
  if [ "$integrations" -lt 1 ]; then
    echo "Level 4 requires at least one integration check; got $integrations" >&2
    exit 1
  fi
fi

if [ "$target" -ge 5 ]; then
  web_bot_auth="$(jq -r '.checks.botAccessControl.webBotAuth.status // "missing"' "$tmp")"
  integrations="$(jq '[.checks.discovery.mcpServerCard, .checks.discovery.a2aAgentCard, .checks.discovery.agentSkills, .checks.discovery.apiCatalog] | map(select(.status == "pass")) | length' "$tmp")"
  auth_metadata="$(jq '[.checks.discovery.oauthDiscovery, .checks.discovery.oauthProtectedResource] | map(select(.status == "pass")) | length' "$tmp")"
  groups=0
  [ "$web_bot_auth" = "pass" ] && groups=$((groups + 1))
  [ "$integrations" -ge 4 ] && groups=$((groups + 1))
  [ "$auth_metadata" -ge 1 ] && groups=$((groups + 1))
  if [ "$groups" -lt 2 ]; then
    echo "Level 5 requires 2 of 3 groups; got $groups" >&2
    exit 1
  fi
fi

echo "Target level reached."
