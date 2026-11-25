import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, BookOpen, Palette, GitPullRequest, ShieldAlert, RefreshCw } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';

export const metadata: Metadata = {
  title: 'Terms of use',
  description:
    'Terms for using the EngCode software and website — MIT license, attribution for content, brand rules, contributions and the no-warranty clause.',
};

const SECTIONS = [
  {
    icon: Scale,
    h: '1 · The software',
    p: 'The EngCode compiler, interpreter, CLI, project templates, VS Code extension and everything else in the repository is licensed under the MIT License. You may use it, copy it, modify it, distribute it and sell it, commercially or personally, without asking permission. The full text is on the license page.',
    link: { label: 'Read the MIT license', href: '/license' },
  },
  {
    icon: BookOpen,
    h: '2 · Website content',
    p: 'Docs, lessons, blog posts and example code on this site may be shared, quoted and reused — including commercially — as long as you attribute EngCode and link back to the site. Screenshots of the website used in press coverage need no permission at all.',
    link: { label: 'See attribution basics', href: '/brand' },
  },
  {
    icon: Palette,
    h: '3 · The brand',
    p: 'The name “EngCode” and the logo files are not covered by the MIT grant. Use the logos per the rules on the brand page: no recolouring, no stretching, no implying endorsement. Writing about the project, embedding the mark in article imagery, and referencing compatibility are all fine — pretending your product is us is not.',
    link: { label: 'Brand & press kit', href: '/brand' },
  },
  {
    icon: GitPullRequest,
    h: '4 · Contributions',
    p: 'Anything you submit — code, docs, examples, issue text — is contributed under the same MIT license, with the understanding that it may be modified or removed by maintainers. By contributing you confirm it is your own work or that you have the right to submit it under an MIT-compatible license.',
    link: { label: 'How to contribute', href: '/contribute' },
  },
  {
    icon: ShieldAlert,
    h: '5 · No warranty',
    p: 'The software and this website are provided “as is”, without warranty of any kind. We do not guarantee that anything is error-free, that your code will run unchanged forever, or that the project is fit for any particular purpose. Use it, learn from it, ship with it — but do not build anything safety-critical on it without your own testing.',
  },
  {
    icon: RefreshCw,
    h: '6 · Changes',
    p: 'These terms may be updated as the project evolves; the date at the top of this page always reflects the current version. Continuing to use the site after a change means you accept it — material changes will also be announced in GitHub Discussions.',
  },
] as const;

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Legal · Last updated November 12, 2026
          </p>
          <h1 className="text-h1 mt-3">Terms of use</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            Plain terms for a plain project: the software is MIT-licensed and yours to use, the
            brand has rules, and nobody warrants anything. Written to be read, not skimmed past.
          </p>
        </div>
      </header>

      <div className="container-site max-w-3xl py-14 md:py-20">
        <div className="space-y-6">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <Reveal key={section.h} delay={i * 0.05}>
                <section className="card p-6">
                  <h2 className="text-h4 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-text">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {section.h}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{section.p}</p>
                  {'link' in section && section.link && (
                    <Link
                      href={section.link.href}
                      className="mt-3 inline-block text-sm font-semibold text-link underline underline-offset-2"
                    >
                      {section.link.label}
                    </Link>
                  )}
                </section>
              </Reveal>
            );
          })}
        </div>

        {/* Summary card */}
        <Reveal delay={0.15} className="mt-8">
          <div className="rounded-2xl border border-brand-400 bg-primary-soft p-6">
            <h2 className="text-h4 text-primary-soft-text">The one-line version</h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-soft-text/90">
              Use the software for anything, credit the writing if you reuse it, follow the brand
              rules for the logo, and remember that all of it ships without a warranty.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Magnetic strength={0.3}>
                <Link href="/license" className="btn-primary">
                  Full license text
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href={`${siteConfig.github.url}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  LICENSE on GitHub
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-8 text-caption text-subtle">
          Questions about these terms:{' '}
          <a
            href="mailto:hello@engcode.dev"
            className="text-link underline underline-offset-2"
          >
            hello@engcode.dev
          </a>{' '}
          · see also the{' '}
          <Link href="/privacy" className="text-link underline underline-offset-2">
            privacy policy
          </Link>{' '}
          and the{' '}
          <Link href="/license" className="text-link underline underline-offset-2">
            license
          </Link>
          .
        </Reveal>
      </div>
    </>
  );
}
