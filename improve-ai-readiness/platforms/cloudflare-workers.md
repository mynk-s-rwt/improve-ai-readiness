# Cloudflare Workers

## Detect

Use when `wrangler.toml` configures a Worker entrypoint or Workers static assets.

## Static Assets

If using Workers static assets, place root and `.well-known` files in the configured asset directory.

## Worker Routes

Use the Worker `fetch()` handler for:

- homepage `Link` header injection
- `Accept: text/markdown` negotiation
- extensionless well-known paths
- Web Bot Auth signed directory response

## Gotchas First

- Worker route patterns are case-sensitive.
- Static assets may bypass Worker logic depending on routing settings.
- Keep Web Bot Auth private keys out of the repo.
