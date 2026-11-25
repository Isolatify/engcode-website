'use client';

import { Search } from 'lucide-react';

/**
 * Opens the global command palette via the 'engcode:toggle-search' event the
 * CommandPalette listens for — server components cannot attach handlers.
 */
export function SearchLauncherButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('engcode:toggle-search'))}
      className="btn-primary"
    >
      <Search className="h-4 w-4" aria-hidden="true" /> {children}
    </button>
  );
}
