import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Bug,
  BookOpen,
  Share2,
  Code2,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { GitHubMark } from '@/components/ui/GitHubMark';

export const metadata: Metadata = {
  title: 'Contribute',
  description:
    'Four ways to help EngCode — report a bug, improve the docs, share an example or write code. Good first issues, dev setup and pull request workflow.',
};

const WAYS = [
  {
    icon: Bug,
    title: 'Report a bug',
    text: 'Wrong error message, unexpected crash, docs that are simply untrue — all of it counts. The bug template asks for your OS, version and the smallest example that reproduces it.',
    cta: 'Open a bug report',
    href: `${siteConfig.github.url}/issues/new/choose`,
    external: true,
  },
  {
    icon: BookOpen,
    title: 'Improve the docs',
    text: 'Found a paragraph you had to read twice? Rewrite it. Docs pull requests don’t need programming — they need someone who remembers being confused.',
    cta: 'Browse the docs',
    href: '/docs',
    external: false,
  },
  {
    icon: Share2,
    title: 'Share an example',
    text: 'A finished project with one clear idea is the most valuable thing a beginner can find. Add it to the gallery with a short README saying what it teaches.',
    cta: 'See the gallery',
    href: '/examples',
    external: false,
  },
  {
    icon: Code2,
    title: 'Write code',
    text: 'Language fixes, CLI ergonomics, the VS Code extension, this website. Start with a good first issue — they’re scoped to be finishable in one sitting.',
    cta: 'Good first issues',
    href: `${siteConfig.github.url}/labels/good%20first%20issue`,
    external: true,
  },
] as const;

const SETUP = [
  {
    step: 'Step 1',
    title: 'Fork the repository',
    text: 'Open the repo on GitHub and press Fork. This gives you a copy you can push to freely.',
    code: `${siteConfig.github.url}`,
  },
  {
    step: 'Step 2',
    title: 'Clone your fork and install',
    text: 'Clone it locally, then install the development dependencies.',
    code: `git clone https://github.com/<you>/engcode.git
cd engcode
npm install`,
  },
  {
    step: 'Step 3',
    title: 'Run the tests',
    text: 'Everything green before you start? Now your changes have a baseline to be measured against.',
    code: `npm test`,
  },
  {
    step: 'Step 4',
    title: 'Create a branch',
    text: 'One branch per change, named after what it does.',
    code: `git checkout -b fix/error-line-numbers`,
  },
  {
    step: 'Step 5',
    title: 'Open a pull request',
    text: 'Push your branch and open a PR against main. Say what changed and why — if it fixes an issue, reference it so the thread links up.',
    code: `git push -u origin fix/error-line-numbers`,
  },
] as const;

export default function ContributePage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Contribute
          </p>
          <h1 className="text-h1 mt-3">Help build EngCode</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            The project is open source and the work is real — from a one-line typo fix to a
            language feature. Most contributions need no programming experience at all.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.35}>
              <a
                href={`${siteConfig.github.url}/labels/good%20first%20issue`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Good first issues <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a href="#setup" className="btn-secondary">
                Developer setup
              </a>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Ways to help */}
      <section className="container-site py-14 md:py-20" aria-labelledby="ways-heading">
        <Reveal>
          <h2 id="ways-heading" className="text-h2">
            Four ways to help
          </h2>
          <p className="mt-3 max-w-2xl text-body-lg text-muted">
            Pick the one that matches your week. Every one of them ships in the next release.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {WAYS.map((way, i) => {
            const Icon = way.icon;
            const inner = (
              <>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-h4 mt-4">{way.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{way.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-link">
                  {way.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </>
            );
            return (
              <Reveal key={way.title} delay={i * 0.08}>
                {way.external ? (
                  <a
                    href={way.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card card-hover flex h-full flex-col p-6"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={way.href} className="card card-hover flex h-full flex-col p-6">
                    {inner}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>

        {/* Good first issues band */}
        <Reveal delay={0.2} className="mt-10">
          <div className="rounded-2xl border border-brand-400 bg-primary-soft p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <h2 className="text-h4 text-primary-soft-text">
                  Issues labelled “good first issue”
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-soft-text/85">
                  Small, self-contained tasks with context written out — someone has already
                  thought about where the change goes. If you get stuck, ask in the issue thread
                  and a maintainer will unblock you.
                </p>
              </div>
              <Magnetic strength={0.35}>
                <a
                  href={`${siteConfig.github.url}/labels/good%20first%20issue`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <GitHubMark className="h-4 w-4" aria-hidden="true" /> Pick an issue
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Dev setup */}
      <section
        id="setup"
        className="scroll-mt-20 border-t border-border bg-bg-subtle py-14 md:py-20"
        aria-labelledby="setup-heading"
      >
        <div className="container-site">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
              Developer setup
            </p>
            <h2 id="setup-heading" className="text-h2 mt-3">
              From fork to pull request
            </h2>
            <p className="mt-3 max-w-2xl text-body-lg text-muted">
              Node.js 18+ and git are the only prerequisites. The whole loop is five steps.
            </p>
          </Reveal>

          <ol className="mt-10 space-y-5">
            {SETUP.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 0.06}>
                <div className="card overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5 md:px-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-caption font-bold text-primary-text">
                        {i + 1}
                      </span>
                      <div>
                        <span className="block text-caption font-semibold uppercase tracking-wider text-subtle">
                          {s.step}
                        </span>
                        <span className="block font-heading text-[15px] font-semibold">{s.title}</span>
                      </div>
                    </div>
                    <GitBranch className="h-4 w-4 text-subtle" aria-hidden="true" />
                  </div>
                  <div className="grid gap-4 px-5 py-4 md:grid-cols-2 md:items-center md:px-6">
                    <p className="text-sm leading-relaxed text-muted">{s.text}</p>
                    <pre className="overflow-x-auto rounded-xl border border-border bg-code-bg p-4 font-mono text-sm leading-relaxed text-code-text">
                      <code>{s.code}</code>
                    </pre>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-surface p-6">
            <div className="flex-1">
              <h3 className="text-h4">Before you push</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Keep pull requests small, describe the “why” as well as the “what”, and follow the{' '}
                <Link href="/community#code-of-conduct" className="text-link underline underline-offset-2">
                  code of conduct
                </Link>
                . Docs and examples get the same review care as compiler code.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Magnetic strength={0.3}>
                <a
                  href={`${siteConfig.github.url}/pulls`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Open pull requests
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link href="/community" className="btn-secondary">
                  Community channels
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
