import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, GraduationCap, Unlock, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { GitHubMark } from '@/components/ui/GitHubMark';
import { StatsStrip } from '@/components/home/StatsStrip';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Why EngCode exists — the frustration behind a language that reads like English, the mission behind it, and where the project is open source.',
};

const MISSION = [
  {
    icon: Unlock,
    title: 'Free, forever',
    text: 'MIT licensed, no paid tier hiding the good parts. The compiler, the CLI, the templates, this website and the course all cost nothing — today and in five years.',
  },
  {
    icon: Sparkles,
    title: 'Open source in the open',
    text: 'Every line, every decision and every roadmap item is public on GitHub. Disagree with us in an issue and you can end up changing the language.',
  },
  {
    icon: GraduationCap,
    title: 'Friendly by default',
    text: 'Learn in an afternoon, ship real projects the same week. Errors, docs and lessons are all written for the person who has never written code before.',
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            About
          </p>
          <h1 className="text-h1 mt-3">
            Programming shouldn&apos;t require a <span className="text-gradient">second language</span>
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            EngCode started in a classroom, not a boardroom — out of watching capable people
            decide they weren&apos;t &quot;smart enough&quot; for code, when the real problem was
            the code.
          </p>
        </div>
      </header>

      {/* Story */}
      <section className="container-site py-14 md:py-20" aria-labelledby="story-heading">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <h2 id="story-heading" className="text-h2">
              The story
            </h2>
            <p className="mt-5 text-body-lg leading-relaxed text-muted">
              Teaching beginners, the same wall appeared every cohort. Not logic — translation.
              Someone would describe exactly what they wanted in a clear, complete sentence, then
              watch that sentence crumble the moment it had to become{' '}
              <code className="rounded border border-border bg-code-bg px-1.5">{'x = []'}</code>{' '}
              and <code className="rounded border border-border bg-code-bg px-1.5">{'if (n === 0)'}</code>.
              The idea was never the hard part.
            </p>
            <p className="mt-4 text-body-lg leading-relaxed text-muted">
              So we wrote the language the idea was already in. EngCode asks you to say what you
              mean — <code className="rounded border border-border bg-code-bg px-1.5">{'set total to 0'}</code>,{' '}
              <code className="rounded border border-border bg-code-bg px-1.5">{'otherwise'}</code>,{' '}
              <code className="rounded border border-border bg-code-bg px-1.5">{'when "button" is clicked'}</code>{' '}
              — and keeps every convention a real language needs underneath. Tables, functions,
              modules, three-layer apps: all of it is there. None of it is spelled with symbols
              you have to memorize first.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <blockquote className="card h-full p-6 md:p-8">
              <p className="font-heading text-xl font-semibold leading-snug text-text md:text-[1.4rem]">
                &quot;Every beginner who quit didn&apos;t fail at thinking. They hit a wall of
                translation we never told them about.&quot;
              </p>
              <footer className="mt-5 border-t border-border pt-4 text-sm text-muted">
                The sentence that started the project — and the reason every error message, lesson
                and doc page here is written in plain English.
              </footer>
              <Link
                href="/docs/introduction"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-link"
              >
                Read the introduction <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <StatsStrip />

      {/* Mission */}
      <section className="container-site py-14 md:py-20" aria-labelledby="mission-heading">
        <Reveal className="max-w-2xl">
          <h2 id="mission-heading" className="text-h2">
            The mission
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Make the first language anyone learns the one that doesn&apos;t need translating —
            learn in an afternoon, ship real projects by the weekend, and never pay for the
            privilege.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {MISSION.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="card card-hover h-full p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-h4 mt-4">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Open source */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
                Open source
              </p>
              <h2 className="text-h2 mt-3">Built in the open, on GitHub</h2>
              <p className="mt-4 text-body-lg leading-relaxed text-muted">
                The interpreter, the CLI, the templates, the VS Code extension, this website and
                the course all live in one repository under the MIT license. Issues, discussions
                and pull requests are how the language changes — a beginner&apos;s confusion counts
                as a bug report, and it&apos;s one we take seriously.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Magnetic strength={0.3}>
                  <a
                    href={siteConfig.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <GitHubMark className="h-4 w-4" aria-hidden="true" /> View on GitHub
                  </a>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <Link href="/contribute" className="btn-secondary">
                    <HeartHandshake className="h-4 w-4" aria-hidden="true" /> How to contribute
                  </Link>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <span className="font-mono text-sm font-semibold text-code-text">
                    Isolatify/engcode
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-surface px-2.5 py-0.5 text-caption font-medium text-success-text">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                    MIT licensed
                  </span>
                </div>
                <ul className="divide-y divide-border">
                  {[
                    { label: 'Star the repo', text: 'It is the cheapest way to say this matters.', href: `${siteConfig.github.url}/stargazers` },
                    { label: 'Report a bug', text: 'A wrong error message is a bug, not a user error.', href: `${siteConfig.github.url}/issues/new/choose` },
                    { label: 'Join the discussion', text: 'Ideas, questions and show-and-tell.', href: `${siteConfig.github.url}/discussions` },
                    { label: 'Read the license', text: 'What you may do with all of it.', href: '/license', internal: true },
                  ].map((row) => (
                    <li key={row.label}>
                      {row.internal ? (
                        <Link
                          href={row.href}
                          className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-bg-subtle"
                        >
                          <span>
                            <span className="block text-sm font-semibold text-text">{row.label}</span>
                            <span className="block text-caption text-muted">{row.text}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
                        </Link>
                      ) : (
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-bg-subtle"
                        >
                          <span>
                            <span className="block text-sm font-semibold text-text">{row.label}</span>
                            <span className="block text-caption text-muted">{row.text}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
