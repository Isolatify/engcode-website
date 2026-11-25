import type { DocPage } from './types';

/** Reference pages. */
export const reference: DocPage[] = [
  {
    slug: 'standard-library',
    title: 'Standard Library',
    blocks: [
      {
        t: 'p',
        text: 'Every built-in phrase, grouped by what it does. All of these work in scripts; phrases marked *app only* need an app block.',
      },
      { t: 'h2', text: 'Math' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say round of 2.6
say floor of 2.9
say ceiling of 2.1
say absolute value of -4
say square root of 81
say minimum of 3 and 8
say maximum of 3 and 8
say power of 2 and 10
say sine of 0
say cosine of 0
say tangent of 0
say pi
say e
say random decimal
set secret to random number from 1 to 100`,
      },
      {
        t: 'ul',
        items: [
          '`pi` and `e` are constants.',
          'Trig functions take radians.',
          '`random number from A to B` is inclusive at both ends.',
          '`random item of list` picks an element at random.',
        ],
      },
      { t: 'h2', text: 'Text' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say uppercase of "hello"
say lowercase of "HELLO"
say trim of "  padded  "
say length of "hello"
say split "a,b,c" by ","
say join numbers with ", "
say replace "l" with "L" in "hello"
say position of "l" in "hello"
say item 1 of "hello"
say last item of "hello"
say text of 42
say number from "42"`,
      },
      {
        t: 'ul',
        items: [
          '`position of … in …` is 1-based and gives `0` when the text is absent.',
          '`number from "42"` fails loudly on bad input — catch it with `try:`.',
        ],
      },
      { t: 'h2', text: 'Lists and tables' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set nums to a list of 1, 2, 3
say item 2 of nums
say last item of nums
say the length of nums
add 4 to nums
remove 1 from nums
sort nums
sort nums descending
reverse nums
shuffle nums
say random item of nums
say nums contains 2`,
      },
      {
        t: 'code',
        lang: 'engcode',
        code: `set row to a table with name "Sam", age 25
say row's name
say row's "full name"
set row's name to "Samuel"
change row's age to 26
remove "age" from row
say length of row`,
      },
      { t: 'h2', text: 'JSON' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say JSON of a table with name "Sam", age 25
set person to data from JSON "{\\"name\\":\\"Sam\\",\\"age\\":25}"`,
      },
      { t: 'h2', text: 'Time' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say "It is " plus format of now with "HH:mm"
say "Today is " plus today
wait 2 seconds`,
      },
      {
        t: 'ul',
        items: [
          '`now` is a table: `year`, `month`, `day`, `hour`, `minute`, `second`.',
          '`today` gives a date like `2026-11-10`.',
          '`format of now with "…"` copies letters outside the pattern literally — `HH:mm` gives `14:30`, `"week 12"` stays `week 12`.',
        ],
      },
      { t: 'h2', text: 'Files, device and web' },
      {
        t: 'code',
        lang: 'engcode',
        code: `write "first line" to file "notes.txt"
append "second line" to file "notes.txt"
read file "notes.txt" and save it as notes
list files in "." and save it as names
delete file "notes.txt"`,
      },
      {
        t: 'code',
        lang: 'engcode',
        code: `save tasks to the device as "tasks"
load "tasks" from the device and save it as saved tasks
delete "tasks" from the device
get data from address and save it as weather
send data payload to "https://example.com/api"`,
      },
      {
        t: 'ul',
        items: [
          'Files stay inside the project folder.',
          'Network calls need `--allow-network` on the CLI.',
        ],
      },
      { t: 'h2', text: 'App only' },
      {
        t: 'code',
        lang: 'engcode',
        code: `value of "name"
key "w" is pressed
change text of "status" to "Saved"
show "details"
hide "details"
clear "search"
go to page "About"
open popup "confirm"
close popup "confirm"
play sound "ding.mp3"`,
      },
      {
        t: 'code',
        lang: 'engcode',
        code: `clear canvas "board" to #111827
draw rectangle on "board" at x 10 and y 10 with width 20 and height 20 in white
draw circle on "board" at x 50 and y 50 with size 8 in white
draw line on "board" from x 0 and y 0 to x 100 and y 100 in white
draw text "Score" on "board" at x 12 and y 24 in white
draw image "ball.png" on "board" at x 50 and y 50 with size 24`,
      },
      { t: 'h2', text: 'Errors' },
      {
        t: 'code',
        lang: 'engcode',
        code: `try:
    say 10 divided by 0
if it fails:
    say "Caught: " plus the error
end`,
      },
      {
        t: 'callout',
        kind: 'info',
        text: 'Every runtime failure is catchable with `try:` / `if it fails:`. Syntax and checker errors are found before the program runs and cannot be caught.',
      },
    ],
  },
  {
    slug: 'cli',
    title: 'CLI Reference',
    blocks: [
      {
        t: 'p',
        text: 'Every `engcode` command and flag. Run `engcode help` any time to see this list in your terminal.',
      },
      { t: 'h2', text: 'Commands' },
      {
        t: 'table',
        head: ['Command', 'What it does'],
        rows: [
          ['engcode run <file>', 'Run a script or app (the default for a file argument)'],
          ['engcode check <file|dir>', 'Parse + type-check without running'],
          ['engcode repl', 'Interactive REPL'],
          ['engcode serve <file>', 'Serve an app for development (port 3000)'],
          ['engcode app <file>', 'Build an app'],
          ['engcode build web', 'Build for the web'],
          ['engcode build windows|mac|linux', 'Desktop builds'],
          ['engcode new <dir>', 'Scaffold a project'],
          ['engcode format <file>', 'Rewrite in canonical formatting (alias: fmt)'],
          ['engcode lint <file>', 'Style warnings only'],
          ['engcode learn', 'Interactive lessons'],
          ['engcode playground', 'Start the playground (port 4000)'],
          ['engcode version · --version · -v', 'Show the version'],
          ['engcode help · --help · -h', 'Show help'],
        ],
      },
      { t: 'h2', text: 'Flags' },
      {
        t: 'table',
        head: ['Flag', 'Meaning'],
        rows: [
          ['--allow-network', 'Permit get/send data'],
          ['--explain', 'Trace execution (Step N · line L format)'],
          ['--step', 'Step-by-step execution in the REPL'],
          ['--json', 'Machine-readable output'],
          ['--strict', 'Treat warnings as failures'],
          ['--lint', 'Include lint warnings in check'],
          ['--check', 'Check only'],
          ['--stdout', 'Print build output to stdout'],
          ['--type', 'Print the detected project type'],
          ['--template', 'Choose a template for new'],
          ['--run', 'Run after build'],
          ['--file', 'Entry file'],
          ['--reset', 'Reset stored state'],
          ['--port', 'Override port'],
          ['--open', 'Open the browser after serve'],
          ['--out', 'Output directory'],
          ['--minify', 'Minify build output'],
        ],
      },
      { t: 'h2', text: 'Exit codes and output' },
      {
        t: 'ul',
        items: [
          '`0` success · `1` errors found · `2` bad usage or internal failure.',
          'A clean check prints: `No problems found in <file>.`',
          'With warnings: `No errors in <file>. N warnings.` — unless `--strict` upgrades them.',
          '`engcode new` creates `main.eng`, `engcode.json`, `.gitignore` and a README.',
        ],
      },
      { t: 'h2', text: 'The REPL' },
      {
        t: 'code',
        lang: 'bash',
        code: `engcode repl
:help        list commands
:load app.eng  load a file
:clear       wipe the session
:quit        leave (q and exit work too)`,
      },
      {
        t: 'p',
        text: 'With `--step`, press Enter to execute one step, `v` to show variables, `q` to quit.',
      },
      { t: 'h2', text: '--explain' },
      {
        t: 'code',
        lang: 'bash',
        code: `engcode run hello.eng --explain`,
      },
      {
        t: 'code',
        lang: 'text',
        code: `Step 1 · line 3
→ say "Hello!"
...`,
      },
      {
        t: 'p',
        text: 'Each step shows the line about to run. The trace stops after 200 steps.',
      },
    ],
  },
  {
    slug: 'vscode-extension',
    title: 'VS Code Extension',
    blocks: [
      {
        t: 'p',
        text: 'The **EngCode** extension turns VS Code into a first-class editor for `.eng` files: highlighting, icons, a run button, ~90 snippets, live checks and a debugger.',
      },
      { t: 'h2', text: 'Install' },
      {
        t: 'code',
        lang: 'bash',
        code: `code --install-extension engcode.engcode`,
      },
      { t: 'h2', text: 'Commands' },
      {
        t: 'table',
        head: ['Command', 'What it does'],
        rows: [
          ['EngCode: Run File', 'Runs the active file with the configured executable'],
          ['EngCode: Serve App', 'Serves the current app on localhost'],
          ['EngCode: Explain File', 'Runs with --explain and shows the trace'],
          ['EngCode: Check File', 'Runs check without executing'],
        ],
      },
      { t: 'h2', text: 'Settings' },
      {
        t: 'code',
        lang: 'text',
        code: `{
  "engcode.executable": "engcode",
  "engcode.checkOnType": true
}`,
      },
      {
        t: 'ul',
        items: [
          '`engcode.executable` — path to the `engcode` binary.',
          '`engcode.checkOnType` — run checks while you type and underline problems as you write.',
        ],
      },
      { t: 'h2', text: 'Editing features' },
      {
        t: 'ul',
        items: [
          '**Syntax highlighting** — a TextMate grammar tuned to EngCode\'s word operators, block words and string escapes.',
          '**File icon** — `.eng` files carry the EngCode mark in the explorer.',
          '**Snippets** — about 90 of them, from `say` to `when … is clicked:` to `draw circle`.',
          '**Smart comments** — Toggle Comment inserts `note:`.',
          '**Smart indentation** — a line ending in `:` indents; a line starting with `end` outdents.',
          '**Word selection** — multi-word identifiers like `saved notes` double-click as one word.',
        ],
      },
      { t: 'h2', text: 'Debugger' },
      {
        t: 'code',
        lang: 'text',
        code: `{
  "type": "engcode",
  "request": "launch",
  "name": "Run main.eng",
  "program": "\${workspaceFolder}/main.eng",
  "stopOnEntry": false
}`,
      },
      {
        t: 'callout',
        kind: 'tip',
        text: 'No extension for your editor? `engcode playground` gives you a local editor with the same examples, and `engcode repl` works anywhere.',
      },
    ],
  },
  {
    slug: 'faq',
    title: 'FAQ',
    blocks: [
      { t: 'h2', text: 'Is EngCode a real language or a toy?' },
      {
        t: 'p',
        text: 'Real. It has a lexer, parser, checker and interpreter, about three hundred tests, a formatter, a linter, a REPL, a VS Code extension with a debugger, and a compiler that produces static websites and desktop apps. It is also genuinely simple — that is the point, not the limitation.',
      },
      { t: 'h2', text: 'Do I need to know another language first?' },
      {
        t: 'p',
        text: 'No. The [20-lesson course](/learn) assumes zero background — the first program you run is one sentence long. If you already program, skim the [Cheat sheet](/cheat-sheet) and you will be writing idiomatic EngCode in an hour.',
      },
      { t: 'h2', text: 'Why does EngCode reject `=`, `+` and `;`?' },
      {
        t: 'p',
        text: 'On purpose. Symbols are the densest part of most languages. EngCode spells them out — **set x to 5**, **change total to total plus 1** — and the lexer explains itself when you slip: *I found "=", which EngCode does not use.* You lose nothing but character count.',
      },
      { t: 'h2', text: 'How do conditions work? Why not `if 1:`?' },
      {
        t: 'p',
        text: 'Conditions must be **yes or no** — there is no implicit truthiness, so a number where a condition belongs is a checker error, not a subtle bug. Write `if score is greater than 0:` instead.',
      },
      { t: 'h2', text: 'Can I use it for serious projects?' },
      {
        t: 'p',
        text: 'For scripts, internal tools, teaching, prototypes, small websites and simple desktop apps — yes, and it is pleasant. It is not aiming to replace general-purpose languages for large systems; v1.0.0 is the first stable release and the [roadmap](/roadmap) shows where it is going.',
      },
      { t: 'h2', text: 'Is it free? What is the license?' },
      {
        t: 'p',
        text: 'MIT licensed — free for personal and commercial use. See the [license](/license) page.',
      },
      { t: 'h2', text: 'Windows and macOS — what about Linux?' },
      {
        t: 'p',
        text: 'Scripts run anywhere Node.js runs, and `engcode build linux` exists. Desktop app wrappers are polished for Windows and macOS first; see the [roadmap](/roadmap).',
      },
      { t: 'h2', text: 'How do I report a bug or ask a question?' },
      {
        t: 'ul',
        items: [
          'Bugs and ideas: [GitHub issues](https://github.com/Isolatify/engcode/issues).',
          'Questions: [GitHub discussions](https://github.com/Isolatify/engcode/discussions).',
          'Or the [support page](/support) — it walks you through what to include so you get answers faster.',
        ],
      },
      { t: 'h2', text: 'Where do the error messages come from?' },
      {
        t: 'p',
        text: 'Every diagnostic is written by hand in plain English: the line number, the offending text under a caret, the problem in one sentence, and a **Try this:** hint with a concrete fix. Misspellings get *Did you mean "…"?* suggestions. See [the error style guide](/docs/quick-start#4-check-before-you-run).',
      },
      { t: 'h2', text: 'Does the playground need an account?' },
      {
        t: 'p',
        text: 'No. [The in-browser playground](/playground) runs scripts without an account, and `engcode playground` runs the same editor locally on port 4000. App previews and the full language (files, network) need the local CLI.',
      },
    ],
  },
];
