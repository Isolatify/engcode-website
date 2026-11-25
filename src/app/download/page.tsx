import type { Metadata } from 'next';
import Link from 'next/link';
import { DownloadOptions } from '@/components/download/DownloadOptions';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Download',
  description:
    'Download EngCode — npm, one-line terminal scripts for Windows, macOS and Linux, and the VS Code extension. Free and open source.',
};

export default function DownloadPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            v{siteConfig.latestRelease.version} · released {siteConfig.latestRelease.date}
          </p>
          <h1 className="text-h1 mt-3">Download EngCode</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            Free, open source and under 20 MB. Pick your system and start writing simple English
            in minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#install-options"
              className="btn-primary"
            >
              Install EngCode
            </a>
            <Link href="/docs/installation" className="btn-secondary">
              Installation docs
            </Link>
          </div>
        </div>
      </header>

      <DownloadOptions />

      {/* 3 steps */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="container-site py-14">
          <h2 className="text-h3">Install and run your first program</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: 'Step 1',
                title: 'Install',
                text: 'Choose one of the four options above. It takes under a minute.',
              },
              {
                step: 'Step 2',
                title: 'Create a project',
                text: 'engcode new hello scaffolds your first app with a runnable starter.',
              },
              {
                step: 'Step 3',
                title: 'Run it',
                text: 'engcode run hello.eng — you are coding in simple English.',
              },
            ].map((s) => (
              <li key={s.step} className="card p-6">
                <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{s.step}</span>
                <h3 className="text-h5 mt-1">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-muted">
            Full details on the{' '}
            <Link href="/docs/installation" className="text-link underline underline-offset-2">
              installation page
            </Link>
            , including system requirements and previous versions.
          </p>
        </div>
      </section>
    </>
  );
}
