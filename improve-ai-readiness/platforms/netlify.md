# Netlify Overlay

Use when the site deploys to Netlify.

## Static Files

Place root and `.well-known` files in the publish directory. In framework projects, author them in the folder copied to the publish output.

## `_headers`

```text
/
  Link: <{{SITE_URL}}/sitemap.xml>; rel="sitemap"; type="application/xml", <{{SITE_URL}}/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json", <{{SITE_URL}}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"

/.well-known/api-catalog
  Content-Type: application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"
```

## Dynamic Behavior

Use Netlify Edge Functions for markdown negotiation and signed Web Bot Auth responses.

## Gotchas First

- `_headers` applies to static files Netlify serves from backing storage, not all functions/proxies.
- Jekyll may exclude files beginning with `_`; make sure `_headers` reaches the publish output.
