'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';

type TabKey = 'website' | 'app';

const SNIPPETS: Record<
  TabKey,
  { label: string; code: string; caption: string }
> = {
  website: {
    label: 'Website',
    caption: 'Pages & blocks → markup · style blocks → CSS · when blocks → behavior',
    code: `app "Bloom Café":
    page "Home":
        navigation bar:
            link "Menu" to "#/menu"
            link "Visit" to "#/visit"
        end
        heading "Fresh bread, every morning"
        button "See the menu" called "menu button"
    end
end

style "menu button":
    padding is 14
    rounded corners of 12
end

when "menu button" is clicked:
    say "Opening the menu…"
end`,
  },
  app: {
    label: 'Desktop app',
    caption: 'One project runs on Windows and macOS',
    code: `app "To-do":
    page "Home":
        input called "task" with label "Add a task"
        button "Add" called "add"
        list called "tasks"
    end
end

keep track of tasks as an empty list

when "add" is clicked:
    set task to value of "task"
    if task is not empty:
        add task to tasks
        save tasks to the device as "tasks"
        clear "task"
        say "Added: " plus task
    end
end

when the page opens:
    load "tasks" from the device and save it as saved
end`,
  },
};

const TABS: { key: TabKey; label: string }[] = [
  { key: 'website', label: 'Website' },
  { key: 'app', label: 'Desktop app' },
];

function RenderedWebsite() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-b-xl bg-white text-[#111827]">
      {/* fake browser chrome */}
      <div className="flex items-center gap-2 border-b border-black/10 bg-[#f3f4f6] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate rounded bg-white px-3 py-0.5 text-xs text-gray-500">
          bloomcafe.example
        </span>
      </div>
      {/* rendered site */}
      <div className="flex-1 bg-gradient-to-b from-[#fff7ed] to-[#ffedd5] px-6 py-5">
        <div className="flex items-center justify-between">
          <span className="font-bold tracking-tight text-[#9a3412]" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Bloom Café
          </span>
          <span className="text-xs text-gray-600">Menu · Visit · Contact</span>
        </div>
        <div className="mt-6">
          <p className="text-2xl font-extrabold leading-tight text-[#1f2937]" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Fresh bread,
            <br />
            every morning
          </p>
          <button className="mt-4 rounded-full bg-[#efab3e] px-5 py-2.5 text-sm font-semibold text-[#1f2937] shadow-sm">
            See the menu
          </button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {['Sourdough', 'Croissant', 'Rye loaf'].map((item) => (
            <div key={item} className="rounded-lg bg-white p-2.5 text-center text-xs shadow-sm">
              <div className="mx-auto mb-1.5 h-8 w-8 rounded-full bg-[#fde68a]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RenderedApp() {
  const [tasks, setTasks] = useState(['Ship EngCode 1.0', 'Write the docs']);
  const [value, setValue] = useState('');

  const add = () => {
    const t = value.trim();
    if (!t) return;
    setTasks((v) => [...v, t]);
    setValue('');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-b-xl bg-[#141312] text-[#f5f2ec]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#1e1c1a] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-white/50">To-do — EngCode app</span>
      </div>
      <div className="flex-1 p-4">
        <p className="text-xs uppercase tracking-widest text-white/40">Today</p>
        <div className="mt-3 flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Add a task"
            aria-label="Add a task"
            className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/35 focus:border-brand-400"
          />
          <button
            type="button"
            onClick={add}
            className="rounded-lg bg-brand-400 px-4 text-sm font-semibold text-[#141312] transition-colors hover:bg-brand-300"
          >
            Add
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.li
                key={task}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm"
              >
                <span className="h-4 w-4 rounded border border-white/30" aria-hidden="true" />
                {task}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {tasks.length === 0 && (
          <p className="mt-6 text-center text-sm text-white/40">Nothing yet — add the first task.</p>
        )}
      </div>
      <div className="border-t border-white/10 px-4 py-2 text-xs text-white/40">
        {tasks.length} task{tasks.length === 1 ? '' : 's'} · saved to tasks.engdata
      </div>
    </div>
  );
}

export function SideBySide() {
  const [tab, setTab] = useState<TabKey>('website');
  const reduce = useReducedMotion();
  const snippet = SNIPPETS[tab];

  return (
    <section className="border-y border-border bg-bg-subtle py-20 md:py-28" aria-labelledby="sbs-heading">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            From sentence to software
          </p>
          <h2 id="sbs-heading" className="text-h2 mt-3">
            Write it in English, get a real app
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Same three layers every time — structure, styling and behavior. Here is what the code
            looks like next to what it makes.
          </p>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <div
            className="inline-flex rounded-full border border-border bg-surface p-1"
            role="tablist"
            aria-label="Choose a demo"
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  tab === t.key ? 'text-primary-text' : 'text-muted hover:text-text'
                }`}
              >
                {tab === t.key && (
                  <motion.span
                    layoutId="sbs-tab"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Side by side */}
        <Reveal delay={0.15} className="mt-10">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            {/* Code side */}
            <div className="overflow-hidden rounded-xl border border-border bg-code-bg shadow-lg">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-caption text-subtle">
                  {tab === 'website' ? 'site.eng' : 'todo.eng'}
                </span>
                <span className="text-caption text-subtle">EngCode</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={tab}
                  initial={reduce ? undefined : { opacity: 0, y: 8 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-code-text"
                >
                  <code>{snippet.code}</code>
                </motion.pre>
              </AnimatePresence>
            </div>

            {/* Rendered side */}
            <div className="min-h-[380px] overflow-hidden rounded-xl border border-border shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={reduce ? undefined : { opacity: 0, scale: 0.985 }}
                  animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {tab === 'website' ? <RenderedWebsite /> : <RenderedApp />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-subtle">{snippet.caption}</p>
        </Reveal>
      </div>
    </section>
  );
}
