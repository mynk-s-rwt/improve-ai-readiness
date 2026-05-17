# Reference Index

Load references only as needed.

## Always Useful

- `universal-readiness.md`: scanner-neutral crawl, SEO, structured data, policy, and discovery layers.
- `host-actions.md`: Cloudflare, Vercel, Netlify, WordPress, Webflow, Wix, Shopify dashboard guidance.
- `level-rules.md`: live level gates and default stop points.
- `audit-rubric.md`: `isitagentready.com` check paths, pass criteria, and fix surfaces.
- `well-known-paths.md`: canonical paths and content types.
- `webmcp.md`: browser-side tool registration for `checks.discovery.webMcp`.

## Load By Target Level

- `tier-1-basic-web.md`: Level 0 to Level 1.
- `tier-2-bot-aware.md`: Level 1 to Level 2.
- `tier-3-agent-readable.md`: Level 2 to Level 3.
- `tier-4-agent-integrated.md`: Level 3 to Level 4.
- `tier-5-agent-native.md`: Level 4 to Level 5.

## Optional

- `commerce-track.md`: only when the user explicitly opts into commerce checks.

## Source Priority

1. User constraints and approval.
2. Public production HTTP evidence.
3. Fresh scanner output, including `scripts/audit.sh` when relevant.
4. These references and platform files.
5. Templates.

If the auditor evidence differs from this documentation, follow the auditor and append the learning to `../learnings.jsonl`.
