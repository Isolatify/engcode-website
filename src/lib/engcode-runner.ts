/**
 * A small, honest in-browser runner for the core EngCode *script* language.
 *
 * Supports: note:, say, ask (… and save it as …, for a number), set/change,
 * keep track of, if/otherwise if/otherwise, repeat N times, count from…to…as,
 * while, for each…in, stop the loop, skip to the next one, define…with…,
 * call…with…, give back, lists (a list of, add, remove, item N of, last item,
 * the length of, sort, reverse, shuffle, join, random item of), tables
 * (a table with …, 's field), word operators and a set of standard-library
 * phrases. App blocks, files, network and device storage are intentionally
 * NOT supported — the playground UI says those need the desktop CLI.
 *
 * Error wording mirrors the real CLI's plain-English diagnostics style.
 * All parsing uses absolute token positions (no sliced-array offsets).
 */

export type RunOutput =
  | { kind: 'ok'; lines: string[]; warnings: string[] }
  | { kind: 'error'; line: number; message: string; lines: string[] }
  /** The program hit an `ask` with no answer queued — pause and prompt inline. */
  | { kind: 'ask'; prompt: string; line: number; lines: string[] };

/** Thrown when the program calls `ask` and no pre-seeded answer is available.
 *  The playground catches it, shows an inline terminal prompt, and resumes by
 *  replaying the program with the collected answers queued. */
class AskSignal extends Error {
  constructor(
    public prompt: string,
    public line: number,
  ) {
    super(prompt);
  }
}

type Value =
  | { t: 'num'; v: number }
  | { t: 'str'; v: string }
  | { t: 'bool'; v: boolean }
  | { t: 'nil' }
  | { t: 'list'; v: Value[] }
  | { t: 'table'; v: Record<string, Value> }
  | { t: 'func'; name: string; params: string[]; defaults: (Value | undefined)[]; body: Node[] };

class EngError extends Error {
  constructor(
    message: string,
    public line: number,
  ) {
    super(message);
  }
}

function fmt(v: Value): string {
  switch (v.t) {
    case 'num':
      return String(v.v);
    case 'str':
      return v.v;
    case 'bool':
      return v.v ? 'yes' : 'no';
    case 'nil':
      return 'nothing';
    case 'list':
      return `a list of ${v.v.map(fmt).join(', ')}`;
    case 'table': {
      const parts = Object.entries(v.v).map(([k, val]) => `${k} ${fmt(val)}`);
      return parts.length ? `a table with ${parts.join(', ')}` : 'an empty table';
    }
    case 'func':
      return `a function called ${v.name}`;
  }
}

function typeName(t: Value['t']): string {
  return {
    num: 'a number',
    str: 'text',
    bool: 'yes or no',
    nil: 'nothing',
    list: 'a list',
    table: 'a table',
    func: 'a function',
  }[t];
}

/* ------------------------------------------------------------------ *
 * Tokenizer
 * ------------------------------------------------------------------ */

type Tok =
  | { k: 'str'; v: string }
  | { k: 'num'; v: number }
  | { k: 'word'; v: string }
  | { k: 'pos' } // 's
  | { k: 'lp' }
  | { k: 'rp' }
  | { k: 'comma' }
  | { k: 'colon' };

function tokenize(line: string, lineNo: number): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (c === '"') {
      let s = '';
      i++;
      while (i < line.length && line[i] !== '"') {
        if (line[i] === '\\') {
          const n = line[i + 1];
          if (n === 'n') s += '\n';
          else if (n === 't') s += '\t';
          else s += n ?? '';
          i += 2;
          continue;
        }
        s += line[i];
        i++;
      }
      if (i >= line.length) {
        throw new EngError('A string never runs past the end of its line.', lineNo);
      }
      i++; // closing quote
      toks.push({ k: 'str', v: s });
      continue;
    }
    if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(line[i + 1] ?? ''))) {
      const m = line.slice(i).match(/^-?[0-9]+(\.[0-9]+)?/)!;
      toks.push({ k: 'num', v: Number(m[0]) });
      i += m[0].length;
      continue;
    }
    if (line.startsWith("'s", i)) {
      toks.push({ k: 'pos' });
      i += 2;
      continue;
    }
    if (c === '(') {
      toks.push({ k: 'lp' });
      i++;
      continue;
    }
    if (c === ')') {
      toks.push({ k: 'rp' });
      i++;
      continue;
    }
    if (c === ',') {
      toks.push({ k: 'comma' });
      i++;
      continue;
    }
    if (c === ':') {
      toks.push({ k: 'colon' });
      i++;
      continue;
    }
    const m = line.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (m) {
      toks.push({ k: 'word', v: m[0] });
      i += m[0].length;
      continue;
    }
    throw new EngError(
      `I don't know what to do with "${c}". EngCode spells its operators in words.`,
      lineNo,
    );
  }
  return toks;
}

function eq(a: Value, b: Value): boolean {
  if (a.t !== b.t) return false;
  switch (a.t) {
    case 'num':
      return a.v === (b as { v: number }).v;
    case 'str':
      return a.v === (b as { v: string }).v;
    case 'bool':
      return a.v === (b as { v: boolean }).v;
    case 'nil':
      return true;
    case 'list':
      return (
        a.v.length === (b as { v: Value[] }).v.length &&
        a.v.every((x, i) => eq(x, (b as { v: Value[] }).v[i]))
      );
    case 'table':
      return JSON.stringify(a.v) === JSON.stringify((b as { v: Record<string, Value> }).v);
    default:
      return false;
  }
}

const isWord = (t: Tok | undefined, w?: string): t is { k: 'word'; v: string } =>
  t !== undefined && t.k === 'word' && (w === undefined || t.v.toLowerCase() === w);

/* ------------------------------------------------------------------ *
 * Block structure
 * ------------------------------------------------------------------ */

type Line = { no: number; text: string; toks: Tok[] };
type Stmt = { kind: 'stmt'; line: Line };
type Block = { kind: 'block'; header: Line; children: Node[] };
type Node = Stmt | Block;

const BLOCK_STARTERS = [
  'if', 'otherwise', 'repeat', 'count', 'while', 'for', 'define', 'every', 'when', 'app',
  'page', 'style', 'theme', 'row', 'column', 'section', 'card', 'form', 'try', 'it',
];

type StackEntry = { block: Block; type: 'if' | 'try' | 'other' | 'arm' };

