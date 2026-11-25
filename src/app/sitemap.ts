import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';
import { docsFlat, docsHref } from '@/config/docs';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages = [
    '',
    '/docs',
    '/playground',
    '/download',
    '/support',
    '/learn',
    '/examples',
    '/blog',
    '/changelog',
    '/roadmap',
    '/about',
    '/community',
    '/contribute',
    '/cheat-sheet',
    '/brand',
    '/privacy',
    '/terms',
    '/license',
    '/blog/engcode-1-0-0',
    '/blog/why-engcode-reads-like-english',
    '/blog/zero-to-desktop-app',
  ];

  const docsPages = docsFlat.map((d) => docsHref(d.slug));

  return [...staticPages, ...docsPages].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency: path.startsWith('/blog') ? 'monthly' : 'weekly',
    priority: path === '' ? 1 : path.startsWith('/docs') ? 0.8 : 0.7,
  }));
}
