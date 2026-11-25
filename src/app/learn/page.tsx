import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, Rocket, Play } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { CourseProgress } from '@/components/learn/CourseProgress';

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'Learn EngCode in 20 short lessons — a free course with three starting paths, a saved progress tracker and projects you can run at the end.',
};

const PATHS = [
  {
    icon: BookOpen,
    title: 'Complete beginner',
    kicker: 'Never written a line of code',
    text: 'Start at Lesson 1 and go in order. Every lesson assumes zero background — we explain what a variable is before we ask you to make one, and the first program you run is one sentence long.',
    start: 'Start at Lesson 1 — Hello, world',
    covers: ['say, comments and variables', 'Conditions, loops and lists', 'Errors and how to read them', 'Your first website and desktop app'],
  },
  {
    icon: Code2,
    title: 'I know another language',
    kicker: 'Python, JavaScript, C#…',
    text: 'You already know what a variable is — what you need is the vocabulary. Skim Lessons 1–6 to learn the words EngCode uses, then jump to Blocks and the app layers where the structure is new.',
    start: 'Skim Lessons 1–6, then Lesson 11',
    covers: ['EngCode words for ideas you know', 'Tables, modules and files', 'Three-layer app structure', 'Reading idiomatic EngCode'],
  },
  {
    icon: Rocket,
    title: 'I want to build apps',
    kicker: 'Projects over theory',
    text: 'Learn just enough to build: the core six lessons, then straight into blocks, styling and behavior. You will have a website and a desktop app running before Lesson 16.',
    start: 'Lessons 1–6, then Lesson 11',
    covers: ['Blocks, styling, behavior', 'Your first website', 'Your first desktop app', 'Files and modules for grown-up projects'],
  },
] as const;

export default function LearnPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            The course
          </p>
          <h1 className="text-h1 mt-3">
            Learn EngCode in <span className="text-gradient">20 lessons</span>
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            Twenty short lessons — about five hours in total — that take you from your first{' '}
            <code className="rounded border border-border bg-code-bg px-1.5">say</code> to a
            desktop app you can show people. Free, self-paced and tracked in your browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <a href="#outline" className="btn-primary">
                See the outline <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/docs/quick-start" className="btn-secondary">
                Skip to the quick start
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Learning paths */}
      <section className="container-site py-14 md:py-20" aria-labelledby="paths-heading">
        <Reveal>
          <h2 id="paths-heading" className="text-h2">
            Pick your starting point
          </h2>
          <p className="mt-3 max-w-2xl text-body-lg text-muted">
            The twenty lessons are the same for everyone — where you enter them is not. Choose the
            path that sounds like you.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PATHS.map((path, i) => {
            const Icon = path.icon;
            return (
              <Reveal key={path.title} delay={i * 0.1}>
                <div className="card card-hover flex h-full flex-col p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-caption font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                    {path.kicker}
                  </p>
                  <h3 className="text-h4 mt-1">{path.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{path.text}</p>
                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {path.covers.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm text-muted">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"
                          aria-hidden="true"
                        />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm font-semibold text-link">{path.start}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Course outline + progress tracker */}
      <section
        id="outline"
        className="scroll-mt-20 border-t border-border bg-bg-subtle py-14 md:py-20"
        aria-labelledby="outline-heading"
      >
        <div className="container-site">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="outline-heading" className="text-h2">
                The 20-lesson outline
              </h2>
              <p className="mt-3 max-w-2xl text-body-lg text-muted">
                Each lesson is one idea, one example and one thing you run. Tick them off as you
                go — your progress is saved on this device.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
              <Play className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              ~5 hours total · self-paced
            </span>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <CourseProgress />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="container-site py-14 md:py-20">
        <Reveal className="rounded-2xl border border-border bg-bg-subtle p-6 text-center md:p-10">
          <h2 className="text-h2">Lesson 0 is one command</h2>
          <p className="mx-auto mt-3 max-w-xl text-body-lg text-muted">
            The quick start gets EngCode installed and your first program running — then Lesson 1
            begins.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Magnetic strength={0.3}>
              <Link href="/docs/quick-start" className="btn-primary">
                Start the quick start <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/playground" className="btn-secondary">
                Try it in the playground
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/examples" className="btn-secondary">
                Browse examples
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
}
