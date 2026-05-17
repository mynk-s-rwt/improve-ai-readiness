import Head from 'next/head';
import { DEFAULT_DEMO_URL, publicReportUrl } from '../lib/readiness';

const PLATFORM_ROWS = [
  ['Next.js', 'App Router routes, Pages Router middleware, or Vercel headers depending on the artifact.'],
  ['Astro', 'Static public files plus middleware for markdown negotiation when server output is available.'],
  ['SvelteKit', 'static/ files for public artifacts and hooks.server for headers or Accept negotiation.'],
  ['Remix and React Router 7', 'Resource routes for well-known JSON, loader headers for Link, and document routes for markdown.'],
  ['Cloudflare Pages', 'public/ files, _headers, Pages Functions, and optional Web Bot Auth through the platform.'],
  ['Cloudflare Workers', 'Route handling for every artifact, headers, markdown variants, and self-hosted well-known JSON.'],
  ['Vercel and Netlify', 'vercel.json, _headers, _redirects, middleware, and framework routes depending on the host.'],
  ['Plain HTML, Jekyll, Hugo', 'Static files first, host-level headers second, generated sitemap dates from real content changes.'],
];

const RESEARCH_NOTES = [
  ['Scanners are converging', 'Cloudflare, SiteDex, IndexedAI, HubSpot, WordLift, and GEO scoreboards are moving toward the same visible signals.'],
  ['llms.txt is not enough', 'It is cheap to publish, but adoption is mixed. JSON-LD, sitemap freshness, canonical URLs, and markdown access carry more durable value.'],
  ['Cloudflare and Vercel matter', 'Both can turn readiness checks into platform features. The framework stays host-neutral so the site owner keeps the playbook.'],
  ['Commerce is gated', 'x402, MPP, UCP, ACP, and AP2 stay opt-in unless the site actually sells products or exposes paid agent flows.'],
];

const SIGNALS = [
  ['Crawl and index', 'robots.txt, sitemap.xml, Link headers, canonical URLs, Open Graph, JSON-LD.'],
  ['Agent reading', 'Markdown negotiation, AGENTS.md, llms.txt, security.txt, content usage policy.'],
  ['Agent discovery', 'MCP server card, A2A agent card, agent-skills index, api-catalog, OpenAPI.'],
  ['Governed access', 'OAuth authorization metadata, protected resource metadata, Web Bot Auth key directory.'],
  ['Browser tools', 'WebMCP tool registration for in-page actions that a browser agent can discover at runtime.'],
];

const IMPACT_DETAILS = [
  [
    'Discovery',
    'Well-known endpoints, Link headers, sitemap entries, and API catalogs give agents deterministic URLs to inspect instead of guessing from page text.',
  ],
  [
    'Interpretation',
    'Markdown negotiation, JSON-LD, Open Graph, AGENTS.md, and llms.txt reduce extraction noise and preserve the intended page meaning.',
  ],
  [
    'Action',
    'MCP, Agent Skills, A2A, OpenAPI, and WebMCP explain what actions are available, what inputs they accept, and where agents should call them.',
  ],
  [
    'Governance',
    'OAuth metadata, protected resource metadata, Content-Signal policy, and Web Bot Auth describe who can access what and under which rules.',
  ],
];

const WORKFLOW_STEPS = [
  ['1. Audit', 'Scan the public URL and read the evidence, not just the headline score.'],
  ['2. Plan', 'Choose report only, patch after approval, or report then patch.'],
  ['3. Patch', 'Add the smallest platform-specific surface that can pass the next readiness layer.'],
  ['4. Verify', 'Deploy, re-scan production, and continue only when the public evidence improves.'],
];

export default function Details() {
  return (
    <>
      <Head>
        <title>AI Readiness Field Guide | Ralphthon@SG</title>
        <meta
          name="description"
          content="Platform-neutral guide for taking a website from basic crawl readiness to agent-native discovery and tool access."
        />
      </Head>

      <header className="page-hero">
        <a className="back-link" href="/">
          Back to live demo
        </a>
        <p className="eyebrow">Field Guide</p>
        <h1>From public website to agent-native surface</h1>
        <p>
          This demo treats agent readiness as a deployment discipline. Each tier adds the smallest
          useful public artifact, verifies it on the live URL, and moves on only after the scanner
          sees the change.
        </p>
        <nav className="hero-actions" aria-label="Field guide links">
          <a className="button button--primary" href="#impact">
            See the impact
          </a>
          <a className="button" href="#workflow">
            Workflow
          </a>
          <a
            className="button"
            href={publicReportUrl(DEFAULT_DEMO_URL)}
            target="_blank"
            rel="noreferrer"
          >
            Open public audit
          </a>
        </nav>
      </header>

      <main className="content content--wide">
        <section className="card" id="workflow">
          <div className="card-header">
            <h2>What The Framework Does</h2>
            <span className="muted small">audit, patch, deploy, verify</span>
          </div>
          <div className="statement-grid">
            <p>
              It starts with the current public score and the scanner evidence. If the site lacks
              basic crawl files, it adds only the Level 1 surface. If that passes, it proceeds to
              bot policy, markdown variants, well-known discovery, then native access metadata.
            </p>
            <p>
              This matters because agent readiness is not one file. It is the relationship between
              visible content, crawl permissions, machine-readable structure, action discovery, and
              access control.
            </p>
          </div>
        </section>

        <section className="card" id="impact">
          <div className="card-header">
            <h2>How The Change Helps Agents</h2>
            <span className="muted small">find, read, call, govern</span>
          </div>
          <div className="research-grid">
            {IMPACT_DETAILS.map(([title, text]) => (
              <article className="research-note" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Signals Covered</h2>
            <span className="muted small">scored plus adjacent</span>
          </div>
          <div className="signal-list">
            {SIGNALS.map(([title, text]) => (
              <article key={title} className="signal-row">
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Operating Loop</h2>
            <span className="muted small">report first, patch by approval</span>
          </div>
          <div className="signal-list">
            {WORKFLOW_STEPS.map(([title, text]) => (
              <article key={title} className="signal-row">
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Platform Map</h2>
            <span className="muted small">same goal, different shipping path</span>
          </div>
          <table className="endpoint-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>How It Ships</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORM_ROWS.map(([platform, path]) => (
                <tr key={platform}>
                  <td>
                    <strong>{platform}</strong>
                  </td>
                  <td className="muted small">{path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Research Notes</h2>
            <span className="muted small">from the local dossiers</span>
          </div>
          <div className="research-grid">
            {RESEARCH_NOTES.map(([title, text]) => (
              <article className="research-note" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card note-card">
          <div className="card-header">
            <h2>Why The Demo Stops Commerce At Neutral</h2>
          </div>
          <p className="muted">
            This site is a public proof page, not a shop. Shipping x402, MPP, UCP, ACP, or AP2
            without a real payment or product flow would make the site noisier and less honest.
            The framework keeps those files behind an explicit commerce track.
          </p>
        </section>
      </main>
    </>
  );
}
