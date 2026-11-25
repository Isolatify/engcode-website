'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Gamepad2, AppWindow, Globe, Wrench, Sparkles } from 'lucide-react';

type Category = 'Games' | 'Apps' | 'Websites' | 'Tools';

type Example = {
  name: string;
  category: Category;
  level: 'Beginner' | 'Intermediate';
  blurb: string;
  tags: string[];
  icon: typeof Gamepad2;
};

const CATEGORIES = ['All', 'Games', 'Apps', 'Websites', 'Tools'] as const;
type Filter = (typeof CATEGORIES)[number];

const EXAMPLES: Example[] = [
  {
    name: 'Calculator',
    category: 'Apps',
    level: 'Beginner',
    blurb: 'A desktop calculator with keyboard input — buttons, a display and clean arithmetic. The classic first app, finished.',
    tags: ['Desktop window', 'Conditions', 'Functions'],
    icon: AppWindow,
  },
  {
    name: 'To-do list',
    category: 'Apps',
    level: 'Beginner',
    blurb: 'Add tasks, tick them off, clear the done ones. Lists, events and state in about eighty lines of plain English.',
    tags: ['Lists', 'Click behavior', 'Blocks'],
    icon: AppWindow,
  },
  {
    name: 'Portfolio site',
    category: 'Websites',
    level: 'Beginner',
    blurb: 'A one-page site with an intro, project grid and contact section — the three layers, laid out top to bottom.',
    tags: ['Three layers', 'Styling', 'Deployable'],
    icon: Globe,
  },
  {
    name: 'Weather app',
    category: 'Apps',
    level: 'Intermediate',
    blurb: 'Type a city, get the forecast. Covers asking for input, reading a web response and showing a loading state.',
    tags: ['ask', 'Web requests', 'Tables'],
    icon: Sparkles,
  },
  {
    name: 'Snake',
    category: 'Games',
    level: 'Intermediate',
    blurb: 'The grid classic: arrow keys, a growing snake, apples that move. Loops and lists doing real-time work.',
    tags: ['Keyboard input', 'Loops', 'Lists'],
    icon: Gamepad2,
  },
  {
    name: 'File renamer',
    category: 'Tools',
    level: 'Intermediate',
    blurb: 'Batch-rename a folder of files with one rule you write yourself. The shortest path to feeling like a real developer.',
    tags: ['Files', 'for each', 'CLI script'],
    icon: Wrench,
  },
  {
    name: 'Quiz game',
    category: 'Games',
    level: 'Beginner',
    blurb: 'Ten questions, a running score and a final grade. Conditions and tables wearing a game hat.',
    tags: ['Conditions', 'Tables', 'Score'],
    icon: Gamepad2,
  },
  {
    name: 'Bakery landing page',
    category: 'Websites',
    level: 'Beginner',
    blurb: 'Hero, menu, opening hours, map link. A real small-business page you could deploy today.',
    tags: ['Blocks', 'Styling', 'Responsive'],
    icon: Globe,
  },
];

export function ExamplesGallery() {
  const [filter, setFilter] = useState<Filter>('All');
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (filter === 'All' ? EXAMPLES : EXAMPLES.filter((e) => e.category === filter)),
    [filter],
  );

  return (
    <section className="container-site py-14 md:py-20" aria-labelledby="gallery-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="gallery-heading" className="text-h2">
            Projects you can run today
          </h2>
          <p className="mt-3 max-w-2xl text-body-lg text-muted">
            Every example opens in the playground with its full source — pick one, change it, make
            it yours.
          </p>
        </div>
        <p className="text-sm text-subtle" aria-live="polite">
          Showing {visible.length} of {EXAMPLES.length}
        </p>
      </div>

      {/* Filters */}
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter examples by category"
      >
        {CATEGORIES.map((cat) => {
          const active = filter === cat;
          const count = cat === 'All' ? EXAMPLES.length : EXAMPLES.filter((e) => e.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={active}
              className={`relative inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'border-brand-400 text-primary-soft-text'
                  : 'border-border bg-surface text-muted hover:border-border-strong hover:text-text'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="examples-filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-primary-soft"
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              {cat}
              <span className={`text-caption font-medium ${active ? 'opacity-70' : 'text-subtle'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <motion.ul layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((example) => {
            const Icon = example.icon;
            return (
              <motion.li
                key={example.name}
                layout={!reduce}
                initial={reduce ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href="/playground" className="card card-hover flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-caption font-medium text-subtle">
                      {example.level}
                    </span>
                  </div>

                  <h3 className="text-h4 mt-4">{example.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{example.blurb}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-caption font-semibold text-primary-soft-text">
                      {example.category}
                    </span>
                    {example.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-2 px-2.5 py-0.5 text-caption text-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-link">
                    Open in playground
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 && (
        <p className="mt-10 rounded-2xl border border-border bg-bg-subtle p-8 text-center text-muted">
          Nothing in this category yet — more examples land with every release.
        </p>
      )}
    </section>
  );
}
