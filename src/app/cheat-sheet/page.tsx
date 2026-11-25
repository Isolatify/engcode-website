import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { PrintButton } from '@/components/cheat-sheet/PrintButton';

export const metadata: Metadata = {
  title: 'Cheat sheet',
  description:
    'A one-page EngCode reference — basics, conditions and loops, data, and the three app layers as tables of syntax and meaning. Printable.',
};

type Row = { syntax: string; meaning: string };

const SECTIONS: { id: string; title: string; intro: string; rows: Row[] }[] = [
  {
    id: 'basics',
    title: 'Basics',
    intro: 'The lines every program starts with.',
    rows: [
      { syntax: 'note: This is a comment.', meaning: 'A note for humans — the computer ignores it.' },
      { syntax: 'say "Hello, world!"', meaning: 'Print text to the console or playground output.' },
      { syntax: 'set x to 5', meaning: 'Store a value under a name.' },
      { syntax: 'change x to x plus 1', meaning: 'Update a name with a new value.' },
      { syntax: 'ask "What is your name?" and save it as name', meaning: 'Ask the user and store the answer under a name.' },
      { syntax: 'ask for a number "Age?" and save it as age', meaning: 'Ask until the user types a valid number.' },
      { syntax: 'set greeting to "Hi, " plus name', meaning: 'Join text together with plus.' },
      { syntax: 'define greet with name:\n    give back "Hi " plus name\nend', meaning: 'Name a piece of work and reuse it anywhere.' },
    ],
  },
  {
    id: 'conditions-loops',
    title: 'Conditions & loops',
    intro: 'Decisions, repetition and everything with a shape.',
    rows: [
      { syntax: 'if score is 100:\n    say "Perfect!"\nend', meaning: 'If the condition is true, run the block. Every block ends with end.' },
      { syntax: 'if guess is wrong:\n    say "Try again"\notherwise:\n    say "You win!"\nend', meaning: 'The alternative branch — run when the if was not taken.' },
      { syntax: 'if x is greater than 0:', meaning: 'Comparisons read like words: is, is not, is greater than, is less than, is at least, is at most.' },
      { syntax: 'if name is empty:', meaning: 'Bare checks: is empty, is not empty, contains, starts with, ends with.' },
      { syntax: 'repeat 5 times:\n    say "Hello"\nend', meaning: 'Do the block a set number of times.' },
      { syntax: 'for each task in tasks:\n    say task\nend', meaning: 'Walk through a list, one item at a time.' },
      { syntax: 'while energy is greater than 0:\n    say "Taking a turn"\nend', meaning: 'Keep looping while the condition stays true. Conditions must be yes or no.' },
      { syntax: 'stop the loop\nskip to the next one', meaning: 'Leave the innermost loop, or jump to the next turn.' },
      { syntax: 'try:\n    set x to 1 divided by 0\nif it fails:\n    say the error\nend', meaning: 'Run risky work and catch any failure — the error holds the message.' },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    intro: 'Lists for sequences, tables for real records.',
    rows: [
      { syntax: 'set tasks to a list of "milk"', meaning: 'Create a list with starting items.' },
      { syntax: 'set tasks to an empty list', meaning: 'Create an empty list under a name.' },
      { syntax: 'add "Buy milk" to tasks', meaning: 'Append an item to a list.' },
      { syntax: 'remove "Buy milk" from tasks', meaning: 'Delete the first matching item.' },
      { syntax: 'say item 2 of tasks\nsay last item of tasks\nsay the length of tasks', meaning: 'Read a list: item N of, last item, the length of — lists start at 1.' },
      { syntax: 'sort tasks\nsort tasks descending\nreverse tasks\nshuffle tasks', meaning: 'Rearrange a list in place.' },
      { syntax: 'set person to a table with name "Sam", age 25', meaning: 'A table: named fields in one record.' },
      { syntax: 'say person\'s name\nchange person\'s age to 26', meaning: 'Read and write table fields with the possessive —s.' },
    ],
  },
  {
    id: 'apps',
    title: 'Apps — the three layers',
    intro: 'Structure, looks, behavior — then open the window.',
    rows: [
      { syntax: 'app "My App":\n    page "Home":\n        …\n    end\nend', meaning: 'Layer 1 · Structure: an app with pages, blocks and elements.' },
      { syntax: 'input called "name" with label "Name"', meaning: 'Layer 1 · Elements: heading, text, button, input, checkbox, dropdown, list, image… every one can be called "id".' },
      { syntax: 'style "submit button":\n    background is blue\n    rounded corners of 8\nend', meaning: 'Layer 2 · Styling: colors, sizes, corners, shadows, hover states and themes — no CSS.' },
      { syntax: 'when "submit" is clicked:\n    say "Sent!"\nend', meaning: 'Layer 3 · Behavior: click, hover, change, submit, key press, page opens, window resized.' },
      { syntax: 'every frame:\n    draw circle on "board" at x 10 and y 10 with size 8 in white\nend', meaning: 'Animation and canvas drawing, about sixty frames per second.' },
      { syntax: 'engcode serve main.eng', meaning: 'Open the running app on localhost while you keep editing.' },
      { syntax: 'engcode build web\nengcode build windows', meaning: 'Publish as a static website — or package it for Windows and macOS.' },
    ],
  },
];

export default function CheatSheetPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Reference
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-h1 mt-3">The EngCode cheat sheet</h1>
              <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
                Every construct you need for scripts, data and apps on one page. Print it, pin it
                above your monitor, or keep the tab open — whichever gets you back to building
                faster.
              </p>
            </div>
            <PrintButton />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <Link href="/learn" className="btn-primary">
                Learn what each line does <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/playground" className="btn-secondary">
                Try it in the playground
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Sections */}
      <section className="container-site py-14 md:py-20" aria-label="Syntax reference">
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-2">
          {SECTIONS.map((section, i) => (
            <Reveal key={section.id} delay={(i % 2) * 0.08}>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
                <div className="border-b border-border bg-bg-subtle px-5 py-4">
                  <h2 className="text-h4">{section.title}</h2>
                  <p className="mt-0.5 text-caption text-subtle">{section.intro}</p>
                </div>
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="w-[52%] px-5 py-2.5 text-caption font-semibold uppercase tracking-wider text-subtle">
                        EngCode
                      </th>
                      <th scope="col" className="px-5 py-2.5 text-caption font-semibold uppercase tracking-wider text-subtle">
                        Meaning
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr
                        key={row.syntax}
                        className="border-b border-border last:border-0 transition-colors hover:bg-bg-subtle"
                      >
                        <td className="px-5 py-3 align-top">
                          <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-code-text">
                            <code>{row.syntax}</code>
                          </pre>
                        </td>
                        <td className="px-5 py-3 align-top text-sm leading-relaxed text-muted">
                          {row.meaning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Footer */}
        <Reveal delay={0.2} className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-bg-subtle p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              This is the short version. The docs cover each construct with examples, edge cases
              and error messages — start with the quick start if you haven&apos;t run anything yet.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <Link href="/docs/quick-start" className="btn-primary">
                Open the docs <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/examples" className="btn-secondary">
                See full examples
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
}
