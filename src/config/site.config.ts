/**
 * Single source of truth for site-wide values: URLs, brand, release info.
 * Every "unknown" is marked TODO so nothing ships as a silent guess.
 */
export const siteConfig = {
  name: 'EngCode',
  slogan: 'Build with Simple English',
  description:
    'EngCode is a programming language written in plain English. Build scripts, websites and apps for Windows and macOS — no confusing symbols, no years of study.',
  url: 'https://engcode.vercel.app',
  locale: 'en',

  github: {
    url: 'https://github.com/Isolatify/engcode',
    repo: 'Isolatify/engcode',
    fallback: {
      // Used only when the GitHub API is unreachable (rate limit / offline).
      stars: 0,
    },
  },

  latestRelease: {
    version: '1.0.0',
    date: '2026-11-12',
  },

  vscodeExtension: {
    // Published on the VS Code Marketplace: engcode.engcode
    marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=engcode.engcode',
    itemName: 'engcode.engcode',
    // Also ships as a .vsix in the repository for offline installs.
    vsixUrl: 'https://github.com/Isolatify/engcode/raw/main/editor/vscode/engcode-1.0.0.vsix',
    repoPath: 'editor/vscode',
  },

  /**
   * Privacy-friendly analytics. Left empty on purpose — the script tag only
   * renders when a domain is set here.
   * TODO(analytics): set a Plausible domain before launch if desired.
   */
  analytics: {
    plausibleDomain: '',
  },
} as const;

export type SiteConfig = typeof siteConfig;
