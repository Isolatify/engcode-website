'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { CopyButton } from '@/components/ui/CopyButton';
import { Magnetic } from '@/components/ui/Magnetic';
import { DotField } from '@/components/ui/DotField';
import { KineticText } from '@/components/ui/KineticText';

const INSTALL_CMD = 'npm install -g engcode';

export function FinalCta() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-border" aria-labelledby="cta-heading">
      {/* background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 100% at 50% 0%, rgb(239 171 62 / 0.16), transparent 70%)',
        }}
      />
      {/* interactive dots that light up around the cursor */}
      <DotField className="absolute inset-0 -z-10" radius={140} baseAlpha={0.1} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, color-mix(in srgb, var(--text) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--text) 6%, transparent) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(60% 70% at 50% 40%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(60% 70% at 50% 40%, black 20%, transparent 100%)',
        }}
      />

      <div className="container-site py-24 text-center md:py-32">
        <Reveal>
          <motion.div
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-text shadow-[0_16px_48px_-12px_rgb(239_171_62_/_0.6)]"
          >
            <Terminal className="h-8 w-8" aria-hidden="true" />
          </motion.div>

          <h2 id="cta-heading" className="text-display mx-auto mt-8 max-w-3xl">
            Your first program is{' '}
            <span className="text-gradient">
              <KineticText text="one sentence" hoverPlay={false} />
            </span>{' '}
            away
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-body-lg text-muted">
            Install EngCode, open the playground, or read a page of docs. Whichever door you
            pick, you will be building in minutes.
          </p>

          <div className="mx-auto mt-8 max-w-md">
            <div className="flex items-center gap-2 rounded-full border border-border bg-code-bg p-1.5 pl-4 shadow-sm">
              <code className="flex-1 truncate py-2 text-left text-sm text-code-text">{INSTALL_CMD}</code>
              <CopyButton
                text={INSTALL_CMD}
                label="Copy install command"
                className="h-9 w-9 shrink-0 rounded-full bg-primary text-primary-text hover:bg-primary-hover hover:text-primary-text"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
            <Magnetic strength={0.3}>
              <Link href="/download" className="btn-secondary">
                Download options
              </Link>
            </Magnetic>
          </div>

          <p className="mt-6 text-sm text-subtle">
            Free forever · MIT licensed ·{' '}
            <a
              href="https://github.com/Isolatify/engcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline underline-offset-2"
            >
              github.com/Isolatify/engcode
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
