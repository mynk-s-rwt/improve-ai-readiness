(function () {
  const tools = [
    {
      name: 'list_agent_resources',
      title: 'List agent resources',
      description: 'Return machine-readable resources exposed by this site for agents.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false
      },
      annotations: { readOnlyHint: true },
      async execute() {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                resources: [
                  '/robots.txt',
                  '/sitemap.xml',
                  '/llms.txt',
                  '/AGENTS.md',
                  '/.well-known/agent-skills/index.json',
                  '/.well-known/api-catalog'
                ]
              })
            }
          ]
        };
      }
    }
  ];

  function installCompatibilitySurface(registry) {
    if (!navigator.modelContext) {
      Object.defineProperty(navigator, 'modelContext', {
        configurable: true,
        value: {
          registerTool(tool, options) {
            if (registry.has(tool.name)) throw new DOMException('Duplicate tool', 'InvalidStateError');
            registry.set(tool.name, tool);
            options?.signal?.addEventListener('abort', () => registry.delete(tool.name), { once: true });
          },
          unregisterTool(name) {
            registry.delete(name);
          }
        }
      });
    }
    if (!navigator.modelContextTesting) {
      Object.defineProperty(navigator, 'modelContextTesting', {
        configurable: true,
        value: {
          async listTools() {
            return Array.from(registry.values()).map(({ execute, ...tool }) => tool);
          }
        }
      });
    }
  }

  const registry = new Map();
  installCompatibilitySurface(registry);

  for (const tool of tools) {
    try {
      navigator.modelContext.unregisterTool?.(tool.name);
    } catch (_error) {
      // Tool was not previously registered.
    }
    try {
      navigator.modelContext.registerTool(tool);
      registry.set(tool.name, tool);
    } catch (error) {
      console.warn('[webmcp] failed to register tool', tool.name, error);
    }
  }
})();
