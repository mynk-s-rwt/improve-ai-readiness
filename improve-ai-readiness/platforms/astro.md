# Astro

## Detect

Use when `astro.config.*` exists or `package.json` depends on `astro`.

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

Use endpoint routes for extensionless files:

| URL | Path |
|---|---|
| `/.well-known/api-catalog` | `src/pages/.well-known/api-catalog.ts` |
| `/.well-known/oauth-protected-resource` | `src/pages/.well-known/oauth-protected-resource.ts` |
| `/.well-known/oauth-authorization-server` | `src/pages/.well-known/oauth-authorization-server.ts` |
| `/.well-known/http-message-signatures-directory` | `src/pages/.well-known/http-message-signatures-directory.ts` |

## Markdown Negotiation

Use `src/middleware.ts` for site-wide negotiation, or endpoint-specific logic for a small site.

## Gotchas First

- Static extensionless files often get weak content types. Use endpoints for exact types.
- Adapter output can change path handling; verify deployed `curl -i`.
