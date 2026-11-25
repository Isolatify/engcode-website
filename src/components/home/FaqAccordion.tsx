'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const FAQS = [
  {
    q: 'Do I need to know another programming language first?',
    a: 'No. EngCode is designed to be a first language — it reads like English and the Quick Start assumes you are starting from zero. If you already code, you will pick it up in an afternoon and appreciate the shorter syntax.',
  },
  {
    q: 'Is EngCode free?',
    a: 'Yes. EngCode is free and open source under the MIT license, for personal, educational and commercial use. No accounts, no usage limits, no telemetry.',
  },
  {
    q: 'Which operating systems are supported?',
    a: 'Windows 10+ and macOS 12+ (Apple Silicon and Intel) for desktop apps, plus any OS with Node.js for scripts and websites. The playground runs in your browser with nothing installed.',
  },
  {
    q: 'Can I build real apps with it?',
    a: 'Yes — scripts, websites and desktop apps all ship from the same language and project structure. The three layers (blocks, styling, behavior) map directly to HTML, CSS and JavaScript under the hood.',
  },
  {
    q: 'How is EngCode different from Python?',
    a: 'Python is a wonderful general-purpose language with a large ecosystem. EngCode trades some of that breadth for readability: words instead of symbols, friendly errors by design, and app-building built into the language rather than added through libraries.',
  },
  {
    q: 'What file extension does EngCode use?',
    a: '.eng files. The official VS Code extension gives them syntax highlighting, the EngCode icon theme and a Run button.',
  },
  {
    q: 'How do I report a bug or ask a question?',
    a: 'GitHub Issues is for bugs and feature requests; GitHub Discussions is for questions and ideas. Both links are on the Support page, and beginners are explicitly welcome.',
  },
];

function Item({ item, index }: { item: (typeof FAQS)[number]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const reduce = useReducedMotion();
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="border-b border-border last:border-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:text-link md:px-6"
        >
          <span className="font-heading text-[15px] font-semibold leading-snug">{item.q}</span>
          <motion.span
            animate={reduce ? undefined : { rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
              open ? 'border-brand-400 bg-primary text-primary-text' : 'border-border text-subtle'
            }`}
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduce ? undefined : { height: 0, opacity: 0 }}
            animate={reduce ? undefined : { height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted md:px-6">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqAccordion() {
  return (
    <section className="container-site py-20 md:py-28" aria-labelledby="faq-heading">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
          FAQ
        </p>
        <h2 id="faq-heading" className="text-h2 mt-3">
          Questions, answered
        </h2>
        <p className="mt-4 text-body-lg text-muted">
          Everything people ask before writing their first line.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
        <div className="card overflow-hidden">
          {FAQS.map((item, i) => (
            <Item key={item.q} item={item} index={i} />
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-muted">
          More questions? The{' '}
          <a href="/support" className="text-link underline underline-offset-2">
            support page
          </a>{' '}
          has troubleshooting and every way to reach us, or read the{' '}
          <a href="/docs/faq" className="text-link underline underline-offset-2">
            docs FAQ
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
