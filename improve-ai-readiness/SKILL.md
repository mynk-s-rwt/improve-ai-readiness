---
name: improve-ai-readiness
description: raise AI readiness, agent-ready website, isitagentready score, improve isitagentready.com level, add robots.txt sitemap.xml Link headers, markdown negotiation, Content-Signal, llms.txt, AGENTS.md, well-known MCP A2A agent-skills api-catalog OAuth metadata, make Next.js Astro SvelteKit Remix Cloudflare Vercel Netlify static site agent-native
---

# improve-ai-readiness

Use this runbook to raise a public website through the `isitagentready.com` levels. Ship one level at a time, verify the deployed URL, then continue.

## When To Use This Skill

Use when the user asks to:

- improve an `isitagentready.com` level or score
- make a website agent-ready, AI-readable, AI-discoverable, or agent-native
- add `robots.txt`, `sitemap.xml`, `Content-Signal`, Markdown negotiation, Agent Skills, MCP, A2A, API catalog, OAuth metadata, or Web Bot Auth
- adapt those artifacts across Next.js, Astro, SvelteKit, Remix, React Router, Cloudflare, Vercel, Netlify, or static HTML

## Not For

- Do not chase commerce protocols unless commerce is explicitly in scope.
- Do not publish fake OAuth, MCP, A2A, or payment endpoints without calling out that they are placeholders.
- Do not optimize against preview URLs when the production URL is available.

## Load First

1. Read `GOTCHAS.md`.
2. Read `references/index.md`.
3. Run `scripts/pick-platform.sh` from the target repo root unless the platform is already known.
4. Run `scripts/audit.sh "$SITE_URL"` and let `nextLevel` drive the next patch.

Ask the user for missing values with `AskUserQuestion` when available:

- public production URL
- platform/framework
- target level, default `nextLevel.target`
- content-signal policy: `search`, `ai-input`, `ai-train`
- whether the site has real APIs, an MCP endpoint, an A2A agent, OAuth, or commerce

## Level Flow

Load only the current target level file:

- Level 1: `references/tier-1-basic-web.md`
- Level 2: `references/tier-2-bot-aware.md`
- Level 3: `references/tier-3-agent-readable.md`
- Level 4: `references/tier-4-agent-integrated.md`
- Level 5: `references/tier-5-agent-native.md`

Then load exactly one platform file from `platforms/`, plus a deployment overlay if needed:

- `platforms/nextjs-app-router.md`
- `platforms/nextjs-pages-router.md`
- `platforms/astro.md`
- `platforms/sveltekit.md`
- `platforms/remix-react-router.md`
- `platforms/cloudflare-pages.md`
- `platforms/cloudflare-workers.md`
- `platforms/vercel.md`
- `platforms/netlify.md`
- `platforms/plain-html.md`

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

- Non-commerce sites: ignore x402, MPP, UCP, ACP, and AP2 unless the user opts in.
- Generic sites: default Level 4 integration to Agent Skills, because it does not require a fake protocol endpoint.
- Protected APIs: only publish OAuth metadata when real authorization/resource endpoints exist or the user explicitly asks for scaffolding.
- Static hosts: use edge/functions/middleware for markdown negotiation; a `.md` alternate file is not enough.

## Verification Loop

1. Apply the smallest patch that can pass the next level.
2. Verify the local routes if the framework supports local dev.
3. After deploy, run `scripts/verify-tier.sh "$SITE_URL" "$TARGET_LEVEL"`.
4. Append one JSON line to `learnings.jsonl` with platform, level, failing checks, fix, and verification result.
5. Continue only after the deployed score moves.

## Source Priority

Use this order when sources disagree:

1. Live `/api/scan` evidence from `isitagentready.com`.
2. `references/level-rules.md` and `references/audit-rubric.md`.
3. Platform docs and project conventions.
4. Templates in this skill.

## Examples

### Example 1: New Next.js Marketing Site

- Input: production URL, Next.js Pages Router, Level 0.
- Load: `tier-1-basic-web.md`, then `platforms/nextjs-pages-router.md`.
- Output: `public/robots.txt`, `public/sitemap.xml`, homepage `Link` header in `next.config.js`.
- Acceptance: `verify-tier.sh "$SITE_URL" 1` exits 0 after deploy.

### Example 2: Static Site At Level 2

- Input: Cloudflare Pages static site with robots and content signals already passing.
- Load: `tier-3-agent-readable.md`, then `platforms/cloudflare-pages.md`.
- Output: Pages Function or Worker middleware for `Accept: text/markdown`; optional `/llms.txt` and `/AGENTS.md`.
- Acceptance: `curl -H "Accept: text/markdown" "$SITE_URL/"` returns `Content-Type: text/markdown`.

### Example 3: Generic Site Reaching Level 4

- Input: no API, no MCP, no A2A, non-commerce.
- Load: `tier-4-agent-integrated.md`.
- Output: `/.well-known/agent-skills/index.json` and one public site-guide `SKILL.md`.
- Acceptance: `checks.discovery.agentSkills.status == "pass"`.
