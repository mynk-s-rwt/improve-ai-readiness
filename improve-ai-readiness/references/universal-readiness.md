# Universal Readiness

Use this before chasing any single scanner score. These signals help crawlers, answer engines, browser agents, SEO tools, and future scorecards.

## Gotchas First

- Do not let `llms.txt` crowd out durable basics. It is cheap to publish, but sitemap freshness, canonical URLs, JSON-LD, and clean markdown access matter more.
- Do not set every sitemap `<lastmod>` to today. Use real content modification dates or omit `lastmod`.
- Do not add schema, API, commerce, OAuth, MCP, or A2A claims that are not true for the site.

## Readiness Layers

| Layer | Ship | Why |
|---|---|---|
| Crawl | `robots.txt`, `sitemap.xml`, canonical URLs, clean redirects | Lets crawlers find and deduplicate public pages. |
| Snippets | title, meta description, Open Graph, Twitter fallback | Makes pages legible in search, chat citations, and previews. |
| Structured data | JSON-LD `Organization`, `WebSite`, `SearchAction`, `BreadcrumbList`; product schema only for real products | Durable machine-readable meaning. |
| Text access | same-URL markdown negotiation, `AGENTS.md`, optional `llms.txt`, RSS/Atom when useful | Gives agents clean content without parsing visual layouts. |
| Policy | AI bot rules, `Content-Signal`, AIPREF-shaped `Content-Usage` when supported, `security.txt` | States permissions, usage preferences, and security contact paths. |
| Discovery | OpenAPI, API catalog, Agent Skills, MCP, A2A, WebMCP | Exposes real actions and documentation. |
| Trust | OAuth metadata, protected resource metadata, Web Bot Auth, signed responses | Governs access and verifies actors. |

## Default Patch Order

1. Fix crawl: robots, sitemap, canonical, redirects.
2. Fix page metadata: titles, descriptions, OG, JSON-LD.
3. Add agent text: `AGENTS.md`, `llms.txt`, markdown negotiation where the stack supports it.
4. Add policy: AI bot stanzas, `Content-Signal`, optional `Content-Usage`, `security.txt`.
5. Add discovery only for real capabilities: OpenAPI, Agent Skills, API catalog, MCP, A2A, WebMCP.
6. Add auth and bot-signing only for real protected resources or signed-bot flows.

## Local Evidence

Collect these before planning:

```bash
curl -i "$SITE_URL/robots.txt"
curl -i "$SITE_URL/sitemap.xml"
curl -I "$SITE_URL/"
curl -H "Accept: text/markdown" -i "$SITE_URL/"
curl -i "$SITE_URL/AGENTS.md"
curl -i "$SITE_URL/llms.txt"
```

Inspect rendered HTML for:

- one canonical URL
- meaningful title and description
- OG title, description, URL, image, type
- JSON-LD that matches visible content
- alternate markdown or feed links when available
