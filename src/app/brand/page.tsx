import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Download, X } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { SwatchGrid } from '@/components/brand/SwatchGrid';

export const metadata: Metadata = {
  title: 'Brand & press kit',
  description:
    'Official EngCode logos, colour palette, typography and usage rules — everything you need to write about or present the project.',
};

const LOGOS = [
  { file: 'logo.png', label: 'Primary logo', note: 'Amber mark + wordmark · light backgrounds', dark: false },
  { file: 'logo-color.png', label: 'Colour logo', note: 'Full-colour lockup for marketing use', dark: false },
  { file: 'logo-white.png', label: 'White logo', note: 'For dark or photographic backgrounds', dark: true },
  { file: 'logo-black.png', label: 'Black logo', note: 'One-colour print and fax-grade surfaces', dark: false },
  { file: 'logo-small.png', label: 'Small mark', note: 'Favicons, avatars and tight spaces', dark: false },
] as const;

const TYPE = [
  { role: 'Headings', font: 'Plus Jakarta Sans', sample: 'Build with Simple English', classes: 'font-heading font-extrabold text-h3', note: 'Tight tracking, weights 600–800' },
  { role: 'Body', font: 'Inter', sample: 'EngCode is a programming language written in plain English.', classes: 'text-body-lg', note: 'Weights 400–600, generous line height' },
  { role: 'Code', font: 'JetBrains Mono', sample: 'say "Hello, world!"', classes: 'font-mono text-lg', note: 'Every code block and inline snippet' },
] as const;

const DOS = [
  'Give logos clear space equal to the height of the amber mark on all sides.',
  'Use the white logo on dark or busy backgrounds, the black logo on light ones.',
  'Keep the amber #EFAB3E unaltered — no recolouring, outlines or drop shadows.',
  'Link back to engcode.dev or the GitHub repository when you publish.',
];

const DONTS = [
  'Stretch, rotate, crop or rearrange the mark and wordmark.',
  'Recolour the logo to anything outside the palette on this page.',
  'Place the amber logo on a competing amber or mid-tone background.',
  'Imply the project is endorsed by or affiliated with your product without asking.',
];

export default function BrandPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Press kit
          </p>
          <h1 className="text-h1 mt-3">Brand & assets</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            Everything needed to write about EngCode: official logos, the exact palette, the real
            fonts and the rules that keep the mark recognizable. Free to use with attribution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <a href="/brand/logo.png" download className="btn-primary">
                <Download className="h-4 w-4" aria-hidden="true" /> Download primary logo
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a href="/brand/design.md" download className="btn-secondary">
                <Download className="h-4 w-4" aria-hidden="true" /> design.md (design system)
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/about" className="btn-secondary">
                About the project
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Logos */}
      <section className="container-site py-14 md:py-20" aria-labelledby="logos-heading">
        <Reveal>
          <h2 id="logos-heading" className="text-h2">
            Logos
          </h2>
          <p className="mt-3 max-w-2xl text-body-lg text-muted">
            Five files cover every case. Click a card to download the PNG at full resolution.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOGOS.map((logo, i) => (
            <Reveal key={logo.file} delay={(i % 3) * 0.08}>
              <div className="card card-hover flex h-full flex-col overflow-hidden">
                <div
                  className={`flex h-36 items-center justify-center p-6 ${
                    logo.dark ? 'bg-[#141312]' : 'bg-[#FAF9F6] dark:bg-surface-2'
                  }`}
                >
                  <Image
                    src={`/brand/${logo.file}`}
                    alt={`EngCode ${logo.label}`}
                    width={240}
                    height={96}
                    className="h-20 w-auto object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col border-t border-border p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-h5">{logo.label}</h3>
                    <code className="font-mono text-caption text-subtle">{logo.file}</code>
                  </div>
                  <p className="mt-1 flex-1 text-caption text-muted">{logo.note}</p>
                  <a
                    href={`/brand/${logo.file}`}
                    download
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-link"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" /> Download PNG
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Colours */}
      <section
        className="border-t border-border bg-bg-subtle py-14 md:py-20"
        aria-labelledby="colors-heading"
      >
        <div className="container-site">
          <Reveal>
            <h2 id="colors-heading" className="text-h2">
              Colour
            </h2>
            <p className="mt-3 max-w-2xl text-body-lg text-muted">
              Four values, no more. Click any swatch to copy its hex code.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <SwatchGrid />
          </Reveal>
        </div>
      </section>

      {/* Typography */}
      <section className="container-site py-14 md:py-20" aria-labelledby="type-heading">
        <Reveal>
          <h2 id="type-heading" className="text-h2">
            Typography
          </h2>
          <p className="mt-3 max-w-2xl text-body-lg text-muted">
            The same three typefaces this website is built with. Use the system fonts listed
            below rather than approximations.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6">
          {TYPE.map((t, i) => (
            <Reveal key={t.role} delay={i * 0.08}>
              <div className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
                  <span className="text-sm font-semibold text-text">{t.role}</span>
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-caption text-subtle">
                    {t.font}
                  </span>
                </div>
                <div className="px-5 py-6">
                  <p className={`${t.classes} text-text`}>{t.sample}</p>
                  <p className="mt-3 text-caption text-subtle">{t.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Usage rules */}
      <section
        className="border-t border-border bg-bg-subtle py-14 md:py-20"
        aria-labelledby="rules-heading"
      >
        <div className="container-site">
          <Reveal>
            <h2 id="rules-heading" className="text-h2">
              Usage rules
            </h2>
            <p className="mt-3 max-w-2xl text-body-lg text-muted">
              Short version: don&apos;t transform the logo, and don&apos;t present your work as
              official EngCode. Everything else is fair game.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="card h-full p-6">
                <h3 className="text-h4 flex items-center gap-2 text-success-text">
                  <Check className="h-5 w-5" aria-hidden="true" /> Do
                </h3>
                <ul className="mt-4 space-y-3">
                  {DOS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card h-full p-6">
                <h3 className="text-h4 flex items-center gap-2 text-error-text">
                  <X className="h-5 w-5" aria-hidden="true" /> Don&apos;t
                </h3>
                <ul className="mt-4 space-y-3">
                  {DONTS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-surface p-6">
            <div>
              <h3 className="text-h4">Need something else?</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Vectors, different lockups or an endorsement check — ask before you invent one.
                We answer in GitHub Discussions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Magnetic strength={0.3}>
                <a
                  href={`${siteConfig.github.url}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Request assets <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link href="/terms" className="btn-secondary">
                  Terms of use
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
