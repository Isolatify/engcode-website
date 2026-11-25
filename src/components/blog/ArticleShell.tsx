import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';

/**
 * Shared layout for the three blog articles: meta header, readable measure
 * and small prose helpers so every post typesets identically.
 * Server component — no 'use client' on purpose.
 */
export function ArticleShell({
  tag,
  title,
  lede,
  date,
  dateISO,
  readingTime,
  children,
}: {
  tag: string;
  title: string;
  lede: string;
  date: string;
  dateISO: string;
  readingTime: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site max-w-3xl py-14 md:py-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-link transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All posts
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            {tag}
          </p>
          <h1 className="text-h1 mt-3">{title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-subtle">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <time dateTime={dateISO}>{date}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {readingTime}
            </span>
          </div>
          <p className="mt-5 text-body-lg leading-relaxed text-muted">{lede}</p>
        </div>
      </header>

      <article className="container-site max-w-3xl py-12 md:py-16">{children}</article>
    </>
  );
}

/** Body paragraph in the shared article measure. */
export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-body-lg leading-relaxed text-muted">{children}</p>;
}

/** Section heading inside an article (h2 semantics, text-h3 sizing). */
export function H3({ children }: { children: ReactNode }) {
  return <h2 className="text-h3 mt-10">{children}</h2>;
}

/** Numbered step heading inside a tutorial article. */
export function Step({ children }: { children: ReactNode }) {
  return <h2 className="text-h3 mt-10 font-heading">{children}</h2>;
}

/** Standard article code block. */
export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-6 overflow-x-auto rounded-xl border border-border bg-code-bg p-5 font-mono text-sm leading-relaxed text-code-text">
      <code>{children}</code>
    </pre>
  );
}

/** Inline code in article body copy. */
export function C({ children }: { children: ReactNode }) {
  return <code className="rounded border border-border bg-code-bg px-1.5">{children}</code>;
}