function parseBlocks(lines: Line[]): Node[] {
  const roots: Node[] = [];
  const stack: StackEntry[] = [];

  const push = (node: Node) => {
    if (stack.length) stack[stack.length - 1].block.children.push(node);
    else roots.push(node);
  };

  for (const line of lines) {
    const last = line.toks[line.toks.length - 1];
    const firstWord = line.toks.find((t) => t.k === 'word') as { v: string } | undefined;
    const headerWords = line.toks
      .filter((t): t is { k: 'word'; v: string } => t.k === 'word')
      .map((t) => t.v.toLowerCase());
    const isBlockHeader =
      last?.k === 'colon' && !!firstWord && BLOCK_STARTERS.includes(firstWord.v.toLowerCase());
    const isEnd =
      line.toks.length === 1 && line.toks[0].k === 'word' && line.toks[0].v.toLowerCase() === 'end';
    const kind: StackEntry['type'] = headerWords[0]?.startsWith('otherwise')
      ? 'arm'
      : headerWords[0] === 'if' && headerWords[1] === 'it' && headerWords[2] === 'fails'
        ? 'arm'
        : headerWords[0]?.startsWith('try')
          ? 'try'
          : headerWords[0] === 'if'
            ? 'if'
            : 'other';

    if (isEnd) {
      if (!stack.length) throw new EngError('There is an extra "end" here.', line.no);
      const popped = stack.pop()!;
      // The language writes a single "end" for a whole if-chain or try block,
      // so an arm's end also closes its host.
      if (popped.type === 'arm' && stack.length) {
        const host = stack[stack.length - 1];
        if (host.type === 'if' || host.type === 'try') stack.pop();
      }
      continue;
    }
    if (isBlockHeader && kind === 'arm') {
      // "otherwise if X:" / "otherwise:" / "if it fails:" attaches to the
      // nearest open if-block (arms) or try-block (the error handler).
      // Only one arm entry sits above its host: a new arm replaces the previous.
      const attachesToTry = headerWords[0] === 'if';
      const want = attachesToTry ? 'try' : 'if';
      const top = stack[stack.length - 1];
      if (top?.type === 'arm') stack.pop();
      const top2 = stack[stack.length - 1];
      if (!top2 || top2.type !== want) {
        throw new EngError(
          attachesToTry
            ? '"if it fails" does not have a "try" above it.'
            : '"otherwise" does not have an "if" above it. Try this: Put it inside an if block.',
          line.no,
        );
      }
      const armBlock: Block = { kind: 'block', header: line, children: [] };
      top2.block.children.push(armBlock);
      stack.push({ block: armBlock, type: 'arm' });
      continue;
    }
    if (isBlockHeader) {
      const block: Block = { kind: 'block', header: line, children: [] };
      push(block);
      stack.push({ block, type: kind });
      continue;
    }
    push({ kind: 'stmt', line });
  }
  if (stack.length) {
    throw new EngError(
      `I expected "end" to close the block that starts "${stack[stack.length - 1].block.header.text.trim()}"`,
      stack[stack.length - 1].block.header.no,
    );
  }
  return roots;
}

/* ------------------------------------------------------------------ *
 * Interpreter
 * ------------------------------------------------------------------ */

interface Frame {
  vars: Map<string, Value>;
}
const MAX_STEPS = 200_000;
const MAX_OUTPUT = 10_000;

class Interpreter {
  private globals: Frame = { vars: new Map() };
  private frames: Frame[] = [this.globals];
  readonly out: string[] = [];
  readonly warnings: string[] = [];
  private steps = 0;
  private funcDepth = 0;
  private answerIndex = 0;
  private answers: string[];

  constructor(answers: string[]) {
    this.answers = answers;
  }

  private tick(lineNo: number) {
    if (++this.steps > MAX_STEPS) {
      throw new EngError(
        'This program ran past 200,000 steps, so I stopped it. Is a loop that never ends?',
        lineNo,
      );
    }
  }

  private lookup(name: string): Value | undefined {
    for (let i = this.frames.length - 1; i >= 0; i--) {
      const v = this.frames[i].vars.get(name);
      if (v !== undefined) return v;
    }
    return undefined;
  }

  private assign(name: string, value: Value) {
    for (let i = this.frames.length - 1; i >= 0; i--) {
      if (this.frames[i].vars.has(name)) {
        this.frames[i].vars.set(name, value);
        return;
      }
    }
    this.frames[this.frames.length - 1].vars.set(name, value);
  }

  private ask(prompt: string, lineNo: number): string {
    if (this.answerIndex >= this.answers.length) {
      throw new AskSignal(prompt, lineNo);
    }
    const answer = this.answers[this.answerIndex++];
    // Terminal transcript: the prompt, then the echoed answer.
    this.out.push(`? ${prompt}`);
    this.out.push(`❯ ${answer}`);
    return answer;
  }

  /* ------------------------- expressions ------------------------- */

  expr(toks: Tok[], from = 0, lineNo = 0): Value {
    return this.parseBinary(toks, from, 0, lineNo).value;
  }

  /**
   * Precedence-climbing over the word operators.
   * `from` and the returned `pos` are absolute indexes into `toks`.
   */
  parseBinary(toks: Tok[], from: number, minPrec: number, lineNo: number): { value: Value; pos: number } {
    const prim = this.parseUnary(toks, from, lineNo);
    let value = prim.value;
    let pos = prim.pos;

    for (;;) {
      const op = this.peekBinaryOp(toks, pos);
      if (!op || op.prec < minPrec) break;

      if (op.kind === 'between') {
        const left = value;
        const a = this.parseBinary(toks, pos + 2, op.prec + 1, lineNo);
        if (!isWord(toks[a.pos], 'and')) {
          throw new EngError('I expected "and" in "is between A and B".', lineNo);
        }
        const b = this.parseBinary(toks, a.pos + 1, op.prec + 1, lineNo);
        value = {
          t: 'bool',
          v: this.compare(a.value, left, 'gteq', lineNo) && this.compare(b.value, left, 'lteq', lineNo),
        };
        pos = b.pos;
        continue;
      }
      const rhs = this.parseBinary(toks, pos + op.len, op.prec + 1, lineNo);
      value =
        op.kind === 'logic'
          ? this.logical(op.word, value, rhs.value, lineNo)
          : this.applyBinary(op.word, value, rhs.value, lineNo);
      pos = rhs.pos;
    }
    return { value, pos };
  }

  private peekBinaryOp(
    toks: Tok[],
    pos: number,
  ): { word: string; prec: number; len: number; kind?: 'logic' | 'between' } | null {
    const at = (w: string): boolean => {
      const ws = w.split(' ');
      for (let i = 0; i < ws.length; i++) {
        if (!isWord(toks[pos + i], ws[i])) return false;
      }
      return true;
    };
    if (at('or')) return { word: 'or', prec: 1, len: 1, kind: 'logic' };
    if (at('and')) return { word: 'and', prec: 2, len: 1, kind: 'logic' };
    for (const w of [
      'is between',
      'is not',
      'is greater than',
      'is less than',
      'is at least',
      'is at most',
      'starts with',
      'ends with',
      'is',
    ]) {
      if (at(w)) return { word: w, prec: 4, len: w.split(' ').length, kind: w === 'is between' ? 'between' : undefined };
    }
    if (at('contains')) return { word: 'contains', prec: 4, len: 1 };
    if (at('plus')) return { word: 'plus', prec: 5, len: 1 };
    if (at('minus')) return { word: 'minus', prec: 5, len: 1 };
    if (at('times')) return { word: 'times', prec: 6, len: 1 };
    if (at('divided by')) return { word: 'divided by', prec: 6, len: 2 };
    if (at('remainder')) return { word: 'remainder', prec: 6, len: 1 };
    return null;
  }

  private parseUnary(toks: Tok[], from: number, lineNo: number): { value: Value; pos: number } {
    const t = toks[from];
    if (!t) throw new EngError('This line needs a value, but it ended early.', lineNo);

    if (isWord(t, 'not')) {
      const inner = this.parseBinary(toks, from + 1, 4, lineNo);
      if (inner.value.t !== 'bool') {
        throw new EngError(`"not" needs yes or no, but this is ${typeName(inner.value.t)}.`, lineNo);
      }
      return { value: { t: 'bool', v: !inner.value.v }, pos: inner.pos };
    }
    if (isWord(t, 'minus')) {
      const inner = this.parseBinary(toks, from + 1, 7, lineNo);
      if (inner.value.t !== 'num') {
        throw new EngError(
          `I can only take the minus of a number, but this is ${typeName(inner.value.t)}.`,
          lineNo,
        );
      }
      return { value: { t: 'num', v: -inner.value.v }, pos: inner.pos };
    }

    const prim = this.parsePrimary(toks, from, lineNo);
    let value = prim.value;
    let pos = prim.pos;

    // postfix: possessive 's field
    for (;;) {
      if (toks[pos]?.k === 'pos') {
        const fieldTok = toks[pos + 1];
        if (fieldTok?.k === 'str') {
          fieldTok satisfies { k: 'str' };
        } else if (fieldTok?.k !== 'word') {
          throw new EngError('I expected a field name after the possessive.', lineNo);
        }
        if (value.t !== 'table') {
          throw new EngError(
            `I can only read a field of a table, but this is ${typeName(value.t)}.`,
            lineNo,
          );
        }
        const field = fieldTok.v;
        value = value.v[field] ?? { t: 'nil' };
        pos += 2;
        continue;
      }
      break;
    }
    return { value, pos };
  }

