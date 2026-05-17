# Tier 3: Agent-Readable

## Goal

Move Level 2 to Level 3 by passing:

- `markdownNegotiation`

## Gotchas First

- The audit requests the homepage with `Accept: text/markdown`. It does not just fetch `/llms.txt`.
- Add `Vary: Accept`.
- HTML must remain the default for normal browser requests.

## Patch

1. Implement platform-specific middleware, hook, edge function, or route logic.
2. If `Accept` contains `text/markdown`, return a Markdown representation of the same route.
3. Set:
   - `Content-Type: text/markdown; charset=utf-8`
   - `Vary: Accept`
   - optionally `x-markdown-tokens`
4. Also add `/llms.txt` and `/AGENTS.md` for durable agent value, even if not required for the current level.

## Verify

```bash
curl -i -H "Accept: text/markdown" "$SITE_URL/"
curl -i "$SITE_URL/llms.txt"
curl -i "$SITE_URL/AGENTS.md"
scripts/verify-tier.sh "$SITE_URL" 3
```
