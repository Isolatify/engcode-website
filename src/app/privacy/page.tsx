import type { Metadata } from 'next';
import Link from 'next/link';
import { Cookie, HardDrive, BarChart3, Share2, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'How the EngCode website handles your data — what is stored in your browser, the cookie-free analytics policy, third-party links and how to contact us.',
};

const STORAGE_ROWS = [
  {
    key: 'Theme preference',
    detail: 'Light or dark mode for this website.',
  },
  {
    key: 'Playground snippets',
    detail: 'Code you write or open in the playground, so it is still there when you come back.',
  },
  {
    key: 'Course progress',
    detail: 'Which of the 20 lessons you have ticked complete (key engcode-course-progress-v1).',
  },
] as const;

const SECTIONS: {
  icon: typeof HardDrive;
  h: string;
  p: string;
  list?: readonly string[];
}[] = [
  {
    icon: HardDrive,
    h: 'What we store, and where',
    p: 'This website has no accounts and no server-side profiles. The only things we keep about you live in your own browser’s localStorage, and you can erase them at any time by clearing site data — the site keeps working without them.',
    list: STORAGE_ROWS.map((r) => `${r.key} — ${r.detail}`),
  },
  {
    icon: Cookie,
    h: 'Cookies',
    p: 'No cookies are set by this website. No consent banner exists because there is nothing to consent to: no session cookies, no tracking pixels, no advertising identifiers.',
  },
  {
    icon: BarChart3,
    h: 'Analytics',
    p: 'If analytics are enabled, they are Plausible-style privacy-friendly analytics: cookie-free, aggregated, and used only to see which pages get read. No cross-site tracking, no fingerprinting, no data sold or shared for advertising. When no analytics domain is configured on a deployment, no analytics script is loaded at all — and that is the current state of this site.',
  },
  {
    icon: Share2,
    h: 'Third-party links',
    p: 'Pages link out to GitHub (source, issues, discussions, releases) and the VS Code Marketplace. Following those links takes you to their sites, which have their own privacy policies — we have no control over what they collect. We only use them because the project lives in the open.',
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Legal · Last updated November 12, 2026
          </p>
          <h1 className="text-h1 mt-3">Privacy policy</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            The short version: this site has no accounts, sets no cookies, and the little it
            remembers about you lives in your own browser — not on a server we control.
          </p>
        </div>
      </header>

      <div className="container-site max-w-3xl py-14 md:py-20">
        {/* TL;DR */}
        <Reveal>
          <div className="rounded-2xl border border-brand-400 bg-primary-soft p-6">
            <h2 className="text-h4 text-primary-soft-text">In one paragraph</h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-soft-text/90">
              We do not collect personal data, do not sell anything, and do not run advertising.
              Theme, playground and course-progress preferences are stored locally in your
              browser. Emails you choose to send us (via the support form) are used to answer you
              and nothing else. This policy will change if the site ever starts collecting
              something new — the date above will move with it.
            </p>
          </div>
        </Reveal>

        {/* Sections */}
        <div className="mt-10 space-y-8">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <Reveal key={section.h} delay={i * 0.06}>
                <section className="card p-6">
                  <h2 className="text-h4 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-text">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {section.h}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{section.p}</p>
                  {section.list && (
                    <ul className="mt-4 space-y-2.5 border-t border-border pt-4">
                      {section.list.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </Reveal>
            );
          })}

          {/* Your choices */}
          <Reveal delay={0.1}>
            <section className="card p-6">
              <h2 className="text-h4">Your choices</h2>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted">
                <li>
                  <strong className="text-text">Clear your data:</strong> clearing this
                  site&apos;s storage in your browser removes every preference we just listed.
                </li>
                <li>
                  <strong className="text-text">Block everything:</strong> local storage can be
                  disabled per site — the site still browses and reads fine; progress and snippets
                  simply won&apos;t persist.
                </li>
                <li>
                  <strong className="text-text">Ask us anything:</strong> email{' '}
                  <a
                    href="mailto:hello@engcode.dev"
                    className="text-link underline underline-offset-2"
                  >
                    hello@engcode.dev
                  </a>{' '}
                  for a copy of what we know about you — which, unless you&apos;ve emailed us, is
                  nothing.
                </li>
              </ul>
            </section>
          </Reveal>

          {/* Related */}
          <Reveal delay={0.14}>
            <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-border bg-bg-subtle p-6">
              <div>
                <h2 className="text-h4">Questions?</h2>
                <p className="mt-1.5 text-sm text-muted">
                  <Mail className="mr-1.5 inline h-4 w-4 text-subtle" aria-hidden="true" />
                  hello@engcode.dev · answered by a human, usually within a couple of days.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Magnetic strength={0.3}>
                  <Link href="/terms" className="btn-secondary">
                    Terms of use
                  </Link>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <Link href="/support" className="btn-primary">
                    Contact form
                  </Link>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-8 text-caption text-subtle">
          Related:{' '}
          <Link href="/terms" className="text-link underline underline-offset-2">
            terms
          </Link>
          ,{' '}
          <Link href="/license" className="text-link underline underline-offset-2">
            license
          </Link>
          ,{' '}
          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link underline underline-offset-2"
          >
            source on GitHub
          </a>
          .
        </Reveal>
      </div>
    </>
  );
}
