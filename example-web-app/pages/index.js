import Head from 'next/head';
import { useEffect, useState } from 'react';

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
    purpose: 'MCP server card for tools exposed to model context',
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

const STACK_LAYERS = [
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

const JOURNEY = [
  ['Before', '0', 'The public audit found no readiness surface: no robots, sitemap, markdown, or well-known discovery.'],
  ['After', '100', 'The same deployed app now reaches Level 5 with fourteen passing checks and commerce left neutral.'],
  ['Repeat', 'Your site', 'Use the framework to get a report, approve a patch plan, deploy, and re-scan.'],
];

const CTA_STEPS = [
  {
    number: '01',
    title: 'Install the framework',
    text: 'Copy the improve-ai-readiness folder into your Claude Code skills directory or use this repo as the reference source.',
  },
  {
    number: '02',
    title: 'Ask for report or patch',
    text: 'Choose a readiness report, an approved patch run, or both. The skill asks before changing files or hosted settings.',
  },
  {
    number: '03',
    title: 'Deploy and verify',
    text: 'Ship the next tier, scan the production URL, then keep going until the evidence improves.',
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

function InfoDot({ text }) {
  return (
    <span className="info-dot" aria-label={text} tabIndex={0} data-tip={text}>
      i
    </span>
  );
}

export default function Home() {
  const [score, setScore] = useState({ state: 'loading' });
  const [webMcp, setWebMcp] = useState({ state: 'checking', tools: [] });
  const [endpoints, setEndpoints] = useState(() =>
    ENDPOINTS.map((e) => ({ ...e, state: 'checking' }))
  );

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

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const testing = navigator.modelContextTesting;
        if (!testing || typeof testing.listTools !== 'function') {
          setWebMcp({ state: 'missing', tools: [] });
          return;
        }
        const tools = await testing.listTools();
        if (cancelled) return;
        setWebMcp({
          state: tools && tools.length ? 'live' : 'missing',
          tools: tools || [],
        });
      } catch (err) {
        if (cancelled) return;
        setWebMcp({ state: 'error', error: err.message, tools: [] });
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

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
        <title>Ralphthon@SG | AI Readiness Demo</title>
        <meta
          name="description"
          content="Demo app showing how the improve-ai-readiness framework moved a public website from 0 to 100 on agent readiness checks."
        />
      </Head>

      <header className="hero">
        <div className="hero-mascot" aria-hidden="true">🦞</div>
        <p className="hero-kicker">Demo app powered by improve-ai-readiness</p>
        <h1 className="title">
          RALPHTHON<span className="title-accent">@SG</span>
        </h1>
        <p className="subtitle">AI Agent Coding Hackathon</p>
        <p className="hero-blurb">
          This is the proof app. It started at <strong>0</strong> on the public AI readiness
          audit. Using the <code>improve-ai-readiness</code> skill framework, it now scores{' '}
          <strong>100</strong> and exposes crawl rules, markdown negotiation, agent discovery,
          OAuth metadata, and browser WebMCP tools.
        </p>
        <nav className="hero-actions" aria-label="Demo links">
          <a className="button button--primary" href="#live-score">
            See the score
          </a>
          <a
            className="button button--primary-alt"
            href="https://github.com/mynk-s-rwt/improve-ai-readiness"
            target="_blank"
            rel="noreferrer"
          >
            Use it on your site
          </a>
          <a className="button" href="/details">
            Framework details
          </a>
        </nav>
      </header>

      <main className="content">
        <section className="card intro-card">
          <div>
            <span className="eyebrow">What you are looking at</span>
            <h2>One Next.js demo app, taken from 0 to 100.</h2>
          </div>
          <p className="muted">
            The framework did not just add a badge. It added the public files, headers,
            well-known endpoints, browser tools, and verification loop that agents and scanners
            can actually inspect. The same pattern works as a report-only audit or as an approved
            code patch for your own website.
          </p>
        </section>

        <section className="card card--accent" id="live-score">
          <div className="card-header">
            <h2>Live AI-Readiness Score</h2>
            <a
              className="card-link"
              href={data ? data.fullReportUrl : 'https://isitagentready.com'}
              target="_blank"
              rel="noreferrer"
            >
              Full report
            </a>
          </div>

          {score.state === 'loading' && (
            <p className="muted">Scanning this site against isitagentready.com...</p>
          )}

          {score.state === 'error' && (
            <p className="error">Could not load score: {score.error}</p>
          )}

          {data && data.blocked && (
            <div className="blocked">
              <p className="error">
                Audit could not reach <code>{data.url}</code>,{' '}
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
                    | Next milestone: <strong>Level {data.nextLevel.target}</strong>{' '}
                    ({data.nextLevel.name}), {data.nextLevel.requirementCount} requirements left
                  </>
                )}
              </p>
            </>
          )}
        </section>

        <section className="card cta-card">
          <div className="card-header">
            <h2>Make Your Website Agent-Ready</h2>
            <a
              className="card-link"
              href="https://github.com/mynk-s-rwt/improve-ai-readiness"
              target="_blank"
              rel="noreferrer"
            >
              Open the framework
            </a>
          </div>
          <div className="cta-steps">
            {CTA_STEPS.map((step) => (
              <article className="cta-step" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className="prompt-strip">
            <code>
              Use improve-ai-readiness on https://your-site.com. First generate a readiness
              report, then ask before applying fixes.
            </code>
          </div>
        </section>

        <section className="journey-grid" aria-label="Before and after summary">
          {JOURNEY.map(([label, value, text]) => (
            <article className="mini-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="card">
          <div className="card-header">
            <h2>What This Demonstrates</h2>
            <a className="card-link" href="/details">
              Read the field guide
            </a>
          </div>
          <div className="layer-grid">
            {STACK_LAYERS.map((layer) => (
              <article className="layer" key={layer.name}>
                <div className="layer-topline">
                  <span className="tier-chip">{layer.status}</span>
                  <InfoDot text={layer.tip} />
                </div>
                <h3>{layer.name}</h3>
                <p className="muted small">{layer.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>WebMCP Browser Tools</h2>
            {webMcp.state === 'checking' && <StatusPill kind="checking">checking...</StatusPill>}
            {webMcp.state === 'live' && <StatusPill kind="live">{webMcp.tools.length} tools live</StatusPill>}
            {webMcp.state === 'missing' && <StatusPill kind="missing">missing</StatusPill>}
            {webMcp.state === 'error' && <StatusPill kind="warn">error</StatusPill>}
          </div>
          {webMcp.state === 'live' ? (
            <ul className="tool-list">
              {webMcp.tools.map((tool) => (
                <li key={tool.name}>
                  <code>{tool.name}</code>
                  <span className="muted small">{tool.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">
              Tools are registered on page load through <code>navigator.modelContext.registerTool()</code>.{' '}
              The fallback polyfill also supports Chromium builds that expose the test harness.
            </p>
          )}
        </section>

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
                if (e.state === 'checking') pill = <StatusPill kind="checking">checking...</StatusPill>;
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

        <section className="split-grid">
          <article className="card">
            <div className="card-header">
              <h2>Score API</h2>
              <span className="muted small">cached 5 min, same origin</span>
            </div>
            <p className="muted">
              <code>GET /api/score</code> proxies the live audit for this demo.
              <br />
              <code>GET /api/score?url=https://example.com</code> scans another public URL.
            </p>
          </article>

          <article className="card">
            <div className="card-header">
              <h2>Use Case</h2>
              <span className="muted small">runbook, not a checklist dump</span>
            </div>
            <p className="muted">
              The framework audits first, ships only the next tier of files, waits for deployment,
              and scans again. It can stop at a report, or it can apply a patch after the user
              approves the plan.
            </p>
          </article>
        </section>

        <section className="card note-card">
          <div className="card-header">
            <h2>Beyond One Checker</h2>
            <InfoDot text="The research folder tracks Cloudflare, SiteDex, IndexedAI, GEO scoreboards, CMS plugins, and protocol drafts." />
          </div>
          <p className="muted">
            The same readiness surface helps with Cloudflare&apos;s audit, SiteDex-style checks,
            agent directories, SEO crawlers, citation systems, and future AIPREF-style content
            usage policies. <code>llms.txt</code> is included because it is cheap, but the durable
            work is crawl policy, structured data, markdown access, signed bot policy, and tool
            discovery.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span className="muted small">
          Audit by{' '}
          <a href="https://isitagentready.com" target="_blank" rel="noreferrer">
            isitagentready.com
          </a>{' '}
          | Framework source on{' '}
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
