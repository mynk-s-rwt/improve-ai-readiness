import { NextResponse } from 'next/server';

const SITE_URL = 'https://ai-readiness-demo-app.vercel.app';

const linkHeader = [
  `<${SITE_URL}/sitemap.xml>; rel="sitemap"; type="application/xml"`,
  `<${SITE_URL}/.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"`,
  `<${SITE_URL}/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"`,
  `<${SITE_URL}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
].join(', ');

const homepageMarkdown = `# AI Readiness Demo App

Public test bed for the improve-ai-readiness Claude Code Skill.

## Live Resources

- Score API: ${SITE_URL}/api/score
- Sitemap: ${SITE_URL}/sitemap.xml
- Agent instructions: ${SITE_URL}/AGENTS.md
- Agent skills: ${SITE_URL}/.well-known/agent-skills/index.json
- API catalog: ${SITE_URL}/.well-known/api-catalog

## Purpose

The app exposes machine-readable discovery files, bot access policy, Markdown
content negotiation, and agent integration metadata so isitagentready.com can
verify each readiness level on a public deployment.
`;

const apiCatalog = {
  linkset: [
    {
      anchor: `${SITE_URL}/api/score`,
      'service-desc': [
        {
          href: `${SITE_URL}/openapi.json`,
          type: 'application/openapi+json',
          title: 'AI Readiness Demo App OpenAPI description',
        },
      ],
      'service-doc': [
        {
          href: `${SITE_URL}/llms.txt`,
          type: 'text/markdown',
          title: 'AI Readiness Demo App agent documentation',
        },
      ],
      status: [
        {
          href: `${SITE_URL}/api/score`,
          type: 'application/json',
          title: 'Current readiness scan summary',
        },
      ],
    },
  ],
};

const oauthAuthorizationServer = {
  issuer: SITE_URL,
  authorization_endpoint: `${SITE_URL}/oauth/authorize`,
  token_endpoint: `${SITE_URL}/oauth/token`,
  jwks_uri: `${SITE_URL}/.well-known/jwks.json`,
  response_types_supported: ['code'],
  grant_types_supported: ['authorization_code', 'client_credentials'],
  code_challenge_methods_supported: ['S256'],
  token_endpoint_auth_methods_supported: ['none'],
  scopes_supported: ['read'],
};

const oauthProtectedResource = {
  resource: SITE_URL,
  authorization_servers: [SITE_URL],
  scopes_supported: ['read'],
  bearer_methods_supported: ['header'],
  resource_documentation: `${SITE_URL}/llms.txt`,
};

const jwks = {
  keys: [
    {
      kty: 'OKP',
      crv: 'Ed25519',
      kid: 'demo-web-bot-auth-2026-05-17',
      x: '11qYAYKxCrfVS_3mqVQzCOt6RSMsnm8J-8M70A-3P5M',
      use: 'sig',
      alg: 'EdDSA',
    },
  ],
  signature_agent: SITE_URL,
  purpose: 'ai',
};

function jsonResponse(body, contentType = 'application/json; charset=utf-8') {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=3600',
    },
  });
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname === '/' && req.headers.get('accept')?.includes('text/markdown')) {
    return new Response(homepageMarkdown, {
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        vary: 'Accept',
        link: linkHeader,
        'cache-control': 'public, max-age=300',
      },
    });
  }

  if (pathname === '/.well-known/api-catalog') {
    return jsonResponse(
      apiCatalog,
      'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'
    );
  }

  if (pathname === '/.well-known/oauth-authorization-server') {
    return jsonResponse(oauthAuthorizationServer);
  }

  if (pathname === '/.well-known/openid-configuration') {
    return jsonResponse(oauthAuthorizationServer);
  }

  if (pathname === '/.well-known/oauth-protected-resource') {
    return jsonResponse(oauthProtectedResource);
  }

  if (pathname === '/.well-known/http-message-signatures-directory') {
    return jsonResponse(jwks, 'application/http-message-signatures-directory+json');
  }

  const response = NextResponse.next();
  if (pathname === '/') {
    response.headers.set('Link', linkHeader);
  }
  return response;
}

export const config = {
  matcher: ['/', '/.well-known/:path*'],
};
