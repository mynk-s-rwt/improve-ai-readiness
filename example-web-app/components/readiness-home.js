import {
  CTA_STEPS,
  IMPACT_ROWS,
  JOURNEY,
  STACK_LAYERS,
} from '../lib/home-content';
import { DEFAULT_DEMO_URL, publicReportUrl, levelLabel } from '../lib/readiness';

const REPO_URL = 'https://github.com/mynk-s-rwt/improve-ai-readiness';

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

function statusPillFor(state) {
  if (state === 'checking') return <StatusPill kind="checking">checking...</StatusPill>;
  if (state === 'live') return <StatusPill kind="live">live</StatusPill>;
  if (state === 'soft404') return <StatusPill kind="warn">soft-404</StatusPill>;
  return <StatusPill kind="missing">missing</StatusPill>;
}

function HeaderLinkGroup({ children }) {
  return <div className="card-actions">{children}</div>;
}

function HomeHero() {
  return (
    <header className="hero">
      <div className="hero-mascot" aria-hidden="true">
        🦞
      </div>
      <p className="hero-kicker">Demo app powered by improve-ai-readiness</p>
      <h1 className="title">
        RALPHTHON<span className="title-accent">@SG</span>
      </h1>
      <p className="subtitle">AI Agent Coding Hackathon</p>
      <p className="hero-blurb">
        This is the proof app. It started at <strong>0</strong> on the public AI readiness audit.
        Using the <code>improve-ai-readiness</code> framework, it now scores{' '}
        <strong>100</strong> and exposes crawl rules, markdown negotiation, agent discovery, OAuth
        metadata, and browser WebMCP tools.
      </p>
      <nav className="hero-actions" aria-label="Demo links">
        <a className="button button--primary" href="#live-score">
          See the score
        </a>
        <a className="button button--primary-alt" href={REPO_URL} target="_blank" rel="noreferrer">
          Use it on your site
        </a>
        <a className="button" href="/details#impact">
          Why it works
        </a>
      </nav>
    </header>
  );
}

function IntroCard() {
  return (
    <section className="card intro-card">
      <div>
        <span className="eyebrow">What you are looking at</span>
        <h2>One Next.js demo app, taken from 0 to 100.</h2>
      </div>
      <p className="muted">
        The framework did not just add a badge. It added the public files, headers, well-known
        endpoints, browser tools, and verification loop that agents and scanners can actually
        inspect. The same pattern works as a report-only audit or as an approved code patch for
        your own website.
      </p>
    </section>
  );
}

function ScoreCard({ score }) {
  const data = score.state === 'ok' ? score.data : null;
  const reportUrl = data?.fullReportUrl || publicReportUrl(DEFAULT_DEMO_URL);

  return (
    <section className="card card--accent" id="live-score">
      <div className="card-header">
        <h2>Live AI-Readiness Score</h2>
        <HeaderLinkGroup>
          <a className="card-link" href={reportUrl} target="_blank" rel="noreferrer">
            Open public audit
          </a>
          <a className="card-link" href="/details#impact">
            How it works
          </a>
        </HeaderLinkGroup>
      </div>

      {score.state === 'loading' && (
        <p className="muted">Scanning this site against isitagentready.com...</p>
      )}

      {score.state === 'error' && <p className="error">Could not load score: {score.error}</p>}

      {data && data.blocked && (
        <div className="blocked">
          <p className="error">
            Audit could not reach <code>{data.url}</code>,{' '}
            <strong>
              {data.siteError.httpStatus} {data.siteError.statusText}
            </strong>
          </p>
          <p className="muted small">
            If you see this, the deployment is behind Vercel Deployment Protection. Use the stable
            project URL or disable protection in Vercel project settings.
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
            Scanned <code>{data.url}</code> at {new Date(data.scannedAt).toLocaleString()}
            {data.nextLevel && (
              <>
                {' '}
                | Next milestone: <strong>Level {data.nextLevel.target}</strong> (
                {data.nextLevel.name}), {data.nextLevel.requirementCount} requirements left
              </>
            )}
          </p>
        </>
      )}
    </section>
  );
}

