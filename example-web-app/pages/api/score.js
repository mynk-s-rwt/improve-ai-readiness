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

function summarize(scan) {
  // Audit returns `siteError` when the target URL is auth-walled or down.
  // Surface that as a structured payload so the dashboard can render a
  // useful message instead of crashing on the missing `level`/`checks`.
  if (scan.siteError) {
    return {
      url: scan.url,
      scannedAt: scan.scannedAt,
      blocked: true,
      siteError: scan.siteError,
      fullReportUrl: `https://isitagentready.com/report?url=${encodeURIComponent(scan.url)}`,
    };
  }

  const rows = [];
  const counts = { pass: 0, fail: 0, neutral: 0 };

  for (const [category, checks] of Object.entries(scan.checks || {})) {
    for (const [name, check] of Object.entries(checks)) {
      const status = check.status || 'neutral';
      counts[status] = (counts[status] || 0) + 1;
      rows.push({
        category,
        name,
        status,
        message: check.message || '',
      });
    }
  }

  return {
    url: scan.url,
    scannedAt: scan.scannedAt,
    level: scan.level,
    levelName: scan.levelName,
    counts,
    rows,
    nextLevel: scan.nextLevel
      ? {
          target: scan.nextLevel.target,
          name: scan.nextLevel.name,
          requirementCount: (scan.nextLevel.requirements || []).length,
        }
      : null,
    fullReportUrl: `https://isitagentready.com/report?url=${encodeURIComponent(scan.url)}`,
  };
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
    const payload = summarize(scan);

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
