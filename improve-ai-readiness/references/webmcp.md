# WebMCP

## Goal

Pass `checks.discovery.webMcp` by registering at least one browser-visible tool on page load.

## Gotchas First

- Use `navigator.modelContext.registerTool()`. Do not rely on older `provideContext()` examples.
- The audit runs a browser and waits briefly after page load. Register immediately, not after a click.
- Tools in iframes may not be detected. Register on the top-level document.
- Duplicate names throw. In SPAs, unregister before registering or catch errors.
- A polyfill alone is not enough; the registry must contain at least one tool.

## Current API

```js
navigator.modelContext.registerTool({
  name: 'search_site',
  title: 'Search site',
  description: 'Search public site content by query.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' }
    },
    required: ['query'],
    additionalProperties: false
  },
  annotations: { readOnlyHint: true },
  async execute({ query }) {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return { content: [{ type: 'text', text: JSON.stringify(await response.json()) }] };
  }
});
```

## Good Tool Choices

- `search_site(query, limit?)`
- `get_page(path)`
- `get_readiness_score(url?)`
- `list_agent_resources()`
- `contact(subject, message, email?)` only if it asks for user confirmation

Prefer read-only tools first. Mutation tools should use `client.requestUserInteraction()`.

## Validate

In a browser console:

```js
await navigator.modelContextTesting?.listTools?.()
```

Then run:

```bash
scripts/audit.sh "$SITE_URL"
```

The target check is `checks.discovery.webMcp.status == "pass"`.

## References

- W3C draft: https://webmachinelearning.github.io/webmcp/
- Chrome early preview: https://developer.chrome.com/blog/webmcp-epp
- Readiness skill: https://isitagentready.com/.well-known/agent-skills/webmcp/SKILL.md
