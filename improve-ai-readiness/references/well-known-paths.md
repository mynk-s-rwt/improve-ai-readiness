# Well-Known Paths

## Core Files

| URL path | Preferred content type | Level |
|---|---|---:|
| `/robots.txt` | `text/plain; charset=utf-8` | 1, 2 |
| `/sitemap.xml` | `application/xml; charset=utf-8` | 1 |
| `/llms.txt` | `text/markdown; charset=utf-8` or `text/plain; charset=utf-8` | adjacent, Level 3 support |
| `/AGENTS.md` | `text/markdown; charset=utf-8` or `text/plain; charset=utf-8` | adjacent |
| `/.well-known/mcp.json` | `application/json; charset=utf-8` | 4 |
| `/.well-known/mcp/server-card.json` | `application/json; charset=utf-8` | 4 |
| `/.well-known/agent-card.json` | `application/json; charset=utf-8` | 4 |
| `/.well-known/agent-skills/index.json` | `application/json; charset=utf-8` | 4 |
| `/.well-known/api-catalog` | `application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"` | 4, 5 |
| `/.well-known/oauth-protected-resource` | `application/json; charset=utf-8` | 5 |
| `/.well-known/oauth-authorization-server` | `application/json; charset=utf-8` | 5 |
| `/.well-known/openid-configuration` | `application/json; charset=utf-8` | 5 |
| `/.well-known/http-message-signatures-directory` | `application/http-message-signatures-directory+json` | 5 group |

## Link Header Bundle

Use absolute URLs when a platform or proxy may change hostnames:

```http
Link: <{{SITE_URL}}/sitemap.xml>; rel="sitemap"; type="application/xml", <{{SITE_URL}}/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json", <{{SITE_URL}}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"
```

The live audit has also accepted relative targets such as:

```http
Link: </.well-known/mcp/server-card.json>; rel="service-desc", </.well-known/agent-skills/index.json>; rel="describedby", </.well-known/api-catalog>; rel="api-catalog"
```
