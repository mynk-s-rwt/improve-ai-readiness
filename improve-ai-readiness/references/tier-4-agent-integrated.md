# Tier 4: Agent-Integrated

## Goal

Move Level 3 to Level 4 by passing at least 1 of:

- `mcpServerCard`
- `a2aAgentCard`
- `agentSkills`
- `apiCatalog`

## Gotchas First

- Default to `agentSkills` for generic websites.
- Use `apiCatalog` when the site has an API or OpenAPI description.
- Use `mcpServerCard` only when a real MCP endpoint exists.
- Use `a2aAgentCard` only when the site is an agent service or exposes an agent-facing endpoint.

## Default Patch: Agent Skills

1. Create `/.well-known/agent-skills/index.json`.
2. Publish at least one `SKILL.md` under `/.well-known/agent-skills/<name>/SKILL.md`.
3. Compute the SHA-256 digest with `scripts/hash-file.sh` if the client enforces integrity.

## Optional Additional Integrations

- `/.well-known/api-catalog` from `templates/well-known/api-catalog`
- `/.well-known/mcp.json` from `templates/well-known/mcp.json`
- `/.well-known/agent-card.json` from `templates/well-known/agent-card.json`

## Verify

```bash
curl -i "$SITE_URL/.well-known/agent-skills/index.json"
scripts/verify-tier.sh "$SITE_URL" 4
```