  private parsePrimary(toks: Tok[], from: number, lineNo: number): { value: Value; pos: number } {
    const t = toks[from];
    if (!t) throw new EngError('This line needs a value, but it ended early.', lineNo);

    if (t.k === 'str') return { value: { t: 'str', v: t.v }, pos: from + 1 };
    if (t.k === 'num') return { value: { t: 'num', v: t.v }, pos: from + 1 };
    if (t.k === 'lp') {
      const inner = this.parseBinary(toks, from + 1, 0, lineNo);
      if (toks[inner.pos]?.k !== 'rp') {
        throw new EngError('I never saw a ")" to match this "(".', lineNo);
      }
      return { value: inner.value, pos: inner.pos + 1 };
    }
    if (t.k !== 'word') {
      throw new EngError('I did not expect this here.', lineNo);
    }
    const w = t.v.toLowerCase();
    const next = toks[from + 1];

    // literals
    if (w === 'yes') return { value: { t: 'bool', v: true }, pos: from + 1 };
    if (w === 'no') return { value: { t: 'bool', v: false }, pos: from + 1 };
    if (w === 'nothing') return { value: { t: 'nil' }, pos: from + 1 };
    if (w === 'pi') return { value: { t: 'num', v: Math.PI }, pos: from + 1 };
    if (w === 'e' && !(isWord(next, 'rror') || isWord(next, 'error'))) {
      return { value: { t: 'num', v: 2.718281828459045 }, pos: from + 1 };
    }

    // standard-library prefixes
    const builtin = this.tryBuiltin(toks, from, lineNo);
    if (builtin) return builtin;

    // list / table constructors, kinds
    if (w === 'a' || w === 'an') {
      const c = this.tryConstructor(toks, from, lineNo);
      if (c) return c;
    }

    // "the length of X"
    if (w === 'the' && isWord(next, 'length') && isWord(toks[from + 2], 'of')) {
      const v = this.parseBinary(toks, from + 3, 8, lineNo);
      const len =
        v.value.t === 'list'
          ? v.value.v.length
          : v.value.t === 'str'
            ? [...v.value.v].length
            : v.value.t === 'table'
              ? Object.keys(v.value.v).length
              : -1;
      if (len < 0) {
        throw new EngError(`"the length of" needs a list or text, but this is ${typeName(v.value.t)}.`, lineNo);
      }
      return { value: { t: 'num', v: len }, pos: v.pos };
    }
    // "the error" resolves inside a try handler, where it is a stored variable
    if (w === 'the' && isWord(next, 'error')) {
      const err = this.lookup('the error');
      if (err) return { value: err, pos: from + 2 };
      throw new EngError('"the error" only works inside "if it fails".', lineNo);
    }

    // random number from A to B | random item of X | random decimal
    if (w === 'random') {
      if (isWord(next, 'number') && isWord(toks[from + 2], 'from')) {
        const a = this.parseBinary(toks, from + 3, 2, lineNo);
        if (!isWord(toks[a.pos], 'to')) throw new EngError('I expected "to" in "random number from A to B".', lineNo);
        const b = this.parseBinary(toks, a.pos + 1, 2, lineNo);
        if (a.value.t !== 'num' || b.value.t !== 'num') {
          throw new EngError('"random number from" needs two numbers.', lineNo);
        }
        return {
          value: { t: 'num', v: Math.floor(Math.random() * (b.value.v - a.value.v + 1)) + a.value.v },
          pos: b.pos,
        };
      }
      if (isWord(next, 'item') && isWord(toks[from + 2], 'of')) {
        const v = this.parseBinary(toks, from + 3, 8, lineNo);
        if (v.value.t !== 'list' || v.value.v.length === 0) {
          throw new EngError('"random item of" needs a list with at least one item.', lineNo);
        }
        return { value: v.value.v[Math.floor(Math.random() * v.value.v.length)], pos: v.pos };
      }
      if (isWord(next, 'decimal')) {
        return { value: { t: 'num', v: Math.random() }, pos: from + 2 };
      }
    }

    // call f with args
    if (w === 'call') {
      return this.parseCall(toks, from, lineNo);
    }

    // bare function call first (greet "Ada"), then stored names
    const fnValue = this.lookup(w);
    if (fnValue && fnValue.t === 'func') {
      let end = from + 1;
      let args: Value[] = [];
      if (toks[end]) {
        const arg = this.parseBinary(toks, end, 3, lineNo);
        args = [arg.value];
        end = arg.pos;
      }
      return { value: this.callFunction(fnValue, args, lineNo), pos: end };
    }

    // stored names (multi-word), longest match first
    const name = this.matchName(toks, from);
    if (name) return { value: this.lookup(name.name)!, pos: from + name.len };

    throw new EngError(
      `I don't know the name "${t.v}". Try this: Use "set" to create it first.`,
      lineNo,
    );
  }

  /** Try to match a stored name (multi-word) starting at position from. */
  private matchName(toks: Tok[], from: number): { name: string; len: number } | null {
    for (let len = Math.min(6, toks.length - from); len >= 1; len--) {
      const slice = toks.slice(from, from + len);
      if (slice.some((t) => t.k !== 'word')) continue;
      const cand = slice
        .map((t) => (t as { k: 'word'; v: string }).v)
        .join(' ')
        .toLowerCase();
      if (this.lookup(cand) !== undefined) return { name: cand, len };
    }
    return null;
  }

  /** One-argument builtin like "uppercase of X", starting at `from`. */
  private parseBuiltin1(
    toks: Tok[],
    from: number,
    words: string[],
    f: (v: Value, lineNo: number) => Value,
    lineNo: number,
  ): { value: Value; pos: number } {
    for (let i = 0; i < words.length; i++) {
      if (!isWord(toks[from + i], words[i])) {
        throw new EngError(`I expected "${words.join(' ')}" here.`, lineNo);
      }
    }
    const inner = this.parseBinary(toks, from + words.length, 8, lineNo);
    return { value: f(inner.value, lineNo), pos: inner.pos };
  }

