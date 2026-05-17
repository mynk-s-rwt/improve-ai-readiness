# Gotchas

## Scoring

**Gotcha: there is no numeric score in the scan API.** The public UI may show score-like numbers, but `/api/scan` returns `level`, `levelName`, checks, and `nextLevel`. Optimize the required checks for the next level, not a guessed point total.

**Gotcha: level names in older briefs drift.** The live rubric observed in May 2026 is Level 2 `Bot-Aware`, Level 3 `Agent-Readable`, Level 4 `Agent-Integrated`, Level 5 `Agent-Native`.

**Gotcha: Level 1 needs 2 of 3, not all 3.** `robots.txt`, `sitemap`, and `Link` headers are still cheap enough to ship together.

## Audit And Deployment

**Gotcha: scan production, not preview.** Vercel preview URLs and per-deploy URLs are often protected or on a different host. Use the stable public production URL.

**Gotcha: a repo file is not a deployed response.** The audit grades HTTP status, headers, content type, and body from the live URL.

**Gotcha: SPA fallbacks can look like success.** `/.well-known/mcp.json` returning `200 text/html` is a failure. Always verify with `curl -i`.

## Baseline Files

**Gotcha: one small robots file can unlock multiple checks.** `User-agent: *`, `Allow: /`, `Content-Signal: ...`, and `Sitemap: ...` usually pass robots, AI bot rules, content signals, and sitemap discovery.

**Gotcha: `Content-Signal` may trigger warnings in unrelated validators.** The readiness audit expects it in `robots.txt`; older SEO tools may call it unknown.

**Gotcha: `Sitemap:` can be discovered from robots.txt.** Still publish `/sitemap.xml`; it improves debuggability and avoids relying on fallback behavior.

## Headers And Content Negotiation

**Gotcha: markdown negotiation is same-URL behavior.** A separate `/page.md` or `/llms.txt` does not pass the check. `GET /` with `Accept: text/markdown` must return `Content-Type: text/markdown`.

**Gotcha: missing `Vary: Accept` can poison caches.** Add `Vary: Accept` when returning Markdown variants.

**Gotcha: `_headers` files do not affect SSR/functions everywhere.** Netlify and Cloudflare Pages `_headers` apply to static assets, not all dynamic responses.

## Well-Known Endpoints

**Gotcha: `/.well-known/api-catalog` is extensionless.** It should return a linkset JSON body with a `linkset` array. Use a dynamic route if the host guesses the wrong content type.

**Gotcha: MCP and A2A cards must not lie.** Do not advertise tools, endpoints, auth, or skills that are not present.

**Gotcha: Agent Skills are the safest Level 4 default.** They describe how agents should use an existing site and do not require inventing an MCP or A2A service.

## WebMCP

**Gotcha: `provideContext()` is stale for current WebMCP guidance.** The current W3C draft and the readiness skill require `navigator.modelContext.registerTool()` with `name`, `description`, `inputSchema`, and `execute`; older `provideContext()` snippets may not exist in the audit browser.

**Gotcha: register tools on page load.** The WebMCP check loads the page without clicking. Tools registered behind user interaction, scroll, or delayed routes are invisible.

**Gotcha: native browser support may be behind flags.** If the site must pass the current audit before broad browser support lands, include a small compatibility/testing surface or a maintained polyfill, then still call `registerTool()`.

**Gotcha: duplicate tool names throw.** Client hydration, Fast Refresh, and SPA navigation can rerun registration. Unregister first or catch duplicate-name errors.

## Level 5

**Gotcha: Level 5 should be honest.** Cloudflare's own audit site has been observed at Level 4 without OAuth metadata. Do not publish fake OAuth metadata unless the user knowingly wants a placeholder.

**Gotcha: Web Bot Auth is more than a JSON file in production.** The audit may only inspect the JWKS directory, but real Web Bot Auth requires signed messages and private key handling outside static templates.

## Persistence

**Gotcha: repeated failures belong in the skill.** Append audit surprises to `learnings.jsonl` so the next invocation starts smarter.
