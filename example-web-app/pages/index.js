import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Ralphthon@SG</title>
      </Head>
      <main className="hero">
        <div className="hero-mascot" aria-hidden>🦞</div>
        <h1 className="title">
          RALPHTHON<span className="title-accent">@SG</span>
        </h1>
        <p className="subtitle">AI Agent Coding Hackathon</p>
      </main>
    </>
  );
}
