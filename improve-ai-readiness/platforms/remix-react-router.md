# Remix / React Router 7

## Detect

Use when `package.json` depends on `@remix-run/*` or React Router framework mode.

## File Placement

Put static artifacts in `public/`:

| URL | Path |
|---|---|
| `/robots.txt` | `public/robots.txt` |
| `/sitemap.xml` | `public/sitemap.xml` |
| `/llms.txt` | `public/llms.txt` |
| `/AGENTS.md` | `public/AGENTS.md` |
| `/.well-known/mcp.json` | `public/.well-known/mcp.json` |
| `/.well-known/agent-card.json` | `public/.well-known/agent-card.json` |
| `/.well-known/agent-skills/index.json` | `public/.well-known/agent-skills/index.json` |

Use resource routes for extensionless files:

| URL | Example route module |
|---|---|
| `/.well-known/api-catalog` | `app/routes/.well-known.api-catalog.ts` |
| `/.well-known/oauth-protected-resource` | `app/routes/.well-known.oauth-protected-resource.ts` |
| `/.well-known/oauth-authorization-server` | `app/routes/.well-known.oauth-authorization-server.ts` |
| `/.well-known/http-message-signatures-directory` | `app/routes/.well-known.http-message-signatures-directory.ts` |

## Headers

Use route module `headers` exports or return `Response` objects from loaders.

## Markdown Negotiation

In loaders for important public routes, return Markdown when `request.headers.get('accept')` includes `text/markdown`.

## Gotchas First

- A resource route exports `loader` or `action` and no default component.
- Client-side navigation to resource URLs should reload the document.
