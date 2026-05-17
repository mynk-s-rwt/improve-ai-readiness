# Tier 5: Agent-Native

## Goal

Move Level 4 to Level 5 by passing 2 of 3 Level 5 groups:

1. `webBotAuth`
2. all four integrations: `mcpServerCard`, `a2aAgentCard`, `agentSkills`, `apiCatalog`
3. auth metadata: `oauthDiscovery` or `oauthProtectedResource`

## Gotchas First

- Do not fabricate OAuth endpoints for a site with no protected resource.
- Do not advertise MCP/A2A endpoints that return 404.
- The Web Bot Auth directory template contains only public key material. Real signing belongs in platform code or CDN configuration.

## Honest Paths

### Protected API Site

1. Publish `/.well-known/oauth-protected-resource`.
2. Publish `/.well-known/oauth-authorization-server` or `/.well-known/openid-configuration`.
3. Publish `/.well-known/api-catalog`.

### Agent Or Protocol Site

1. Publish Agent Skills.
2. Publish API Catalog.
3. Publish MCP Server Card for a real MCP endpoint.
4. Publish A2A Agent Card for a real A2A endpoint.

### Cloudflare Or Signed Bot Site

1. Configure Web Bot Auth properly.
2. Publish the HTTP message signatures directory.
3. Pair with one auth metadata or all-integrations group.

## Verify

```bash
curl -i "$SITE_URL/.well-known/api-catalog"
curl -i "$SITE_URL/.well-known/oauth-protected-resource"
curl -i "$SITE_URL/.well-known/oauth-authorization-server"
curl -i "$SITE_URL/.well-known/http-message-signatures-directory"
scripts/verify-tier.sh "$SITE_URL" 5
```
