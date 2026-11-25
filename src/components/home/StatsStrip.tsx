'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Star, Download, GitFork, Users } from 'lucide-react';
import { useGitHubStats, formatCount } from '@/lib/use-github-stats';

function useCounter(target: number | null, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!run || target === null) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration, reduce]);
  return target === null ? null : value;
}

function Stat({
  value,
  suffix = '',
  label,
  icon,
  run,
}: {
  value: number | null;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
  run: boolean;
}) {
  const n = useCounter(value, run);
  const display = formatCount(value, suffix);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1.5 px-6 py-10 text-center"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text">
        {icon}
      </span>
      <span className="font-heading text-h3 font-extrabold tracking-tight">{display}</span>
      <span className="max-w-44 text-sm text-muted">{label}</span>
    </motion.div>
  );
}

/**
 * Real numbers, live from the GitHub + npm APIs (see useGitHubStats).
 * They render as "—" until loaded — never invented.
 */
export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { stars, forks, contributors, npmDownloads } = useGitHubStats();

  return (
    <section className="border-y border-border bg-bg-subtle" aria-label="EngCode by the numbers">
      <div
        ref={ref}
        className="container-site grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4"
      >
        <Stat run={inView} value={stars} suffix="+" label="GitHub stars" icon={<Star className="h-5 w-5 fill-current" />} />
        <Stat run={inView} value={npmDownloads} suffix="+" label="npm downloads, last 30 days" icon={<Download className="h-5 w-5" />} />
        <Stat run={inView} value={forks} suffix="+" label="GitHub forks" icon={<GitFork className="h-5 w-5" />} />
        <Stat run={inView} value={contributors} suffix="+" label="Contributors" icon={<Users className="h-5 w-5" />} />
      </div>
    </section>
  );
}
