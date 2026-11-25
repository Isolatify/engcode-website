'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, Copy, ExternalLink, Terminal, Download } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { CopyButton } from '@/components/ui/CopyButton';
import { siteConfig } from '@/config/site.config';

type Option = {
  key: string;
  label: string;
  os: string;
  command: string;
  note: string;
  external?: string;
};

const OPTIONS: Option[] = [
  {
    key: 'npm',
    label: 'npm',
    os: 'Any OS with Node.js',
    command: 'npm install -g engcode',
    note: 'Fastest path if you already use Node.js. Works on Windows, macOS and Linux.',
  },
  {
    key: 'curl',
    label: 'curl',
    os: 'macOS · Linux',
    command: `curl ${siteConfig.url}/install/curl -fsS | bash`,
    note: 'One line in your terminal. Installs the latest binary to ~/.engcode/bin.',
  },
  {
    key: 'irm',
    label: 'PowerShell',
    os: 'Windows',
    command: `irm '${siteConfig.url}/install/irm' | iex`,
    note: 'Windows PowerShell or PowerShell 7 — needs Node.js 20+.',
  },
  {
    key: 'vscode',
    label: 'VS Code',
    os: 'Editor extension',
    command: 'code --install-extension engcode.engcode',
    note: 'Straight from the VS Code Marketplace. Syntax highlighting, the .eng icon theme and a Run button for your files.',
    external: siteConfig.vscodeExtension.marketplaceUrl,
  },
];

function detectOs(): string {
  if (typeof navigator === 'undefined') return 'npm';
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'irm';
  if (/Mac/i.test(ua)) return 'curl';
  return 'npm';
}

export function InstallTabs() {
  const [active, setActive] = useState('npm');
  // OS suggestion is detected after mount so server and client render match
  const [suggested, setSuggested] = useState('');
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();

  // Highlight the best option for this visitor's OS
  useEffect(() => {
    const detected = detectOs();
    setSuggested(detected);
    setActive(detected);
  }, []);

  const option = OPTIONS.find((o) => o.key === active) ?? OPTIONS[0]!;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(option.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt('Copy:', option.command);
    }
  };

  return (
    <section className="border-y border-border bg-bg-subtle py-20 md:py-28" aria-labelledby="install-heading">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Install
          </p>
          <h2 id="install-heading" className="text-h2 mt-3">
            Pick your way in
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Four options, all official. We highlighted the one that fits your system.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Install options">
            {OPTIONS.map((o) => (
              <button
                key={o.key}
                role="tab"
                aria-selected={active === o.key}
                onClick={() => setActive(o.key)}
                className={`relative rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                  active === o.key
                    ? 'border-brand-400 bg-primary text-primary-text shadow-sm'
                    : 'border-border bg-surface text-muted hover:border-border-strong hover:text-text'
                }`}
              >
                {o.label}
                {o.key === suggested && active !== o.key && (
                  <span className="ml-1.5 text-[10px] uppercase tracking-wide opacity-70">you</span>
                )}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={option.key}
                initial={reduce ? undefined : { opacity: 0, y: 10 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                  <span className="flex items-center gap-2 text-sm font-medium text-text">
                    <Terminal className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                    {option.label}
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-caption text-subtle">
                      {option.os}
                    </span>
                  </span>
                  {option.external ? (
                    <a
                      href={option.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-text transition-colors hover:bg-primary-hover"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" /> Install extension
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={copy}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                        copied
                          ? 'bg-success-surface text-success-text'
                          : 'bg-primary text-primary-text hover:bg-primary-hover'
                      }`}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>

                <div className="bg-code-bg px-5 py-5">
                  <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-code-text">
                    <code>{option.command}</code>
                  </pre>
                </div>

                <p className="px-5 py-4 text-sm leading-relaxed text-muted">{option.note}</p>
              </motion.div>
            </AnimatePresence>

            {/* verify strip */}
            <div className="flex flex-wrap items-center gap-3 border-t border-border bg-surface px-5 py-4 text-sm text-muted">
              <Check className="h-4 w-4 text-success" aria-hidden="true" />
              Verify with{' '}
              <code className="rounded border border-border bg-code-bg px-2 py-0.5 text-[13px] text-code-text">
                engcode --version
              </code>
              <span className="text-subtle">→ v{siteConfig.latestRelease.version}</span>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-muted">
            New to terminals?{' '}
            <Link href="/docs/installation" className="text-link underline underline-offset-2">
              The installation docs walk through every step
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// detectOsSafe is no longer needed — see `suggested` state above
