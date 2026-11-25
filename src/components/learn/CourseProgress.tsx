'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, RotateCcw, ArrowRight } from 'lucide-react';

type Lesson = {
  n: number;
  title: string;
  minutes: number;
  blurb: string;
};

const LESSONS: Lesson[] = [
  { n: 1, title: 'Hello, world', minutes: 10, blurb: 'Run your first line and meet say.' },
  { n: 2, title: 'Comments', minutes: 8, blurb: 'Leave notes for humans inside your code.' },
  { n: 3, title: 'Variables', minutes: 12, blurb: 'set x to 5 — remember things under a name.' },
  { n: 4, title: 'Asking questions', minutes: 10, blurb: 'ask the user and use their answer.' },
  { n: 5, title: 'Conditions', minutes: 14, blurb: 'when … is … and otherwise — make decisions.' },
  { n: 6, title: 'Loops', minutes: 14, blurb: 'repeat, while and for each — do it again.' },
  { n: 7, title: 'Lists', minutes: 12, blurb: 'Keep many values together in one name.' },
  { n: 8, title: 'Functions', minutes: 16, blurb: 'Name a chunk of work and call it on demand.' },
  { n: 9, title: 'Tables', minutes: 14, blurb: 'Rows and columns for real data.' },
  { n: 10, title: 'Errors', minutes: 12, blurb: 'Read a friendly error and fix it fast.' },
  { n: 11, title: 'Blocks', minutes: 16, blurb: 'Lay out a page or window with block.' },
  { n: 12, title: 'Styling', minutes: 18, blurb: 'Give it shape and colour with style.' },
  { n: 13, title: 'Behavior', minutes: 18, blurb: 'when … is clicked — bring it to life.' },
  { n: 14, title: 'Your first website', minutes: 25, blurb: 'Three layers, one site you can deploy.' },
  { n: 15, title: 'Your first desktop app', minutes: 25, blurb: 'A window that runs on Windows and macOS.' },
  { n: 16, title: 'Files', minutes: 16, blurb: 'Read and write files from your programs.' },
  { n: 17, title: 'Modules', minutes: 16, blurb: 'Split a project into files that import each other.' },
  { n: 18, title: 'Reading other people’s code', minutes: 14, blurb: 'Follow someone else’s logic in the example gallery.' },
  { n: 19, title: 'Build a project: calculator', minutes: 30, blurb: 'Plan, build and test a complete calculator.' },
  { n: 20, title: 'Where to go next', minutes: 10, blurb: 'Playground, docs, community — and shipping.' },
];

const STORAGE_KEY = 'engcode-course-progress-v1';

function loadCompleted(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is number => typeof n === 'number' && n >= 1 && n <= LESSONS.length);
  } catch {
    return [];
  }
}

export function CourseProgress() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const reduce = useReducedMotion();

  // Restore saved progress after mount (localStorage is unavailable during SSR).
  useEffect(() => {
    setCompleted(loadCompleted());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // Storage full or blocked — progress still works for this visit.
    }
  }, [completed, hydrated]);

  const toggle = useCallback((n: number) => {
    setCompleted((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }, []);

  const reset = useCallback(() => setCompleted([]), []);

  const done = completed.length;
  const total = LESSONS.length;
  const pct = Math.round((done / total) * 100);
  const nextLesson = LESSONS.find((l) => !completed.includes(l.n));

  return (
    <div className="card overflow-hidden">
      {/* Progress header */}
      <div className="border-b border-border bg-bg-subtle p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-h4">Your progress</h3>
            <p className="mt-1 text-sm text-muted" aria-live="polite">
              {hydrated ? (
                <>
                  <strong className="text-text">
                    {done} of {total}
                  </strong>{' '}
                  lessons complete · {pct}%
                </>
              ) : (
                'Loading your saved progress…'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={done === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>

        {/* Progress bar */}
        <div
          className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          aria-label="Course progress"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: hydrated ? `${pct}%` : '0%' }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <p className="mt-3 text-caption text-subtle">
          Saved in your browser&apos;s localStorage — no account, nothing sent anywhere. Tick a
          lesson when you finish it and pick up where you left off next visit.
          {hydrated && nextLesson ? (
            <>
              {' '}
              <span className="text-brand-700 dark:text-brand-400">
                Next up: Lesson {nextLesson.n} — {nextLesson.title}.
              </span>
            </>
          ) : null}
          {hydrated && done === total ? (
            <span className="text-success-text"> Course complete — nice work. 🎉</span>
          ) : null}
        </p>
      </div>

      {/* Lesson checklist */}
      <ul className="divide-y divide-border">
        {LESSONS.map((lesson, i) => {
          const isDone = completed.includes(lesson.n);
          return (
            <li key={lesson.n}>
              <button
                type="button"
                onClick={() => toggle(lesson.n)}
                aria-pressed={isDone}
                className={`group flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-bg-subtle md:px-6 ${
                  isDone ? 'bg-primary-soft/40' : ''
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition-colors ${
                    isDone
                      ? 'border-brand-400 bg-primary text-primary-text'
                      : 'border-border-strong bg-surface text-subtle group-hover:border-brand-400'
                  }`}
                  aria-hidden="true"
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : lesson.n}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block font-heading text-[15px] font-semibold ${
                      isDone ? 'text-muted line-through decoration-brand-400' : 'text-text'
                    }`}
                  >
                    {lesson.title}
                  </span>
                  <span className="block truncate text-caption text-subtle">{lesson.blurb}</span>
                </span>
                <span className="shrink-0 text-caption text-subtle">{lesson.minutes} min</span>
              </button>
              <span className="sr-only">, lesson {i + 1} of {total}</span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-bg-subtle px-5 py-4 md:px-6">
        <p className="text-sm text-muted">
          Finished a lesson? The docs repeat each idea with more detail.
        </p>
        <a href="/docs/quick-start" className="inline-flex items-center gap-1.5 text-sm font-semibold text-link">
          Open the quick start <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
