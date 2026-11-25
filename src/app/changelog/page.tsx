import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { GitHubMark } from '@/components/ui/GitHubMark';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Every change to EngCode, straight from the GitHub commit history — grouped by day, updated automatically.',
};

export const revalidate = 1800;

type GhCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
  };
};

async function fetchCommits(): Promise<GhCommit[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${siteConfig.github.repo}/commits?per_page=60`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 1800 },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as GhCommit[];
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

function firstLine(message: string): string {
  const line = message.split('\n')[0]!.trim();
  return line.charAt(0).toUpperCase() + line.slice(1);
}

function dayKey(dateISO: string): string {
  return dateISO.slice(0, 10);
}

function formatDay(dateISO: string): string {
  return new Date(`${dateISO}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function isMerge(message: string): boolean {
  return /^merge (pull request|branch|remote)/i.test(message.trim());
}

export default async function ChangelogPage() {
  const commits = await fetchCommits();

  // Group commits by day, newest first, skipping merge commits.
  const days = new Map<string, GhCommit[]>();
  if (commits) {
    for (const commit of commits) {
      if (isMerge(commit.commit.message)) continue;
      const date = commit.commit.author?.date;
      if (!date) continue;
      const key = dayKey(date);
      const list = days.get(key) ?? [];
      list.push(commit);
      days.set(key, list);
    }
  }
  const groups = [...days.entries()];

  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Changelog
          </p>
          <h1 className="text-h1 mt-3">Every change, straight from GitHub</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            This timeline is the repository&apos;s commit history, fetched live from GitHub and
            grouped by day. Nothing curated, nothing stale — the source of truth.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <a
                href={`${siteConfig.github.url}/commits`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Commit history <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/roadmap" className="btn-secondary">
                See the roadmap
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <section className="container-site py-14 md:py-20" aria-label="Change timeline">
        {groups.length === 0 ? (
          <Reveal className="card mx-auto max-w-2xl p-8 text-center">
            <GitHubMark className="mx-auto h-10 w-10 text-subtle" />
            <h2 className="text-h4 mt-4">Couldn&apos;t reach GitHub</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The commit history is fetched from the GitHub API, which is unreachable right now.
              You can read it directly on GitHub:
            </p>
            <a
              href={`${siteConfig.github.url}/commits`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 inline-flex h-11 items-center gap-2 px-5 text-sm"
            >
              <GitHubMark className="h-4 w-4" /> Open the commit history
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        ) : (
          <ol className="relative ml-3 border-l border-border pl-8 md:ml-4 md:pl-10">
            {groups.map(([key, dayCommits], i) => (
              <Reveal
                as="li"
                key={key}
                delay={Math.min(i * 0.08, 0.4)}
                className="relative pb-12 last:pb-0"
              >
                {/* Timeline dot */}
                <span
                  className={`absolute -left-[41px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-bg md:-left-[49px] ${
                    i === 0
                      ? 'bg-primary shadow-[0_0_0_5px_rgb(239_171_62_/_0.25)]'
                      : 'bg-border-strong'
                  }`}
                  aria-hidden="true"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-h4">
                    <time dateTime={key}>{formatDay(key)}</time>
                  </h2>
                  {i === 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-caption font-bold uppercase tracking-wide text-primary-text">
                      Latest
                    </span>
                  ) : null}
                  <span className="text-sm text-subtle">
                    {dayCommits.length} change{dayCommits.length === 1 ? '' : 's'}
                  </span>
                </div>

                <ul className="card mt-4 divide-y divide-border overflow-hidden">
                  {dayCommits.map((commit) => {
                    const message = firstLine(commit.commit.message);
                    const pr = /#(\d+)/.exec(message);
                    return (
                      <li
                        key={commit.sha}
                        className="flex items-start gap-3 px-5 py-3.5 text-sm leading-relaxed text-muted transition-colors hover:bg-bg-subtle"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border-strong" aria-hidden="true" />
                        <span className="min-w-0 flex-1">{message}</span>
                        {pr ? (
                          <a
                            href={`https://github.com/${siteConfig.github.repo}/pull/${pr[1]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 font-mono text-caption text-link hover:underline"
                          >
                            #{pr[1]}
                          </a>
                        ) : (
                          <a
                            href={commit.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 font-mono text-caption text-subtle hover:text-link"
                            aria-label={`View commit ${commit.sha.slice(0, 7)}`}
                          >
                            {commit.sha.slice(0, 7)}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </ol>
        )}

        <Reveal delay={0.2} className="mt-14 rounded-2xl border border-border bg-bg-subtle p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-h4">What&apos;s coming?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                The public roadmap and open issues show what we&apos;re building next.
              </p>
            </div>
            <a
              href={`${siteConfig.github.url}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary h-11 px-5 text-sm"
            >
              Open issues <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
