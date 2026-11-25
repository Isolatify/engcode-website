import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { docsGroups, docsHref } from '@/config/docs';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { DocsSidebar } from '@/components/docs/DocsSidebar';

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'The EngCode documentation — install the CLI, learn the language guide by guide, build websites and desktop apps, and look up every command in the reference.',
};

export default function DocsIndexPage() {
  return (
    <div className="container-site flex gap-12 py-12 lg:py-16">
      <DocsSidebar />

      <div className="min-w-0 flex-1">
        <header>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Documentation
          </p>
          <h1 className="text-h1 mt-3">
            Everything EngCode can do, <span className="text-gradient">in plain English</span>
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-muted">
            Start with a five-minute Quick Start, learn the language one statement at a time,
            build a website or desktop app, then keep the reference close.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <Link href="/docs/quick-start" className="btn-primary">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Start the Quick Start
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/playground" className="btn-secondary">
                Try the playground
              </Link>
            </Magnetic>
          </div>
        </header>

        <div className="mt-14 space-y-14">
          {docsGroups.map((group, gi) => (
            <section key={group.title} aria-labelledby={`group-${gi}`}>
              <Reveal>
                <h2 id={`group-${gi}`} className="text-h3">
                  {group.title}
                </h2>
              </Reveal>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {group.items.map((item, i) => (
                  <li key={item.slug}>
                    <Reveal delay={0.05 * (i % 2)}>
                      <Link
                        href={docsHref(item.slug)}
                        className="card card-hover group flex h-full flex-col p-5"
                      >
                        <span className="font-heading font-semibold text-text transition-colors group-hover:text-primary-soft-text">
                          {item.title}
                        </span>
                        <span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                          {item.description}
                        </span>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft-text opacity-0 transition-opacity group-hover:opacity-100">
                          Read
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
