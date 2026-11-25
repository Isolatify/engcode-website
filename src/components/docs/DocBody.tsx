import type { ReactNode } from 'react';
import { parseInline, headingId, type Block, type Inline } from '@/content/docs/types';
import { CopyButton } from '@/components/ui/CopyButton';

/* ------------------------------------------------------------------ *
 * EngCode syntax highlighting (server-side, deterministic)
 * ------------------------------------------------------------------ */

const ENG_KEYWORDS = new Set([
  'note', 'set', 'to', 'change', 'add', 'remove', 'from', 'say', 'ask', 'for', 'save', 'as',
  'it', 'if', 'otherwise', 'end', 'repeat', 'times', 'each', 'in', 'count', 'while', 'stop',
  'the', 'loop', 'skip', 'next', 'one', 'define', 'with', 'give', 'back', 'try', 'fails',
  'use', 'read', 'write', 'file', 'files', 'append', 'delete', 'get', 'send', 'data', 'play',
  'sound', 'show', 'hide', 'clear', 'go', 'page', 'open', 'close', 'keep', 'track', 'sort',
  'reverse', 'shuffle', 'descending', 'wait', 'seconds', 'draw', 'canvas', 'plus', 'minus',
  'times', 'divided', 'by', 'remainder', 'and', 'or', 'not', 'is', 'greater', 'than', 'less',
  'at', 'least', 'most', 'between', 'contains', 'starts', 'ends', 'empty', 'of', 'yes', 'no',
  'nothing', 'new', 'kind', 'thing', 'has', 'can', 'its', 'called', 'showing', 'level',
  'default', 'on', 'text', 'number', 'list', 'table', 'function', 'value', 'item', 'last',
  'length', 'JSON', 'error', 'every', 'when', 'app', 'row', 'column', 'section', 'card',
  'heading', 'paragraph', 'button', 'input', 'theme', 'frame', 'style', 'form', 'link',
  'divider', 'popup', 'image', 'menu', 'grid',
]);

type Tok = { text: string; kind: 'kw' | 'str' | 'num' | 'com' | 'plain' };

function tokenizeEngCode(code: string): Tok[][] {
  return code.split('\n').map((line) => {
    const toks: Tok[] = [];
    let rest = line;
    // Whole-line comment: note: …
    const noteMatch = rest.match(/^(\s*)(note:.*)$/);
    if (noteMatch) {
      if (noteMatch[1]) toks.push({ text: noteMatch[1], kind: 'plain' });
      toks.push({ text: noteMatch[2], kind: 'com' });
      return toks;
    }
    const re = /("[^"]*")|(\b\d+(?:\.\d+)?\b)|(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b)|([A-Za-z_']+)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(rest))) {
      if (m.index > last) toks.push({ text: rest.slice(last, m.index), kind: 'plain' });
      if (m[1]) toks.push({ text: m[1], kind: 'str' });
      else if (m[2]) toks.push({ text: m[2], kind: 'num' });
      else if (m[3]) toks.push({ text: m[3], kind: 'num' });
      else {
        const word = m[4];
        const bare = word.replace(/'s$/, '');
        toks.push({
          text: word,
          kind: ENG_KEYWORDS.has(bare) || ENG_KEYWORDS.has(word) ? 'kw' : 'plain',
        });
      }
      last = m.index + m[0].length;
    }
    if (last < rest.length) toks.push({ text: rest.slice(last), kind: 'plain' });
    return toks;
  });
}

function highlightEng(code: string): ReactNode {
  return tokenizeEngCode(code).map((line, i) => (
    <span key={i} className="block">
      {line.map((tok, j) =>
        tok.kind === 'plain' ? (
          tok.text
        ) : tok.kind === 'kw' ? (
          <span key={j} className="text-brand-700 dark:text-brand-300">
            {tok.text}
          </span>
        ) : tok.kind === 'str' ? (
          <span key={j} className="text-emerald-700 dark:text-emerald-400">
            {tok.text}
          </span>
        ) : tok.kind === 'num' ? (
          <span key={j} className="text-sky-700 dark:text-sky-400">
            {tok.text}
          </span>
        ) : (
          <span key={j} className="text-subtle italic">
            {tok.text}
          </span>
        ),
      )}
    </span>
  ));
}

