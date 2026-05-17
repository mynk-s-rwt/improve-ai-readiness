export const ENDPOINTS = [
  {
    path: '/robots.txt',
    expects: 'text/plain',
    tier: 1,
    purpose: 'Crawler allow/disallow rules plus sitemap pointer',
  },
  {
    path: '/sitemap.xml',
    expects: 'xml',
    tier: 1,
    purpose: 'Machine-readable URL inventory',
  },
  {
    path: '/llms.txt',
    expects: 'text',
    tier: 2,
    purpose: 'LLM-friendly site summary',
  },
  {
    path: '/AGENTS.md',
    expects: 'markdown',
    tier: 2,
    purpose: 'Agent-readable site guide',
  },
  {
    path: '/.well-known/mcp/server-card.json',
    expects: 'json',
    tier: 3,
    purpose: 'MCP server card for model context tools',
  },
  {
    path: '/.well-known/mcp.json',
    expects: 'json',
    tier: 3,
    purpose: 'Fallback MCP server card path accepted by the audit',
  },
  {
    path: '/.well-known/agent-card.json',
    expects: 'json',
    tier: 4,
    purpose: 'A2A agent card for agent-to-agent discovery',
  },
  {
    path: '/.well-known/agent-skills/index.json',
    expects: 'json',
    tier: 4,
    purpose: 'Skills discovery index',
  },
  {
    path: '/.well-known/api-catalog',
    expects: 'json',
    tier: 5,
    purpose: 'API catalog',
  },
  {
    path: '/.well-known/oauth-protected-resource',
    expects: 'json',
    tier: 5,
    purpose: 'OAuth Protected Resource Metadata',
  },
  {
    path: '/.well-known/oauth-authorization-server',
    expects: 'json',
    tier: 5,
    purpose: 'OAuth Authorization Server Metadata',
  },
  {
    path: '/.well-known/http-message-signatures-directory',
    expects: 'json',
    tier: 5,
    purpose: 'Web Bot Auth public key directory',
  },
];

export const STACK_LAYERS = [
  {
    name: 'Crawl contract',
    status: 'Level 1',
    text: 'robots.txt, sitemap.xml, and Link headers tell crawlers where the site map and machine endpoints live.',
    tip: 'Cheap first move: ship robots and sitemap before touching advanced protocol files.',
  },
  {
    name: 'Readable pages',
    status: 'Level 3',
    text: 'Markdown negotiation gives agents a clean representation without asking them to parse the visual page.',
    tip: 'The audit sends Accept: text/markdown and expects Vary: Accept with a markdown response.',
  },
  {
    name: 'Agent directory',
    status: 'Level 4',
    text: 'MCP, A2A, agent-skills, and api-catalog endpoints publish the actions and documentation agents can use.',
    tip: 'Most sites can start with agent-skills and api-catalog. Full MCP is only needed when tools exist.',
  },
  {
    name: 'Native controls',
    status: 'Level 5',
    text: 'OAuth metadata, Web Bot Auth, and browser WebMCP move the site from static discovery into governed interaction.',
    tip: 'Do not add commerce or payment protocols on non-commerce sites. The checker treats them as neutral.',
  },
];

export const JOURNEY = [
  {
    label: 'Before',
    value: '0',
    text: 'The public audit found no readiness surface: no robots, sitemap, markdown, or well-known discovery.',
  },
  {
    label: 'After',
    value: '100',
    text: 'The same deployed app now reaches Level 5 with fourteen passing checks and commerce left neutral.',
  },
  {
    label: 'Repeat',
    value: 'Your site',
    text: 'Use the framework to get a report, approve a patch plan, deploy, and re-scan.',
  },
];

export const CTA_STEPS = [
  {
    number: '01',
    title: 'Point your agent at the guide',
    text: 'Use the folder with Claude Code, Codex, Cursor, OpenCode, Aider, or another agent that can read local instructions.',
  },
  {
    number: '02',
    title: 'Ask for report or patch',
    text: 'Choose a readiness report, an approved patch run, or both. The guide asks before changing files or hosted settings.',
  },
  {
    number: '03',
    title: 'Deploy and verify',
    text: 'Ship the next tier, scan the production URL, then keep going until the evidence improves.',
  },
];

export const IMPACT_ROWS = [
  {
    title: 'More crawl certainty',
    text: 'Robots rules, sitemap entries, canonical links, and Link headers reduce guesswork for crawlers and scanners.',
  },
  {
    title: 'Cleaner agent reading',
    text: 'Markdown negotiation and guidance files give agents a stable text path instead of forcing them through visual HTML.',
  },
  {
    title: 'Higher action discovery',
    text: 'Well-known JSON, Agent Skills, MCP, A2A, OpenAPI, and WebMCP expose what the site can do, where it lives, and how to call it.',
  },
];
