'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site.config';

export type GitHubStats = {
  stars: number | null;
  forks: number | null;
  contributors: number | null;
  npmDownloads: number | null;
};

const EMPTY: GitHubStats = { stars: null, forks: null, contributors: null, npmDownloads: null };
const CACHE_KEY = 'engcode:github-stats';
const TTL = 30 * 60 * 1000; // 30 minutes — counts don't need to be live-second

function readCache(): GitHubStats | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number } & GitHubStats;
    if (Date.now() - parsed.t > TTL) return null;
    return { stars: parsed.stars, forks: parsed.forks, contributors: parsed.contributors, npmDownloads: parsed.npmDownloads };
  } catch {
    return null;
  }
}

/**
 * Real GitHub + npm numbers, fetched client-side (cached 30 min in
 * localStorage, per-IP rate limits on the public APIs are shared).
 * `null` values render as "—" until they load; UI must never fake them.
 */
export function useGitHubStats(): GitHubStats {
  const [stats, setStats] = useState<GitHubStats>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cached = readCache();
      if (cached) {
        setStats(cached);
        return;
      }
      const repo = siteConfig.github.repo;
      const [repoRes, contribRes, npmRes] = await Promise.allSettled([
        fetch(`https://api.github.com/repos/${repo}`, { headers: { Accept: 'application/vnd.github+json' } }),
        fetch(`https://api.github.com/repos/${repo}/contributors?per_page=1&anon=true`, {
          headers: { Accept: 'application/vnd.github+json' },
        }),
        fetch('https://api.npmjs.org/downloads/point/last-month/engcode'),
      ]);

      const next: GitHubStats = { ...EMPTY };

      if (repoRes.status === 'fulfilled' && repoRes.value.ok) {
        const data = (await repoRes.value.json()) as { stargazers_count?: number; forks_count?: number };
        next.stars = data.stargazers_count ?? null;
        next.forks = data.forks_count ?? null;
      }
      if (contribRes.status === 'fulfilled' && contribRes.value.ok) {
        // Link header's last page == total contributor pages (1 contributor per page)
        const link = contribRes.value.headers.get('Link');
        const match = link?.match(/[?&]page=(\d+)[^>]*>; rel="last"/);
        next.contributors = match ? Number(match[1]) : 1;
      }
      if (npmRes.status === 'fulfilled' && npmRes.value.ok) {
        const data = (await npmRes.value.json()) as { downloads?: number };
        next.npmDownloads = data.downloads ?? null;
      }

      if (!cancelled) {
        setStats(next);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ ...next, t: Date.now() }));
        } catch {
          // private mode — skip caching
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}

/** "12.4k" style formatting used everywhere counts are shown. */
export function formatCount(n: number | null, suffix = ''): string {
  if (n === null) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 1 : 1)}k${suffix}`;
  return `${n}${suffix}`;
}