  private tryBuiltin(toks: Tok[], from: number, lineNo: number): { value: Value; pos: number } | null {
    const w = (toks[from] as { k: 'word'; v: string }).v.toLowerCase();
    const wordAfter = (o: number): string | null => (isWord(toks[from + o]) ? (toks[from + o] as { v: string }).v.toLowerCase() : null);

    const num1 = (phrase: string[], f: (n: number) => number) =>
      this.parseBuiltin1(
        toks,
        from,
        phrase,
        (v, ln) => {
          if (v.t !== 'num') throw new EngError(`"${phrase.join(' ')}" needs a number, but this is ${typeName(v.t)}.`, ln);
          return { t: 'num', v: f(v.v) };
        },
        lineNo,
      );
    const text1 = (phrase: string[], f: (s: string) => string) =>
      this.parseBuiltin1(
        toks,
        from,
        phrase,
        (v, ln) => {
          if (v.t !== 'str') throw new EngError(`"${phrase.join(' ')}" needs text, but this is ${typeName(v.t)}.`, ln);
          return { t: 'str', v: f(v.v) };
        },
        lineNo,
      );

    switch (w) {
      case 'uppercase':
        return text1([w, 'of'], (s) => s.toUpperCase());
      case 'lowercase':
        return text1([w, 'of'], (s) => s.toLowerCase());
      case 'trim':
        return text1([w, 'of'], (s) => s.trim());
      case 'round':
        return num1([w, 'of'], Math.round);
      case 'floor':
        return num1([w, 'of'], Math.floor);
      case 'ceiling':
        return num1([w, 'of'], Math.ceil);
      case 'sine':
        return num1([w, 'of'], Math.sin);
      case 'cosine':
        return num1([w, 'of'], Math.cos);
      case 'tangent':
        return num1([w, 'of'], Math.tan);
      case 'absolute':
        return num1(['absolute', 'value', 'of'], Math.abs);
      case 'square':
        return num1(['square', 'root', 'of'], Math.sqrt);
      case 'text':
        return text1(['text', 'of'], (s) => s);
      case 'number': {
        if (wordAfter(1) !== 'from') return null;
        const v = this.parseBinary(toks, from + 2, 8, lineNo);
        if (v.value.t !== 'str') throw new EngError('"number from" needs text.', lineNo);
        const n = Number(v.value.v);
        if (Number.isNaN(n)) throw new EngError(`I could not read "${v.value.v}" as a number.`, lineNo);
        return { value: { t: 'num', v: n }, pos: v.pos };
      }
      case 'item': {
        // item N of X
        const nTok = toks[from + 1];
        if (!nTok || nTok.k !== 'num') return null;
        if (wordAfter(2) !== 'of') return null;
        const v = this.parseBinary(toks, from + 3, 8, lineNo);
        return { value: this.itemOf(v.value, nTok.v, lineNo), pos: v.pos };
      }
      case 'last': {
        // last item of X
        if (wordAfter(1) !== 'item' || wordAfter(2) !== 'of') return null;
        const v = this.parseBinary(toks, from + 3, 8, lineNo);
        if (v.value.t === 'list') return { value: v.value.v.at(-1) ?? { t: 'nil' }, pos: v.pos };
        if (v.value.t === 'str') return { value: { t: 'str', v: [...v.value.v].at(-1) ?? '' }, pos: v.pos };
        throw new EngError(`"last item of" needs a list or text, but this is ${typeName(v.value.t)}.`, lineNo);
      }
      case 'length': {
        // length of X
        if (wordAfter(1) !== 'of') return null;
        const v = this.parseBinary(toks, from + 2, 8, lineNo);
        const len =
          v.value.t === 'list'
            ? v.value.v.length
            : v.value.t === 'str'
              ? [...v.value.v].length
              : v.value.t === 'table'
                ? Object.keys(v.value.v).length
                : -1;
        if (len < 0) {
          throw new EngError(`"length of" needs a list or text, but this is ${typeName(v.value.t)}.`, lineNo);
        }
        return { value: { t: 'num', v: len }, pos: v.pos };
      }
      case 'minimum':
      case 'maximum':
      case 'power': {
        if (wordAfter(1) !== 'of') return null;
        const a = this.parseBinary(toks, from + 2, 3, lineNo);
        if (!isWord(toks[a.pos], 'and')) throw new EngError(`I expected "and" in "${w} of A and B".`, lineNo);
        const b = this.parseBinary(toks, a.pos + 1, 3, lineNo);
        if (a.value.t !== 'num' || b.value.t !== 'num') {
          throw new EngError(`"${w} of" needs two numbers.`, lineNo);
        }
        const value =
          w === 'minimum' ? Math.min(a.value.v, b.value.v) : w === 'maximum' ? Math.max(a.value.v, b.value.v) : Math.pow(a.value.v, b.value.v);
        return { value: { t: 'num', v: value }, pos: b.pos };
      }
      case 'split': {
        // split X by Y
        const x = this.parseBinary(toks, from + 1, 7, lineNo);
        if (!isWord(toks[x.pos], 'by')) throw new EngError('I expected "by" in "split X by Y".', lineNo);
        const y = this.parseBinary(toks, x.pos + 1, 8, lineNo);
        if (x.value.t !== 'str' || y.value.t !== 'str') {
          throw new EngError('"split … by …" needs text.', lineNo);
        }
        return {
          value: { t: 'list', v: x.value.v.split(y.value.v).map((p) => ({ t: 'str', v: p }) as Value) },
          pos: y.pos,
        };
      }
      case 'join': {
        // join X with Y
        const x = this.parseBinary(toks, from + 1, 6, lineNo);
        if (!isWord(toks[x.pos], 'with')) throw new EngError('I expected "with" in "join X with Y".', lineNo);
        const y = this.parseBinary(toks, x.pos + 1, 8, lineNo);
        if (x.value.t !== 'list' || y.value.t !== 'str') {
          throw new EngError('"join … with …" needs a list and text.', lineNo);
        }
        return { value: { t: 'str', v: x.value.v.map(fmt).join(y.value.v) }, pos: y.pos };
      }
      case 'replace': {
        // replace A with B in C
        const a = this.parseBinary(toks, from + 1, 5, lineNo);
        if (!isWord(toks[a.pos], 'with')) throw new EngError('I expected "with" in "replace A with B in C".', lineNo);
        const b = this.parseBinary(toks, a.pos + 1, 5, lineNo);
        if (!isWord(toks[b.pos], 'in')) throw new EngError('I expected "in" in "replace A with B in C".', lineNo);
        const c = this.parseBinary(toks, b.pos + 1, 8, lineNo);
        if (a.value.t !== 'str' || b.value.t !== 'str' || c.value.t !== 'str') {
          throw new EngError('"replace … with … in …" needs text.', lineNo);
        }
        return {
          value: { t: 'str', v: c.value.v.split(a.value.v).join(b.value.v) },
          pos: c.pos,
        };
      }
      case 'position': {
        // position of A in B
        if (wordAfter(1) !== 'of') return null;
        const a = this.parseBinary(toks, from + 2, 5, lineNo);
        if (!isWord(toks[a.pos], 'in')) throw new EngError('I expected "in" in "position of A in B".', lineNo);
        const b = this.parseBinary(toks, a.pos + 1, 8, lineNo);
        if (a.value.t !== 'str' || b.value.t !== 'str') {
          throw new EngError('"position of … in …" needs text.', lineNo);
        }
        return { value: { t: 'num', v: b.value.v.indexOf(a.value.v) + 1 }, pos: b.pos };
      }
      case 'value':
      case 'key':
        throw new EngError(
          `"${w} of" works inside an app. This browser runner runs scripts only — app features need the desktop CLI.`,
          lineNo,
        );
      default:
        return null;
    }
  }

  private itemOf(v: Value, n: number, lineNo: number): Value {
    if (v.t === 'list') return v.v[n - 1] ?? { t: 'nil' };
    if (v.t === 'str') return { t: 'str', v: [...v.v][n - 1] ?? '' };
    throw new EngError(`"item N of" needs a list or text, but this is ${typeName(v.t)}.`, lineNo);
  }

