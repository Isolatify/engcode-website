'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Search, Star } from 'lucide-react';
import { mainNav } from '@/config/nav';
import { siteConfig } from '@/config/site.config';
import { useGitHubStats, formatCount } from '@/lib/use-github-stats';
import { ThemeToggle } from './ThemeToggle';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { stars } = useGitHubStats();

  // Sticky shrink + blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => setMenuOpen(false), [pathname]);

  const formatStars = formatCount;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-border bg-bg/85 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="container-site flex h-16 items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="EngCode home">
          <span className="dark:hidden">
            <Image src="/brand/logo.png" alt="EngCode" width={130} height={50} priority className="h-8 w-auto" />
          </span>
          <span className="hidden dark:inline">
            <Image src="/brand/logo-color.png" alt="EngCode" width={130} height={50} priority className="h-8 w-auto" />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'text-text' : 'text-muted hover:text-text'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-brand-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Search */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('engcode:toggle-search'))}
            className="hidden h-9 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-subtle transition-colors hover:border-border-strong hover:text-text sm:flex"
            aria-label="Search (keyboard shortcut Control K)"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Search</span>
            <kbd className="rounded border border-border bg-surface-2 px-1.5 text-caption">Ctrl K</kbd>
          </button>

          <ThemeToggle />

          {/* GitHub stars */}
          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm font-medium text-text transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-sm sm:flex"
          >
            <Star className="h-4 w-4 fill-current" aria-hidden="true" />
            <span>Star</span>
            {stars !== null && (
              <span className="text-subtle" aria-label={`${stars} stars`}>
                {formatStars(stars)}
              </span>
            )}
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-text lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav id="mobile-menu" className="border-t border-border bg-bg lg:hidden" aria-label="Main menu">
          <div className="container-site flex flex-col gap-1 py-4">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-md px-3 py-2.5 text-base font-medium ${
                    active ? 'bg-surface-2 text-text' : 'text-muted hover:bg-surface-2 hover:text-text'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                window.dispatchEvent(new Event('engcode:toggle-search'));
              }}
              className="mt-2 flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-base text-muted"
            >
              <Search className="h-4 w-4" /> Search
            </button>
            <a
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium text-muted hover:bg-surface-2 hover:text-text"
            >
              <Star className="h-4 w-4 fill-current" /> GitHub
              {stars !== null && <span className="text-subtle">{formatStars(stars)}</span>} ↗
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
