import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'EngCode release notes, design writing and tutorials — how a programming language that reads like English gets built.',
};

const POSTS = [
  {
    slug: '/blog/engcode-1-0-0',
    tag: 'Release',
    title: 'EngCode 1.0.0 is here',
    excerpt:
      'Desktop apps that scaffold their own package.json, a VS Code file icon theme, an optional light/dark toggle in generated apps, and a CLI first run that actually tells you what to do next.',
    date: 'Nov 12, 2026',
    dateISO: '2026-11-12',
    readingTime: '4 min read',
    accent: true,
  },
  {
    slug: '/blog/why-engcode-reads-like-english',
    tag: 'Design',
    title: 'Why EngCode reads like English',
    excerpt:
      'Three rules shaped the language: words over symbols, one line you can read out loud, and errors written in the same voice. None of them are accidental.',
    date: 'Oct 28, 2026',
    dateISO: '2026-10-28',
    readingTime: '6 min read',
    accent: false,
  },
  {
    slug: '/blog/zero-to-desktop-app',
    tag: 'Tutorial',
    title: 'Zero to desktop app in four steps',
    excerpt:
      'Install the CLI, scaffold a window, read the three files EngCode generates, and run it. A full walkthrough from an empty folder to a desktop app on Windows or macOS.',
    date: 'Oct 10, 2026',
    dateISO: '2026-10-10',
    readingTime: '8 min read',
    accent: false,
  },
] as const;

export default function BlogPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Blog
          </p>
          <h1 className="text-h1 mt-3">Notes from the workshop</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            Release announcements, the thinking behind the language, and tutorials that end with
            something running on your machine.
          </p>
        </div>
      </header>

      {/* Post list */}
      <section className="container-site py-14 md:py-20" aria-label="Blog posts">
        <div className="grid gap-6">
          {POSTS.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <Link
                href={post.slug}
                className={`card card-hover group block p-6 md:p-8 ${
                  post.accent ? 'border-brand-400 shadow-[0_0_0_1px_var(--primary)]' : ''
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-caption font-semibold ${
                      post.accent ? 'bg-primary text-primary-text' : 'bg-surface-2 text-subtle'
                    }`}
                  >
                    {post.tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-caption text-subtle">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    <time dateTime={post.dateISO}>{post.date}</time>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-caption text-subtle">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {post.readingTime}
                  </span>
                </div>

                <h2 className="text-h3 mt-4">{post.title}</h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted">{post.excerpt}</p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-link">
                  Read the post
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.25} className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-bg-subtle p-6 md:p-8">
          <div>
            <h2 className="text-h4">Prefer a changelog?</h2>
            <p className="mt-1.5 max-w-md text-sm text-muted">
              Every release, every change, in one place — with links to the GitHub release notes.
            </p>
          </div>
          <Magnetic strength={0.3}>
            <Link href="/changelog" className="btn-secondary">
              View the changelog <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Magnetic>
        </Reveal>
      </section>
    </>
  );
}