function CallToActionCard() {
  return (
    <section className="card cta-card">
      <div className="card-header">
        <h2>Make Your Website Agent-Ready</h2>
        <HeaderLinkGroup>
          <a className="card-link" href={REPO_URL} target="_blank" rel="noreferrer">
            Open the framework
          </a>
          <a className="card-link" href="/details#workflow">
            See the workflow
          </a>
        </HeaderLinkGroup>
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
          Read improve-ai-readiness/SKILL.md for https://your-site.com. First generate a readiness
          report, then ask before applying fixes.
        </code>
      </div>
    </section>
  );
}

function JourneyGrid() {
  return (
    <section className="journey-grid" aria-label="Before and after summary">
      {JOURNEY.map(({ label, value, text }) => (
        <article className="mini-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}

function LayerSummaryCard() {
  return (
    <section className="card">
      <div className="card-header">
        <h2>What This Demonstrates</h2>
        <a className="card-link" href="/details#impact">
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
  );
}

function ImpactCard() {
  return (
    <section className="card">
      <div className="card-header">
        <h2>Why The Score Improves</h2>
        <a className="card-link" href="/details#impact">
          More detail
        </a>
      </div>
      <div className="layer-grid">
        {IMPACT_ROWS.map((row) => (
          <article className="layer" key={row.title}>
            <h3>{row.title}</h3>
            <p className="muted small">{row.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WebMcpCard({ webMcp }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>WebMCP Browser Tools</h2>
        {webMcp.state === 'checking' && <StatusPill kind="checking">checking...</StatusPill>}
        {webMcp.state === 'live' && (
          <StatusPill kind="live">{webMcp.tools.length} tools live</StatusPill>
        )}
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
  );
}

function EndpointTable({ endpoints }) {
  return (
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
          {endpoints.map((endpoint) => (
            <tr key={endpoint.path}>
              <td>
                <a href={endpoint.path} target="_blank" rel="noreferrer">
                  <code>{endpoint.path}</code>
                </a>
              </td>
              <td>
                <span className="tier-chip">L{endpoint.tier}</span>
              </td>
              <td>{statusPillFor(endpoint.state)}</td>
              <td className="muted small">{endpoint.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function UtilityCards() {
  return (
    <section className="split-grid" id="workflow">
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
          The framework audits first, ships only the next tier of files, waits for deployment, and
          scans again. It can stop at a report, or it can apply a patch after the user approves the
          plan.
        </p>
      </article>
    </section>
  );
}

function BeyondOneCheckerCard() {
  return (
    <section className="card note-card">
      <div className="card-header">
        <h2>Beyond One Checker</h2>
        <InfoDot text="The research folder tracks Cloudflare, SiteDex, IndexedAI, GEO scoreboards, CMS plugins, and protocol drafts." />
      </div>
      <p className="muted">
        The same readiness surface helps with Cloudflare&apos;s audit, SiteDex-style checks, agent
        directories, SEO crawlers, citation systems, and future AIPREF-style content usage
        policies. <code>llms.txt</code> is included because it is cheap, but the durable work is
        crawl policy, structured data, markdown access, signed bot policy, and tool discovery.
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span className="muted small">
        Audit by{' '}
        <a href={publicReportUrl(DEFAULT_DEMO_URL)} target="_blank" rel="noreferrer">
          isitagentready.com
        </a>{' '}
        | Framework source on{' '}
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </span>
    </footer>
  );
}

export function ReadinessHome({ score, webMcp, endpoints }) {
  return (
    <>
      <HomeHero />
      <main className="content">
        <IntroCard />
        <ScoreCard score={score} />
        <CallToActionCard />
        <JourneyGrid />
        <LayerSummaryCard />
        <ImpactCard />
        <WebMcpCard webMcp={webMcp} />
        <EndpointTable endpoints={endpoints} />
        <UtilityCards />
        <BeyondOneCheckerCard />
      </main>
      <Footer />
    </>
  );
}
