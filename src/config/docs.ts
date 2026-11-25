/**
 * Central docs registry: drives the sidebar, search palette, prev/next
 * links and the sitemap. Adding a page here wires it everywhere.
 */
export type DocsGroup = {
  title: string;
  items: { title: string; slug: string; description: string }[];
};

export const docsGroups: DocsGroup[] = [
  {
    title: 'Getting started',
    items: [
      {
        title: 'Introduction',
        slug: 'introduction',
        description: 'What EngCode is and why it reads like simple English.',
      },
      {
        title: 'Installation',
        slug: 'installation',
        description: 'Install the EngCode CLI on Windows, macOS or any OS with Node.js.',
      },
      {
        title: 'Quick Start',
        slug: 'quick-start',
        description: 'Write and run your first EngCode program in five minutes.',
      },
    ],
  },
  {
    title: 'Language guide',
    items: [
      { title: 'Variables', slug: 'variables', description: 'Store and change information with set … to …' },
      { title: 'Data Types', slug: 'data-types', description: 'Text, numbers, true/false, lists and tables.' },
      { title: 'Conditions', slug: 'conditions', description: 'Make decisions with when … otherwise …' },
      { title: 'Loops', slug: 'loops', description: 'Repeat work with repeat, for each and while.' },
      { title: 'Input/Output', slug: 'input-output', description: 'Say things to the user and ask them questions.' },
      { title: 'Arrays', slug: 'arrays', description: 'Keep ordered collections of things in lists.' },
      { title: 'Functions', slug: 'functions', description: 'Name a piece of work and reuse it anywhere.' },
    ],
  },
  {
    title: 'Building apps',
    items: [
      { title: 'Styling', slug: 'styling', description: 'Colors, spacing and layout — the look of your app.' },
      { title: 'Blocks', slug: 'blocks', description: 'Structure your interface with blocks, like HTML.' },
      { title: 'Websites', slug: 'websites', description: 'Build and publish a website with EngCode.' },
      { title: 'Apps', slug: 'apps', description: 'Ship desktop apps for Windows and macOS.' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { title: 'Standard Library', slug: 'standard-library', description: 'Every built-in command, grouped by category.' },
      { title: 'CLI Reference', slug: 'cli', description: 'Every engcode command and flag.' },
      { title: 'VS Code Extension', slug: 'vscode-extension', description: 'Syntax highlighting, run button and icon theme.' },
      { title: 'FAQ', slug: 'faq', description: 'Quick answers to the most common questions.' },
    ],
  },
];

/** Flat list in reading order — used for prev/next and search. */
export const docsFlat = docsGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title })),
);

export function docsHref(slug: string) {
  return `/docs/${slug}`;
}
