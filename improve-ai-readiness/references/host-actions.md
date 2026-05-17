# Hosted Platform Actions

Use this when the site is partly controlled by a dashboard, CMS, CDN, or deployment host. Ask before changing hosted settings. If no connector or credentials exist, provide exact manual steps.

## Gotchas First

- Hosted toggles can change production behavior immediately. Present the change and get approval first.
- Preview deployments may be protected or use different headers. Verify the stable production host.
- CMS plugins can emit stale or duplicate metadata. Check the public HTML after enabling them.

## Cloudflare

Suggest when the site uses Cloudflare DNS, Pages, Workers, or proxying:

- AI Crawl Control for crawler visibility and bot policy.
- Content Signals or robots `Content-Signal` for publisher preferences.
- Web Bot Auth when signed bot verification is in scope.
- Workers or Pages Functions for markdown negotiation and extensionless `.well-known` routes.
- Pay-Per-Crawl only for publishers or commercial licensing workflows.

Ask: "Do you want code changes only, Cloudflare dashboard guidance, or both?"

## Vercel

Suggest when the site deploys to Vercel:

- stable production URL for scans, not SSO-protected preview deployments
- framework middleware for `Accept: text/markdown`
- `vercel.json` only for headers and static routing that the framework does not own
- Open Graph, canonical, JSON-LD, and sitemap generation in the app framework

Ask: "Is Deployment Protection disabled for the production URL being audited?"

## Netlify

Suggest:

- `_headers` for static Link and content-type headers
- `_redirects` for stable well-known aliases
- Edge Functions or framework routes for markdown negotiation

## WordPress

Suggest when there is no code repo or the site is plugin-managed:

- confirm sitemap, canonical, OG, and schema output from Yoast, RankMath, AIOSEO, SEOPress, or equivalent
- add or edit `robots.txt` through the host/plugin
- use a snippets plugin or theme child file for JSON-LD gaps
- publish `AGENTS.md`, `llms.txt`, and `.well-known` files through static file upload, redirects, or server config

Do not promise direct commits unless the WordPress theme/plugin repo is present.

## Webflow, Framer, Wix

Suggest:

- page-level SEO title, description, canonical, and OG fields
- custom code embeds for JSON-LD
- exported/static files or host redirects for `AGENTS.md`, `llms.txt`, and `.well-known`
- external edge proxy when the platform cannot set required headers

## Shopify

Suggest only for real commerce:

- product and offer JSON-LD that matches visible product pages
- sitemap and canonical verification
- app or theme edits for additional well-known files
- commerce protocols only when the merchant wants agentic checkout or payment discovery
