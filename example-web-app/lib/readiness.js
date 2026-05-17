export const AUDIT_HOME_URL = 'https://isitagentready.com';
export const DEFAULT_DEMO_URL = 'https://ai-readiness-demo-app.vercel.app';

export function publicReportUrl(url = DEFAULT_DEMO_URL) {
  return `${AUDIT_HOME_URL}/?url=${encodeURIComponent(url)}`;
}

export function matchesExpectedType(contentType, expects) {
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

export function levelLabel(level) {
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

export function summarizeScan(scan) {
  if (scan.siteError) {
    return {
      url: scan.url,
      scannedAt: scan.scannedAt,
      blocked: true,
      siteError: scan.siteError,
      fullReportUrl: publicReportUrl(scan.url),
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
    fullReportUrl: publicReportUrl(scan.url),
  };
}
