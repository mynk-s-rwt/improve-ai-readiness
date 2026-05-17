---
name: {{PUBLIC_SKILL_NAME}}
description: Use when an agent needs to understand, summarize, cite, navigate, or safely interact with {{SITE_NAME}} at {{SITE_URL}}.
---

# {{SITE_NAME}} Site Guide

## Use This Skill When

- A user asks about {{SITE_NAME}}.
- An agent needs the canonical pages, API docs, or support routes for {{SITE_NAME}}.
- An agent needs to summarize or cite public content from {{SITE_URL}}.

## Start Here

1. Read `{{SITE_URL}}/llms.txt`.
2. Use `{{SITE_URL}}/sitemap.xml` for canonical public URLs.
3. Request pages with `Accept: text/markdown` when possible.

## Boundaries

- Do not access private, authenticated, or rate-limited areas unless the user explicitly authorizes it.
- Do not submit forms or call mutation APIs unless the user explicitly asks.
- Respect `{{SITE_URL}}/robots.txt`.

## Canonical Pages

{{PUBLIC_SKILL_CANONICAL_PAGES}}
