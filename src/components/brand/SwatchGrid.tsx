'use client';

import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';

type Swatch = {
  name: string;
  hex: string;
  use: string;
  textOnIt?: string;
};

const SWATCHES: Swatch[] = [
  {
    name: 'Brand amber',
    hex: '#EFAB3E',
    use: 'Primary actions, accents, highlights. Never for body text.',
    textOnIt: '#141312',
  },
  {
    name: 'Deep ink',
    hex: '#141312',
    use: 'Headings and body copy on light surfaces; dark backgrounds.',
    textOnIt: '#FAF9F6',
  },
  {
    name: 'Warm paper',
    hex: '#FAF9F6',
    use: 'Default page background and light surfaces.',
    textOnIt: '#141312',
  },
  {
    name: 'Wordmark black',
    hex: '#000000',
    use: 'Wordmark on light backgrounds and one-colour print.',
    textOnIt: '#FAF9F6',
  },
];

/** Color swatches that copy their hex on click — press-kit ergonomics. */
export function SwatchGrid() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      window.setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1600);
    } catch {
      window.prompt('Copy colour:', hex);
    }
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SWATCHES.map((swatch) => {
        const isCopied = copied === swatch.hex;
        return (
          <button
            key={swatch.hex}
            type="button"
            onClick={() => copy(swatch.hex)}
            aria-label={`Copy ${swatch.name} ${swatch.hex}`}
            className="card card-hover overflow-hidden text-left"
          >
            <span
              className="flex h-24 w-full items-end justify-end p-3"
              style={{ backgroundColor: swatch.hex }}
            >
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/10 backdrop-blur-sm"
                style={{ color: swatch.textOnIt }}
                aria-hidden="true"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </span>
            </span>
            <span className="block p-4">
              <span className="block font-heading text-sm font-semibold">{swatch.name}</span>
              <span className="mt-0.5 block font-mono text-sm text-muted">
                {isCopied ? 'Copied!' : swatch.hex}
              </span>
              <span className="mt-2 block text-caption leading-relaxed text-subtle">
                {swatch.use}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
