---
name: improve-ai-readiness
description: agent-ready website, AI readiness audit, LLM SEO, answer engine optimization, improve crawlability, add robots.txt sitemap canonical OG JSON-LD AGENTS.md llms.txt Content-Signal Content-Usage markdown negotiation OpenAPI MCP A2A agent-skills WebMCP OAuth Web Bot Auth, improve isitagentready SiteDex IndexedAI Cloudflare Vercel Netlify WordPress Webflow Shopify static site readiness
---

# improve-ai-readiness

Use this runbook to improve a public website's agent-readiness surface across scanners, crawlers, answer engines, and browser agents. Treat `isitagentready.com` as one useful public scorecard, not the whole goal.

## When To Use This Skill

Use when the user asks to:

- make a website agent-ready, AI-readable, AI-discoverable, answer-engine friendly, or LLM-crawlable
- improve `isitagentready.com`, SiteDex-style, IndexedAI-style, SEO, GEO, or structured-data readiness
- add crawl, policy, markdown, schema, OpenAPI, MCP, A2A, Agent Skills, WebMCP, OAuth, or Web Bot Auth artifacts
- adapt those artifacts across Next.js, Astro, SvelteKit, Remix, React Router, Cloudflare, Vercel, Netlify, WordPress, Webflow, Shopify, or static HTML

## Not For

- Do not chase x402, MPP, UCP, ACP, or AP2 unless commerce is explicitly in scope.
- Do not publish placeholder OAuth, MCP, A2A, payment, or bot-signing endpoints without labeling them as placeholders and getting approval.
- Do not make hosted-dashboard changes without explicit user permission and credentials.
- Do not optimize preview URLs when a stable production URL exists.

## Default Interaction Flow

Start in survey mode. Do not edit files until the user approves a plan, unless the user has already given explicit approval for this exact patch.

1. Read `GOTCHAS.md`, then `references/index.md`.
2. Detect the local platform with `scripts/pick-platform.sh .` when a repo is available.
3. Ask for missing setup values with `AskUserQuestion` when available. Otherwise ask concise numbered questions.
4. Run available audits against the public production URL. Use `scripts/audit.sh "$SITE_URL"` for the Cloudflare scorecard, then do local checks for universal readiness.
5. Present a short plan before edits:
   - current evidence
   - recommended track
   - files or hosted settings to change
   - risks and placeholders
   - exact approval question: `Proceed with this patch?`
6. After approval, patch only the agreed scope. Re-audit after deploy.

## Required Questions

Gather these values before planning:

- public production URL
- target outcome: universal baseline, specific scanner score, or `isitagentready.com` level
- repo scope: local code changes, hosted-platform instructions, or both
- platform and host: detect when possible, confirm if uncertain
- site type: docs, marketing, SaaS app, API, agent service, marketplace, commerce, publisher
- real capabilities: public API, OpenAPI, MCP, A2A, OAuth, account login, protected resources, commerce
- content policy: `search`, `ai-input`, `ai-train`, and any legal or brand constraints

When `AskUserQuestion` is available, ask no more than three structured questions at once:

- outcome: `Universal baseline`, `Next scorecard level`, `Specific target`
- scope: `Code patch`, `Hosted guidance`, `Both`
- capability profile: `Content site`, `App/API`, `Commerce`

## Tracks

Load only the references needed for the chosen track.

| Track | When | Load |
|---|---|---|
| Universal baseline | any public site | `references/universal-readiness.md` |
| Cloudflare scorecard | user asks for `isitagentready.com` or Level 0-5 | `references/level-rules.md`, then one tier file |
| Hosted platform | user needs Cloudflare, Vercel, Netlify, WordPress, Webflow, Shopify guidance | `references/host-actions.md` plus one platform file |
| Browser tools | user needs WebMCP or page-level tools | `references/webmcp.md` |
| Commerce | real commerce or explicit opt-in | `references/commerce-track.md` |

## Quick Reference

```bash
# Detect platform
improve-ai-readiness/scripts/pick-platform.sh .

# Audit public deployment
improve-ai-readiness/scripts/audit.sh https://example.com

# Verify deployed target level
improve-ai-readiness/scripts/verify-tier.sh https://example.com 3

# Hash a published Agent Skill file for index.json
improve-ai-readiness/scripts/hash-file.sh public/.well-known/agent-skills/site-guide/SKILL.md
```

## Defaults

- Generic site: start with universal baseline, then use scorecard tiers as verification.
- Code repo available: prefer direct patching of files, headers, routes, metadata, and structured data.
- No repo or hosted CMS: provide exact dashboard steps and snippets; do not pretend to have changed the site.
- Non-commerce sites: ignore x402, MPP, UCP, ACP, and AP2 unless the user opts in.
- Generic scorecard Level 4: default to Agent Skills, because it does not require an invented protocol endpoint.
- Protected APIs: only publish OAuth metadata when real authorization/resource endpoints exist or the user explicitly asks for scaffolding.
- Static hosts: use edge, functions, middleware, or host rules for markdown negotiation; a `.md` alternate file is not enough.

## Verification Loop

1. Apply the smallest approved patch that can pass the next goal.
2. Verify the local routes if the framework supports local dev.
3. After deploy, re-run the relevant scanner and direct `curl -i` checks.
4. Append one JSON line to `learnings.jsonl` with platform, goal, failing checks, fix, and verification result.
5. Continue only after deployed evidence improves or the user chooses a different track.

## Source Priority

Use this order when sources disagree:

1. The user's explicit product, legal, and deployment constraints.
2. Live HTTP evidence from the public production URL.
3. Scanner evidence, including `isitagentready.com` when in scorecard mode.
4. Platform documentation and project conventions.
5. Templates in this skill.

## Examples

### Example 1: Next.js Marketing Site

- Survey: production URL, Pages Router, Vercel, no API, non-commerce.
- Plan: robots, sitemap, canonical, OG, JSON-LD, `AGENTS.md`, `llms.txt`, Link header.
- Ask: `Proceed with this patch?`
- Verify: local build, `curl -i`, then `audit.sh`.

### Example 2: Cloudflare Pages Static Site

- Survey: static output, Cloudflare Pages, user wants scorecard Level 3.
- Plan: `_headers`, `robots.txt`, sitemap, Pages Function for `Accept: text/markdown`.
- Hosted ask: confirm whether Cloudflare dashboard toggles such as AI Crawl Control or Web Bot Auth are in scope.

### Example 3: WordPress Or Webflow Site

- Survey: no repo write access, hosted CMS.
- Plan: dashboard/plugin steps for sitemap, robots, schema, OG, custom code embeds, and redirects.
- Output: instructions and copy-paste snippets, not local commits that cannot affect production.
