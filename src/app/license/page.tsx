import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ExternalLink, Scale } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';

export const metadata: Metadata = {
  title: 'License',
  description:
    'EngCode is MIT licensed. The full license text, what that permission means in practice, and where to find LICENSE in the repository.',
};

const MIT_TEXT = `MIT License

Copyright (c) 2026 Isolatify

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

const PERMISSIONS = [
  'Commercial use — ship it, sell it, bundle it.',
  'Modification — change it however you like.',
  'Distribution — share copies freely.',
  'Private use — use it internally with no obligations beyond the notice.',
];

export default function LicensePage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Legal · MIT license
          </p>
          <h1 className="text-h1 mt-3">License</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            EngCode is free software under the MIT license — the short, human-readable license
            used by most of the open-source world. Use it, change it, ship it. Keep the copyright
            notice and you have nothing else to do.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <a
                href={`${siteConfig.github.url}/blob/main/LICENSE`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                LICENSE on GitHub <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/terms" className="btn-secondary">
                Terms of use
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      <div className="container-site max-w-3xl py-14 md:py-20">
        {/* Plain-language summary */}
        <Reveal>
          <div className="card p-6">
            <h2 className="text-h4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              What the MIT license means in practice
            </h2>
            <ul className="mt-4 space-y-2.5">
              {PERMISSIONS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted">
              In return: the copyright and permission notices stay with the code, and the software
              comes with no warranty — see the full text below. The project name and logo are{' '}
              <Link href="/brand" className="text-link underline underline-offset-2">
                not
              </Link>{' '}
              covered by this license.
            </p>
          </div>
        </Reveal>

        {/* Full text */}
        <Reveal delay={0.1} className="mt-8">
          <h2 className="text-h3">The full text</h2>
          <p className="mt-2 text-sm text-muted">
            Identical to <code className="rounded border border-border bg-code-bg px-1.5">LICENSE</code>{' '}
            in the root of the repository.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-code-bg p-5 font-mono text-sm leading-relaxed text-code-text">
            <code>{MIT_TEXT}</code>
          </pre>
        </Reveal>

        {/* Covered components */}
        <Reveal delay={0.15} className="mt-8">
          <div className="card p-6">
            <h2 className="text-h4">What this covers</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-text">Under this license</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted">
                  <li>Interpreter, compiler and CLI</li>
                  <li>Project templates and examples</li>
                  <li>VS Code extension</li>
                  <li>This website and the course</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Not under this license</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted">
                  <li>The EngCode name and logo — see the brand kit</li>
                  <li>Trademarks and press imagery</li>
                  <li>Other people&apos;s work linked from this site</li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
          <Magnetic strength={0.3}>
            <a
              href={`${siteConfig.github.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Source on GitHub
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link href="/contribute" className="btn-secondary">
              Contribute under this license
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </>
  );
}
