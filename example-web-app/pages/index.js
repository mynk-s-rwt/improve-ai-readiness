import Head from 'next/head';
import { ReadinessHome } from '../components/readiness-home';
import { useReadinessDashboard } from '../hooks/useReadinessDashboard';

export default function Home() {
  const dashboard = useReadinessDashboard();

  return (
    <>
      <Head>
        <title>Ralphthon@SG | AI Readiness Demo</title>
        <meta
          name="description"
          content="Demo app showing how the improve-ai-readiness framework moved a public website from 0 to 100 on agent readiness checks."
        />
      </Head>
      <ReadinessHome {...dashboard} />
    </>
  );
}
