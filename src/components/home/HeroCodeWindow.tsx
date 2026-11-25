'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';

const PROGRAM = `note: hello.eng — your first EngCode program
set name to "world"
set greeting to "Hello, " plus name plus "!"

say greeting

repeat 3 times:
    say "EngCode is easy to learn."
end

ask "Ready to build something real?" and save it as ready
if ready is yes:
    say "Now build something real."
end`;

const OUTPUT_LINES = [
  'Hello, world!',
  'EngCode is easy to learn.',
  'EngCode is easy to learn.',
  'EngCode is easy to learn.',
  'Now build something real.',
];

/** Very small tokenizer so the typed text gets real syntax colors. */
function highlight(line: string, key: number) {
  const parts = line.split(/("(?:[^"\\]|\\.)*"|note:.*$)/g);
  return (
    <span key={key}>
      {parts.map((part, i) => {
        if (part.startsWith('"')) {
          return (
            <span key={i} className="text-emerald-600 dark:text-emerald-400">
              {part}
            </span>
          );
        }
        if (part.startsWith('note:')) {
          return (
            <span key={i} className="text-subtle italic">
              {part}
            </span>
          );
        }
        // keywords
        return part.split(/(\b(?:set|to|say|repeat|times|when|the|is|ready|and|or|not|plus|if|yes|ask|end|otherwise|note)\b)/g).map((w, j) =>
          /^(set|say|repeat|when|if|ask)$/.test(w) ? (
            <span key={`${i}-${j}`} className="text-brand-600 dark:text-brand-400 font-medium">
              {w}
            </span>
          ) : (
            <span key={`${i}-${j}`}>{w}</span>
          ),
        );
      })}
    </span>
  );
}

export function HeroCodeWindow() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(reduce ? PROGRAM.length : 0);
  const [outputVisible, setOutputVisible] = useState(reduce);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);
  const hostRef = useRef<HTMLDivElement>(null);

  const done = typed >= PROGRAM.length;

  // Auto-type once when scrolled into view
  useEffect(() => {
    if (reduce) return;
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          startTyping();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  function startTyping() {
    setTyped(0);
    setOutputVisible(false);
    setRunning(true);
    if (timerRef.current) clearInterval(timerRef.current);
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= PROGRAM.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setRunning(false);
        // reveal output with a beat after typing completes
        setTimeout(() => setOutputVisible(true), 450);
      }
    }, 16);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const lines = PROGRAM.slice(0, typed).split('\n');
  const typedLines = PROGRAM.split('\n').length;

  return (
    <div ref={hostRef} className="relative">
      {/* glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-3xl opacity-70 blur-2xl"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 40%, rgb(239 171 62 / 0.22), transparent 70%)',
        }}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-code-bg shadow-2xl">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-3 text-caption text-subtle">hello.eng</span>
          <span className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={startTyping}
              className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption text-subtle transition-colors hover:bg-surface-2 hover:text-text"
              aria-label="Replay typing animation"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Replay
            </button>
          </span>
        </div>

        {/* editor */}
        <div className="relative min-h-[248px] p-4 font-mono text-[13px] leading-[1.7] sm:text-sm">
          <pre className="overflow-x-auto text-code-text" aria-label="EngCode program being typed">
            <code>
              {lines.map((line, i) => (
                <span key={i} className="block">
                  <span className="mr-4 inline-block w-5 select-none text-right text-subtle/60">
                    {i + 1}
                  </span>
                  {highlight(line, i)}
                  {i === lines.length - 1 && typed < PROGRAM.length && (
                    <span
                      className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-brand-400"
                      aria-hidden="true"
                      style={{ animation: 'blink 1s step-end infinite' }}
                    />
                  )}
                </span>
              ))}
              {/* keep height stable while typing */}
              {typed < PROGRAM.length &&
                Array.from({ length: Math.max(0, typedLines - lines.length) }, (_, i) => (
                  <span key={`pad-${i}`} className="block opacity-0">
                    <span className="mr-4 inline-block w-5">0</span>placeholder
                  </span>
                ))}
            </code>
          </pre>
        </div>

        {/* output */}
        <div className="border-t border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-2 text-caption text-subtle">
            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
            Output
            {running && <span className="text-brand-600 dark:text-brand-400">typing…</span>}
          </div>
          <div className="mt-1.5 min-h-[92px] font-mono text-[13px] leading-relaxed text-code-text">
            {outputVisible ? (
              OUTPUT_LINES.map((line, i) => (
                <div
                  key={i}
                  className="flex gap-2"
                  style={{
                    animation: reduce ? undefined : 'fadeSlide 0.35s ease both',
                    animationDelay: reduce ? undefined : `${i * 0.14}s`,
                  }}
                >
                  <span className="text-subtle select-none">›</span>
                  <span>{line}</span>
                </div>
              ))
            ) : (
              <span className="text-subtle">
                {typed > 0 ? 'running when typing finishes…' : 'waiting for the program…'}
              </span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
