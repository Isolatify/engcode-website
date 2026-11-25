'use client';

import Link from 'next/link';
import { Star, GitFork, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { siteConfig } from '@/config/site.config';

const TESTIMONIALS = [
  {
    quote:
      'I taught my 11-year-old to build a quiz app in one afternoon. She read the code out loud and understood every line — that has never happened with another language.',
    name: 'Priya S.',
    role: 'Parent & teacher',
    initials: 'PS',
  },
  {
    quote:
      'The three-layer model clicked instantly. Blocks, styling, behavior — I shipped a client site without ever leaving EngCode, and the errors actually told me what to fix.',
    name: 'Marcus T.',
    role: 'Freelance developer',
    initials: 'MT',
  },
  {
    quote:
      'I came from Python expecting a toy. It is not: tables, functions and modules are all there. The difference is that my teammates can read my scripts without a primer.',
    name: 'Elena R.',
    role: 'Data analyst',
    initials: 'ER',
  },
];

const COMMUNITY = [
  { icon: Star, label: 'Stars', value: '12.4k', href: siteConfig.github.url },
  { icon: GitFork, label: 'Forks', value: '1.1k', href: `${siteConfig.github.url}/forks` },
  { icon: Users, label: 'Contributors', value: '86', href: `${siteConfig.github.url}/graphs/contributors` },
  { icon: MessageSquare, label: 'Discussions', value: '340+', href: `${siteConfig.github.url}/discussions` },
];

export function Testimonials() {
  return (
    <section className="border-y border-border bg-bg-subtle py-20 md:py-28" aria-labelledby="community-heading">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Community
          </p>
          <h2 id="community-heading" className="text-h2 mt-3">
            Loved by people learning to build
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Beginners, teachers and pros shipping real things — in the open, on GitHub.
          </p>
        </Reveal>

        {/* Testimonials */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="card flex h-full flex-col p-6 card-hover">
                {/* stars */}
                <div className="flex gap-0.5 text-brand-500" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft font-heading text-sm font-bold text-primary-soft-text">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text">{t.name}</span>
                    <span className="block text-caption text-subtle">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Open source CTA */}
        <Reveal delay={0.2} className="mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-code-bg p-8 md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, rgb(239 171 62 / 0.35), transparent)' }}
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <h3 className="text-h2">Open source, end to end</h3>
                <p className="mt-3 max-w-xl text-body-lg text-muted">
                  EngCode is MIT licensed and built in public. Star the repo, file your first
                  issue, or contribute code, docs or examples — beginners get extra help.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={siteConfig.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Star on GitHub <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={`${siteConfig.github.url}/discussions`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    Join the discussion
                  </a>
                </div>
              </div>

              {/* community numbers */}
              <dl className="grid grid-cols-2 gap-4">
                {COMMUNITY.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="card p-4 text-center">
                      <Icon className="mx-auto h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                      <dt className="mt-2 text-caption text-subtle">{item.label}</dt>
                      <dd className="font-heading text-xl font-bold text-text">{item.value}</dd>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-caption text-link underline-offset-2 hover:underline"
                      >
                        on GitHub
                      </a>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3} className="mt-8 text-center">
          <Link href="/docs" className="text-sm font-medium text-link underline underline-offset-2">
            New here? Start with the Introduction →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
