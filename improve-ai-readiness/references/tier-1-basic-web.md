# Tier 1: Basic Web Presence

## Goal

Move Level 0 to Level 1 by passing at least 2 of:

- `robotsTxt`
- `sitemap`
- `linkHeaders`

Ship all three unless the platform makes one unusually expensive.

## Gotchas First

- Auth, redirects, or middleware must not block `/robots.txt` or `/sitemap.xml`.
- `Link` must be a response header on the homepage, not just an HTML `<link>` tag.
- If deployed behind a CDN, verify final edge headers.

## Patch

1. Create `/robots.txt` from `templates/robots.txt`.
2. Create `/sitemap.xml` from `templates/sitemap.xml`.
3. Add homepage `Link` header from `templates/headers/link-header.snippet`.

Minimum robots policy:

```text
User-agent: *
Allow: /
Content-Signal: ai-train=no, search=yes, ai-input=yes

Sitemap: https://example.com/sitemap.xml
```

## Verify

```bash
curl -i "$SITE_URL/robots.txt"
curl -i "$SITE_URL/sitemap.xml"
curl -I "$SITE_URL/"
scripts/verify-tier.sh "$SITE_URL" 1
```
