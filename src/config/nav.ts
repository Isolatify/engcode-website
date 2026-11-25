/**
 * Navigation structure shared by the header, footer and command palette.
 * One edit here updates all three.
 */
import { siteConfig } from './site.config';

/** Primary navbar — per spec: Docs, Playground, Download, Support. */
export const mainNav = [
  { label: 'Docs', href: '/docs' },
  { label: 'Playground', href: '/playground' },
  { label: 'Download', href: '/download' },
  { label: 'Support', href: '/support' },
] as const;

/** Extra indexable pages (footer + command palette). */
export const sitePages = [
  { label: 'Learn', href: '/learn' },
  { label: 'Examples', href: '/examples' },
  { label: 'Blog', href: '/blog' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'About', href: '/about' },
  { label: 'Community', href: '/community' },
  { label: 'Contribute', href: '/contribute' },
  { label: 'Cheat sheet', href: '/cheat-sheet' },
  { label: 'Press kit', href: '/brand' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'License', href: '/license' },
] as const;

export const footerNav = {
  Product: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Playground', href: '/playground' },
    { label: 'Download', href: '/download' },
    { label: 'Support', href: '/support' },
    { label: 'Cheat sheet', href: '/cheat-sheet' },
  ],
  Learn: [
    { label: 'Introduction', href: '/docs/introduction' },
    { label: 'Quick Start', href: '/docs/quick-start' },
    { label: 'Lessons', href: '/learn' },
    { label: 'Examples', href: '/examples' },
    { label: 'Tutorial', href: '/docs/quick-start' },
  ],
  Community: [
    { label: 'GitHub', href: siteConfig.github.url },
    { label: 'Discussions', href: `${siteConfig.github.url}/discussions` },
    { label: 'Issues', href: `${siteConfig.github.url}/issues` },
    { label: 'Contributors', href: '/community' },
    { label: 'Contribute', href: '/contribute' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Press kit', href: '/brand' },
    { label: 'About', href: '/about' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'License', href: '/license' },
  ],
} as const;
