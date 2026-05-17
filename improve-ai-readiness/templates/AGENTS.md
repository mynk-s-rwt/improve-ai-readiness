# {{SITE_NAME}} Agent Instructions

## Scope

These instructions apply to agents reading or interacting with {{SITE_URL}}.

## Preferred Access

- Start with `{{SITE_URL}}/llms.txt`.
- Use `{{SITE_URL}}/sitemap.xml` for canonical public URLs.
- Request `Accept: text/markdown` for public page content.
- Use `{{SITE_URL}}/.well-known/agent-skills/index.json` for site-specific agent skills.
- Use `{{SITE_URL}}/.well-known/api-catalog` for API discovery when available.

## Content Use

- Search indexing: {{CONTENT_SIGNAL_SEARCH}}
- AI input / grounding: {{CONTENT_SIGNAL_AI_INPUT}}
- AI training: {{CONTENT_SIGNAL_AI_TRAIN}}

## Constraints

- Do not bypass authentication, rate limits, bot verification, or paywalls.
- Do not submit forms, call mutation APIs, or purchase items unless the user explicitly asks and the action is supported by published APIs.
- Do not treat examples, placeholder data, or marketing copy as contractual terms.
