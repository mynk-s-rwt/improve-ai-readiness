# Level Rules

These rules mirror the live `isitagentready.com` API behavior observed on 2026-05-17.

| Level | Live name | Requirement |
|---:|---|---|
| 0 | Not Ready | Does not meet Level 1 |
| 1 | Basic Web Presence | Pass 2 of 3: `robotsTxt`, `sitemap`, `linkHeaders` |
| 2 | Bot-Aware | Level 1 plus both `robotsTxtAiRules` and `contentSignals` |
| 3 | Agent-Readable | Level 2 plus `markdownNegotiation` |
| 4 | Agent-Integrated | Level 3 plus 1 of 4: `mcpServerCard`, `a2aAgentCard`, `agentSkills`, `apiCatalog` |
| 5 | Agent-Native | Level 4 plus 2 of 3: Web Bot Auth, all four integrations, auth metadata |

## Practical Defaults

- Level 1: ship all three cheap baseline checks even though only two are required.
- Level 2: wildcard robots rules can satisfy AI bot rules; add `Content-Signal` deliberately.
- Level 3: implement same-URL Markdown negotiation with `Vary: Accept`.
- Level 4: default to Agent Skills for generic sites.
- Level 5: continue only when the site has real auth, real protocol endpoints, or the user accepts placeholder metadata.

## Level 5 Groups

The Level 5 "2 of 3" groups are:

1. `webBotAuth` passes.
2. All four integrations pass: `mcpServerCard`, `a2aAgentCard`, `agentSkills`, `apiCatalog`.
3. Auth metadata passes: `oauthDiscovery` or `oauthProtectedResource`.

Do not treat commerce checks as part of this ladder for non-commerce sites.
