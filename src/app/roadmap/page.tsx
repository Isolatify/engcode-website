import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader, Milestone, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { LiveRoadmapIssues } from '@/components/roadmap/LiveRoadmapIssues';

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    'What EngCode has shipped, what we are building now and what is planned next — the public roadmap for the language, the CLI and this website.',
};

type Column = {
  id: string;
  title: string;
  icon: typeof CheckCircle2;
  accent: 'done' | 'active' | 'planned';
  note: string;
  items: string[];
};

const COLUMNS: Column[] = [
  {
    id: 'done',
    title: 'Done',
    icon: CheckCircle2,
    accent: 'done',
    note: 'Shipped and stable',
    items: [
      'Scripts, tables and functions in the core language',
      'Three-layer apps: blocks, styling and behavior',
      'Windows and macOS project templates',
      'VS Code extension with syntax highlighting and the .eng icon theme',
      'In-browser playground for quick experiments',
      'Docs structure and the 20-lesson course',
    ],
  },
  {
    id: 'active',
    title: 'In progress',
    icon: Loader,
    accent: 'active',
    note: 'Being built right now',
    items: [
      'This website — new pages, course tracker and press kit',
      'Playground running on the real interpreter instead of the preview',
      'winget and Homebrew packages for one-command installs',
      'Docs search across every page',
    ],
  },
  {
    id: 'planned',
    title: 'Planned',
    icon: Milestone,
    accent: 'planned',
    note: 'Next on the list',
    items: [
      'Real-time preview while you edit app blocks',
      'Quizzes at the end of each lesson',
      'Translations of the course and docs',
      'Example gallery submissions from the community',
      'Language-server autocomplete in every editor',
    ],
  },
];

export default function RoadmapPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Roadmap
          </p>
          <h1 className="text-h1 mt-3">Where EngCode is going</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            Three columns, no marketing: what is done, what we are building this month, and what
            is queued behind it. Updated with every release.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <a
                href={`${siteConfig.github.url}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Suggest something <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/changelog" className="btn-secondary">
                See what already shipped
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Columns */}
      <section className="container-site py-14 md:py-20" aria-label="Roadmap columns">
        <div className="grid gap-6 lg:grid-cols-3">
          {COLUMNS.map((col, i) => {
            const Icon = col.icon;
            const heading =
              col.accent === 'done'
                ? 'text-success-text'
                : col.accent === 'active'
                  ? 'text-brand-700 dark:text-brand-400'
                  : 'text-subtle';
            const dot =
              col.accent === 'done'
                ? 'bg-success'
                : col.accent === 'active'
                  ? 'bg-brand-400'
                  : 'bg-border-strong';
            return (
              <Reveal key={col.id} delay={i * 0.1}>
                <div className="card flex h-full flex-col overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border bg-bg-subtle px-5 py-4">
                    <h2 className="text-h4 flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${heading}`} aria-hidden="true" />
                      {col.title}
                    </h2>
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-caption font-medium text-subtle">
                      {col.items.length}
                    </span>
                  </div>
                  <p className="border-b border-border px-5 py-2.5 text-caption uppercase tracking-wider text-subtle">
                    {col.note}
                  </p>
                  <ul className="flex-1 divide-y divide-border">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 px-5 py-3.5 text-sm leading-relaxed text-muted transition-colors hover:bg-bg-subtle"
                      >
                        <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <LiveRoadmapIssues />

        {/* Principles + CTA */}
        <Reveal delay={0.25} className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-h4">How we pick</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              One rule decides everything on this page: does it remove a hurdle between a beginner
              and a running program? Anything that only impresses experienced developers waits.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Dates are deliberately absent — this project ships when it is honest, not when a
              calendar says so. Follow the{' '}
              <Link href="/changelog" className="text-link underline underline-offset-2">
                changelog
              </Link>{' '}
              to see the actual pace.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="text-h4">Help build it</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Half of &quot;In progress&quot; and &quot;Planned&quot; is open for contribution —
              docs search, translations and gallery submissions are all beginner-friendly work.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Magnetic strength={0.3}>
                <Link href="/contribute" className="btn-primary">
                  Contribute <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href={`${siteConfig.github.url}/labels/good%20first%20issue`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Good first issues
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
