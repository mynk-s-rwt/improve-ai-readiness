# Commerce Track

Commerce checks are neutral for non-commerce sites. Do not ship these by default.

## When To Opt In

Ask the user before adding commerce metadata when the site has:

- product or offer JSON-LD
- cart or checkout routes
- Shopify, WooCommerce, Stripe, or marketplace behavior
- paid API routes
- agent-driven purchasing workflows

## Checks

| Check | Surface | Notes |
|---|---|---|
| `x402` | paid route returns HTTP 402 with payment challenge | API/content monetization |
| `mpp` | `/openapi.json` with `x-payment-info` extensions | paid API operations |
| `ucp` | `/.well-known/ucp` | retail agent commerce |
| `acp` | `/.well-known/acp.json` | OpenAI/Stripe agentic checkout |
| `ap2` | A2A Agent Card extension | agent payment mandates |

## Gotchas First

- Do not add commerce discovery to brochure sites.
- Do not publish payment challenges that cannot be paid.
- Browse current primary protocol docs before implementation; these specs are moving fast.
