# EngCode Language Reference (QA Edition)

Source repo: `C:\Users\Abdul\Code\engcode\engcode` (read-only inspection).
Package version: **1.0.0** (`package.json`, name `engcode-language`, private, MIT).
Test counts: README (line 37) and design.md (§"302 tests") claim **302 tests**; direct count
= **308 `test(` call sites across 28 test files** (306 at column 0, plus 2 loop sites:
`symbols.test.ts:333` iterating 10 `SAMPLES`, `web-compiler.test.ts:35` iterating 6
`EXAMPLES`) → **≈322 tests registered at runtime**.

All example lines below are quoted verbatim from the repo's tests, docs, and `examples/`
folders. Anything not verifiable in the repo is listed in section 10 as Unknown.

---

## 1. Language overview

- Files use the `.eng` extension; scripts are collections of **one statement per line**.
- Blocks are introduced by a line ending in `:` and closed by a line containing `end`.
- Indentation is cosmetic (the formatter standardizes on 4 spaces) — blocks are explicit.
- Comments start with `note:` and run to the end of the line.
- Keywords are case-insensitive; user names are case-sensitive.
- No semicolons, no curly braces, no `=`, no `+`. The lexer rejects them with:
  - `EngCode does not use semicolons.`
  - `EngCode does not use curly braces.`
  - `I found "=", which EngCode does not use.`
  - `I don't know what to do with "+". EngCode spells its operators in words.`
- Two dialects: plain scripts (`say`, `ask`, loops, functions) and **apps** (an `app`
  block containing `page`s, `style:`, `when …:` event blocks, compiled to HTML/CSS/JS).

Minimal program (`README.md`):

```engcode
say "Hello!"
```

Multi-line sample (`examples/hello/main.eng`):

```engcode
note: Your first EngCode program.
say "Hello, world!"
ask "What is your name?" and save it as name
say "Hello, " plus name plus "! Welcome to EngCode."
```

---

## 2. Exact syntax, production by production

Grammar authority: `docs/grammar.md` (EBNF), verified against `src/parser.ts`.

### 2.1 Lexical

```ebnf
line = { statement } , comment ;
comment = "note:" , { any char except newline } ;
string = '"' , { char | '\\"' | '\\\\' | '\\n' | '\\t' } , '"' ;
number = digit , { digit } , [ "." , digit , { digit } ] ;
hex = "#" , hexdigit , hexdigit , hexdigit , [ hexdigit , hexdigit , hexdigit ] ;
```

- Strings support escapes `\"`, `\\`, `\n`, `\t` (tests: `escaped "quotes" and \n newlines \t tabs`).
- String literals never span lines; a dangling `"` reports `A string never runs past the end of its line.`
- Numbers are IEEE-754 doubles (max safe integer 9007199254740991).
- Hex colors `#fff` / `#0f766e` are only legal in `style:` blocks and `draw`. Using one in a
  normal expression is a parse error: `Colors only make sense in a style block.`
- A lone `#` in expression position: `I don't know how to read "#".` (grammar.md also quotes
  `I don't understand "#". Colors belong in a style block.` — that exact string does not
  appear in `src/`; see section 10.)

### 2.2 Names (identifiers)

Multi-word names are allowed. The parser "prescans" a statement to find the longest
identifier sequence before any keyword delimiter. Reserved delimiters that can never be
part of a name:

```
to  from  with  as  in  and  or  called  showing  level  default  that  ,  :
```

Parentheses are supported in expressions (see the `otherwise if` example in §2.4) and group
sub-expressions; `(` also ends the identifier prescan.

The prescan builds a `BUILTINS` set of fixed multi-word phrases (`keep track of`,
`change x by`, `item … of`, `the …`, `a list of`, etc.) so a user variable with the same
words loses to the built-in phrase. Lookup order (parser name resolution): locally scoped
block name → any name in scope (innermost block outward) → global `set` name → closest
built-in word → error `I don't know the name "naem".` with hint `Did you mean "name"?`
(unmatched: `Give the value a name with "set" first.`).

