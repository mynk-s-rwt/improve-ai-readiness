import Head from 'next/head';
import { useEffect, useState } from 'react';

// Well-known endpoints that AI agents look for. Each row is live-checked
// against this same origin on page load — green when present with the right
// content-type, amber on soft-404 (200 + text/html), red on hard 404.
const ENDPOINTS = [
  {
    path: '/robots.txt',
    expects: 'text/plain',
    tier: 1,
    purpose: 'Crawler allow/disallow rules + sitemap pointer',
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
    purpose: 'LLM-friendly site summary (Answer.AI spec)',
  },
  {
    path: '/AGENTS.md',
    expects: 'markdown',
    tier: 2,
    purpose: 'Agent-readable site guide (agentsmd.net)',
  },
  {
    path: '/.well-known/mcp/server-card.json',
    expects: 'json',
    tier: 3,
    purpose: 'MCP server card — tools exposed to model context',
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
    purpose: 'A2A agent card — agent-to-agent discovery',
  },
  {
    path: '/.well-known/agent-skills/index.json',
    expects: 'json',
    tier: 4,
    purpose: 'Skills discovery index (Cloudflare RFC v0.2.0)',
  },
  {
    path: '/.well-known/api-catalog',
    expects: 'json',
    tier: 5,
    purpose: 'API catalog (RFC 9727)',
  },
  {
    path: '/.well-known/oauth-protected-resource',
    expects: 'json',
    tier: 5,
    purpose: 'OAuth Protected Resource Metadata (RFC 9728)',
  },
  {
    path: '/.well-known/oauth-authorization-server',
    expects: 'json',
    tier: 5,
    purpose: 'OAuth Authorization Server Metadata (RFC 8414)',
  },
  {
    path: '/.well-known/http-message-signatures-directory',
    expects: 'json',
    tier: 5,
    purpose: 'Web Bot Auth public key directory',
  },
];

function matchesExpectedType(contentType, expects) {
  if (!contentType) return false;
  const ct = contentType.toLowerCase();
  switch (expects) {
    case 'text/plain':
      return ct.includes('text/plain');
    case 'xml':
      return ct.includes('xml');
    case 'text':
      return ct.includes('text/plain') || ct.includes('text/markdown');
    case 'markdown':
      return ct.includes('markdown') || ct.includes('text/plain');
    case 'json':
      return ct.includes('json');
    default:
      return true;
  }
}

function levelLabel(level) {
  // Mirrors isitagentready.com's 0-5 rubric
  const names = [
    'Not Ready',
    'Basic Web Presence',
    'AI-Readable',
    'AI-Discoverable',
    'Agent-Integrated',
    'Agent-Native',
  ];
  return names[level] || `Level ${level}`;
}

function StatusPill({ kind, children }) {
  return <span className={`pill pill--${kind}`}>{children}</span>;
}

