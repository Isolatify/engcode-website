'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Bug,
  MessagesSquare,
  BookOpen,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';

const FAQS = [
  {
    q: 'Do I need to know another programming language first?',
    a: 'No. EngCode is designed to be a first language — the docs and lessons assume you are starting from zero.',
  },
  {
    q: 'Is EngCode free?',
    a: 'Yes. MIT licensed and open source, for personal, educational and commercial use.',
  },
  {
    q: 'Which operating systems are supported?',
    a: 'Windows 10+ and macOS 12+ (Apple Silicon and Intel) for desktop apps, any OS with Node.js for scripts and websites, plus the in-browser playground.',
  },
  {
    q: 'Can I build real websites and apps with it?',
    a: 'Yes. Websites and desktop apps are first-class project types, built from the same three layers: blocks, styling and behavior.',
  },
  {
    q: 'The playground says my code has an error — what now?',
    a: 'Errors show the line number and a plain-English explanation. Fix the highlighted line and the playground re-runs automatically. If the message seems wrong, please open a bug report — friendly errors are a feature we maintain.',
  },
  {
    q: 'How do I report a bug?',
    a: 'Use the “Report a bug” card below — it opens a GitHub issue with the right template pre-filled. Include your OS, EngCode version and the smallest example that reproduces the problem.',
  },
  {
    q: 'Where can I ask a question?',
    a: 'GitHub Discussions is best for questions (it stays searchable for the next person). Discord, if linked in the repository README, is for quick chat.',
  },
  {
    q: 'How do I update to the latest version?',
    a: 'Run the same install command you used originally — npm install -g engcode, or re-run the curl/PowerShell script. Check with engcode --version.',
  },
];

function FaqItem({ item, index }: { item: (typeof FAQS)[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="border-b border-border last:border-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:text-link md:px-6"
        >
          <span className="font-heading text-[15px] font-semibold leading-snug">{item.q}</span>
          <motion.span
            animate={reduce ? undefined : { rotate: open ? 45 : 0 }}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
              open ? 'border-brand-400 bg-primary text-primary-text' : 'border-border text-subtle'
            }`}
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? undefined : { height: 0, opacity: 0 }}
            animate={reduce ? undefined : { height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted md:px-6">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SupportContent() {
  const channels = [
    {
      icon: Bug,
      title: 'Report a bug',
      text: 'Opens a GitHub issue with our bug template pre-filled — include steps to reproduce.',
      href: `${siteConfig.github.url}/issues/new/choose`,
      cta: 'New issue',
    },
    {
      icon: MessagesSquare,
      title: 'Ask the community',
      text: 'GitHub Discussions for questions, ideas and show-and-tell. Searchable and beginner-safe.',
      href: `${siteConfig.github.url}/discussions`,
      cta: 'Open Discussions',
    },
    {
      icon: BookOpen,
      title: 'Browse the FAQ',
      text: 'Quick answers in the docs — installation, syntax, apps and the CLI.',
      href: '/docs/faq',
      cta: 'Docs FAQ',
      internal: true,
    },
  ];

  return (
    <>
      {/* Channels */}
      <section className="container-site py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {channels.map((c, i) => {
            const Icon = c.icon;
            const inner = (
              <>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-h4 mt-4">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-link">
                  {c.cta} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </>
            );
            return (
              <Reveal key={c.title} delay={i * 0.08}>
                {c.internal ? (
                  <a href={c.href} className="card block h-full p-6 card-hover">
                    {inner}
                  </a>
                ) : (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="card block h-full p-6 card-hover">
                    {inner}
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-bg-subtle py-14" aria-labelledby="support-faq">
        <div className="container-site max-w-3xl">
          <h2 id="support-faq" className="text-h2 text-center">
            Frequently asked questions
          </h2>
          <div className="card mt-8 overflow-hidden">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Community links + status */}
      <section className="container-site py-14">
        <Reveal className="mx-auto max-w-2xl space-y-6">
          <div className="card p-6">
            <h3 className="text-h4">Community links</h3>
            <ul className="mt-4 space-y-3">
              {[
                { label: 'GitHub repository', href: siteConfig.github.url },
                { label: 'GitHub Issues', href: `${siteConfig.github.url}/issues` },
                { label: 'GitHub Discussions', href: `${siteConfig.github.url}/discussions` },
                { label: 'Releases & changelog', href: `${siteConfig.github.url}/releases` },
                { label: 'Contribution guide', href: '/contribute', internal: true },
                { label: 'Lessons', href: '/learn', internal: true },
              ].map((link) => (
                <li key={link.label}>
                  {link.internal ? (
                    <a href={link.href} className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-link">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-link"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                      {link.label} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div id="status" className="card scroll-mt-24 p-6">
            <h3 className="text-h4">Project status</h3>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-2 rounded-full bg-success-surface px-3 py-1 font-medium text-success-text">
                <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" /> All systems working
              </span>
              <span>
                Latest version: <strong className="text-text">v{siteConfig.latestRelease.version}</strong>
              </span>
              <a href="/changelog" className="text-link underline underline-offset-2">
                See the changelog
              </a>
            </div>
            <p className="mt-4 text-caption text-subtle">
              Outages, if any, are announced in GitHub Discussions. The playground and docs are
              static — they work even when the API does not.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
