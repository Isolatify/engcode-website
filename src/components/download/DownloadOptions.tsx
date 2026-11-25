'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Terminal,
  Globe,
  MonitorDown,
  Puzzle,
  Check,
  Copy,
  ExternalLink,
  Info,
} from 'lucide-react';

/** Brand marks lucide doesn't ship — drawn inline (simple geometric glyphs). */
function WindowsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 5.5 10.2 4.5v6.6H3V5.5Zm8.4-1.2L21 3v8.1h-9.6V4.3ZM3 12.9h7.2v6.6L3 18.5v-5.6Zm8.4 0H21V21l-9.6-1.3v-6.8Z" />
    </svg>
  );
}
function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.7 12.9c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.2-.9-2.2-3.4ZM14.4 6.2c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2Z" />
    </svg>
  );
}
import { siteConfig } from '@/config/site.config';
import { CopyButton } from '@/components/ui/CopyButton';
import { Reveal } from '@/components/ui/Reveal';

type Option = {
  key: string;
  title: string;
  platform: string;
  os: 'windows' | 'mac' | 'any';
  command: string;
  note: string;
  icon: typeof Terminal;
  external?: string;
};

const OPTIONS: Option[] = [
  {
    key: 'npm',
    title: 'EngCode CLI via npm',
    platform: 'Windows · macOS · Linux',
    os: 'any',
    command: 'npm install -g engcode',
    note: 'The universal option — requires Node.js 18+. Installs the latest CLI globally.',
    icon: Terminal,
  },
  {
    key: 'curl',
    title: 'EngCode CLI via curl',
    platform: 'macOS · Linux · Git Bash',
    os: 'mac',
    command: `curl ${siteConfig.url}/install/curl -fsS | bash`,
    note: 'Needs Node.js 20+. Installs the CLI from npm, then verifies engcode is on your PATH.',
    icon: Globe,
  },
  {
    key: 'irm',
    title: 'EngCode CLI via PowerShell',
    platform: 'Windows 10+',
    os: 'windows',
    command: `irm '${siteConfig.url}/install/irm' | iex`,
    note: 'Needs Node.js 20+. Installs the CLI from npm, then verifies engcode is on your PATH.',
    icon: MonitorDown,
  },
  {
    key: 'vscode',
    title: 'VS Code Extension',
    platform: 'Windows · macOS · Linux',
    os: 'any',
    command: 'code --install-extension engcode.engcode',
    note: 'Straight from the VS Code Marketplace. Syntax highlighting, the .eng icon theme, friendly errors and a Run button.',
    icon: Puzzle,
    external: siteConfig.vscodeExtension.marketplaceUrl,
  },
];

function detectOs(): 'windows' | 'mac' | 'other' {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'windows';
  if (/Mac|iPhone|iPad/i.test(ua)) return 'mac';
  return 'other';
}

