# SvelteKit

## Detect

Use when `svelte.config.*` exists or `package.json` depends on `@sveltejs/kit`.

## File Placement

Put static artifacts in `static/`:

| URL | Path |
|---|---|
| `/robots.txt` | `static/robots.txt` |
| `/sitemap.xml` | `static/sitemap.xml` |
| `/llms.txt` | `static/llms.txt` |
| `/AGENTS.md` | `static/AGENTS.md` |
| `/.well-known/mcp.json` | `static/.well-known/mcp.json` |
| `/.well-known/agent-card.json` | `static/.well-known/agent-card.json` |
| `/.well-known/agent-skills/index.json` | `static/.well-known/agent-skills/index.json` |

Use server routes for extensionless files:

| URL | Path |
|---|---|
| `/.well-known/api-catalog` | `src/routes/.well-known/api-catalog/+server.ts` |
| `/.well-known/oauth-protected-resource` | `src/routes/.well-known/oauth-protected-resource/+server.ts` |
| `/.well-known/oauth-authorization-server` | `src/routes/.well-known/oauth-authorization-server/+server.ts` |
| `/.well-known/http-message-signatures-directory` | `src/routes/.well-known/http-message-signatures-directory/+server.ts` |

## Markdown Negotiation

Use `src/hooks.server.ts` `handle`:

- inspect `event.request.headers.get('accept')`
- return Markdown for public pages
- set `Vary: Accept`

## Gotchas First

- SvelteKit static files live in `static/`, not `public/`.
- Host-level `_headers` may not apply to SSR responses.
