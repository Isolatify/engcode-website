/**
 * Docs content model. Every docs page is a list of typed blocks rendered by
 * DocBody — keeping content as data (not JSX) lets the sidebar, palette,
 * sitemap and "on this page" lists all derive from one source.
 */
export type Block =
  | { t: 'p'; text: string }
  | { t: 'h2'; text: string; id?: string }
  | { t: 'h3'; text: string; id?: string }
  | { t: 'code'; code: string; caption?: string; lang?: 'engcode' | 'bash' | 'text' }
  | { t: 'ul'; items: string[] }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'callout'; kind: 'info' | 'tip' | 'warn'; title?: string; text: string };

export type DocPage = {
  slug: string;
  title: string;
  blocks: Block[];
};

/** Inline formatting shared by paragraph text: `code`, **bold**, [links](href). */
export type Inline =
  | { t: 'text'; text: string }
  | { t: 'code'; text: string }
  | { t: 'bold'; text: string }
  | { t: 'link'; text: string; href: string };

/** Parse `code`, **bold** and [text](href) spans out of a plain string. */
export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ t: 'text', text: text.slice(last, m.index) });
    if (m[1]) out.push({ t: 'code', text: m[1].slice(1, -1) });
    else if (m[2]) out.push({ t: 'bold', text: m[2].slice(2, -2) });
    else if (m[3]) {
      const linkText = m[3].slice(1, m[3].indexOf(']'));
      const href = m[3].slice(m[3].indexOf(']') + 2, -1);
      out.push({ t: 'link', text: linkText, href });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ t: 'text', text: text.slice(last) });
  return out;
}

/** Slug for a heading — used for ids and the "on this page" list. */
export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
