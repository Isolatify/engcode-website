'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { docsGroups } from '@/config/docs';
import { docsHref } from '@/config/docs';

/**
 * Docs sidebar. Desktop: sticky column. Mobile: horizontal scroll chips.
 */
export function DocsSidebar({ currentSlug }: { currentSlug?: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Docs" className="sticky top-24 hidden w-56 shrink-0 lg:block">
        {docsGroups.map((group) => (
          <div key={group.title} className="mb-7">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-subtle">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const href = docsHref(item.slug);
                const active = item.slug === currentSlug;
                const childOpen = pathname.startsWith('/docs') && active;
                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? 'bg-primary-soft font-medium text-primary-soft-text'
                          : 'text-muted hover:bg-surface-2 hover:text-text'
                      } ${childOpen ? '' : ''}`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Mobile: scrollable group chips */}
      <nav aria-label="Docs sections" className="lg:hidden">
        <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {docsGroups.flatMap((g) => g.items).map((item) => {
            const active = item.slug === currentSlug;
            return (
              <Link
                key={item.slug}
                href={docsHref(item.slug)}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? 'border-primary/50 bg-primary-soft font-medium text-primary-soft-text'
                    : 'border-border bg-surface text-muted'
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
