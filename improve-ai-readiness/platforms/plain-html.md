# Plain HTML / Jekyll / Hugo

## Detect

Use when the site is a static output with no app server.

## File Placement

Place files in the web root or static generator output source:

| URL | Path |
|---|---|
| `/robots.txt` | `<web-root>/robots.txt` |
| `/sitemap.xml` | `<web-root>/sitemap.xml` |
| `/llms.txt` | `<web-root>/llms.txt` |
| `/AGENTS.md` | `<web-root>/AGENTS.md` |
| `/.well-known/mcp.json` | `<web-root>/.well-known/mcp.json` |
| `/.well-known/agent-card.json` | `<web-root>/.well-known/agent-card.json` |
| `/.well-known/agent-skills/index.json` | `<web-root>/.well-known/agent-skills/index.json` |
| `/.well-known/api-catalog` | `<web-root>/.well-known/api-catalog` |

## Headers

Use the host:

- Netlify: `_headers`
- Cloudflare Pages: `_headers`
- Vercel: `vercel.json`
- Apache: `.htaccess`
- Nginx: server config

## Markdown Negotiation

Pure static hosting cannot usually vary on `Accept`. Use an edge function, Worker, middleware, or web server content negotiation.

## Gotchas First

- Do not claim Level 3 until `curl -H "Accept: text/markdown" "$SITE_URL/"` returns Markdown.
- Extensionless well-known files need explicit content type on many hosts.
