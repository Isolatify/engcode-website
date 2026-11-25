'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Copy-to-clipboard button with a brief "copied" confirmation. */
export function CopyButton({
  text,
  className = '',
  label = 'Copy',
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (insecure context) — fall back to a prompt
      window.prompt('Copy:', text);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle transition-colors hover:bg-surface-2 hover:text-text ${
        copied ? 'text-success' : ''
      } ${className}`}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