function highlightBash(code: string): ReactNode {
  return code.split('\n').map((line, i) => {
    const isComment = /^\s*#/.test(line);
    if (isComment) {
      return (
        <span key={i} className="block text-subtle italic">
          {line}
        </span>
      );
    }
    const parts = line.split(/(\s)/);
    return (
      <span key={i} className="block">
        {parts.map((part, j) =>
          part === 'engcode' || part === 'npm' || part === 'code' || part === 'curl' || part === 'irm' ? (
            <span key={j} className="text-brand-700 dark:text-brand-300">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    );
  });
}

/* ------------------------------------------------------------------ *
 * Inline formatting
 * ------------------------------------------------------------------ */

function renderInline(nodes: Inline[], keyPrefix: string): ReactNode {
  return nodes.map((n, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (n.t) {
      case 'code':
        return (
          <code key={key} className="rounded border border-border bg-code-bg px-1.5 text-[0.875em]">
            {n.text}
          </code>
        );
      case 'bold':
        return (
          <strong key={key} className="font-semibold text-text">
            {n.text}
          </strong>
        );
      case 'link':
        return (
          <a key={key} href={n.href} className="underline decoration-brand/60 underline-offset-2 hover:text-link">
            {n.text}
          </a>
        );
      default:
        return n.text;
    }
  });
}

/* ------------------------------------------------------------------ *
 * Block renderer
 * ------------------------------------------------------------------ */

export function DocBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="doc-body">
      {blocks.map((b, i) => (
        <BlockRenderer key={i} block={b} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.t) {
    case 'h2': {
      const id = block.id ?? headingId(block.text);
      return (
        <h2 id={id} className="scroll-mt-24 pt-6 font-heading text-h3 font-bold tracking-tight">
          {block.text}
        </h2>
      );
    }
    case 'h3': {
      const id = block.id ?? headingId(block.text);
      return (
        <h3 id={id} className="scroll-mt-24 pt-4 font-heading text-h4 font-semibold tracking-tight">
          {block.text}
        </h3>
      );
    }
    case 'p':
      return (
        <p className="text-[0.975rem] leading-[1.75] text-muted [&_a]:font-medium [&_code]:whitespace-nowrap">
          {renderInline(parseInline(block.text), 'p')}
        </p>
      );
    case 'ul':
      return (
        <ul className="ml-1 space-y-2.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-[0.95rem] leading-[1.7] text-muted">
              <span aria-hidden="true" className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{renderInline(parseInline(item), `li-${j}`)}</span>
            </li>
          ))}
        </ul>
      );
    case 'code': {
      const body =
        block.lang === 'bash' ? highlightBash(block.code) : block.lang === 'text' ? block.code : highlightEng(block.code);
      return (
        <figure className="group relative">
          {block.caption ? (
            <figcaption className="flex items-center justify-between rounded-t-xl border border-b-0 border-border bg-surface-2 px-4 py-2 font-mono text-xs text-subtle">
              <span>{block.caption}</span>
              <CopyButton text={block.code} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </figcaption>
          ) : null}
          <pre
            className={`relative overflow-x-auto border border-border bg-code-bg p-5 font-mono text-sm leading-relaxed text-code-text ${
              block.caption ? 'rounded-b-xl' : 'rounded-xl'
            }`}
          >
            <code>{body}</code>
            {!block.caption ? (
              <CopyButton
                text={block.code}
                className="absolute right-2 top-2 rounded-lg bg-surface/80 opacity-0 backdrop-blur group-hover:opacity-100"
              />
            ) : null}
          </pre>
        </figure>
      );
    }
    case 'table':
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                {block.head.map((h, j) => (
                  <th key={j} className="px-4 py-2.5 font-heading font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j} className="border-b border-border last:border-0">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-2.5 align-top text-muted [&_code]:whitespace-nowrap">
                      {renderInline(parseInline(cell), `t${j}-${k}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout': {
      const styles = {
        info: 'border-info/30 bg-info-surface text-info-text',
        tip: 'border-success/30 bg-success-surface text-success-text',
        warn: 'border-warning/40 bg-warning-surface text-warning-text',
      } as const;
      const icon = { info: 'ℹ', tip: '✦', warn: '⚠' }[block.kind];
      return (
        <div className={`flex gap-3 rounded-xl border px-4 py-3.5 ${styles[block.kind]}`}>
          <span aria-hidden="true" className="mt-0.5 shrink-0 font-bold">
            {icon}
          </span>
          <p className="text-sm leading-relaxed">{renderInline(parseInline(block.text), 'co')}</p>
        </div>
      );
    }
  }
}
