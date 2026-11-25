'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import { HeroCodeWindow } from './HeroCodeWindow';
import { CopyButton } from '@/components/ui/CopyButton';
import { Magnetic } from '@/components/ui/Magnetic';
import { KineticText } from '@/components/ui/KineticText';
import { DotField } from '@/components/ui/DotField';
import { siteConfig } from '@/config/site.config';

const INSTALL_CMD = 'npm install -g engcode';

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden">
      {/* animated grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, color-mix(in srgb, var(--text) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--text) 7%, transparent) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(75% 60% at 50% 30%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(75% 60% at 50% 30%, black 30%, transparent 100%)',
        }}
      />
      {/* interactive dot field — dots glow around the cursor */}
      <DotField className="absolute inset-0 -z-10" radius={150} />

      {/* gradient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[540px] w-[880px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgb(239 171 62 / 0.30), rgb(239 171 62 / 0.08) 60%, transparent)',
        }}
        animate={reduce ? undefined : { opacity: [0.75, 1, 0.75], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container-site grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy column */}
        <div>
          <motion.p
            {...fade(0)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted shadow-xs"
          >
            <span className="h-2 w-2 rounded-full bg-brand-400" aria-hidden="true" />
            Free &amp; open source · v{siteConfig.latestRelease.version}
          </motion.p>

          <motion.h1 {...fade(0.08)} className="text-display mt-7">
            <KineticText text="Build with" /> <KineticText text="Simple English" delay={0.25} gradient />
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-xl text-body-lg leading-relaxed text-muted">
            EngCode is a programming language that reads like the language you already speak.
            Write scripts, websites and desktop apps for Windows and macOS — no confusing
            symbols, no years of study.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.3}>
              <Link href="/docs/quick-start" className="btn-primary">
                Get Started <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/playground" className="btn-secondary">
                Try the Playground
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href={siteConfig.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-base font-medium text-muted transition-colors hover:text-text"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
                </svg>
                Star on GitHub
              </a>
            </Magnetic>
          </motion.div>

          {/* Install command */}
          <motion.div {...fade(0.32)} className="mt-8 max-w-md">
            <div className="flex items-center gap-2 rounded-full border border-border bg-code-bg p-1.5 pl-4 shadow-sm">
              <Terminal className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
              <code className="flex-1 truncate py-2 text-left text-sm text-code-text">{INSTALL_CMD}</code>
              <CopyButton
                text={INSTALL_CMD}
                label="Copy install command"
                className="h-9 w-9 shrink-0 rounded-full bg-primary text-primary-text hover:bg-primary-hover hover:text-primary-text"
              />
            </div>
            <p className="mt-2 text-caption text-subtle">
              or try it instantly in the{' '}
              <Link href="/playground" className="text-link underline underline-offset-2">
                playground
              </Link>{' '}
              — nothing to install.
            </p>
          </motion.div>
        </div>

        {/* Code window column */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 30, scale: 0.98 },
                animate: { opacity: 1, y: 0, scale: 1 },
                transition: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
              })}
        >
          <HeroCodeWindow />
        </motion.div>
      </div>
    </section>
  );
}
