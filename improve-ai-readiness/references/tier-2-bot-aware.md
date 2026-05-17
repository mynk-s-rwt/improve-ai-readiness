# Tier 2: Bot-Aware

## Goal

Move Level 1 to Level 2 by passing both:

- `robotsTxtAiRules`
- `contentSignals`

## Gotchas First

- A wildcard `User-agent: *` rule can satisfy AI bot rules in the current audit, but explicit AI crawler stanzas are clearer.
- The content policy is a user/business decision. Do not guess `ai-train=yes`.
- Keep `Content-Signal` in `robots.txt`, not as an HTTP header, unless the auditor evidence changes.

## Patch

Update `/robots.txt` with:

- wildcard allow/disallow
- optional explicit AI crawler groups
- `Content-Signal: ai-train={{...}}, search={{...}}, ai-input={{...}}`
- `Sitemap: {{SITE_URL}}/sitemap.xml`

Use `templates/robots.txt`.

## Verify

```bash
curl -i "$SITE_URL/robots.txt"
scripts/verify-tier.sh "$SITE_URL" 2
```