Scope rules:

- `set` inside a block first assigns an existing outer variable of that name; if none
  exists it creates a new one **in that block**. Top level = global scope.
- `keep track of … as …` always declares in the current block.
- Function parameters are local to the function block.
- Loops, `if`, `app`, `page`, `style`, `when`, `every`, `try/if it fails` each open a block.

### 2.3 Literals and constructors

```engcode
set n to 42
set x to 3.5
set s to "hello"
set t to yes
set u to nothing
set nums to a list of 1, 2, 3
set emptyList to an empty list
set row to a table with name "Sam", age 25
set emptyTable to an empty table
set e to e
```

- `yes` / `no` are booleans; `nothing` is nil.
- Tables are written `a table with key: value, key: value`. Recognized keys (checker):
  `name, title, price, count, total, status, id, email, phone, url, image, time, day,
  month, year, question, answer, category, tag, state, note, message, user, item, type`.
  An unrecognized key yields a warning: `Tables usually use keys like "name", "price", "status", or "time".`
- `e` (Euler's number) is implemented (parser.ts:2442 returns 2.718281828459045).

### 2.4 Statements — exact line forms

Statement dispatch is in `src/parser.ts` (lines ~399–516). One statement per line.

**Output / input**

```engcode
say "Hello, world!"
say "Hello, " plus name plus "! Welcome to EngCode."
ask "What is your name?" and save it as name
ask for a number "Guess a number from 1 to 100" and save it as guess
```

- `say expr` — prints the value plus `\n` (in apps: a toast). The newline is appended by
  the interpreter (`console.log(format(...))`), not by the expression.
- `ask expr and save it as name` — the `and save it as name` clause is **required**
  (parser: `I expected "and save it as name" after the question.`).
- `ask for a number expr and save it as name` — numeric variant (the three-word prefix
  `for a number` is optional and detected by lookahead).

**Variables**

```engcode
set score to 0
change guesses to guesses plus 1
change paddle to paddle minus 6
keep track of items as an empty list
```

- `set name to expr` — create or reassign (block-scoped as described in 2.2).
- `change name to expr` — requires an existing name; missing name:
  `I can only change a number, but "highscore" has no value yet.` Missing `to`:
  `I expected "to" after the name, as in "change age to 26".`
- `keep track of name as expr` — always declares in the current block.

**Conditionals**

```engcode
if score is greater than 10:
  say "high"
otherwise if score is 5:
  say "five"
otherwise:
  say "other"
end
```

```engcode
try:
    set x to 1 divided by 0
if it fails:
    say the error
end
```

- `try:` … `if it fails:` … `end` is the error-handling block; the two middle keywords are
  mandatory (`I expected "if it fails:" after the try block.`). `the error` is only valid
  inside the handler (`"the error" only works inside "if it fails".`). Misplaced handler:
  `"if it fails" does not have a "try" above it.`
- Alternate branches of `if` are `otherwise if cond:` and `otherwise:` (NOT `else`/`elif`).
  Misuse: `"otherwise" does not have an "if" above it.` hint `Put it inside an if block.`
- `otherwise if` / `otherwise` bind to the nearest open `if` (design.md).
- Truthiness: conditions must be yes/no. Non-boolean condition error (checker):
  `A condition must be yes or no, but this is a number.` hint:
  `Write a comparison, as in "if age is greater than 17:". EngCode does not treat other values as true or false.`
- `if it fails:` … `end` opens a try/catch block; inside it `the error` holds the message
  (`"the error" only works inside "if it fails".`).

**Loops**

```engcode
repeat 3 times:
  say "hi"
end
```

```engcode
for each item in a list of 1, 2, 3:
  say item
end
```

```engcode
count from 1 to 5 as i:
  say i
end
```

```engcode
while found is no:
    change guesses to guesses plus 1
end
```

```engcode
stop the loop
skip to the next one
```

- `repeat N times:` (N must be a number: `"repeat" needs a number of times.`)
- `for each name in listExpr:` — the word `each` is mandatory
  (`I expected "for each name in list".`); non-list:
  `"for ... in" needs a list to go through.`
- `count from A to B [as name]:` — inclusive at both ends; default loop variable is
  `counter` (`count from 1 to 5:`).
- `while cond:` — same yes/no condition rule.
- `stop the loop` breaks; `skip to the next one` continues. Exact wording is required.
- `wait N seconds` — runtime form; bad argument:
  `"wait ... seconds" needs a number, 0 or more.`

**Functions**

```engcode
define greet with name:
  say "Hi " plus name
end
```

```engcode
say call greet with "Ada"
```

```engcode
give back 42
```

- `define name with param:` … `end` (0 params allowed: `define setup:`).
- Call with `call f with arg` / `say call f with arg`. Arity errors:
  `"greet" takes 1 argument, but 2 were given.` / `needs 1 more argument`.
- `give back expr` returns; outside a function: `"give back" needs to be inside a function.`

**Lists and tables**

```engcode
add 4 to numbers
remove "Mars" from planets
say item 1 of numbers
say the length of numbers
sort numbers
sort numbers descending
reverse numbers
shuffle numbers
```

- `add expr to name` / `remove expr from name` — append / delete-first-match.
- `item N of list` — 1-based; `item 0 of list` evaluates to `nothing` (no error).
- `sort name` / `sort name descending` / `reverse name` / `shuffle name`.
- Field access: `say rex's age` (possessive `'s` binds tightest alongside calls).
- Delete: `delete …` (exact forms: `delete the file …` / list-row deletion — see §4/§10).

**Files, data, persistence**

```engcode
read file "notes.txt" and save it as contents
write contents to file "notes.txt"
append line to file "notes.txt"
delete file "notes.txt"
list files in "." and save it as names
```

```engcode
get data from address and save it as weather
send data payload to "https://example.com/api"
```

```engcode
save tasks to the device as "tasks"
load "tasks" from the device and save it as saved tasks
delete "tasks" from the device
```

- `use "path"` declares a file/module at program level (grammar: `use_decl = "use" (string | module_name)`;
  `use theme "name"` selects an app theme). Lint capability notes:
  `This program can use project files.` / `…the network.` / `…device storage.`
- `read/write/append/delete file …`, `list files in … and save it as …` — file I/O;
  every one of these fixed clauses (`and save it as`, `to file`, `from`) is parsed by
  lookahead, not by expression greed (grammar.md §160). If an expression needs the same
  words, parenthesize it.
- `get data from … and save it as …` / `send data … to …` — network; running requires
  `--allow-network`.
- `save expr to the device as expr` / `load expr from the device and save it as name` /
  `delete expr from the device` — device storage.

**Objects (kinds)**

```engcode
define a kind of thing called Dog:
  it has name as "Rex"
  it has age as 3
  it can bark:
    say "Woof!"
  end
end
```

```engcode
set rex to a new Dog with name "Rex", age 3
rex bark
say rex's age
say call rex's years with 10
```

- `define a kind of thing called Name:` opens a block; fields via `it has field as default`,
  behaviors via `it can name:` … `end`.
- Construct: `set x to a new Kind with field value, field value`.
- Call a behavior: `x behaviorName`; call with args: `say call x's method with arg`.

**Misc control**

```engcode
wait 2 seconds
play sound "jump"
```

- `stop the loop`, `skip to the next one` — innermost loop/timer only
  (`stop`/`skip` must be inside a loop or timer). Inside `every` they affect one tick.
- `wait expr seconds` (number ≥ 0: `"wait ... seconds" needs a number, 0 or more.`);
  inside event handlers it makes the handler async.
- `play sound expr` — plays a sound by name/URL.
- Errors surface through `try:` / `if it fails:` (see §2.4 Conditionals).

### 2.5 Apps — `app` / `page` / UI elements / `style` / `when` / `every`

Complete real app (`examples/notes/main.eng`, lines 1–40):

```engcode
note: examples/notes/main.eng
app "Notes":
    page "Home":
        heading "My Notes"
        text area called "note" with label "Note" and hint "Write something..."
        row:
            button "Save note" called "save button"
            button "Clear all" called "clear button"
        end
        list called "notes" showing saved notes
    end
end

keep track of saved notes as an empty list

style everything:
    font is "Helvetica"
    background is #f8fafc
end

when the page opens:
    load "notes" from the device and save it as loaded
    if loaded is not nothing:
        set saved notes to loaded
    end
end

when "save button" is clicked:
    set note to value of "note"
    if note is not empty:
        add note to saved notes
        save saved notes to the device as "notes"
        clear "note"
    end
end
```

**Structure**

- `app "Name":` … `end` — top-level app block; contains `page` blocks, `style` blocks,
  `theme` declarations, and event blocks.
- `page "Name":` … `end` — a screen (hash route `#/name` in the compiled site).
- Layout wrappers: `row:`, `column:`, `section:`, `card:`, `divider`, etc.
- UI element line forms (all real):
  - `heading "Weather Now"` / `heading "Current weather" level 2` (+ `called "id"`)
  - `text "Press Check to begin." called "result"`
  - `button "Check" called "check button"`
  - `input called "latitude" with label "Latitude" and hint "For example 52.52"`
  - `text area called "body" with label "Note" and hint "Start writing..."`
  - `list called "notes" showing saved notes`
- Every element can carry `called "id"`; ids must be unique per page
  (`The id "x" is used twice on this page.`) and `style` targets must exist
  (`The style target "..." is not on any page.`).
- Optional modifiers seen in parser: `level N`, `required`, `submits`, `loops`/`loop`,
  `showing expr`, `to …`, `with … and …`, `radio choice`, `drop …`.

**Style blocks**

```engcode
style everything:
    font is "Helvetica"
    background is #f8fafc
end

style "add button":
    background is blue
    text color is white
    rounded corners of 8
    padding is 12
    when mouse is over:
        background is dark blue
    end
end

style section on small screens:
    padding is 12
end

style navigation bar:
    animation is slide down over 0.4 seconds
end
```

- Targets: `everything`, a `called` id, a group word (`headings`, `cards`, `images`,
  `navigation bar`, `links`, `buttons`), or `<target> on small screens|big screens|…`
  (media queries).
- Inside a style block, statements are `property is value` or `property of value`
  (`style_stmt = property ("is" | "of") style_value`). Hex `#rrggbb`/`#rgb`, named colors
  (`blue`, `dark blue`, `white`), `rgb(...)`, and style keywords (`full`, `soft`, …) are
  legal **only** here.
- `when mouse is over:` … `end` inside a style block = CSS `:hover` rules.

**Themes**

```engcode
theme "Day":
    ...
end

theme "Night" in dark mode:
    ...
end
```

**Events and timers**

```engcode
when the page opens:
when "save button" is clicked:
every frame:
```

Exact `when` forms (parser `parseWhen`):

| Form | Event |
|---|---|
| `when the page opens:` | page-open |
| `when page "Home" opens:` | page-open for a named page |
| `when "id" is clicked:` | click |
| `when "id" is hovered:` | hover |
| `when "id" is submitted:` | form submit |
| `when "id" changes:` | input change |
| `when the user types in "id":` | typing |
| `when the user presses key "Enter":` | key press |
| `when the mouse enters "id":` / `when the mouse leaves "id":` | mouse enter/leave |
| `when the window is resized:` | resize |

Errors are exact: `Write "when the page opens:".`, `I expected "clicked", "hovered", or "submitted".`,
`I expected "page", "user", "mouse", or "window" after "the".`

- `every frame:` — ~60 fps tick (canvas games). Other timers: `every N seconds:`.
  Inside a timer, `stop the loop` stops the timer, `skip to the next one` skips a tick.

**In-app UI statements**

```engcode
change text of "empty hint" to "No notes match your search."
change value of "title" to note title
set search text to value of "search"
clear "note"
show "notes"
hide "empty hint"
go to page "Play"
open popup "details"
close popup "details"
clear canvas "board" to #111827
draw rectangle on "board" at x 20 and y paddle with width 12 and height 80 in white
draw circle on "board" at x ball x and y ball y with size 12 in white
draw text "Hits: " plus hits on "board" at x 640 and y 20 in white
```

- `change ui-property of "id" to expr`, `value of "id"` (read an input/list selection),
  `show`/`hide`/`clear "id"`, `go to page expr`, `open/close popup string`.
- `say` inside an app shows a toast; program-level `say` in scripts prints to stdout.

---

## 3. Operator list

Precedence from `docs/design.md` §3.5, loosest → tightest:

| # | Operators | Assoc / notes |
|---|---|---|
| 1 | `or` | left |
| 2 | `and` | left; in an argument list `and` separates arguments — inside parentheses it is logical `and` |
| 3 | `not` (prefix) | binds looser than comparisons, tighter than `and`: `not x is empty` = `not (x is empty)` |
| 4 | `is`, `is not`, `is greater than`, `is less than`, `is at least`, `is at most`, `is between A and B`, `contains`, `starts with`, `ends with` | **non-chaining** — `a is b is c` errors with `cannot be chained` and an `and` suggestion; `is between` consumes its own `and` |
| 5 | `plus`, `minus` (infix) | `plus` concatenates when either side is text; otherwise numbers |
| 6 | `times`, `divided by`, `remainder` (infix) | numbers only; `divided by` is one two-word operator; `You can't divide by zero.` |
| 7 | `minus` (prefix/unary) | e.g. `change paddle to paddle minus 6` parses `minus 6` as unary |
| 8 | `'s` (possessive), calls (`call f with a`, `name args`), builtin phrases (`length of x`, `uppercase of x`, …) | left |
| 9 | literals, names, `( … )` | — |

Notes:

- Comparisons include the bare forms `x is empty`, `x is not empty`, `list contains value`.
- `and`/`or` short-circuit; operands must be yes/no (checker error for non-booleans).
- Parentheses override precedence; a missing `)` reports `I never saw a ")" to match this "(".`
- No symbolic operators: `+`, `-` (as infix), `=`, `==`, `%`, `&&` are not the language.
  The lexer rejects `+` (`I don't know what to do with "+". EngCode spells its operators in words.`)
  and `=` (`I found "=", which EngCode does not use.`). The only `#` use is hex color,
  and only in style/draw contexts.

Real expression lines:

```engcode
say "Hello, " plus name plus "! Welcome to EngCode."
if guess is less than secret:
otherwise if (player is "rock" and computer is "scissors") or (player is "paper" and computer is "rock") or (player is "scissors" and computer is "paper"):
set secret to random number from 1 to 100
change guesses to guesses plus 1
say "You got it in " plus guesses plus " guesses!"
say number from "42"
```

---

## 4. Standard library

Source: `docs/stdlib.md`. All phrases are used exactly as written.

### Math

```engcode
say round of 2.6
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
say random decimal
set secret to random number from 1 to 100
```

Constants `pi`, `e`; trig in radians; `random number from A to B` is inclusive;
`random item of list` picks a random element.

### Text

```engcode
say uppercase of "hello"
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
```

`position of find in text` is 1-based and returns `0` when absent.

### Lists and tables

```engcode
set nums to a list of 1, 2, 3
set xs to an empty list
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
```

```engcode
set row to a table with name "Sam", age 25
say row's name
say row's "full name"
set row's name to "Samuel"
change row's age to 26
remove "age" from row
say length of row
```

- Lists are 1-based; `item 0 of list` → `nothing`; missing table key → `nothing`.
- Multi-word table keys are quoted: `table's "key with spaces"`.
- `sort`/`reverse`/`shuffle` mutate in place (they are statements, not functions).

### Conversion and JSON

```engcode
say number from "42"
say text of 42
say JSON of a table with name "Sam", age 25
set person to data from JSON "{\"name\":\"Sam\",\"age\":25}"
```

Invalid numbers/JSON are catchable runtime errors.

### Time

```engcode
say "It is " plus format of now with "HH:mm"
say "Today is " plus today
wait 2 seconds
```

`now` returns a table (`year, month, day, hour, minute, second`); `today` → `2026-11-10`;
pattern letters `YYYY MM DD HH mm ss` (others copied literally).

### Files, device, web

```engcode
write "first line" to file "notes.txt"
append "second line" to file "notes.txt"
read file "notes.txt" and save it as notes
list files in "." and save it as names
delete file "notes.txt"
save tasks to the device as "tasks"
load "tasks" from the device and save it as saved tasks
delete "tasks" from the device
get data from address and save it as weather
send data payload to "https://example.com/api"
```

Files are confined to the project folder — escaping it is a catchable error.
Web access needs `--allow-network` on the CLI.

### UI, drawing, sorting, errors (app-only)

```engcode
value of "name"
key "w" is pressed
change text of "status" to "Saved"
show "details"
hide "details"
clear "search"
go to page "About"
open popup "confirm"
close popup "confirm"
play sound "ding.mp3"
```

```engcode
clear canvas "board" to #111827
draw rectangle on "board" at x 10 and y 10 with width 20 and height 20 in white
draw circle on "board" at x 50 and y 50 with size 8 in white
draw line on "board" from x 0 and y 0 to x 100 and y 100 in white
draw text "Score" on "board" at x 12 and y 24 in white
draw image "ball.png" on "board" at x 50 and y 50 with size 24
```

```engcode
try:
    say 10 divided by 0
if it fails:
    say "Caught: " plus the error
end
```

Every runtime failure is catchable; syntax/checker errors are found by `engcode check`
before running and cannot be caught.

---

## 5. CLI reference

Source: `src/cli.ts` (help text) and `docs/cli.md`.

### Commands

```
engcode run <file>          run a script or app (default for a file argument)
engcode check <file|dir>    parse + type-check without running
engcode repl                interactive REPL
engcode serve <file>        serve an app for development (default port 3000, +10 retries)
engcode app <file>          build an app
engcode build web           build for the web
engcode build windows|mac|linux   desktop builds
engcode new <dir>           scaffold a project
engcode format <file>       rewrite in canonical formatting (alias: fmt)
engcode lint <file>         style warnings only
engcode learn               interactive lessons
engcode playground          start the playground (default port 4000)
engcode help                show help
engcode version             show version (also --version / -v, --help / -h)
```

### Flags

```
--allow-network   permit get/send data
--explain         trace execution (Step N · line L format)
--step            step-by-step execution in the REPL
--json            machine-readable output
--strict          treat warnings as failures
--lint            include lint warnings in check
--check           check only
--stdout          print build output to stdout
--type            print the detected project type
--template        choose a template for `new`
--run             run after build
--file            entry file
--done            print completion marker
--reset           reset stored state
--port            override port
--open            open the browser after serve
--out             output directory
--minify          minify build output
```

### Exit codes and output

- `0` success, `1` errors found, `2` bad usage / internal failure.
- Clean check: `No problems found in <file>.`
- With warnings: `No errors in <file>. N warnings.`
- `engcode new` creates `main.eng`, `engcode.json` (`{"name": …, "type": …, "entry": …}`),
  `.gitignore`, and a README.

### REPL

- Commands: `:help`, `:clear`, `:load <file>`, `:quit` (also `q`, `exit`).
- `--step` stepping keys: `Enter` step, `v` show variables, `q` quit.

### `--explain` format

```
Step 1 · line 3
→ say "Hello!"
...
… more steps follow. The explanation stops after 200 steps.
```

(`Step N · line L`, then `→ …` for the executed line; hard cap of 200 steps.)

---

## 6. VS Code extension

Source: `editor/vscode/` (installed as `engcode-1.0.0.vsix`).

- Language id: `engcode`; file extensions: `.eng`; grammar scope: `source.engcode`;
  configured via TextMate grammar `syntaxes/*.tmLanguage.json`.
- Icon theme entry for `.eng` files ships with the extension.
- Commands (package.json `contributes.commands`):
  - **EngCode: Run File** — runs the active file with the configured executable.
  - **EngCode: Serve App** — serves the app.
  - **EngCode: Explain File** — runs with `--explain`.
  - **EngCode: Check File** — runs `check`.
- Settings:
  - `engcode.executable` — path to the `engcode` binary.
  - `engcode.checkOnType` — run checks while typing (boolean).
- Debugger: `type: engcode`, configuration attributes `program` (required) and
  `stopOnEntry` (boolean).
- `language-configuration.json`:
  - line comment token: `note:` (so Toggle Comment inserts `note:`),
  - `increaseIndentPattern`: a line ending in `:` (block open),
  - `decreaseIndentPattern`: a line starting with `end`,
  - custom `wordPattern` so multi-word identifiers double-click together.
- Snippets: `snippets/engcode.json` contributes roughly 90 snippets covering `say`,
  `ask … and save it as`, `set`, `change … to`, `if/otherwise/end`, `repeat`, `for each`,
  `count from`, `while`, `define … with`, `give back`, `try/if it fails`, `app/page`,
  `style`, `when … is clicked`, `every frame`, `draw …`, list/table phrases, etc.

---

## 7. Types and complete keyword list

### 7.1 Types

| Type | English word | Literals |
|---|---|---|
| Number | `number` | `0`, `25`, `9.99`, `-4` (IEEE-754 doubles) |
| Text | `text` | `"Sam"`, `""` |
| True/false | `yes` / `no` | `yes`, `no` |
| Nothing | `nothing` | `nothing` |
| List | `list` | `a list of 1, 2, 3` or `an empty list` |
| Table | `table` | `a table with name "Sam", age 25` or `an empty table` |
| Function | `function` | `define … with …:` blocks, callable values |
| Kind/object | `a kind of thing` | `set rex to a new Dog with name "Rex", age 3` |

### 7.2 Hard delimiters (may never appear inside a name)

```
to  from  with  as  in  and  or  called  showing  level  default  that  ,  :
```

### 7.3 Full keyword list (design.md §3.6, verbatim)

Keywords are case-insensitive. Most are **contextual** — a keyword only in the construct
where the grammar uses it — which is why `set is happy to yes` and
`set nothing here to nothing` are valid.

**Statements and blocks**

```
note  set  to  change  add  remove  from  say  ask  for  save  as  it  if  otherwise  end
repeat  times  each  in  count  while  stop  the  loop  skip  next  one  define  with
give  gives  back  that  does  try  fails  use  read  write  file  files  append  delete
get  send  data  play  sound  show  hide  clear  go  page  open  close  keep  track  sort
reverse  shuffle  descending  wait  seconds  draw  canvas
```

**Operators and comparison words**

```
plus  minus  times  divided  by  remainder  and  or  not  is  greater  than  less  at
least  most  between  contains  starts  ends  empty  of
```

**Literal and structural words**

```
yes  no  nothing  a  an  the  new  kind  thing  has  can  it  its  called  showing
level  default  on
```

**Values and conversion**

```
text  number  list  table  function  value  item  last  length  JSON  error
```

**Standard-library words**

```
uppercase  lowercase  trim  split  join  replace  position  round  floor  ceiling  square
root  absolute  minimum  maximum  power  pi  sine  cosine  tangent  random  shuffle  now
today  format  year  month  day  hour  minute  second  wait  exists  read  write  append
delete  get  send  device  load  save  sound  play  data  from  to  by  with  in  files
```

**UI block words**

```
app  page  section  row  column  grid  heading  paragraph  text  button  input  area
text area  checkbox  dropdown  radio  choice  slider  switch  image  video  audio  list
table  card  menu  navigation  bar  footer  form  link  icon  divider  popup  tabs  tab
canvas
```

**UI attributes and actions**

```
called  label  hint  choices  showing  level  description  poster  submits  required
loops  starting  minimum  maximum  columns  width  height  gap  min  max  go  open  close
show  hide  clear  change  text  value  background  text color  font  size  padding
margin  rounded  corners  border  shadow  alignment  layout  direction  wrap  opacity
transition  animation  animate  over  pressed  focused  dark  mode  theme  light  full
half  auto  percent  small  big  screens  phones  tablets
```

**Events**

```
when  clicked  changes  changed  typed  hovered  opens  resized  every  seconds  frame
the  page  window  user  types  in  presses  key  mouse  enters  leaves  submitted
checked
```

**Not keywords:** color names (`blue`, `light gray`), font names, file paths, table keys,
and property names after `'s` are values, parsed in their own contexts.

---

## 8. Error message style

### 8.1 Rendered format (`src/diagnostics.ts`)

```
Oops — line 12 of guess.eng
  12 | set guesses to guesses pluss 1
     |                   ^^^^^
I don't know the name "pluss".
Try this:
  Did you mean "plus"?
```

Rules:

- Headline: `Oops — line <N> of <file>` (or just `Oops` when there is no source span).
- Gutter: two spaces, line number, ` | `, source line with tabs expanded to 4 spaces.
- Caret line: `^` repeated `max(1, spanLength)` times, positioned under the span.
- Then the message, then `Try this:` with the hint indented two spaces.
- No span → `Oops`, blank line, message only.

### 8.2 Voice and conventions

- Second person, plain English, one problem per diagnostic, always saying what to do next.
- Quotes `"…"` around the offending token or the exact phrase to write.
- A `Did you mean "x"?` suggestion for misspelled names.
- Errors stop compilation/execution; warnings (`--strict` upgrades them) do not.

### 8.3 Representative exact messages

Lexical:

```
EngCode does not use semicolons.
EngCode does not use curly braces.
I found "=", which EngCode does not use.
I don't know what to do with "+". EngCode spells its operators in words.
A string never runs past the end of its line.
That does not look like a color.
I don't know how to read "#".
```

Parser / structure:

```
I expected ":" at the end of the "otherwise if" line.
I expected ":" after "otherwise".
I expected "if it fails:" after the try block.
I expected ":" after "try".
I expected "end" to close this "try" block.
I expected "to" after the name, as in "change age to 26".
I expected "and save it as name" after the question.
I expected "for each name in list".
I expected "each" here.
I never saw a ")" to match this "(".
There is an extra "end" here.
"otherwise" does not have an "if" above it.        (hint: Put it inside an if block.)
"if it fails" does not have a "try" above it.
Colors only make sense in a style block.
```

Checker / names:

```
I don't know the name "naem".                       (hint: Did you mean "name"?)
I don't know the name "age". Use "set" to create it first.
A condition must be yes or no, but this is a number.
    hint: Write a comparison, as in "if age is greater than 17:". EngCode does not treat
    other values as true or false.
"greet" takes 1 argument, but 2 were given.
"greet" needs 1 more argument.
The id "x" is used twice on this page.
The style target "..." is not on any page.
"give back" needs to be inside a function.
"the error" only works inside "if it fails".
A comparison cannot be chained; use "and".
```

Runtime (catchable via `try` / `if it fails`):

```
You can't divide by zero.
I can only change a number, but "highscore" has no value yet.
"repeat" needs a number of times.
"for ... in" needs a list to go through.
"wait ... seconds" needs a number, 0 or more.
```

Lint warnings (never fatal unless `--strict`):

```
This file uses tabs to indent.
This line is longer than 120 characters.
This note looks like a TODO.
Name ends with an operator word.
Name shadows a built-in word.
This value is set but never used.
This block is empty.
This program can use project files.
This program can use the network.
This program can use device storage.
```

(Exact wording of individual lint rules varies; the above are the rule categories emitted
by `src/lint.ts` — see section 10 for any string not verified character-for-character.)