  private tryConstructor(toks: Tok[], from: number, lineNo: number): { value: Value; pos: number } | null {
    const is = (o: number, w: string): boolean => isWord(toks[from + o], w);
    const ws = toks
      .slice(from)
      .map((x) => (x.k === 'word' ? (x as { v: string }).v.toLowerCase() : '#'))
      .join(' ');

    if (ws.startsWith('a list of') || ws.startsWith('an empty list')) {
      if (is(2, 'empty')) return { value: { t: 'list', v: [] }, pos: from + 3 };
      const items: Value[] = [];
      let pos = from + 3;
      for (;;) {
        const part = this.parseBinary(toks, pos, 4, lineNo);
        items.push(part.value);
        pos = part.pos;
        if (toks[pos]?.k === 'comma' || isWord(toks[pos], 'and')) {
          pos++;
          continue;
        }
        break;
      }
      return { value: { t: 'list', v: items }, pos };
    }
    if (ws.startsWith('a table with') || ws.startsWith('an empty table')) {
      if (is(2, 'empty')) return { value: { t: 'table', v: {} }, pos: from + 3 };
      const row: Record<string, Value> = {};
      let pos = from + 3;
      for (;;) {
        // key(s) value — the key is the word run before a value token
        const keyStart = pos;
        let j = pos;
        while (j < toks.length && toks[j].k === 'word') j++;
        if (j === keyStart || j >= toks.length) {
          throw new EngError('I expected another field, like name "Sam", in this table.', lineNo);
        }
        const valTok = toks[j];
        if (!(valTok.k === 'str' || valTok.k === 'num' || valTok.k === 'lp')) {
          throw new EngError('I expected a field value in this table, like name "Sam".', lineNo);
        }
        // The value parser may consume trailing words it knows; require the last key word
        // to be followed by a value literal so keys like "name" stay keys.
        const val = this.parseBinary(toks, j, 4, lineNo);
        const key = toks
          .slice(keyStart, j)
          .map((t) => (t as { k: 'word'; v: string }).v)
          .join(' ')
          .toLowerCase();
        row[key] = val.value;
        pos = val.pos;
        if (toks[pos]?.k === 'comma') {
          pos++;
          continue;
        }
        break;
      }
      return { value: { t: 'table', v: row }, pos };
    }
    if (ws.startsWith('a new')) {
      throw new EngError(
        'Kinds ("a new … with …") are not part of this browser runner yet — they run with the desktop CLI.',
        lineNo,
      );
    }
    return null;
  }

  /** call f with args — `from` points at "call" or directly at the function name. */
  private parseCall(toks: Tok[], from: number, lineNo: number): { value: Value; pos: number } {
    let i = from;
    if (isWord(toks[i], 'call')) i++;
    if (!isWord(toks[i])) {
      throw new EngError('I expected a function name after "call".', lineNo);
    }
    const name = (toks[i] as { v: string }).v.toLowerCase();
    i++;
    const fnValue = this.lookup(name);
    if (!fnValue || fnValue.t !== 'func') {
      throw new EngError(`I don't know a function called "${name}". Define one with "define".`, lineNo);
    }
    let args: Value[] = [];
    let end = i;
    if (isWord(toks[i], 'with')) {
      i++;
      const arg = this.parseBinary(toks, i, 3, lineNo);
      args = [arg.value];
      end = arg.pos;
    }
    return { value: this.callFunction(fnValue, args, lineNo), pos: end };
  }

  private callFunction(fnValue: Extract<Value, { t: 'func' }>, args: Value[], lineNo: number): Value {
    if (args.length > fnValue.params.length) {
      throw new EngError(
        `"${fnValue.name}" takes ${fnValue.params.length} argument${fnValue.params.length === 1 ? '' : 's'}, but ${args.length} were given.`,
        lineNo,
      );
    }
    const required = fnValue.params.filter((_, i) => fnValue.defaults[i] === undefined).length;
    if (args.length < required) {
      const missing = fnValue.params.length - args.length;
      throw new EngError(`"${fnValue.name}" needs ${missing} more argument${missing === 1 ? '' : 's'}.`, lineNo);
    }
    const frame: Frame = { vars: new Map() };
    fnValue.params.forEach((p, i) => {
      frame.vars.set(p, args[i] ?? fnValue.defaults[i] ?? { t: 'nil' });
    });
    this.frames.push(frame);
    this.funcDepth++;
    try {
      this.runNodes(fnValue.body, undefined);
      return { t: 'nil' };
    } catch (e) {
      if (e instanceof ReturnSignal) {
        return e.value;
      }
      throw e;
    } finally {
      this.funcDepth--;
      this.frames.pop();
    }
  }

  /* ------------------------- statements ------------------------- */

  private say(v: Value, lineNo: number) {
    if (this.out.length >= MAX_OUTPUT) {
      throw new EngError('This program printed more than 10,000 lines, so I stopped it.', lineNo);
    }
    this.out.push(fmt(v));
  }

  compare(lhs: Value, rhs: Value, op: string, lineNo: number): boolean {
    const bothNum = lhs.t === 'num' && rhs.t === 'num';
    const bothStr = lhs.t === 'str' && rhs.t === 'str';
    switch (op) {
      case 'eq':
        return eq(lhs, rhs);
      case 'neq':
        return !eq(lhs, rhs);
      case 'gt':
      case 'gteq':
      case 'lt':
      case 'lteq': {
        if (!bothNum && !bothStr) {
          throw new EngError(
            `I can only compare two numbers or two texts, but this is ${typeName(lhs.t)} and ${typeName(rhs.t)}.`,
            lineNo,
          );
        }
        const a = (lhs as { v: number | string }).v;
        const b = (rhs as { v: number | string }).v;
        if (op === 'gt') return a > b;
        if (op === 'gteq') return a >= b;
        if (op === 'lt') return a < b;
        return a <= b;
      }
      default:
        throw new EngError('I could not compare those.', lineNo);
    }
  }

  private logical(word: string, a: Value, b: Value, lineNo: number): Value {
    if (a.t !== 'bool' || b.t !== 'bool') {
      throw new EngError(
        `"${word}" needs yes or no on both sides, but this is ${typeName(a.t)} and ${typeName(b.t)}.`,
        lineNo,
      );
    }
    if (word === 'and') return { t: 'bool', v: a.v && b.v };
    return { t: 'bool', v: a.v || b.v };
  }

  private applyBinary(word: string, a: Value, b: Value, lineNo: number): Value {
    switch (word) {
      case 'plus':
        if (a.t === 'str' || b.t === 'str') return { t: 'str', v: fmt(a) + fmt(b) };
        if (a.t === 'num' && b.t === 'num') return { t: 'num', v: a.v + b.v };
        throw new EngError(
          `"plus" needs numbers or text, but this is ${typeName(a.t)} and ${typeName(b.t)}.`,
          lineNo,
        );
      case 'minus':
        if (a.t !== 'num' || b.t !== 'num') {
          throw new EngError(`"minus" needs numbers, but this is ${typeName(a.t)} and ${typeName(b.t)}.`, lineNo);
        }
        return { t: 'num', v: a.v - b.v };
      case 'times':
        if (a.t !== 'num' || b.t !== 'num') {
          throw new EngError(`"times" needs numbers, but this is ${typeName(a.t)} and ${typeName(b.t)}.`, lineNo);
        }
        return { t: 'num', v: a.v * b.v };
      case 'divided by':
        if (a.t !== 'num' || b.t !== 'num') {
          throw new EngError(
            `"divided by" needs numbers, but this is ${typeName(a.t)} and ${typeName(b.t)}.`,
            lineNo,
          );
        }
        if (b.v === 0) throw new EngError("You can't divide by zero.", lineNo);
        return { t: 'num', v: a.v / b.v };
      case 'remainder':
        if (a.t !== 'num' || b.t !== 'num') {
          throw new EngError(
            `"remainder" needs numbers, but this is ${typeName(a.t)} and ${typeName(b.t)}.`,
            lineNo,
          );
        }
        if (b.v === 0) throw new EngError("You can't divide by zero.", lineNo);
        return { t: 'num', v: a.v % b.v };
      case 'is':
        return { t: 'bool', v: eq(a, b) };
      case 'is not':
        return { t: 'bool', v: !eq(a, b) };
      case 'is greater than':
        return { t: 'bool', v: this.compare(a, b, 'gt', lineNo) };
      case 'is less than':
        return { t: 'bool', v: this.compare(a, b, 'lt', lineNo) };
      case 'is at least':
        return { t: 'bool', v: this.compare(a, b, 'gteq', lineNo) };
      case 'is at most':
        return { t: 'bool', v: this.compare(a, b, 'lteq', lineNo) };
      case 'starts with':
        if (a.t !== 'str' || b.t !== 'str') throw new EngError('"starts with" needs text.', lineNo);
        return { t: 'bool', v: a.v.startsWith(b.v) };
      case 'ends with':
        if (a.t !== 'str' || b.t !== 'str') throw new EngError('"ends with" needs text.', lineNo);
        return { t: 'bool', v: a.v.endsWith(b.v) };
      case 'contains':
        if (a.t === 'str' && b.t === 'str') return { t: 'bool', v: a.v.includes(b.v) };
        if (a.t === 'list') return { t: 'bool', v: a.v.some((x) => eq(x, b)) };
        throw new EngError(`"contains" needs a list or text, but this is ${typeName(a.t)}.`, lineNo);
      default:
        throw new EngError(`I don't know how to use "${word}" here.`, lineNo);
    }
  }

