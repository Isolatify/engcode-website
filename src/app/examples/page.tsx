import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { GitHubMark } from '@/components/ui/GitHubMark';
import { ExamplesGallery } from '@/components/examples/ExamplesGallery';

export const metadata: Metadata = {
  title: 'Examples',
  description:
    'A gallery of real EngCode projects — calculator, to-do list, portfolio site, weather app, Snake, file renamer and more — each openable in the playground.',
};

export default function ExamplesPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Examples
          </p>
          <h1 className="text-h1 mt-3">Real projects, real code</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            Not snippets — finished things you can open, read end to end, break on purpose and
            rebuild better. Every card drops you straight into the playground.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <a href="#gallery" className="btn-primary">
                Browse the gallery <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/learn" className="btn-secondary">
                Learn the language first
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      <div id="gallery" className="scroll-mt-20">
        <ExamplesGallery />
      </div>

      {/* Contribute your own */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-surface p-6 md:p-8">
            <div>
              <h2 className="text-h4">Built something? Put it in the gallery.</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                A two-file example that teaches one idea is worth more than a sprawling project.
                Share it with a pull request — new examples ship with every release.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Magnetic strength={0.3}>
                <Link href="/contribute" className="btn-primary">
                  Share an example <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href={`${siteConfig.github.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <GitHubMark className="h-4 w-4" aria-hidden="true" /> GitHub
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
