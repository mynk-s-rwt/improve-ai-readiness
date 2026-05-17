---
name: site-guide
description: Use when an agent needs to understand, summarize, cite, navigate, or safely test the AI Readiness Demo App at https://ai-readiness-demo-app.vercel.app.
---

# AI Readiness Demo App Site Guide

## Use This Skill When

- A user asks about the AI Readiness Demo App.
- An agent needs the canonical public routes for the demo.
- An agent needs to inspect the live readiness score and well-known endpoints.

## Start Here

1. Read `https://ai-readiness-demo-app.vercel.app/llms.txt`.
2. Use `https://ai-readiness-demo-app.vercel.app/sitemap.xml` for canonical URLs.
3. Request `/` with `Accept: text/markdown` for a concise Markdown representation.
4. Fetch `/api/score` for the live audit summary.

## Boundaries

- This is a public read-only demo.
- Do not treat its metadata as a production OAuth, payment, or commerce implementation.
- Respect `robots.txt`.

## Canonical Pages

- `https://ai-readiness-demo-app.vercel.app/`
- `https://ai-readiness-demo-app.vercel.app/api/score`