export default function Home() {
  const [score, setScore] = useState({ state: 'loading' });
  const [endpoints, setEndpoints] = useState(() =>
    ENDPOINTS.map((e) => ({ ...e, state: 'checking' }))
  );

  // Fetch the audit score on mount
  useEffect(() => {
    let cancelled = false;
    fetch('/api/score')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setScore({ state: 'error', error: data.error });
        else setScore({ state: 'ok', data });
      })
      .catch((err) => {
        if (cancelled) return;
        setScore({ state: 'error', error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Live-check each endpoint on the same origin
  useEffect(() => {
    let cancelled = false;
    ENDPOINTS.forEach((endpoint, idx) => {
      fetch(endpoint.path, { method: 'GET' })
        .then(async (resp) => {
          if (cancelled) return;
          const ct = resp.headers.get('content-type');
          let state;
          if (resp.status === 404) state = 'missing';
          else if (!resp.ok) state = 'missing';
          else if (matchesExpectedType(ct, endpoint.expects)) state = 'live';
          else state = 'soft404';
          setEndpoints((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], state, contentType: ct, status: resp.status };
            return next;
          });
        })
        .catch(() => {
          if (cancelled) return;
          setEndpoints((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], state: 'missing' };
            return next;
          });
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const data = score.state === 'ok' ? score.data : null;

  return (
    <>
      <Head>
        <title>Ralphthon@SG — AI-Readiness Demo</title>
        <meta
          name="description"
          content="Live test bed for the improve-ai-readiness Claude Skill. Starts at Level 0 and climbs as the skill applies each tier."
        />
      </Head>

      <header className="hero">
        <div className="hero-mascot" aria-hidden>🦞</div>
        <h1 className="title">
          RALPHTHON<span className="title-accent">@SG</span>
        </h1>
        <p className="subtitle">AI Agent Coding Hackathon</p>
        <p className="hero-blurb">
          This page is the live test bed for the <code>improve-ai-readiness</code> Claude Skill.
          It exposes the same machine-readable files, headers, and well-known endpoints the skill
          applies to production websites, then reports the live audit result after each deploy.
        </p>
      </header>

      <main className="content">
        {/* === SCORE CARD === */}
        <section className="card">
          <div className="card-header">
            <h2>Live AI-Readiness Score</h2>
            <a
              className="card-link"
              href={data ? data.fullReportUrl : 'https://isitagentready.com'}
              target="_blank"
              rel="noreferrer"
            >
              Full report ↗
            </a>
          </div>

          {score.state === 'loading' && (
            <p className="muted">Scanning this site against isitagentready.com…</p>
          )}

          {score.state === 'error' && (
            <p className="error">Could not load score: {score.error}</p>
          )}

          {data && data.blocked && (
            <div className="blocked">
              <p className="error">
                Audit could not reach <code>{data.url}</code> —{' '}
                <strong>
                  {data.siteError.httpStatus} {data.siteError.statusText}
                </strong>
              </p>
              <p className="muted small">
                If you&apos;re seeing this, the deployment is behind Vercel&apos;s Deployment
                Protection (per-deploy URLs are SSO-walled by default). Use the stable
                project URL or disable protection in Vercel → Project → Settings → Deployment Protection.
              </p>
            </div>
          )}

          {data && !data.blocked && (
            <>
              <div className="score-grid">
                <div className="score-level">
                  <div className="score-number" data-level={data.level}>
                    {data.level}
                  </div>
                  <div className="score-name">{data.levelName || levelLabel(data.level)}</div>
                </div>
                <div className="score-counts">
                  <div className="count count--pass">
                    <strong>{data.counts.pass || 0}</strong> pass
                  </div>
                  <div className="count count--fail">
                    <strong>{data.counts.fail || 0}</strong> fail
                  </div>
                  <div className="count count--neutral">
                    <strong>{data.counts.neutral || 0}</strong> neutral
                  </div>
                </div>
              </div>
              <p className="muted score-meta">
                Scanned <code>{data.url}</code> at{' '}
                {new Date(data.scannedAt).toLocaleString()}
                {data.nextLevel && (
                  <>
                    {' '}
                    · Next milestone: <strong>Level {data.nextLevel.target}</strong>{' '}
                    ({data.nextLevel.name}) — {data.nextLevel.requirementCount} requirements left
                  </>
                )}
              </p>
            </>
          )}
        </section>

        {/* === ENDPOINT TABLE === */}
        <section className="card">
          <div className="card-header">
            <h2>Demo Well-Known Endpoints</h2>
            <span className="muted small">live-checked against this origin</span>
          </div>
          <table className="endpoint-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((e) => {
                let pill;
                if (e.state === 'checking') pill = <StatusPill kind="checking">checking…</StatusPill>;
                else if (e.state === 'live') pill = <StatusPill kind="live">live</StatusPill>;
                else if (e.state === 'soft404')
                  pill = <StatusPill kind="warn">soft-404 (HTML)</StatusPill>;
                else pill = <StatusPill kind="missing">missing</StatusPill>;

                return (
                  <tr key={e.path}>
                    <td>
                      <a href={e.path} target="_blank" rel="noreferrer">
                        <code>{e.path}</code>
                      </a>
                    </td>
                    <td>
                      <span className="tier-chip">L{e.tier}</span>
                    </td>
                    <td>{pill}</td>
                    <td className="muted small">{e.purpose}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* === API SAMPLE === */}
        <section className="card">
          <div className="card-header">
            <h2>Score API</h2>
            <span className="muted small">cached 5min · same origin</span>
          </div>
          <p className="muted">
            <code>GET /api/score</code> proxies the live audit so you can wire it into anything.
            <br />
            <code>GET /api/score?url=https://example.com</code> scans an arbitrary URL.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span className="muted small">
          Audit by{' '}
          <a href="https://isitagentready.com" target="_blank" rel="noreferrer">
            isitagentready.com
          </a>{' '}
          · Skill source on{' '}
          <a
            href="https://github.com/mynk-s-rwt/improve-ai-readiness"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </span>
      </footer>
    </>
  );
}
