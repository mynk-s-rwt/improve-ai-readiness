# AI Readiness Demo App Agent Instructions

## Scope

These instructions apply to agents reading or testing https://ai-readiness-demo-app.vercel.app.

## Preferred Access

- Start with `/llms.txt`.
- Use `/sitemap.xml` for canonical public URLs.
- Request `/` with `Accept: text/markdown` for concise Markdown.
- Use `/.well-known/agent-skills/index.json` for skill discovery.
- Use `/.well-known/api-catalog` for API discovery.

## Content Use

- Search indexing: yes
- AI input / grounding: yes
- AI training: no

## Constraints

- Do not bypass rate limits or deployment protection.
- Do not treat this demo as a production OAuth, payment, or commerce service.
- Do not submit mutation requests; this demo exposes read-only public endpoints.