export function DownloadOptions() {
  const [os, setOs] = useState<'windows' | 'mac' | 'other'>('other');
  const [active, setActive] = useState('npm');
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const detected = detectOs();
    setOs(detected);
    // Highlight the best option for this visitor
    if (detected === 'windows') setActive('irm');
    else if (detected === 'mac') setActive('curl');
    else setActive('npm');
  }, []);

  const option = OPTIONS.find((o) => o.key === active) ?? OPTIONS[0]!;
  const bestKey = os === 'windows' ? 'irm' : os === 'mac' ? 'curl' : 'npm';
  const OsIcon = os === 'windows' ? WindowsMark : os === 'mac' ? AppleMark : Info;

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
    <section className="container-site py-14 md:py-20" aria-labelledby="options-heading">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="options-heading" className="text-h2">
            Four ways to install
          </h2>
          <p className="mt-2 text-body-lg text-muted">
            {os === 'other'
              ? 'Pick the option that matches your system.'
              : `We detected ${os === 'windows' ? 'Windows' : 'macOS'} and highlighted the best fit.`}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
          <OsIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          {os === 'windows' ? 'Windows detected' : os === 'mac' ? 'macOS detected' : 'Select your OS below'}
        </span>
      </Reveal>

      {/* Option cards as tabs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Install options">
        {OPTIONS.map((o) => {
          const Icon = o.icon;
          const selected = active === o.key;
          const best = o.key === bestKey;
          return (
            <button
              key={o.key}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(o.key)}
              className={`card relative p-5 text-left transition-all ${
                selected
                  ? 'border-brand-400 shadow-[0_0_0_1px_var(--primary),0_12px_32px_-12px_rgb(239_171_62_/_0.5)]'
                  : 'hover:border-border-strong hover:-translate-y-0.5'
              }`}
            >
              {best && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-text">
                  Best for you
                </span>
              )}
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                  selected ? 'bg-primary text-primary-text' : 'bg-surface-2 text-muted'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-h5 mt-3">{o.title}</h3>
              <p className="mt-1 text-caption text-subtle">{o.platform}</p>
              {selected && (
                <motion.span
                  layoutId="dl-underline"
                  className="absolute inset-x-0 bottom-0 h-1 rounded-b-xl bg-brand-400"
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Command panel */}
      <Reveal delay={0.1} className="mt-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={option.key}
              initial={reduce ? undefined : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                <span className="text-sm font-semibold text-text">{option.title}</span>
                {option.external ? (
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={option.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-text transition-colors hover:bg-primary-hover"
                    >
                      Open Marketplace <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <CopyButton text={option.command} label="Copy install command" className="h-9 w-9 rounded-full border border-border" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={copy}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                      copied ? 'bg-success-surface text-success-text' : 'bg-primary text-primary-text hover:bg-primary-hover'
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
        </div>
      </Reveal>

      {/* Standalone binaries note — no .exe / .dmg installers exist yet */}
      <Reveal delay={0.15} className="mt-6">
        <div className="card flex items-start gap-4 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-primary-soft dark:text-primary-soft-text">
            <Check className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-heading font-semibold">Everything installs through one of the options above</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              EngCode currently ships as the npm package and the one-line scripts — there are no
              separate .exe or .dmg installers. Standalone binaries are on the{' '}
              <Link href="/roadmap" className="text-link underline underline-offset-2">roadmap</Link>.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Verification */}
      <Reveal delay={0.2} className="mt-10">
        <div className="card p-6">
          <h3 className="text-h4 flex items-center gap-2">
            <Check className="h-5 w-5 text-success" aria-hidden="true" />
            Verify your install
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-code-bg p-4">
              <p className="text-caption text-subtle">1 · Check the version</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <code className="font-mono text-sm text-code-text">engcode --version</code>
                <CopyButton text="engcode --version" label="Copy command" />
              </div>
              <p className="mt-2 text-caption text-subtle">
                Prints <strong className="text-text">v{siteConfig.latestRelease.version}</strong> when
                everything is set up.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-code-bg p-4">
              <p className="text-caption text-subtle">2 · Create a project</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <code className="font-mono text-sm text-code-text">engcode new hello</code>
                <CopyButton text="engcode new hello" label="Copy command" />
              </div>
              <p className="mt-2 text-caption text-subtle">Scaffolds a runnable starter app.</p>
            </div>
            <div className="rounded-xl border border-border bg-code-bg p-4">
              <p className="text-caption text-subtle">3 · Run it</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <code className="font-mono text-sm text-code-text">cd hello &amp;&amp; engcode run hello.eng</code>
                <CopyButton text="cd hello && engcode run hello.eng" label="Copy command" />
              </div>
              <p className="mt-2 text-caption text-subtle">You are coding in simple English.</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* First program mini guide */}
      <Reveal delay={0.25} className="mt-10">
        <div className="rounded-2xl border border-border bg-code-bg p-6 md:p-8">
          <h3 className="text-h3">Your first program</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Open <code className="rounded border border-border bg-surface px-1.5 py-0.5">hello.eng</code>{' '}
            in any editor (VS Code with the extension gets highlighting) and write:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface p-5 font-mono text-sm leading-relaxed text-code-text">
            <code>{`set name to "world"
say "Hello, " plus name plus "!"

repeat 3 times:
    say "EngCode is easy to learn."
end`}</code>
          </pre>
          <p className="mt-4 text-sm text-muted">
            Then run <code className="rounded border border-border bg-surface px-1.5 py-0.5">engcode run hello.eng</code>{' '}
            — or skip the install entirely and{' '}
            <Link href="/playground" className="text-link underline underline-offset-2">
              try it in the playground
            </Link>
            .
          </p>
        </div>
      </Reveal>
    </section>
  );
}
