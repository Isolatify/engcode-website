'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';

const ORDER = ['light', 'dark', 'system'] as const;
type Mode = (typeof ORDER)[number];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render a stable placeholder until mounted to avoid hydration mismatch.
  const mode: Mode = mounted && theme ? (theme as Mode) : 'system';

  const next = () => {
    const i = ORDER.indexOf(mode);
    setTheme(ORDER[(i + 1) % ORDER.length]);
  };

  const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={next}
      aria-label={`Change theme (currently ${mode})`}
      title={`Theme: ${mode} — click to change`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      {mounted ? (
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <span className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}
