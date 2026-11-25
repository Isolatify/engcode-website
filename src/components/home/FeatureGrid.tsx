'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  MessageSquareText,
  Terminal,
  Globe,
  AppWindow,
  Palette,
  BookOpen,
  Puzzle,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const FEATURES = [
  {
    icon: MessageSquareText,
    title: 'Plain-English syntax',
    text: 'set score to 10 reads exactly like it means. Every keyword is a word you already know — no braces, no semicolons, no symbol hunting.',
    accent: 'when the score is 10',
  },
  {
    icon: Terminal,
    title: 'Scripts & automation',
    text: 'Rename a folder, parse a file, hit an API on a schedule. The CLI runs anywhere Node.js runs, with one command to start.',
    accent: 'engcode run script.eng',
  },
  {
    icon: Globe,
    title: 'Websites',
    text: 'Blocks become markup, styling becomes CSS, behavior becomes JavaScript — you write all three in the same simple English.',
    accent: 'page "Home":\n    heading "…"',
  },
  {
    icon: AppWindow,
    title: 'Desktop apps',
    text: 'Ship native-feeling apps for Windows and macOS from one project. One template, one run command, both platforms.',
    accent: 'engcode app .',
  },
  {
    icon: Palette,
    title: 'Styling blocks',
    text: 'Describe look and feel in readable sentences — colors, spacing and layout that stay maintainable as your app grows.',
    accent: 'style "card":\n    padding is 16\nend',
  },
  {
    icon: BookOpen,
    title: 'Built-in standard library',
    text: 'Text, numbers, lists, tables, files, time and web requests are all included. Nothing to wire up before you build.',
    accent: 'read the file "notes.txt"',
  },
  {
    icon: Puzzle,
    title: 'VS Code extension',
    text: 'Syntax highlighting, the EngCode file icon theme, friendly errors and one-click run — straight from your editor.',
    accent: '.eng files light up',
  },
];

function SpotlightCard({ feature, index }: { feature: (typeof FEATURES)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const Icon = feature.icon;

  return (
    <Reveal delay={Math.min(index * 0.06, 0.3)} y={20}>
      <div
        ref={ref}
        onMouseMove={onMove}
        className="card group relative h-full overflow-hidden p-6 card-hover"
      >
        {/* cursor spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgb(239 171 62 / 0.14), transparent 65%)',
          }}
        />
        <div className="relative">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="text-h4 mt-4">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
          <code className="mt-4 inline-block rounded-md border border-border bg-code-bg px-2.5 py-1 text-caption text-code-text">
            {feature.accent}
          </code>
        </div>
      </div>
    </Reveal>
  );
}

export function FeatureGrid() {
  return (
    <section className="container-site py-20 md:py-28" aria-labelledby="features-heading">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
          Features
        </p>
        <h2 id="features-heading" className="text-h2 mt-3">
          One language, everything you build
        </h2>
        <p className="mt-4 text-body-lg text-muted">
          From your first line to a shipped app — the same plain English carries you the whole way.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <SpotlightCard key={feature.title} feature={feature} index={i} />
        ))}
        {/* 7th card spans to keep the grid balanced */}
        <Reveal delay={0.36} y={20} className="lg:col-span-3">
          <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="text-h4">And the whole thing is open source</h3>
              <p className="mt-1.5 text-sm text-muted">
                MIT licensed, built in public, welcoming to first-time contributors. Read the code,
                file an issue, or ship your first pull request this week.
              </p>
            </div>
            <a
              href="https://github.com/Isolatify/engcode"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary shrink-0"
            >
              Explore on GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
