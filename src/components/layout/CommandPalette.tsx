'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { mainNav, sitePages } from '@/config/nav';
import { docsFlat, docsHref } from '@/config/docs';
import { siteConfig } from '@/config/site.config';

type Entry = {
  label: string;
  href: string;
  hint: string;
  group: string;
  keywords: string;
};

const PAGES: Entry[] = [
  ...mainNav.map((n) => ({
    label: n.label,
    href: n.href,
    hint: 'Page',
    group: 'Pages',
    keywords: n.label.toLowerCase(),
  })),
  ...sitePages.map((n) => ({
    label: n.label,
    href: n.href,
    hint: 'Page',
    group: 'Pages',
    keywords: n.label.toLowerCase(),
  })),
  ...[
    { label: 'EngCode 1.0.0 is here', href: '/blog/engcode-1-0-0' },
    { label: 'Why EngCode reads like English', href: '/blog/why-engcode-reads-like-english' },
    { label: 'Zero to desktop app in 15 minutes', href: '/blog/zero-to-desktop-app' },
  ].map((n) => ({
    label: n.label,
    href: n.href,
    hint: 'Blog',
    group: 'Pages',
    keywords: `${n.label} blog post`.toLowerCase(),
  })),
  ...docsFlat.map((d) => ({
    label: d.title,
    href: docsHref(d.slug),
    hint: d.group,
    group: 'Documentation',
    keywords: `${d.title} ${d.description} ${d.group}`.toLowerCase(),
  })),
  {
    label: 'GitHub repository',
    href: siteConfig.github.url,
    hint: 'External',
    group: 'Links',
    keywords: 'github repository source code stars open source',
  },
];

function score(entry: Entry, query: string) {
  const q = query.toLowerCase();
  const label = entry.label.toLowerCase();
  if (label === q) return 0;
  if (label.startsWith(q)) return 1;
  if (label.includes(q)) return 2;
  if (entry.keywords.includes(q)) return 3;
  // loose: every token appears somewhere
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every((t) => entry.keywords.includes(t) || label.includes(t))) return 4;
  return -1;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return PAGES.slice(0, 12);
    return PAGES.map((e) => ({ e, s: score(e, query.trim()) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s)
      .slice(0, 14)
      .map((r) => r.e);
  }, [query]);

  // Open / close from anywhere with Cmd/Ctrl+K, or the 'engcode:toggle-search'
  // custom event that the header and 404 buttons dispatch.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onToggle = () => setOpen((v) => !v);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('engcode:toggle-search', onToggle);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('engcode:toggle-search', onToggle);
    };
  }, []);

  // Reset state on open, focus input
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      // wait a tick so the input exists
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Clamp active when results change
  useEffect(() => setActive(0), [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (entry: Entry) => {
    setOpen(false);
    if (entry.href.startsWith('http')) {
      window.open(entry.href, '_blank', 'noopener,noreferrer');
    } else {
      // Use a plain navigation so it works from any route
      window.location.href = entry.href;
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/50 px-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages and docs…"
            className="w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-subtle"
            aria-label="Search pages and documentation"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={`cp-item-${active}`}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                const entry = results[active];
                if (entry) choose(entry);
              }
            }}
          />
          <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 text-caption text-subtle sm:block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <ul
          id="command-palette-list"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="max-h-[50vh] overflow-y-auto p-2"
        >
          {results.map((entry, i) => (
            <li
              key={entry.href + entry.label}
              id={`cp-item-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(entry)}
              className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-[15px] ${
                i === active ? 'bg-surface-2 text-text' : 'text-muted'
              }`}
            >
              <span className="flex items-center gap-2.5">
                {entry.group === 'Documentation' ? (
                  <FileText className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
                )}
                <span>{entry.label}</span>
              </span>
              <span className="flex items-center gap-2 text-caption text-subtle">
                {entry.hint}
                {i === active && <CornerDownLeft className="h-3.5 w-3.5" aria-hidden="true" />}
              </span>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-subtle">
              No results for “{query}”. Try “variables”, “install” or “playground”.
            </li>
          )}
        </ul>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-border bg-bg-subtle px-4 py-2 text-caption text-subtle">
          <span>
            <kbd className="rounded border border-border bg-surface px-1">↑</kbd>{' '}
            <kbd className="rounded border border-border bg-surface px-1">↓</kbd> to navigate ·{' '}
            <kbd className="rounded border border-border bg-surface px-1">↵</kbd> to open
          </span>
          <span>{PAGES.length} pages indexed</span>
        </div>
      </div>
    </div>
  );
}
