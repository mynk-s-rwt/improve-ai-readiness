# Cloudflare Pages

## Detect

Use when the site deploys to Cloudflare Pages.

## Static Files

Put files in the directory copied to the Pages output. For many frameworks this is `public/` or `static/`; for plain sites it is the publish directory.

## Headers

Create `_headers` in the static output source:

```text
/
  Link: <{{SITE_URL}}/sitemap.xml>; rel="sitemap"; type="application/xml", <{{SITE_URL}}/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json", <{{SITE_URL}}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"

/.well-known/api-catalog
  Content-Type: application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"
```

## Functions

Use Pages Functions for:

- markdown negotiation: `functions/_middleware.ts`
- extensionless well-known files
- signed Web Bot Auth responses

## Gotchas First

- `_headers` does not apply to Pages Functions responses.
- Cloudflare managed robots may alter `robots.txt`; verify the production body.
