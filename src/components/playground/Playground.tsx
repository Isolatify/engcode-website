'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Check, Eraser, FileCode2, Loader2, Play, TriangleAlert } from 'lucide-react';
import type * as MonacoTypes from 'monaco-editor';
import { runProgram, type RunOutput } from '@/lib/engcode-runner';
import { CopyButton } from '@/components/ui/CopyButton';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[26rem] items-center justify-center text-subtle">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span className="ml-2 text-sm">Loading editor…</span>
    </div>
  ),
});

const STORAGE_KEY = 'engcode:website-playground';

const EXAMPLES: { id: string; label: string; code: string }[] = [
  {
    id: 'hello',
    label: 'Hello',
    code: `note: Your first EngCode program.
say "Hello, world!"

ask "What is your name?" and save it as name
say "Hello, " plus name plus "!"`,
  },
  {
    id: 'loops',
    label: 'Loops',
    code: `set total to 0
repeat 5 times:
    change total to total plus 1
end

count from 1 to 5 as number:
    say "Number " plus number
end

say "Total: " plus total`,
  },
  {
    id: 'lists',
    label: 'Lists and tables',
    code: `set people to a list of a table with name "Sam", age 25 and a table with name "Ada", age 36

for each person in people:
    say person's name plus " is " plus person's age
end

set fruits to a list of "pear", "apple", "fig"
sort fruits
say join fruits with ", "`,
  },
  {
    id: 'functions',
    label: 'Functions',
    code: `define greet with who default "friend":
    give back "Hello, " plus who
end

define factorial with n:
    if n is at most 1:
        give back 1
    end
    give back n times (call factorial with n minus 1)
end

say call greet with "Ada"
say factorial 6`,
  },
  {
    id: 'errors',
    label: 'Errors',
    code: `try:
    say 10 divided by 0
if it fails:
    say "Caught " plus the error
end

set answer to 42
if answer is 42:
    say "The answer to everything."
otherwise:
    say "Hmm, not quite."
end`,
  },
  {
    id: 'guess',
    label: 'Guessing game',
    code: `note: Play it! The playground asks for your guesses when you run it.
set secret to 50
set guesses to 0

repeat 3 times:
    ask for a number "Guess a number from 1 to 100" and save it as guess
    change guesses to guesses plus 1
    if guess is less than secret:
        say "Too low!"
    otherwise if guess is greater than secret:
        say "Too high!"
    otherwise:
        say "You got it in " plus guesses plus " guesses!"
        stop the loop
    end
end`,
  },
];

type MonacoNs = {
  languages: {
    register(x: { id: string }): void;
    setMonarchTokensProvider(id: string, x: unknown): void;
    defineTheme(id: string, x: unknown): void;
  };
  editor: { defineTheme(id: string, x: unknown): void; setTheme(id: string): void };
};

const BEFORE_MOUNT = (monaco: MonacoNs) => {
  monaco.languages.register({ id: 'engcode' });
  monaco.languages.setMonarchTokensProvider('engcode', {
    ignoreCase: true,
    tokenizer: {
      root: [
        [/note:.*$/, 'comment'],
        [/"(?:[^"\\]|\\.)*"/, 'string'],
        [/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/, 'number'],
        [/\b\d+(?:\.\d+)?\b/, 'number'],
        [
          /\b(?:say|ask|and|save|it|as|set|to|change|keep|track|of|if|otherwise|end|repeat|times|count|from|while|for|each|in|stop|the|loop|skip|next|one|define|with|default|give|back|try|fails|wait|seconds|add|remove|sort|reverse|shuffle|descending|not|and|or|is|greater|than|less|at|least|most|between|contains|starts|ends|plus|minus|divided|by|remainder|yes|no|nothing|pi|e|every|frame|call)\b/,
          'keyword',
        ],
        [/'s/, 'keyword'],
        [/[A-Za-z_][A-Za-z0-9_]*/, 'identifier'],
      ],
    },
  });
  monaco.editor.defineTheme('engcode-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '9e620e' },
      { token: 'string', foreground: '047857' },
      { token: 'number', foreground: '0369a1' },
      { token: 'comment', foreground: '8a837a', fontStyle: 'italic' },
    ],
    colors: {},
  });
  monaco.editor.defineTheme('engcode-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'f3c568' },
      { token: 'string', foreground: '4ade80' },
      { token: 'number', foreground: '38bdf8' },
      { token: 'comment', foreground: '8a837a', fontStyle: 'italic' },
    ],
    colors: {},
  });
};

