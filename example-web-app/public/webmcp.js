(function () {
  const registry = new Map();

  function safeCloneTool(tool) {
    return {
      name: tool.name,
      title: tool.title || tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema || { type: 'object', properties: {} },
      annotations: tool.annotations || {},
    };
  }

  function ensureModelContext() {
    const nav = window.navigator;

    if (!nav.modelContext) {
      const modelContext = {
        registerTool(tool, options) {
          if (!tool || !tool.name || !tool.description || typeof tool.execute !== 'function') {
            throw new DOMException('Invalid WebMCP tool definition', 'InvalidStateError');
          }
          if (registry.has(tool.name)) {
            throw new DOMException('Duplicate WebMCP tool name', 'InvalidStateError');
          }
          registry.set(tool.name, tool);
          if (options && options.signal) {
            options.signal.addEventListener('abort', () => registry.delete(tool.name), { once: true });
          }
        },
        unregisterTool(name) {
          if (!registry.delete(name)) {
            throw new DOMException('Unknown WebMCP tool name', 'InvalidStateError');
          }
        },
      };

      try {
        Object.defineProperty(nav, 'modelContext', {
          configurable: true,
          enumerable: true,
          value: modelContext,
        });
      } catch (error) {
        console.warn('[webmcp] could not install compatibility modelContext', error);
      }
    }

    if (!nav.modelContextTesting) {
      try {
        Object.defineProperty(nav, 'modelContextTesting', {
          configurable: true,
          enumerable: true,
          value: {
            async listTools() {
              return Array.from(registry.values(), safeCloneTool);
            },
            async executeTool(name, input) {
              const tool = registry.get(name);
              if (!tool) throw new DOMException('Unknown WebMCP tool name', 'InvalidStateError');
              return tool.execute(input || {}, { requestUserInteraction: (callback) => callback() });
            },
          },
        });
      } catch (error) {
        console.warn('[webmcp] could not install compatibility testing surface', error);
      }
    }

    return nav.modelContext;
  }

  async function textFromResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return JSON.stringify(await response.json(), null, 2);
    }
    return response.text();
  }

  const tools = [
    {
      name: 'get_readiness_score',
      title: 'Get readiness score',
      description:
        'Fetch the current isitagentready.com audit summary for this demo app, or for a supplied public URL.',
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            format: 'uri',
            description: 'Optional public URL to scan through the demo score proxy.',
          },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      async execute(input) {
        const query = input && input.url ? `?url=${encodeURIComponent(input.url)}` : '';
        const response = await fetch(`/api/score${query}`, {
          headers: { accept: 'application/json' },
        });
        return {
          content: [
            {
              type: 'text',
              text: await textFromResponse(response),
            },
          ],
        };
      },
    },
    {
      name: 'list_agent_resources',
      title: 'List agent resources',
      description:
        'Return the machine-readable discovery resources exposed by the AI Readiness Demo App.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      async execute() {
        const origin = window.location.origin;
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  resources: [
                    { path: '/robots.txt', purpose: 'crawler and content-signal policy' },
                    { path: '/sitemap.xml', purpose: 'canonical public URL inventory' },
                    { path: '/llms.txt', purpose: 'LLM-readable site summary' },
                    { path: '/AGENTS.md', purpose: 'agent instructions' },
                    { path: '/.well-known/agent-skills/index.json', purpose: 'Agent Skills index' },
                    { path: '/.well-known/mcp/server-card.json', purpose: 'MCP server card' },
                    { path: '/.well-known/agent-card.json', purpose: 'A2A agent card' },
                    { path: '/.well-known/api-catalog', purpose: 'RFC 9727 API catalog' },
                  ].map((resource) => ({ ...resource, url: `${origin}${resource.path}` })),
                },
                null,
                2
              ),
            },
          ],
        };
      },
    },
    {
      name: 'get_agent_resource',
      title: 'Get agent resource',
      description:
        'Fetch one public machine-readable resource from the AI Readiness Demo App by path.',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'A same-origin resource path such as /llms.txt or /.well-known/api-catalog.',
          },
        },
        required: ['path'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute(input) {
        const allowed = [
          '/robots.txt',
          '/sitemap.xml',
          '/llms.txt',
          '/AGENTS.md',
          '/openapi.json',
          '/.well-known/agent-skills/index.json',
          '/.well-known/mcp/server-card.json',
          '/.well-known/mcp.json',
          '/.well-known/agent-card.json',
          '/.well-known/api-catalog',
          '/.well-known/oauth-protected-resource',
          '/.well-known/oauth-authorization-server',
          '/.well-known/http-message-signatures-directory',
        ];
        if (!allowed.includes(input.path)) {
          return {
            content: [
              {
                type: 'text',
                text: `Unsupported path. Allowed paths: ${allowed.join(', ')}`,
              },
            ],
          };
        }
        const response = await fetch(input.path, { headers: { accept: '*/*' } });
        return {
          content: [
            {
              type: 'text',
              text: await textFromResponse(response),
            },
          ],
        };
      },
    },
  ];

  function registerTools() {
    const modelContext = ensureModelContext();
    if (!modelContext || typeof modelContext.registerTool !== 'function') return;

    for (const tool of tools) {
      try {
        if (typeof modelContext.unregisterTool === 'function') {
          try {
            modelContext.unregisterTool(tool.name);
          } catch (_error) {
            // Tool was not previously registered.
          }
        }
        modelContext.registerTool(tool);
        registry.set(tool.name, tool);
      } catch (error) {
        console.warn('[webmcp] failed to register tool', tool.name, error);
      }
    }
  }

  registerTools();
})();