  private nameFrom(toks: Tok[], start: number, end: number): string {
    return toks
      .slice(start, end)
      .filter((t): t is { k: 'word'; v: string } => t.k === 'word')
      .map((t) => t.v)
      .join(' ')
      .toLowerCase();
  }

  /** set row's age to 26 — writes a table field through a possessive name. */
  private setPossessive(
    toks: Tok[],
    start: number,
    end: number,
    value: Value,
    _verb: 'set' | 'change',
    lineNo: number,
  ): boolean {
    const posIdx = toks.findIndex((t, i) => t.k === 'pos' && i >= start && i < end);
    if (posIdx < 0) return false;
    const objName = this.nameFrom(toks, start, posIdx);
    const field = this.nameFrom(toks, posIdx + 1, end);
    const target = this.lookup(objName);
    if (!target || target.t !== 'table') {
      throw new EngError(
        `I can only set a field of a table, but "${objName}" is ${target ? typeName(target.t) : 'not created yet'}.`,
        lineNo,
      );
    }
    target.v[field] = value;
    return true;
  }

  /** Index of a keyword, searching from `start` (word tokens only, up to `limit`). */
  private findWord(toks: Tok[], word: string, start = 0, limit?: number): number {
    const end = limit ?? toks.length;
    for (let i = start; i < toks.length && i < end; i++) {
      if (isWord(toks[i], word)) return i;
    }
    return -1;
  }

  private wordsOf(header: Line): string {
    return header.toks
      .filter((t): t is { k: 'word'; v: string } => t.k === 'word')
      .map((t) => t.v)
      .join(' ')
      .toLowerCase();
  }

