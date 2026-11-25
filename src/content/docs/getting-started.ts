import type { DocPage } from './types';

/** Getting-started pages. */
export const gettingStarted: DocPage[] = [
  {
    slug: 'introduction',
    title: 'Introduction',
    blocks: [
      {
        t: 'p',
        text: 'EngCode is a programming language written in plain English. There are no curly braces, no semicolons, no cryptic symbols — a program reads like a list of instructions you could say out loud.',
      },
      {
        t: 'code',
        lang: 'engcode',
        caption: 'hello.eng',
        code: `note: Your first EngCode program.
say "Hello, world!"

ask "What is your name?" and save it as name
say "Hello, " plus name plus "! Welcome to EngCode."`,
      },
      {
        t: 'p',
        text: 'That is a complete, runnable program. Every line is one statement. Blocks of code end with the word **end**, comments start with `note:`, and there is nothing else to memorize before you can run something.',
      },
      { t: 'h2', text: 'Why plain English?' },
      {
        t: 'p',
        text: 'Most languages spend their syntax budget on punctuation: `{ } ( ) ; => ++`. EngCode spends it on words. Where another language writes `total += 1`, EngCode writes **change total to total plus 1**. The result is code that a non-programmer can read out loud and roughly understand — which makes it easier to learn, easier to review, and easier to come back to after a month.',
      },
      {
        t: 'ul',
        items: [
          '**No symbols to trip over.** The lexer rejects `;`, `{`, `}` and `=` with a friendly explanation instead of a syntax error you have to Google.',
          '**One statement per line.** No semicolons, no line continuations, no ambiguity about where a statement ends.',
          '**Explicit blocks.** A block starts with a line ending in `:` and ends with a line reading `end`. Indentation is cosmetic.',
          '**Forgiving names.** Identifiers can be several words long, and misspellings get a "Did you mean …?" suggestion.',
        ],
      },
      { t: 'h2', text: 'What can you build?' },
      {
        t: 'table',
        head: ['Kind', 'What you write', 'What you get'],
        rows: [
          ['Scripts', 'say, ask, loops, functions', 'Terminal programs that run anywhere Node.js runs'],
          ['Websites', 'an app block with pages', 'A static site you can deploy anywhere'],
          ['Desktop apps', 'app + style + when events', 'Windows and macOS apps built with engcode build'],
        ],
      },
      { t: 'h2', text: 'How it works' },
      {
        t: 'p',
        text: 'The `engcode` CLI reads your `.eng` file, checks it, and runs it directly — or compiles it. Scripts are interpreted with a hard cap of 200,000 steps so a runaway loop stops instead of freezing your machine. Apps compile to HTML, CSS and JavaScript, then get wrapped for the web or for desktop.',
      },
      {
        t: 'callout',
        kind: 'tip',
        text: 'New to programming entirely? Skip ahead to [Quick Start](/docs/quick-start) and run your first program in about five minutes.',
      },
      { t: 'h2', text: 'Where to go next' },
      {
        t: 'ul',
        items: [
          '[Install](/docs/installation) the CLI on Windows, macOS or Linux.',
          '[Quick Start](/docs/quick-start) — write and run your first program.',
          '[Language guide](/docs/variables) — every statement form, one page at a time.',
          '[Standard Library](/docs/standard-library) — every built-in command.',
        ],
      },
    ],
  },
  {
    slug: 'installation',
    title: 'Installation',
    blocks: [
      {
        t: 'p',
        text: 'EngCode ships three ways: a one-line install script per platform, npm, and the VS Code extension for editing. All three are free and open source.',
      },
      { t: 'h2', text: 'Windows (PowerShell)' },
      {
        t: 'code',
        lang: 'bash',
        code: `irm 'https://engcode.vercel.app/install/irm' | iex`,
      },
      { t: 'h2', text: 'macOS / Linux (curl)' },
      {
        t: 'code',
        lang: 'bash',
        code: `curl https://engcode.vercel.app/install/curl -fsS | bash`,
      },
      {
        t: 'p',
        text: 'The script installs the latest release into `~/.engcode/bin` and updates your PATH. If curl is missing it falls back to npm automatically.',
      },
      { t: 'h2', text: 'With npm' },
      {
        t: 'p',
        text: 'If you already have Node.js 18+, npm is the most portable option:',
      },
      {
        t: 'code',
        lang: 'bash',
        code: `npm install -g engcode

engcode --version`,
      },
      { t: 'h2', text: 'Verify the install' },
      {
        t: 'code',
        lang: 'bash',
        code: `engcode --version
# 1.0.0

engcode help`,
      },
      {
        t: 'callout',
        kind: 'info',
        text: 'Getting "command not found"? Close and reopen your terminal first — the install script edits your PATH, and already-open terminals do not pick it up.',
      },
      { t: 'h2', text: 'The VS Code extension' },
      {
        t: 'p',
        text: 'The extension adds syntax highlighting for `.eng` files, a file icon, a Run button and about 90 snippets:',
      },
      {
        t: 'code',
        lang: 'bash',
        code: `code --install-extension engcode.engcode`,
      },
      {
        t: 'p',
        text: 'Inside VS Code you get four commands: **EngCode: Run File**, **EngCode: Serve App**, **EngCode: Explain File** and **EngCode: Check File**, plus optional checks while you type (`engcode.checkOnType`). See [VS Code Extension](/docs/vscode-extension) for everything it does.',
      },
      { t: 'h2', text: 'Uninstall' },
      {
        t: 'code',
        lang: 'bash',
        code: `npm uninstall -g engcode`,
      },
      {
        t: 'p',
        text: 'The install script also writes to `~/.engcode` — delete that folder to remove the binaries and any cached files.',
      },
    ],
  },
  {
    slug: 'quick-start',
    title: 'Quick Start',
    blocks: [
      {
        t: 'p',
        text: 'From nothing to a running program in five minutes. You need the CLI installed — see [Installation](/docs/installation) if you do not have it yet.',
      },
      { t: 'h2', text: '1. Create a project' },
      {
        t: 'code',
        lang: 'bash',
        code: `engcode new hello
cd hello`,
      },
      {
        t: 'p',
        text: 'This creates `main.eng`, a `engcode.json` project file, a `.gitignore` and a README. `engcode.json` records the project name, type and entry file.',
      },
      { t: 'h2', text: '2. Read your first program' },
      {
        t: 'code',
        lang: 'engcode',
        caption: 'main.eng',
        code: `note: Your first EngCode program.
say "Hello, world!"

ask "What is your name?" and save it as name
say "Hello, " plus name plus "!"`,
      },
      {
        t: 'p',
        text: 'Line by line: `note:` starts a comment the computer ignores. `say` prints a line. `ask … and save it as …` asks a question and stores the answer under a name. **plus** joins text together — EngCode spells its operators in words.',
      },
      { t: 'h2', text: '3. Run it' },
      {
        t: 'code',
        lang: 'bash',
        code: `engcode run main.eng`,
      },
      {
        t: 'code',
        lang: 'text',
        caption: 'Output',
        code: `Hello, world!
What is your name?
Ada
Hello, Ada! Welcome to EngCode.`,
      },
      { t: 'h2', text: '4. Check before you run' },
      {
        t: 'code',
        lang: 'bash',
        code: `engcode check main.eng
# No problems found in main.eng.`,
      },
      {
        t: 'p',
        text: '`check` parses and type-checks without running — useful when a file has grown long. Errors come back as plain-English sentences with the line number, the offending text marked with a caret, and a **Try this:** hint.',
      },
      {
        t: 'code',
        lang: 'text',
        code: `Oops — line 12 of guess.eng
  12 | set guesses to guesses pluss 1
     |                   ^^^^^
I don't know the name "pluss".
Try this:
  Did you mean "plus"?`,
      },
      { t: 'h2', text: '5. Try something bigger' },
      {
        t: 'p',
        text: 'A guessing game — conditions, loops and a random number in ten lines:',
      },
      {
        t: 'code',
        lang: 'engcode',
        code: `set secret to random number from 1 to 100
set guesses to 0

repeat 7 times:
    ask for a number "Guess a number from 1 to 100" and save it as guess
    change guesses to guesses plus 1
    if guess is less than secret:
        say "Too low!"
    otherwise if guess is greater than secret:
        say "Too high!"
    otherwise:
        say "You got it in " plus guesses plus " guesses!"
        stop the loop
    end
end`,
      },
      {
        t: 'callout',
        kind: 'tip',
        text: 'Stuck? `engcode playground` opens a local editor in your browser with the same examples, and the [Cheat sheet](/cheat-sheet) puts every command on one printable page.',
      },
      { t: 'h2', text: 'Next steps' },
      {
        t: 'ul',
        items: [
          '[Variables](/docs/variables) — storing and changing values in detail.',
          '[Loops](/docs/loops) — repeat, count, while and for each.',
          '[Apps](/docs/apps) — build your first desktop app.',
        ],
      },
    ],
  },
];