export function Playground() {
  const { resolvedTheme } = useTheme();
  const [code, setCode] = useState<string>(EXAMPLES[0].code);
  const [exampleId, setExampleId] = useState<string>(EXAMPLES[0].id);
  const [result, setResult] = useState<RunOutput | null>(null);
  const [ran, setRan] = useState(false);
  const [ready, setReady] = useState(false);
  // Answers collected for `ask` prompts so far, in program order. A run
  // that needs more answers pauses (kind 'ask'), the editor shows an
  // inline prompt on the ask line (VS Code-style), and resuming replays
  // the program with the answers queued — the output is deterministic.
  // Answered values stay visible in the code as inline values, like a
  // debugger: name = Ava.
  type Answer = { line: number; value: string };
  const [answers, setAnswers] = useState<Answer[]>([]);
  const editorRef = useRef<MonacoTypes.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof MonacoTypes | null>(null);
  const askZoneRef = useRef<string | null>(null);
  const askZoneInputRef = useRef<HTMLInputElement | null>(null);
  const answerDecosRef = useRef<string[]>([]);

  // Restore the last program
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCode(saved);
        const savedExample = localStorage.getItem(`${STORAGE_KEY}:example`);
        if (savedExample) setExampleId(savedExample);
      }
    } catch {
      // private mode — no persistence
    }
    setReady(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, code);
      localStorage.setItem(`${STORAGE_KEY}:example`, exampleId);
    } catch {
      // quota / private mode — ignore
    }
  }, [code, exampleId, ready]);

  const run = useCallback(
    (queue: string[]) => {
      setResult(runProgram(code, queue));
      setRan(true);
    },
    [code],
  );

  /** The variable an ask on this line saves into, parsed from the source line. */
  const varNameForLine = useCallback(
    (line: number): string => {
      const text = code.split('\n')[line - 1] ?? '';
      const m = /save it as ([A-Za-z][\w' -]*)/i.exec(text);
      return m ? m[1].trim() : 'answer';
    },
    [code],
  );

  /** Remove the inline answer prompt from the editor. */
  const clearAskZone = useCallback(() => {
    const editor = editorRef.current;
    if (editor && askZoneRef.current) {
      editor.changeViewZones((accessor) => {
        if (askZoneRef.current) accessor.removeZone(askZoneRef.current);
      });
      askZoneRef.current = null;
      askZoneInputRef.current = null;
    }
  }, []);

  /** Render answered values inline in the code: name = Ava (debugger-style). */
  const renderAnswerDecorations = useCallback((list: Answer[]) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;
    const byLine = new Map<number, string[]>();
    for (const a of list) {
      const arr = byLine.get(a.line) ?? [];
      arr.push(a.value);
      byLine.set(a.line, arr);
    }
    const decos = [...byLine.entries()].map(([line, values]) => ({
      range: new monaco.Range(line, 1, line, model.getLineMaxColumn(line)),
      options: {
        after: {
          content: '   ' + values.map((v) => `${varNameForLine(line)} = ${v}`).join('   '),
          inlineClassName: 'pg-inline-answer',
        },
      },
    }));
    answerDecosRef.current = editor.deltaDecorations(answerDecosRef.current, decos);
  }, [varNameForLine]);

  const clearAnswerDecorations = useCallback(() => {
    const editor = editorRef.current;
    if (editor && answerDecosRef.current.length > 0) {
      editor.deltaDecorations(answerDecosRef.current, []);
      answerDecosRef.current = [];
    }
  }, []);

  /** Show the inline answer prompt right below the ask line. */
  const showAskZone = useCallback((line: number) => {
    const editor = editorRef.current;
    if (!editor) return;
    clearAskZone();
    editor.revealLineNearTop(line);
    editor.changeViewZones((accessor) => {
      const dom = document.createElement('div');
      dom.className = 'pg-ask-zone';
      const arrow = document.createElement('span');
      arrow.className = 'pg-ask-arrow';
      arrow.textContent = '❯';
      arrow.setAttribute('aria-hidden', 'true');
      const input = document.createElement('input');
      input.className = 'pg-ask-input';
      input.type = 'text';
      input.placeholder = 'Type your answer, then press Enter';
      input.setAttribute('aria-label', `Answer for the ask on line ${line}`);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitAnswerRef.current();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          input.blur();
        }
      });
      dom.append(arrow, input);
      askZoneRef.current = accessor.addZone({
        afterLineNumber: line,
        heightInLines: 1,
        domNode: dom,
      });
      askZoneInputRef.current = input;
      requestAnimationFrame(() => input.focus());
    });
  }, [clearAskZone]);

  // A fresh run from scratch: clear collected answers and start over.
  const runFresh = useCallback(() => {
    clearAskZone();
    clearAnswerDecorations();
    setAnswers([]);
    run([]);
  }, [run, clearAskZone, clearAnswerDecorations]);

  // Answer the inline prompt: record the value and resume the program.
  const submitAnswer = useCallback(() => {
    const value = (askZoneInputRef.current?.value ?? '').trim();
    if (!value) return;
    if (askZoneInputRef.current) askZoneInputRef.current.value = '';
    const line = result && result.kind === 'ask' ? result.line : 0;
    if (!line) return;
    const next = [...answers, { line, value }];
    setAnswers(next);
    run(next.map((a) => a.value));
  }, [result, answers, run]);

  const submitAnswerRef = useRef(submitAnswer);
  useEffect(() => {
    submitAnswerRef.current = submitAnswer;
  }, [submitAnswer]);


  const loadExample = (id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id) ?? EXAMPLES[0];
    setExampleId(id);
    setCode(ex.code);
    setAnswers([]);
    clearAskZone();
    clearAnswerDecorations();
    setResult(null);
    setRan(false);
  };

  // Ctrl/Cmd + Enter to run — Monaco focus is handled by the editor command;
  // this window listener covers focus outside the editor.
  const runFreshRef = useRef(runFresh);
  useEffect(() => {
    runFreshRef.current = runFresh;
  }, [runFresh]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.key === 'Enter' && (e.ctrlKey || e.metaKey))) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('.monaco-editor')) return; // editor command handles it
      e.preventDefault();
      runFreshRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const status = !ran
    ? { label: 'Ready', tone: 'idle' as const }
    : result && result.kind === 'ok'
      ? { label: 'Finished', tone: 'ok' as const }
      : result && result.kind === 'ask'
        ? { label: 'Waiting for your answer', tone: 'wait' as const }
        : { label: 'Please fix the program', tone: 'bad' as const };

  // Pause on `ask`: show the inline prompt in the editor on the ask line.
  // Otherwise put away the prompt and, when finished, keep the answers
  // visible as inline values in the code.
  useEffect(() => {
    if (result && result.kind === 'ask') {
      showAskZone(result.line);
    } else {
      clearAskZone();
      if (result && result.kind === 'ok') renderAnswerDecorations(answers);
      if (result && result.kind === 'error') clearAnswerDecorations();
    }
  }, [result, code, answers, showAskZone, clearAskZone, renderAnswerDecorations, clearAnswerDecorations]);

  const monacoTheme = resolvedTheme === 'dark' ? 'engcode-dark' : 'engcode-light';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor panel */}
      <section className="card flex min-w-0 flex-col overflow-hidden" aria-labelledby="pg-editor">
        <header className="flex flex-wrap items-center gap-3 border-b border-border bg-surface-2 px-4 py-3">
          <h2 id="pg-editor" className="flex items-center gap-2 font-heading text-sm font-semibold">
            <FileCode2 className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            your-program.eng
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="pg-examples" className="sr-only">
              Load an example
            </label>
            <select
              id="pg-examples"
              value={exampleId}
              onChange={(e) => loadExample(e.target.value)}
              className="h-8 rounded-lg border border-border bg-surface px-2.5 text-sm text-text"
            >
              {EXAMPLES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.label}
                </option>
              ))}
              {exampleId && !EXAMPLES.some((e) => e.id === exampleId) ? (
                <option value={exampleId}>Your program</option>
              ) : null}
            </select>
          </div>
        </header>

        <div className="h-[30rem] min-h-[30rem] w-full">
          <MonacoEditor
            height="100%"
            language="engcode"
            theme={monacoTheme}
            value={code}
            beforeMount={BEFORE_MOUNT}
            onChange={(v) => setCode(v ?? '')}
            onMount={(editor, monaco) => {
              editorRef.current = editor;
              monacoRef.current = monaco;
              // Monaco stops keydown propagation before it reaches window
              // listeners — register the run shortcut as an editor command.
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                () => runFreshRef.current(),
              );
            }}
            options={{
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
              fontLigatures: false,
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: 'none',
              overviewRulerLanes: 0,
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              automaticLayout: true,
              tabSize: 4,
              contextmenu: false,
            }}
          />
        </div>

        <footer className="flex flex-wrap items-center gap-3 border-t border-border bg-surface-2 px-4 py-3">
          <span className="text-sm text-muted">
            The program asks you questions as it runs — answer in the output panel.
          </span>
          <button type="button" onClick={runFresh} className="btn-primary ml-auto h-10 px-5 text-sm">
            <Play className="h-4 w-4" aria-hidden="true" />
            Run
            <kbd className="ml-1 hidden rounded border border-primary-soft-text/30 px-1.5 text-xs sm:inline">
              Ctrl
            </kbd>
            <kbd className="hidden rounded border border-primary-soft-text/30 px-1.5 text-xs sm:inline">
              Enter
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => loadExample(EXAMPLES_BY_ID[exampleId] ? exampleId : EXAMPLES[0].id)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-medium text-muted transition-colors hover:text-text"
            aria-label="Reset to the example"
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </footer>
      </section>

      {/* Output panel */}
      <section className="card flex min-w-0 flex-col overflow-hidden" aria-labelledby="pg-output">
        <header className="flex items-center gap-3 border-b border-border bg-surface-2 px-4 py-3">
          <h2 id="pg-output" className="font-heading text-sm font-semibold">
            Output
          </h2>
          <div className="ml-auto flex items-center gap-2">
            {ran && result && result.kind === 'ok' ? (
              <CopyButton text={result.lines.join('\n')} label="Copy output" />
            ) : null}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                status.tone === 'ok'
                  ? 'bg-success-surface text-success-text'
                  : status.tone === 'bad'
                    ? 'bg-error-surface text-error-text'
                    : status.tone === 'wait'
                      ? 'bg-primary-soft text-primary-soft-text'
                      : 'bg-surface text-subtle'
              }`}
              role="status"
              aria-live="polite"
            >
              {status.tone === 'ok' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
              {status.tone === 'bad' ? (
                <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
              ) : null}
              {status.label}
            </span>
          </div>
        </header>

        <div className="min-h-0 flex-1 px-4 py-4">
          {!ran ? (
            <p className="flex h-full min-h-64 items-center justify-center text-center text-sm text-subtle">
              Press Run to see what your program does.
            </p>
          ) : result && result.kind === 'ok' && result.lines.length === 0 ? (
            <p className="flex h-full min-h-64 items-center justify-center text-center text-sm text-subtle">
              The program finished without printing anything.
            </p>
          ) : result && result.kind === 'ok' ? (
            <pre
              tabIndex={0}
              className="max-h-[25rem] overflow-auto rounded-xl border border-border bg-code-bg p-4 font-mono text-sm leading-relaxed text-code-text"
            >
              {result.lines.join('\n')}
            </pre>
          ) : null}

          {result && result.kind === 'error' ? (
            <div className="rounded-xl border border-error/40 bg-error-surface p-4 text-sm text-error-text" role="alert">
              <p className="font-semibold">
                Oops — {result.line ? `line ${result.line}` : 'somewhere in your program'}
              </p>
              <p className="mt-1 leading-relaxed">{result.message}</p>
            </div>
          ) : null}

          {ran && result && result.kind === 'ok' && result.warnings.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {result.warnings.map((w, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-warning-surface px-3 py-2 text-xs text-warning-text"
                >
                  <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {w}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <footer className="border-t border-border bg-surface-2 px-4 py-3 text-xs leading-relaxed text-subtle">
          This browser runner supports the core script language. Apps, files, device storage and
          the network run with the desktop CLI —{' '}
          <code className="rounded border border-border bg-code-bg px-1">engcode playground</code>.
        </footer>
      </section>
    </div>
  );
}

const EXAMPLES_BY_ID = Object.fromEntries(EXAMPLES.map((e) => [e.id, e]));
