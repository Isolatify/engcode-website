'use client';

import { Printer } from 'lucide-react';

/** Prints the cheat sheet. window.print() only exists in the browser. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-secondary"
      aria-label="Print the cheat sheet"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Print this page
    </button>
  );
}
