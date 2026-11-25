'use client';

import Link from 'next/link';
import { PenLine, Play, Rocket } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const STEPS = [
  {
    icon: PenLine,
    title: 'Write',
    text: 'Open any editor — VS Code with our extension is the cozy choice — and type plain English into a .eng file.',
    code: 'set greeting to "Hello!"',
  },
  {
    icon: Play,
    title: 'Run',
    text: 'One command runs your program. Scripts print output, websites open in a browser, apps open a window.',
    code: 'engcode run hello.eng',
  },
  {
    icon: Rocket,
    title: 'Ship',
    text: 'Package for Windows or macOS, or publish the website. The same project builds everywhere.',
    code: 'engcode build --release',
  },
];

export function HowItWorks() {
  return (
    <section className="container-site py-20 md:py-28" aria-labelledby="how-heading">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
          How it works
        </p>
        <h2 id="how-heading" className="text-h2 mt-3">
          Write → run → ship
        </h2>
        <p className="mt-4 text-body-lg text-muted">
          Three steps, no hidden ones. The whole workflow fits on one line.
        </p>
      </Reveal>

      <ol className="mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal as="li" key={step.title} delay={i * 0.12} className="relative">
              {/* connector line */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-4 top-10 hidden h-0.5 w-8 bg-gradient-to-r from-brand-400 to-border md:block"
                />
              )}
              <div className="card h-full p-6 card-hover">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-text">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-sm text-subtle">step {i + 1}</span>
                </div>
                <h3 className="text-h3 mt-4">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                <code className="mt-4 block overflow-x-auto rounded-md border border-border bg-code-bg px-3 py-2 text-[13px] text-code-text">
                  {step.code}
                </code>
              </div>
            </Reveal>
          );
        })}
      </ol>

      <Reveal delay={0.3} className="mt-10 text-center">
        <Link href="/docs/quick-start" className="btn-primary">
          Follow the Quick Start
        </Link>
      </Reveal>
    </section>
  );
}
