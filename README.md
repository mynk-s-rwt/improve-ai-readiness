# AI Readiness Field Guide

A practical framework for making public websites easier for agents, crawlers, and audit tools to read. The demo site starts from a Level 0 public deployment and ends at Level 5 on Cloudflare's `isitagentready.com` rubric while keeping commerce protocols neutral for a non-commerce site.

The work is broader than one scanner. The same files and headers help with SiteDex-style audits, Cloudflare checks, SEO crawlers, agent directories, browser tool discovery, and future content usage policy checks.

## Live Demo

- Demo app: https://ai-readiness-demo-app.vercel.app
- Public audit: https://isitagentready.com
- Final result captured in `results/`: Level 5, 14 pass, 0 fail, 5 neutral
- Baseline branch: `codex/level-0-demo-app`
- Final branch: `main`

## What Is In This Repository

```text
improve-ai-readiness/     Claude Code compatible field guide and templates
example-web-app/          Next.js Pages Router demo deployed on Vercel
research/                 Local research dossiers used to shape the framework
results/                  Before and after screenshots for the demo and audit
```

The `improve-ai-readiness/` directory contains the reusable guide: tier references, platform notes, templates, scripts, and gotchas. It is designed to be read progressively. The entry file stays short, and the platform-specific details live in separate files.

## The Route From Level 0 To Level 5

The framework treats readiness as a sequence, not a bulk file dump.

| Stage | Public surface | Why it matters |
| --- | --- | --- |
| Level 1 | `robots.txt`, `sitemap.xml`, Link headers | Crawlers can find the site map and machine endpoints. |
| Level 2 | AI bot rules and Content-Signal policy | The site states crawler and training preferences. |
| Level 3 | Markdown negotiation | Agents can request a clean text representation of key pages. |
| Level 4 | MCP card, A2A card, agent-skills, api-catalog | Agents can discover tools, skills, and API descriptions. |
| Level 5 | OAuth metadata, protected resource metadata, Web Bot Auth, WebMCP | The site exposes governed access and browser-visible tools. |

Commerce files such as x402, MPP, UCP, ACP, and AP2 are opt-in. They should only appear when the site has a real commerce or payment flow.

## Demo App

The demo app is intentionally small. It proves the mechanics without hiding them behind a large product surface.

- `/api/score` proxies the public audit API.
- `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/AGENTS.md` expose basic discovery and guidance files.
- `middleware.js` adds Link headers, markdown negotiation, API catalog, OAuth discovery, protected resource metadata, and a Web Bot Auth key directory.
- `/webmcp.js` registers browser-side WebMCP tools for agents that inspect the page runtime.
- `/details` explains the framework, platform map, and research notes.

Run it locally:

```bash
cd example-web-app
npm install
npm run dev
```

Build it:

```bash
cd example-web-app
npm run build
```

Scan a public URL:

```bash
curl -sX POST https://isitagentready.com/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://ai-readiness-demo-app.vercel.app"}'
```

## Platform Coverage

The guide is not tied to Vercel or Next.js. It has explicit recipes for:

- Next.js App Router
- Next.js Pages Router
- Astro
- SvelteKit
- Remix and React Router 7
- Cloudflare Pages
- Cloudflare Workers
- Vercel config
- Netlify config
- Plain HTML, Jekyll, and Hugo

Each platform note explains where to put static files, where to set headers, and how to handle `Accept: text/markdown` when the framework supports server routes.

## Why This Is Broader Than `isitagentready.com`

Cloudflare's scanner is a useful public scoreboard, but the durable value is the site surface itself:

- Search engines and answer engines still need accurate crawl policy, sitemap dates, canonical URLs, Open Graph, and JSON-LD.
- Agent runtimes need predictable `.well-known/` locations for MCP, A2A, skills, API catalogs, and auth metadata.
- Browser agents need runtime tool registration, which is why the demo includes WebMCP.
- CMS and platform tools are converging on the same checks, so a platform-neutral guide ages better than a single-host recipe.

The research folder tracks Cloudflare, SiteDex, IndexedAI, WordLift, HubSpot, GEO scoreboards, CMS plugins, MCP, A2A, AIPREF, Content Signals, and Web Bot Auth. The guide keeps the high-signal pieces and avoids pretending that every draft protocol belongs on every site.

## Screenshots

The `results/` directory contains the proof set:

- `before-demo-app-level-0-home.png`
- `before-demo-app-level-0-full-page.png`
- `before-agentready-level-0-overview.png`
- `before-agentready-level-0-full-page.png`
- `before-agentready-level-0-checks.png`
- `after-demo-app-level-5-home.png`
- `after-demo-app-level-5-full-page.png`
- `after-demo-app-level-5-details.png`
- `final-agentready-level-5-overview.png`
- `final-agentready-level-5-full-page.png`
- `final-agentready-level-5-checks.png`

## Authoring Notes

- Commits in this repo are authored as `mynk-s-rwt <mynk-s-rwt@users.noreply.github.com>`.
- The deployed production URL is the stable Vercel project URL, not a per-deploy preview URL. Preview URLs can be protected by Vercel SSO and fail public scans.
- The guide should stay append-only for gotchas and learnings. New scanner behavior belongs in `GOTCHAS.md` or `learnings.jsonl` so future runs improve.
