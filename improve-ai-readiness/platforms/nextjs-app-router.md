# Next.js App Router

## Detect

Use when `package.json` depends on `next` and `app/` exists.

## File Placement

| URL | Path |
|---|---|
| `/robots.txt` | `app/robots.txt` for static content, or `public/robots.txt` when using nonstandard directives |
| `/sitemap.xml` | `app/sitemap.ts` or `app/sitemap.xml` |
| `/llms.txt` | `public/llms.txt` |
| `/AGENTS.md` | `public/AGENTS.md` |
| `/.well-known/mcp.json` | `public/.well-known/mcp.json` |
| `/.well-known/agent-card.json` | `public/.well-known/agent-card.json` |
| `/.well-known/agent-skills/index.json` | `public/.well-known/agent-skills/index.json` |

Use route handlers for extensionless files:

| URL | Path |
|---|---|
| `/.well-known/api-catalog` | `app/.well-known/api-catalog/route.ts` |
| `/.well-known/oauth-protected-resource` | `app/.well-known/oauth-protected-resource/route.ts` |
| `/.well-known/oauth-authorization-server` | `app/.well-known/oauth-authorization-server/route.ts` |
| `/.well-known/http-message-signatures-directory` | `app/.well-known/http-message-signatures-directory/route.ts` |

## Headers

Use `next.config.js` `headers()` for static assets and homepage `Link`.

## Markdown Negotiation

Use `middleware.ts`. If `Accept` contains `text/markdown` and the path is a public page, return Markdown with `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`.

Exclude:

- `/_next/*`
- `/api/*`
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/AGENTS.md`
- `/.well-known/*`

## Gotchas First

- `app/robots.ts` cannot emit `Content-Signal`; use a static file or route handler for full robots content.
- Do not create `route.ts` beside `page.tsx` in the same segment.
- Auth middleware must bypass root machine files.
