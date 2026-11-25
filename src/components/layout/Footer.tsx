import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { footerNav } from '@/config/nav';
import { ThemeToggle } from './ThemeToggle';

const year = new Date().getFullYear();

const socials = [
  {
    label: 'GitHub',
    href: siteConfig.github.url,
    path: 'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z',
  },
  {
    label: 'Discussions',
    href: `${siteConfig.github.url}/discussions`,
    path: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z',
  },
  {
    label: 'Releases',
    href: `${siteConfig.github.url}/releases`,
    path: 'M12 2v13M12 15l4-4M12 15l-4-4M5 21h14',
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="container-site py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="EngCode home">
              <span className="dark:hidden">
                <Image src="/brand/logo.png" alt="EngCode" width={130} height={50} className="h-8 w-auto" />
              </span>
              <span className="hidden dark:inline">
                <Image src="/brand/logo-color.png" alt="EngCode" width={130} height={50} className="h-8 w-auto" />
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-brand-400 hover:text-brand-600"
                  aria-label={social.label}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerNav).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h3 className="text-sm font-semibold text-text">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => {
                  const external = link.href.startsWith('http');
                  return (
                    <li key={link.label}>
                      {external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted transition-colors hover:text-link"
                        >
                          {link.label} ↗
                        </a>
                      ) : (
                        <Link href={link.href} className="text-sm text-muted transition-colors hover:text-link">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-subtle">
            © {year} EngCode contributors · v{siteConfig.latestRelease.version} · MIT licensed
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand-400 hover:text-text"
            >
              <Image src="/brand/logo-small.png" alt="" width={14} height={14} className="h-3.5 w-3.5" />
              Made with EngCode
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
