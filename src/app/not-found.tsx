import Link from 'next/link';
import { Home } from 'lucide-react';
import { SearchLauncherButton } from '@/components/layout/SearchLauncherButton';

export default function NotFound() {
  return (
    <div className="container-site flex flex-col items-center py-24 text-center">
      <p className="font-mono text-sm text-subtle">engcode: error 404</p>
      <h1 className="text-h1 mt-4">This page left the program</h1>
      <p className="mt-4 max-w-md text-body-lg text-muted">
        Unlike a good error message, this one doesn&apos;t tell you where it went.
        Try searching, or head back to somewhere that compiles.
      </p>

      <div className="mt-8 w-full max-w-md rounded-xl border border-border bg-code-bg p-5 text-left">
        <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-code-text">
          <code>{`when the page is missing
  say "404 — but your next program starts here"
  go to "/"`}</code>
        </pre>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <SearchLauncherButton>Search the site</SearchLauncherButton>
        <Link href="/" className="btn-secondary">
          <Home className="h-4 w-4" aria-hidden="true" /> Go home
        </Link>
      </div>
    </div>
  );
}
