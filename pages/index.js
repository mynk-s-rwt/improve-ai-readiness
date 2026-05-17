import Head from 'next/head';

const missingSignals = [
  'robots.txt',
  'sitemap.xml',
  'HTTP Link headers',
  'Markdown negotiation',
  'Agent Skills index',
  'MCP / A2A cards',
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Ralphthon@SG AI readiness baseline</title>
      </Head>
      <main className="hero">
        <section className="hero-copy">
          <div className="hero-mascot" aria-hidden>🦞</div>
          <p className="eyebrow">Before the improve-ai-readiness skill</p>
          <h1 className="title">
            RALPHTHON<span className="title-accent">@SG</span>
          </h1>
          <p className="subtitle">AI Agent Coding Hackathon</p>
          <p className="lede">
            This baseline is intentionally human-readable but not agent-ready.
            It has no public machine files, no discovery headers, no well-known
            endpoints, and no browser tools for agents.
          </p>
        </section>

        <section className="baseline-panel" aria-label="AI readiness baseline">
          <div>
            <p className="panel-kicker">Expected audit result</p>
            <div className="level-row">
              <span className="level-number">0</span>
              <span className="level-label">Not Ready</span>
            </div>
          </div>
          <div className="missing-grid">
            {missingSignals.map((signal) => (
              <span className="missing-chip" key={signal}>{signal}</span>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
