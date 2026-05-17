# isitagentready Scorecard

Use this reference only when the user asks for the Cloudflare `isitagentready.com` scorecard, or when using that scorecard as one verification layer. It is not the full definition of generic agent readiness.

Use the live scan response as the scorecard contract:

```http
POST https://isitagentready.com/api/scan
Content-Type: application/json

{"url":"https://example.com"}
```

Optional body field `"format":"agent"` can return an agent-readable Markdown fix list.

## Response Shape

Top-level keys usually include:

- `url`
- `redirectedFrom`
- `scannedAt`
- `level`
- `levelName`
- `checks`
- `nextLevel`
- `isCommerce`
- `commerceSignals`

Each check has:

- `status`: `pass`, `fail`, `neutral`, or sometimes `unableToCheck`
- `message`
- `details`
- `evidence[]`
- `durationMs`

## Check Catalog

| JSON path | Pass signal | Default fix |
|---|---|---|
| `checks.discoverability.robotsTxt` | `/robots.txt` returns 200 text/plain with `User-agent` | `templates/robots.txt` |
| `checks.discoverability.sitemap` | `/sitemap.xml` exists with valid XML, or `Sitemap:` exists in robots | `templates/sitemap.xml` plus robots line |
| `checks.discoverability.linkHeaders` | Homepage includes agent-useful `Link` headers | `templates/headers/link-header.snippet` |
| `checks.contentAccessibility.markdownNegotiation` | `/` with `Accept: text/markdown` returns `text/markdown` | platform middleware/route |
| `checks.botAccessControl.robotsTxtAiRules` | robots has AI bot entries or wildcard rules | wildcard or explicit AI bot stanzas |
| `checks.botAccessControl.contentSignals` | robots has `Content-Signal:` | `Content-Signal: ai-train=..., search=..., ai-input=...` |
| `checks.botAccessControl.webBotAuth` | key directory exists with valid JWKS | `/.well-known/http-message-signatures-directory` |
| `checks.discovery.mcpServerCard` | MCP card at accepted well-known path with name/serverInfo | `templates/well-known/mcp.json` |
| `checks.discovery.a2aAgentCard` | A2A card has `name`, `version`, `supportedInterfaces` | `templates/well-known/agent-card.json` |
| `checks.discovery.agentSkills` | skills index has non-empty `skills` array | `templates/well-known/agent-skills/index.json` |
| `checks.discovery.webMcp` | page exposes WebMCP JS tools on load | `references/webmcp.md` and `templates/webmcp.js` |
| `checks.discovery.apiCatalog` | `/.well-known/api-catalog` has linkset array | `templates/well-known/api-catalog` |
| `checks.discovery.oauthDiscovery` | OAuth/OIDC metadata exists with required endpoints | `templates/well-known/oauth-authorization-server` |
| `checks.discovery.oauthProtectedResource` | protected resource metadata has `resource` and `authorization_servers` | `templates/well-known/oauth-protected-resource` |
| `checks.commerce.x402` | paid routes return valid x402 402 challenge | opt-in only |
| `checks.commerce.mpp` | `/openapi.json` has `x-payment-info` | opt-in only |
| `checks.commerce.ucp` | `/.well-known/ucp` has protocol version and services | opt-in only |
| `checks.commerce.acp` | `/.well-known/acp.json` has ACP protocol metadata | opt-in only |
| `checks.commerce.ap2` | A2A Agent Card includes AP2 extension | opt-in only |

## Evidence Usage

Prefer `evidence[]` over assumptions. It tells you:

- exact URL fetched
- request method and headers
- response status and headers
- body preview
- parser finding

Replay the failing fetches before changing code.

## Primary Specs

- Robots Exclusion Protocol: https://www.rfc-editor.org/rfc/rfc9309
- Well-Known URIs: https://www.rfc-editor.org/rfc/rfc8615
- Web Linking: https://www.rfc-editor.org/rfc/rfc8288
- Linkset JSON: https://www.rfc-editor.org/rfc/rfc9264
- API Catalog: https://www.rfc-editor.org/rfc/rfc9727
- OAuth Authorization Server Metadata: https://www.rfc-editor.org/rfc/rfc8414
- OAuth Protected Resource Metadata: https://www.rfc-editor.org/rfc/rfc9728
- llms.txt: https://llmstxt.org/
- AGENTS.md: https://github.com/openai/agents.md
- Agent Skills Discovery: https://github.com/cloudflare/agent-skills-discovery-rfc
- A2A Agent Card: https://a2a-protocol.org/latest/specification/
- Web Bot Auth: https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/
