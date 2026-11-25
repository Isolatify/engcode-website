'use client';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { GitHubMark } from '@/components/ui/GitHubMark';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';

type GhIssue = { number: number; title: string; html_url: string; labels?: { name: string }[] };

/**
 * Open issues carrying the `roadmap` label, straight from GitHub. The panel
 * renders nothing at all when the API is unreachable or the label is empty —
 * the curated columns above stay the source of truth.
 */
export function LiveRoadmapIssues() {
  const [issues, setIssues] = useState<GhIssue[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${siteConfig.github.repo}/issues?labels=roadmap&state=open&per_page=8`,
          { headers: { Accept: 'application/vnd.github+json' } },
        );
        if (!res.ok) return;
        const data = (await res.json()) as GhIssue[];
        if (!Array.isArray(data) || data.length === 0) return;
        if (!cancelled) setIssues(data.filter((i) => !i.html_url.includes('/pull/')));
      } catch {
        // offline / rate-limited — panel stays hidden
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!issues || issues.length === 0) return null;

  return (
    <Reveal className="mt-10">
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border bg-bg-subtle px-5 py-3.5">
          <GitHubMark className="h-4 w-4 text-subtle" />
          <h3 className="font-heading text-sm font-semibold">Straight from GitHub</h3>
          <span className="ml-auto text-caption text-subtle">open issues labeled “roadmap”</span>
        </div>
        <ul className="divide-y divide-border">
          {issues.map((issue) => (
            <li key={issue.number}>
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 text-sm text-muted transition-colors hover:bg-bg-subtle hover:text-text"
              >
                <span className="font-mono text-caption text-subtle">#{issue.number}</span>
                <span className="min-w-0 flex-1 truncate">{issue.title}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
