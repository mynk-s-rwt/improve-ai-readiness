# Next.js Pages Router

## Detect

Use when `package.json` depends on `next` and `pages/` exists.

## File Placement

| URL | Path |
|---|---|
| `/robots.txt` | `public/robots.txt` |
| `/sitemap.xml` | `public/sitemap.xml` |
| `/llms.txt` | `public/llms.txt` |
| `/AGENTS.md` | `public/AGENTS.md` |
| `/.well-known/mcp.json` | `public/.well-known/mcp.json` |
| `/.well-known/agent-card.json` | `public/.well-known/agent-card.json` |
| `/.well-known/agent-skills/index.json` | `public/.well-known/agent-skills/index.json` |

For extensionless well-known paths, prefer middleware or host/server routes. If deploying to Vercel, do not rely on `/.well-known` rewrites unless verified in production.

## Headers

Use `next.config.js`:

```js
module.exports = {
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value:
              '<{{SITE_URL}}/sitemap.xml>; rel="sitemap"; type="application/xml", <{{SITE_URL}}/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json", <{{SITE_URL}}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
          },
        ],
      },
    ];
  },
};
```

## Markdown Negotiation

Use root `middleware.js`:

- Check `req.headers.get('accept')`.
- Return Markdown for public page paths.
- Let other requests continue.

## Gotchas First

- `pages/api/*` maps under `/api`, not root well-known paths.
- `public/` static files will not handle `Accept` negotiation by themselves.
