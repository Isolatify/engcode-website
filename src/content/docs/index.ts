import type { DocPage } from './types';
import { gettingStarted } from './getting-started';
import { languageGuide } from './language-guide';
import { buildingApps } from './building-apps';
import { reference } from './reference';

export * from './types';

export type { DocPage } from './types';

const groups: DocPage[][] = [gettingStarted, languageGuide, buildingApps, reference];

/** Every docs page in registry order. */
export const allDocsPages: DocPage[] = groups.flat();

const bySlug = new Map(allDocsPages.map((p) => [p.slug, p]));

export function getDocPage(slug: string): DocPage | undefined {
  return bySlug.get(slug);
}

export function getDocNeighbors(slug: string): { prev: DocPage | null; next: DocPage | null } {
  const i = allDocsPages.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? allDocsPages[i - 1] : null,
    next: i >= 0 && i < allDocsPages.length - 1 ? allDocsPages[i + 1] : null,
  };
}

/** h2 headings for the "on this page" list. */
export function getDocToc(page: DocPage) {
  return page.blocks
    .filter((b): b is Extract<typeof b, { t: 'h2' }> => b.t === 'h2')
    .map((b) => ({ id: b.id!, text: b.text }));
}
