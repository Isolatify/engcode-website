import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { ArticleShell, P, H3, CodeBlock, C } from '@/components/blog/ArticleShell';

export const metadata: Metadata = {
  title: 'Why EngCode reads like English',
  description:
    'The three design rules behind EngCode: words over symbols, lines you can read out loud, and errors written in the same voice — on top of a real language underneath.',
};

const RULES = [
  {
    n: 'Rule 1',
    title: 'Words over symbols',
    text: 'Every time the language had a choice between a symbol and a word, the word won. Not because symbols are bad, but because every symbol is one more thing a beginner has to be told.',
  },
  {
    n: 'Rule 2',
    title: 'Read it like a sentence',
    text: 'A line of EngCode should survive being read out loud, top to bottom, by someone who has never seen the program before.',
  },
  {
    n: 'Rule 3',
    title: 'Errors in the same voice',
    text: 'If the language speaks English, the errors speak English too — the same words, the same tone, and a suggested fix on the next line.',
  },
] as const;

export default function WhyEngcodeReadsLikeEnglishPost() {
  return (
    <ArticleShell
      tag="Design"
      title="Why EngCode reads like English"
      lede="Three rules decided almost every syntax question we hit. None of them were accidents, and none of them came at the cost of being a real language."
      date="October 28, 2026"
      dateISO="2026-10-28"
      readingTime="6 min read"
    >
      <P>
        When you teach people to program, you watch the same wall get hit over and over. It is not
        logic — beginners are perfectly good at logic. It is translation: the moment where a
        perfectly clear idea in someone&apos;s head has to become{' '}
        <C>if (score === 100)</C> instead of &quot;when the score is 100&quot;. The idea is simple.
        The encoding is the obstacle.
      </P>
      <P>EngCode grew from three rules that push the encoding out of the way.</P>

      <Reveal className="mt-8 grid gap-5 md:grid-cols-3">
        {RULES.map((rule, i) => (
          <div key={rule.n} className="card card-hover p-5">
            <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{rule.n}</span>
            <h2 className="text-h5 mt-1">{rule.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{rule.text}</p>
            <span className="sr-only">Rule {i + 1}</span>
          </div>
        ))}
      </Reveal>

      <H3>Rule 1: words over symbols</H3>
      <P>
        Equality is <C>is</C>, not <C>===</C>. The alternative branch is{' '}
        <C>otherwise</C>, not <C>else</C>. Assignment is <C>set … to …</C>, not{' '}
        <C>x = …</C> with the risk of typing <C>==</C> by accident. None of these choices make the
        language less powerful — underneath, <C>is</C> compiles to the same strict comparison you
        would write by hand. They just remove a symbol you would have had to memorize and a class
        of typo you would have had to debug.
      </P>
      <CodeBlock>{`when score is 100
  say "Perfect!"
otherwise
  say "Keep going!"`}</CodeBlock>
      <P>
        Read it out loud. It says exactly what it does, in the order you would say it to another
        person. That is the entire test.
      </P>

      <H3>Rule 2: read it like a sentence</H3>
      <P>
        The second rule sets the order of a line: subject, condition, action — the way English
        puts it. A button handler starts with the event, then what happens:
        <C>when &quot;button&quot; is clicked, say &quot;Hello&quot;</C>. In a program it is
        written across two lines, because indenting the action is how you see the shape of the
        block at a glance:
      </P>
      <CodeBlock>{`when "button" is clicked
  say "Hello"`}</CodeBlock>
      <P>
        The same order applies everywhere: <C>repeat 5 times</C>, <C>while energy is above 0</C>,{' '}
        <C>for each task in tasks</C>, <C>ask &quot;What is your name?&quot;</C>. Every construct
        begins with a word you already know and ends with the thing it is about. If a line cannot
        be read as a sentence, that is a bug in the language — we rewrite the syntax, not the
        reader.
      </P>

      <H3>Rule 3: errors in the same voice</H3>
      <P>
        The cruellest convention in programming is the error message. A beginner writes something
        small and gets back a paragraph of jargon about things they have never heard of. EngCode
        errors use the same words the language uses, name the line, and propose the fix:
      </P>
      <CodeBlock>{`Error on line 4: "total" was never set.
Fix: write  set total to 0  before you use it.`}</CodeBlock>
      <P>
        No stack trace in the first screen. No &quot;undefined is not a function&quot;. The
        playground and the CLI print identical messages, so the skill you build in one transfers
        to the other. When a message is wrong, that is a bug we treat with the same seriousness
        as a crash —{' '}
        <Link href="/support" className="text-link underline underline-offset-2">
          the support page
        </Link>{' '}
        explains how to report one.
      </P>

      <H3>The real language underneath</H3>
      <P>
        Plain English on the surface would be worthless if the language underneath were a toy, so
        here is what is actually there when you scratch the paint:
      </P>
      <ul className="mt-5 space-y-3">
        {[
          ['Tables', 'named columns and rows, for real data — table with columns and friends'],
          ['Functions', 'named blocks of work you can call, pass values into and get answers back'],
          ['Modules', 'files that import each other, so a project can grow past one screen'],
          ['Three-layer apps', 'blocks, styling and behavior — the same structure real web apps use'],
        ].map(([title, text]) => (
          <li key={title} className="flex items-start gap-3 text-[17px] leading-relaxed text-muted">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"
              aria-hidden="true"
            />
            <span>
              <strong className="text-text">{title}</strong> — {text}
            </span>
          </li>
        ))}
      </ul>
      <P>
        The English is the syntax layer. The engineering underneath — scoping, data structures,
        modules, a real event model — is conventional, boring and exactly where it should be. You
        can move from EngCode to any other language later and find the same ideas wearing
        different clothes.
      </P>
      <P>
        The fastest way to judge the rules is to run them: open the playground, type{' '}
        <C>say &quot;Hello&quot;</C>, and read what comes back.
      </P>

      <Reveal delay={0.1} className="mt-12">
        <div className="rounded-2xl border border-border bg-bg-subtle p-6 md:p-8">
          <h2 className="text-h4">Read it for yourself</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            The playground runs in your browser — no install, no account. Or start at the quick
            start if you prefer a guided first ten minutes.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <Link href="/playground" className="btn-primary">
                Open the playground <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/docs/quick-start" className="btn-secondary">
                Quick start
              </Link>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </ArticleShell>
  );
}
