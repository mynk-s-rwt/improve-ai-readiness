import { useEffect, useState } from 'react';
import { ENDPOINTS } from '../lib/home-content';
import { matchesExpectedType } from '../lib/readiness';

function endpointState(response, endpoint) {
  if (!response.ok) return 'missing';
  return matchesExpectedType(response.headers.get('content-type'), endpoint.expects)
    ? 'live'
    : 'soft404';
}

export function useReadinessDashboard() {
  const [score, setScore] = useState({ state: 'loading' });
  const [webMcp, setWebMcp] = useState({ state: 'checking', tools: [] });
  const [endpoints, setEndpoints] = useState(() =>
    ENDPOINTS.map((endpoint) => ({ ...endpoint, state: 'checking' }))
  );

  useEffect(() => {
    let cancelled = false;

    fetch('/api/score')
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        setScore(data.error ? { state: 'error', error: data.error } : { state: 'ok', data });
      })
      .catch((err) => {
        if (!cancelled) setScore({ state: 'error', error: err.message });
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

        const tools = (await testing.listTools()) || [];
        if (!cancelled) setWebMcp({ state: tools.length ? 'live' : 'missing', tools });
      } catch (err) {
        if (!cancelled) setWebMcp({ state: 'error', error: err.message, tools: [] });
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
      fetch(endpoint.path)
        .then((response) => {
          if (cancelled) return;

          const contentType = response.headers.get('content-type');

          setEndpoints((previous) => {
            const next = [...previous];
            next[idx] = {
              ...next[idx],
              state: endpointState(response, endpoint),
              contentType,
              status: response.status,
            };
            return next;
          });
        })
        .catch(() => {
          if (cancelled) return;
          setEndpoints((previous) => {
            const next = [...previous];
            next[idx] = { ...next[idx], state: 'missing' };
            return next;
          });
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { score, webMcp, endpoints };
}
