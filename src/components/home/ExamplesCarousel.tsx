'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { CopyButton } from '@/components/ui/CopyButton';

type Example = { key: string; label: string; file: string; code: string; output: string };

const EXAMPLES: Example[] = [
  {
    key: 'hello',
    label: 'Hello world',
    file: 'hello.eng',
    code: `say "Hello, world!"

set name to "EngCode"
say "You are learning " plus name plus "."`,
    output: `Hello, world!\nYou are learning EngCode.`,
  },
  {
    key: 'variables',
    label: 'Variables',
    file: 'variables.eng',
    code: `set age to 12
set name to "Ada"
set likes coffee to yes

change age to age plus 1

say name plus " is " plus age plus " years old"
if likes coffee is yes:
    say "Coffee: yes"
end`,
    output: `Ada is 13 years old\nCoffee: yes`,
  },
  {
    key: 'loops',
    label: 'Loops',
    file: 'loops.eng',
    code: `repeat 3 times:
    say "One more time"
end

count from 1 to 4 as count:
    say "Count: " plus count
end`,
    output: `One more time\nOne more time\nOne more time\nCount: 1\nCount: 2\nCount: 3\nCount: 4`,
  },
  {
    key: 'arrays',
    label: 'Arrays',
    file: 'arrays.eng',
    code: `set fruits to a list of "apple", "banana", "cherry"

add "mango" to fruits
say "We have " plus the length of fruits plus " fruits"

for each fruit in fruits:
    say "- " plus fruit
end`,
    output: `We have 4 fruits\n- apple\n- banana\n- cherry\n- mango`,
  },
  {
    key: 'functions',
    label: 'Functions',
    file: 'functions.eng',
    code: `define greet with person:
    give back "Hello, " plus person
end

define area with width and height:
    give back width times height
end

say call greet with "Ada"
say "Room is " plus (call area with 4 and 5) plus " m²"`,
    output: `Hello, Ada!\nRoom is 20 m²`,
  },
  {
    key: 'website',
    label: 'Website',
    file: 'site.eng',
    code: `app "Bloom Café":
    page "Home":
        heading "Fresh bread, every morning"
        button "See the menu" called "menu button"
    end
end

style "menu button":
    background is amber
    rounded corners of 12
end

when "menu button" is clicked:
    say "Opening the menu…"
end`,
    output: `→ rendered as HTML + CSS\n→ served at localhost:3000`,
  },
  {
    key: 'app',
    label: 'Desktop app',
    file: 'app.eng',
    code: `app "Calculator":
    page "Main":
        text "0" called "display"
        button "7" called "seven"
    end
end

when "seven" is clicked:
    change text of "display" to "77"
end

when "equals" is clicked:
    say "Result: 77"
end`,
    output: `→ window opens on Windows / macOS\n→ Result: 42`,
  },
];

export function ExamplesCarousel() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const example = EXAMPLES[index];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + EXAMPLES.length) % EXAMPLES.length);

  return (
    <section className="border-y border-border bg-bg-subtle py-20 md:py-28" aria-labelledby="examples-heading">
      <div className="container-site">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
              Code examples
            </p>
            <h2 id="examples-heading" className="text-h2 mt-3">
              Seven snippets, one language
            </h2>
            <p className="mt-4 text-body-lg text-muted">
              Every example runs in the playground — open one, change it, make it yours.
            </p>
          </div>

          {/* controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous example"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:-translate-x-0.5 hover:border-brand-400 hover:text-text"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="w-20 text-center text-sm text-subtle" aria-live="polite">
              {index + 1} / {EXAMPLES.length}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next example"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:translate-x-0.5 hover:border-brand-400 hover:text-text"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>

        {/* chip selector */}
        <Reveal delay={0.08} className="mt-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose an example">
            {EXAMPLES.map((ex, i) => (
              <button
                key={ex.key}
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  i === index
                    ? 'border-brand-400 bg-primary text-primary-text shadow-sm'
                    : 'border-border bg-surface text-muted hover:border-border-strong hover:text-text'
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* carousel panel */}
        <Reveal delay={0.12} className="mt-6">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={example.key}
                initial={reduce ? undefined : { opacity: 0, x: 24 }}
                animate={reduce ? undefined : { opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <span className="flex items-center gap-2 text-caption text-subtle">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-400" aria-hidden="true" />
                    {example.file}
                  </span>
                  <CopyButton text={example.code} label={`Copy ${example.label} example`} />
                </div>
                <div className="grid md:grid-cols-[1.5fr_1fr]">
                  <pre className="overflow-x-auto bg-code-bg p-5 font-mono text-[13px] leading-relaxed text-code-text">
                    <code>{example.code}</code>
                  </pre>
                  <div className="border-t border-border p-5 md:border-l md:border-t-0">
                    <p className="text-caption font-semibold uppercase tracking-wider text-subtle">
                      Output
                    </p>
                    <pre className="mt-3 whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-muted">
                      <code>{example.output}</code>
                    </pre>
                    <a
                      href={`/playground?example=${example.key}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-link underline underline-offset-2"
                    >
                      Open in playground →
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