  runNodes(nodes: Node[], stopFrame?: { stopped?: boolean; skipped?: boolean }) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.kind === 'block') {
        const h = this.wordsOf(node.header);
        // Group sibling chains: the parser makes "otherwise …" blocks siblings
        // of their "if" and "if it fails" a sibling of "try".
        let block = node;
        if (h.startsWith('if')) {
          const children = [...node.children];
          while (
            i + 1 < nodes.length &&
            nodes[i + 1].kind === 'block' &&
            this.wordsOf((nodes[i + 1] as Block).header).startsWith('otherwise')
          ) {
            children.push(nodes[++i]);
          }
          block = { ...node, children };
        } else if (h.startsWith('try')) {
          const children = [...node.children];
          while (
            i + 1 < nodes.length &&
            nodes[i + 1].kind === 'block' &&
            this.wordsOf((nodes[i + 1] as Block).header).startsWith('if it fails')
          ) {
            children.push(nodes[++i]);
          }
          block = { ...node, children };
        }
        this.runBlock(block, stopFrame);
      } else {
        this.runStatement(node.line, stopFrame);
      }
      if (stopFrame && (stopFrame.stopped || stopFrame.skipped)) return;
    }
  }

  private runBlock(block: Block, stopFrame?: { stopped?: boolean; skipped?: boolean }) {
    const headerNo = block.header.no;
    this.tick(headerNo);
    const h = block.header.toks
      .filter((t): t is { k: 'word'; v: string } => t.k === 'word')
      .map((t) => t.v)
      .join(' ')
      .toLowerCase();

    // Unsupported app-layer constructs: honest error
    if (/^(app|page|style|theme|when|every|row|column|section|card|form)\b/.test(h)) {
      throw new EngError(
        `"${h.split(' ')[0]} …" works inside an app. This browser runner runs scripts only — app features need the desktop CLI (engcode playground).`,
        headerNo,
      );
    }

    if (h.startsWith('try')) {
      try {
        this.runNodes(block.children, stopFrame);
      } catch (e) {
        if (e instanceof ReturnSignal || e instanceof LoopSignal) throw e;
        const handler = block.children.find(
          (c): c is Block => c.kind === 'block' && this.wordsOf(c.header).startsWith('if it fails'),
        );
        if (!handler) throw e;
        this.frames.push({ vars: new Map([['the error', { t: 'str', v: e instanceof Error ? e.message : String(e) }]]) });
        try {
          this.runNodes(handler.children, stopFrame);
        } finally {
          this.frames.pop();
        }
      }
      return;
    }
    if (h.startsWith('if it fails')) {
      throw new EngError('"if it fails" does not have a "try" above it.', headerNo);
    }

    // if / otherwise if / otherwise — one chain of arms
    if (h.startsWith('if')) {
      const arms: { condToks: Tok[]; body: Node[]; no: number }[] = [];
      const stripColon = (toks: Tok[]): Tok[] =>
        toks[toks.length - 1]?.k === 'colon' ? toks.slice(0, -1) : toks;
      const headerToks = stripColon(block.header.toks);
      const isBareOtherwise = !headerToks.some((t) => t.k === 'word' && t.v.toLowerCase() === 'if');
      // condition = header minus the leading "if" / "otherwise if"
      let drop = isBareOtherwise ? 0 : isWord(headerToks[0], 'otherwise') ? 2 : 1;
      // bare "if" with no condition is a checker error
      if (!isBareOtherwise && drop >= headerToks.length) {
        throw new EngError('This "if" needs a condition before the colon.', headerNo);
      }
      arms.push({
        condToks: isBareOtherwise ? [{ k: 'word', v: 'yes' } as Tok] : headerToks.slice(drop),
        body: block.children.filter(
          (c) => !(c.kind === 'block' && this.wordsOf(c.header).startsWith('otherwise')),
        ),
        no: headerNo,
      });
      for (const child of block.children) {
        if (child.kind === 'block' && this.wordsOf(child.header).startsWith('otherwise')) {
          const ct = stripColon(child.header.toks);
          const bare = !ct.some((t) => t.k === 'word' && t.v.toLowerCase() === 'if');
          const d = bare ? 0 : isWord(ct[0], 'otherwise') ? 2 : 1;
          arms.push({
            condToks: bare ? ([{ k: 'word', v: 'yes' } as Tok]) : ct.slice(d),
            body: child.children,
            no: child.header.no,
          });
        }
      }
      for (const arm of arms) {
        const v = this.safeExpr(arm.condToks, arm.no);
        if (v.t !== 'bool') {
          throw new EngError(
            `A condition must be yes or no, but this is ${typeName(v.t)}. Try this: Write a comparison, as in "if age is greater than 17:".`,
            arm.no,
          );
        }
        if (v.v) {
          this.runNodes(arm.body, stopFrame);
          return;
        }
      }
      return;
    }

    if (h.startsWith('repeat')) {
      const nTok = block.header.toks.find((t) => t.k === 'num') as { k: 'num'; v: number } | undefined;
      let n: number | undefined = nTok?.v;
      if (n === undefined) {
        const nameTok = block.header.toks[1];
        if (isWord(nameTok)) {
          const name = this.matchName(block.header.toks, 1);
          if (name) {
            const v = this.lookup(name.name)!;
            if (v.t !== 'num') throw new EngError('"repeat" needs a number of times.', headerNo);
            n = v.v;
          }
        }
        if (n === undefined) throw new EngError('"repeat" needs a number of times.', headerNo);
      }
      for (let k = 0; k < n; k++) {
        this.tick(headerNo);
        this.runNodes(block.children, stopFrame);
        if (stopFrame?.stopped) {
          stopFrame.stopped = false;
          return;
        }
        if (stopFrame?.skipped) stopFrame.skipped = false;
      }
      return;
    }

    if (h.startsWith('count')) {
      const nums = block.header.toks.filter((t): t is { k: 'num'; v: number } => t.k === 'num');
      if (nums.length < 2) {
        throw new EngError('"count from" needs two numbers, like "count from 1 to 5".', headerNo);
      }
      const asIdx = this.findWord(block.header.toks, 'as');
      const varName =
        asIdx >= 0 ? this.nameFrom(block.header.toks, asIdx + 1, block.header.toks.length - 1) || 'counter' : 'counter';
      for (let k = nums[0].v; k <= nums[1].v; k++) {
        this.tick(headerNo);
        this.assign(varName, { t: 'num', v: k });
        this.runNodes(block.children, stopFrame);
        if (stopFrame?.stopped) {
          stopFrame.stopped = false;
          return;
        }
        if (stopFrame?.skipped) stopFrame.skipped = false;
      }
      return;
    }

    if (h.startsWith('while')) {
      const condToks = block.header.toks.slice(1, block.header.toks.length - 1);
      for (;;) {
        const cond = this.safeExpr(condToks, headerNo);
        if (cond.t !== 'bool') {
          throw new EngError(
            `A condition must be yes or no, but this is ${typeName(cond.t)}. Try this: Write a comparison, as in "while guesses is greater than 0:".`,
            headerNo,
          );
        }
        if (!cond.v) return;
        this.tick(headerNo);
        this.runNodes(block.children, stopFrame);
        if (stopFrame?.stopped) {
          stopFrame.stopped = false;
          return;
        }
        if (stopFrame?.skipped) stopFrame.skipped = false;
      }
    }

    if (h.startsWith('for each')) {
      const inIdx = this.findWord(block.header.toks, 'in');
      if (inIdx < 0) throw new EngError('I expected "for each name in list".', headerNo);
      const varName = this.nameFrom(block.header.toks, 2, inIdx);
      const list = this.safeExpr(block.header.toks.slice(inIdx + 1, block.header.toks.length - 1), headerNo);
      if (list.t !== 'list') {
        throw new EngError('"for ... in" needs a list to go through.', headerNo);
      }
      for (const item of list.v) {
        this.tick(headerNo);
        this.assign(varName, item);
        this.runNodes(block.children, stopFrame);
        if (stopFrame?.stopped) {
          stopFrame.stopped = false;
          return;
        }
        if (stopFrame?.skipped) stopFrame.skipped = false;
      }
      return;
    }

    if (h.startsWith('define')) {
      const header = block.header;
      const withIdx = this.findWord(header.toks, 'with');
      const name = withIdx >= 0 ? this.nameFrom(header.toks, 1, withIdx) : this.nameFrom(header.toks, 1, header.toks.length - 1);
      const params: string[] = [];
      const defaults: (Value | undefined)[] = [];
      if (withIdx >= 0) {
        const paramToks = header.toks.slice(withIdx + 1, header.toks.length - 1);
        let i = 0;
        while (i < paramToks.length) {
          const t = paramToks[i];
          if (isWord(t, 'and')) {
            i++;
            continue;
          }
          if (!isWord(t)) throw new EngError('I expected a parameter name after "with".', headerNo);
          params.push((t as { v: string }).v);
          i++;
          if (isWord(paramToks[i], 'default')) {
            i++;
            const lit = paramToks[i];
            if (lit && (lit.k === 'str' || lit.k === 'num')) {
              defaults.push(lit.k === 'str' ? { t: 'str', v: lit.v } : { t: 'num', v: lit.v });
              i++;
            } else if (isWord(lit, 'yes')) {
              defaults.push({ t: 'bool', v: true });
              i++;
            } else if (isWord(lit, 'no')) {
              defaults.push({ t: 'bool', v: false });
              i++;
            } else {
              defaults.push(undefined);
            }
          } else {
            defaults.push(undefined);
          }
        }
      }
      const fnValue: Value = { t: 'func', name, params, defaults, body: block.children };
      this.frames[this.frames.length - 1].vars.set(name, fnValue);
      return;
    }

    throw new EngError(`I don't know how to run "${h}".`, headerNo);
  }

  private safeExpr(toks: Tok[], lineNo: number): Value {
    return this.parseBinary(toks, 0, 0, lineNo).value;
  }

  private safeCond(text: string, lineNo: number): { t: 'bool'; v: boolean } {
    const toks = tokenize(text, lineNo);
    const v = this.parseBinary(toks, 0, 0, lineNo).value;
    if (v.t !== 'bool') {
      throw new EngError(
        `A condition must be yes or no, but this is ${typeName(v.t)}. Try this: Write a comparison, as in "if age is greater than 17:".`,
        lineNo,
      );
    }
    return v;
  }

  private runStatement(line: Line, stopFrame?: { stopped?: boolean; skipped?: boolean }) {
    const { toks, no } = line;
    this.tick(no);
    if (!toks.length) return;
    const ws = toks
      .filter((t): t is { k: 'word'; v: string } => t.k === 'word')
      .map((t) => t.v)
      .join(' ')
      .toLowerCase();
    const w0 = ws.split(' ')[0];

    if (ws === 'note') return;

    if (w0 === 'say') {
      const v = this.parseBinary(toks, 1, 0, no);
      this.say(v.value, no);
      return;
    }

    if (w0 === 'ask') {
      // ask "…" and save it as NAME | ask for a number "…" and save it as NAME
      let isNumber = false;
      let i = 1;
      if (isWord(toks[i], 'for')) {
        if (!isWord(toks[i + 1], 'a') || !isWord(toks[i + 2], 'number')) {
          throw new EngError('I expected "ask for a number" or a question after "ask".', no);
        }
        isNumber = true;
        i += 3;
      }
      const promptTok = toks[i];
      if (!promptTok || promptTok.k !== 'str') {
        throw new EngError('I expected a question in quotes after "ask".', no);
      }
      const asIdx = this.findWord(toks, 'as', i);
      if (asIdx < 0 || !this.findWord(toks, 'save', i, asIdx)) {
        throw new EngError('I expected "and save it as name" after the question.', no);
      }
      const name = this.nameFrom(toks, asIdx + 1, toks.length);
      if (!name) throw new EngError('I expected "and save it as name" after the question.', no);
      let answer: Value = { t: 'str', v: this.ask((promptTok as { v: string }).v, no) };
      if (isNumber) {
        const n = Number((answer as { v: string }).v);
        if (Number.isNaN(n)) {
          throw new EngError(`I asked for a number, but "${(answer as { v: string }).v}" is not one.`, no);
        }
        answer = { t: 'num', v: n };
      }
      this.assign(name, answer);
      return;
    }

    if (w0 === 'set') {
      const toIdx = this.findWord(toks, 'to', 1);
      if (toIdx < 1) throw new EngError('I expected "set name to value".', no);
      const name = this.nameFrom(toks, 1, toIdx);
      if (!name) throw new EngError('I expected a name after "set".', no);
      const value = this.parseBinary(toks, toIdx + 1, 0, no).value;
      if (this.setPossessive(toks, 1, toIdx, value, 'set', no)) return;
      this.assign(name, value);
      return;
    }

    if (w0 === 'change' && /^(change (text|value) of)\b/.test(ws)) {
      throw new EngError(
        '"change text of" and "change value of" work inside an app. This browser runner runs scripts only — app features need the desktop CLI.',
        no,
      );
    }
    if (w0 === 'change') {
      const toIdx = this.findWord(toks, 'to', 1);
      if (toIdx < 1) {
        throw new EngError('I expected "to" after the name, as in "change age to 26".', no);
      }
      const name = this.nameFrom(toks, 1, toIdx);
      const value = this.parseBinary(toks, toIdx + 1, 0, no).value;
      if (this.setPossessive(toks, 1, toIdx, value, 'change', no)) return;
      if (!this.lookup(name)) {
        throw new EngError(
          `I can only change a number, but "${name}" has no value yet. Try this: Give the value a name with "set" first.`,
          no,
        );
      }
      this.assign(name, value);
      return;
    }

    if (w0 === 'keep') {
      if (ws !== 'keep track of' && !ws.startsWith('keep track of')) {
        throw new EngError('I expected "keep track of name as value".', no);
      }
      const asIdx = this.findWord(toks, 'as');
      if (asIdx < 0) throw new EngError('I expected "keep track of name as value".', no);
      const name = this.nameFrom(toks, 3, asIdx);
      const value = this.parseBinary(toks, asIdx + 1, 0, no).value;
      this.frames[this.frames.length - 1].vars.set(name, value);
      return;
    }

    if (w0 === 'add') {
      const toIdx = this.findWord(toks, 'to', 1);
      if (toIdx < 1) throw new EngError('I expected "add value to list".', no);
      const value = this.parseBinary(toks, 1, 7, no).value;
      const name = this.nameFrom(toks, toIdx + 1, toks.length);
      const list = this.lookup(name);
      if (!list || list.t !== 'list') {
        throw new EngError(`"add … to …" needs a list called "${name}". Use "set" and "an empty list" first.`, no);
      }
      list.v.push(value);
      return;
    }

    if (w0 === 'remove') {
      const fromIdx = this.findWord(toks, 'from', 1);
      if (fromIdx < 1) throw new EngError('I expected "remove value from list".', no);
      const value = this.parseBinary(toks, 1, 7, no).value;
      const name = this.nameFrom(toks, fromIdx + 1, toks.length);
      const target = this.lookup(name);
      if (target && target.t === 'list') {
        const i = target.v.findIndex((x) => eq(x, value));
        if (i >= 0) target.v.splice(i, 1);
        return;
      }
      if (target && target.t === 'table' && value.t === 'str') {
        delete target.v[value.v];
        return;
      }
      throw new EngError(`"remove … from …" needs a list or table called "${name}".`, no);
    }

    if (w0 === 'sort' || w0 === 'reverse' || w0 === 'shuffle') {
      const word = ws.split(' ')[0];
      const words = toks
        .filter((t): t is { k: 'word'; v: string } => t.k === 'word')
        .map((t) => t.v)
        .filter((v) => v.toLowerCase() !== word && v.toLowerCase() !== 'descending');
      const name = words.join(' ').toLowerCase();
      const list = this.lookup(name);
      if (!list || list.t !== 'list') {
        throw new EngError(`"${word}" needs a list called "${name}".`, no);
      }
      if (word === 'sort') {
        list.v.sort((a, b) => this.sortCompare(a, b));
        if (ws.includes('descending')) list.v.reverse();
      }
      if (word === 'reverse') list.v.reverse();
      if (word === 'shuffle') {
        for (let i = list.v.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [list.v[i], list.v[j]] = [list.v[j], list.v[i]];
        }
      }
      return;
    }

    if (w0 === 'stop' && ws === 'stop the loop') {
      if (stopFrame) stopFrame.stopped = true;
      return;
    }
    if (w0 === 'skip' && ws === 'skip to the next one') {
      if (stopFrame) stopFrame.skipped = true;
      return;
    }
    if (w0 === 'give') {
      if (!/^(gives?) back\b/.test(ws)) {
        throw new EngError('I expected "give back a value" inside a function.', no);
      }
      if (this.funcDepth === 0) {
        throw new EngError('"give back" needs to be inside a function.', no);
      }
      const backIdx = this.findWord(toks, 'back', 0);
      throw new ReturnSignal(this.parseBinary(toks, backIdx + 1, 0, no).value);
    }
    if (w0 === 'wait') {
      // accepted but instant in the browser runner
      return;
    }
    if (w0 === 'call') {
      this.parseCall(toks, 0, no);
      return;
    }
    if (w0 === 'use') {
      this.warnings.push('This browser runner cannot load other files. Files work with the desktop CLI.');
      return;
    }
    if (w0 === 'play') {
      if (!ws.startsWith('play sound')) {
        throw new EngError('I expected "play sound name" after "play".', no);
      }
      this.warnings.push('Sounds play in the desktop CLI and in built apps — the browser runner skips them.');
      return;
    }
    if (/^(read|write|append|delete)\b/.test(ws)) {
      throw new EngError(
        'Files need the desktop CLI. This browser runner runs scripts without touching your files.',
        no,
      );
    }
    if (/^(get|send) data\b/.test(ws)) {
      throw new EngError(
        'The network needs the desktop CLI with --allow-network. This browser runner stays offline.',
        no,
      );
    }
    if (/^(save|load|delete)\b/.test(ws) && ws.includes('device')) {
      throw new EngError(
        'Device storage needs the desktop CLI. This browser runner keeps everything in your browser only.',
        no,
      );
    }

    // bare function call: greet "Ada"
    if (isWord(toks[0])) {
      const fnValue = this.lookup((toks[0] as { v: string }).v.toLowerCase());
      if (fnValue && fnValue.t === 'func') {
        this.parseCall(toks, 0, no);
        return;
      }
    }

    throw new EngError(
      `I don't know how to run "${ws}". Try this: Start with "say", "set", "if" or "repeat".`,
      no,
    );
  }

  private sortCompare(a: Value, b: Value): number {
    if (a.t === 'num' && b.t === 'num') return a.v - b.v;
    if (a.t === 'str' && b.t === 'str') return a.v.localeCompare(b.v);
    return 0;
  }
}

class LoopSignal {}
class ReturnSignal {
  constructor(public value: Value) {}
}

/** Run a program. `answers` feeds `ask` prompts in order; when the queue runs
 *  dry the run pauses with kind 'ask' so a host can prompt and resume. */
export function runProgram(source: string, answers: string[]): RunOutput {
  const interp = new Interpreter(answers);
  try {
    // Strip comments and blank lines, keep line numbers
    const lines: Line[] = [];
    source.split('\n').forEach((raw, idx) => {
      const no = idx + 1;
      const stripped = raw.replace(/note:.*$/, '').trim();
      if (!stripped) return;
      lines.push({ no, text: stripped, toks: tokenize(stripped, no) });
    });
    const program = parseBlocks(lines);
    interp.runNodes(program);
    return { kind: 'ok', lines: interp.out, warnings: interp.warnings };
  } catch (e) {
    if (e instanceof AskSignal) {
      return { kind: 'ask', prompt: e.prompt, line: e.line, lines: interp.out };
    }
    const line = e instanceof EngError ? e.line : 0;
    const message = e instanceof Error ? e.message : String(e);
    return { kind: 'error', line, message, lines: interp.out };
  }
}

export { fmt };
