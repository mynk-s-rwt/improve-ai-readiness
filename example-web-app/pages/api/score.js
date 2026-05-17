// Server-side proxy to isitagentready.com /api/scan
//
// Why a proxy and not a direct browser call?
//   - Avoids any CORS surprises on the audit endpoint
//   - Lets us cache the result (the audit takes 5-10s)
//   - Lets us strip the response down to what the dashboard renders
//   - Lets us inject our own deployed URL automatically (no manual config)
//
// The cache lives in module scope, so it persists across warm invocations
// on the same Vercel serverless container. Cold start = fresh fetch.

import { summarizeScan } from '../../lib/readiness';

const AUDIT_ENDPOINT = 'https://isitagentready.com/api/scan';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cache = null; // { key, scannedAt, payload }

function resolveSiteUrl(req) {
  // Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the stable project domain
  // (e.g. "ai-readiness-demo-app.vercel.app") and VERCEL_URL to the
  // per-deployment URL. Prefer the stable one so cache is shared across
  // deploys; fall back to the request host for local dev.
  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    req.headers['x-forwarded-host'] ||
    req.headers.host;

  if (!host) return null;
  if (host.startsWith('http')) return host;
  return `https://${host}`;
}

export default async function handler(req, res) {
  const siteUrl = (req.query.url && String(req.query.url)) || resolveSiteUrl(req);

  if (!siteUrl) {
    res.status(400).json({ error: 'Could not resolve site URL' });
    return;
  }

  const now = Date.now();
  if (
    cache &&
    cache.key === siteUrl &&
    now - cache.scannedAt < CACHE_TTL_MS
  ) {
    res.setHeader('x-cache', 'HIT');
    res.setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json(cache.payload);
    return;
  }

  try {
    const upstream = await fetch(AUDIT_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: siteUrl }),
    });

    if (!upstream.ok) {
      res.status(502).json({
        error: `Audit service returned ${upstream.status}`,
        siteUrl,
      });
      return;
    }

    const scan = await upstream.json();
    const payload = summarizeScan(scan);

    cache = { key: siteUrl, scannedAt: now, payload };
    res.setHeader('x-cache', 'MISS');
    res.setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json(payload);
  } catch (err) {
    res.status(502).json({
      error: 'Audit fetch failed',
      detail: err && err.message,
      siteUrl,
    });
  }
}
