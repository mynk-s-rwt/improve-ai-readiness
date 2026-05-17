# Vercel Overlay

Use this with any Vercel-deployed framework when framework-native headers are insufficient.

## `vercel.json` Headers

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/",
      "headers": [
        {
          "key": "Link",
          "value": "<{{SITE_URL}}/sitemap.xml>; rel=\"sitemap\"; type=\"application/xml\", <{{SITE_URL}}/.well-known/agent-skills/index.json>; rel=\"describedby\"; type=\"application/json\", <{{SITE_URL}}/.well-known/api-catalog>; rel=\"api-catalog\"; type=\"application/linkset+json\""
        }
      ]
    }
  ]
}
```

## Gotchas First

- Do not depend on Vercel rewrites for `/.well-known/*` without a production `curl -i` check.
- Vercel config cannot implement `Accept` negotiation. Use framework middleware.
- Stable production URL matters; preview URLs may be protected.
