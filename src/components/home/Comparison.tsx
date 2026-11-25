'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const TASK = 'Print "Hello" five times, then sum 1..5 and show the result.';

const LANGS = [
  {
    name: 'EngCode',
    badge: 'the point',
    accent: true,
    code: `repeat 5 times:
    say "Hello"
end

set total to 0
count from 1 to 5 as n:
    change total to total plus n
end

say "Total: " plus total`,
    verdicts: [
      { ok: true, text: 'Reads out loud, in order' },
      { ok: true, text: 'Zero symbols to memorize' },
      { ok: true, text: 'Errors explain themselves' },
    ],
  },
  {
    name: 'Python',
    badge: 'beginner classic',
    accent: false,
    code: `for _ in range(5):
    print("Hello")

total = 0
for i in range(1, 6):
    total += i

print("Total:", total)`,
    verdicts: [
      { ok: true, text: 'Close to English' },
      { ok: false, text: 'Indentation must be exact' },
      { ok: true, text: 'Great ecosystem' },
    ],
  },
  {
    name: 'JavaScript',
    badge: 'runs in browsers',
    accent: false,
    code: `for (let i = 0; i < 5; i++) {
  console.log("Hello");
}

let total = 0;
for (let i = 1; i <= 5; i++) {
  total += i;
}

console.log("Total:", total);`,
    verdicts: [
      { ok: false, text: 'Braces, semicolons, i++' },
      { ok: false, text: 'Easy off-by-one mistakes' },
      { ok: true, text: 'Powers the web' },
    ],
  },
];

export function Comparison() {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <section className="container-site py-20 md:py-28" aria-labelledby="compare-heading">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
          Comparison
        </p>
        <h2 id="compare-heading" className="text-h2 mt-3">
          The same task, three languages
        </h2>
        <p className="mt-4 text-body-lg text-muted">
          {TASK}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {LANGS.map((lang, i) => (
          <Reveal
            key={lang.name}
            delay={i * 0.1}
            className={lang.accent ? 'lg:-mt-4' : undefined}
          >
            <motion.div
              onHoverStart={() => setHovered(lang.name)}
              onHoverEnd={() => setHovered(null)}
              animate={
                reduce
                  ? undefined
                  : { y: hovered === lang.name ? -4 : 0 }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={`card flex h-full flex-col overflow-hidden ${
                lang.accent ? 'border-brand-400 shadow-[0_0_0_1px_var(--primary)]' : ''
              }`}
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <h3 className="font-heading text-lg font-bold">{lang.name}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-caption font-medium ${
                    lang.accent
                      ? 'bg-primary text-primary-text'
                      : 'bg-surface-2 text-subtle'
                  }`}
                >
                  {lang.badge}
                </span>
              </div>

              <pre className="flex-1 overflow-x-auto bg-code-bg p-5 font-mono text-[13px] leading-relaxed text-code-text">
                <code>{lang.code}</code>
              </pre>

              <ul className="space-y-2 border-t border-border p-5">
                {lang.verdicts.map((v) => (
                  <li key={v.text} className="flex items-start gap-2.5 text-sm">
                    {v.ok ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                    )}
                    <span className={v.ok ? 'text-muted' : 'text-subtle'}>{v.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="mt-8 text-center text-sm text-subtle">
        Python and JavaScript remain excellent languages — EngCode just removes the first
        hurdle when you are learning to build.
      </Reveal>
    </section>
  );
}
