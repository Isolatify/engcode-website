import type { DocPage } from './types';

/** Language-guide pages. */
export const languageGuide: DocPage[] = [
  {
    slug: 'variables',
    title: 'Variables',
    blocks: [
      {
        t: 'p',
        text: 'A variable is a name that holds a value. EngCode has exactly three ways to create or update one, and each is a full English sentence.',
      },
      { t: 'h2', text: 'set … to …' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set score to 0
set name to "Ada"
set greeting to "Hello, " plus name`,
      },
      {
        t: 'p',
        text: '`set` creates a new variable **or** reassigns an existing one. At the top level of a file, variables are global. Inside a block (a loop, an `if`, a function), `set` first assigns an existing variable of that name from an outer block; if none exists, it creates a fresh one local to that block.',
      },
      { t: 'h2', text: 'change … to …' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set guesses to 0
change guesses to guesses plus 1`,
      },
      {
        t: 'p',
        text: '`change … to …` only updates a variable that already exists. Pointing it at an unknown name is a friendly runtime error: **I can only change a number, but "highscore" has no value yet.** Use it when you want the computer to catch typos.',
      },
      { t: 'h2', text: 'keep track of … as …' },
      {
        t: 'code',
        lang: 'engcode',
        code: `keep track of saved notes as an empty list
add "milk" to saved notes`,
      },
      {
        t: 'p',
        text: '`keep track of … as …` always declares the variable in the current block, even if a variable with the same name exists outside it. It reads naturally for state that grows over the life of a program.',
      },
      { t: 'h2', text: 'Names' },
      {
        t: 'ul',
        items: [
          'Names are **case-sensitive**: `score` and `Score` are different.',
          'Names can be **several words long**: `high score`, `saved notes`, `player one`.',
          'A few reserved words (`to`, `from`, `with`, `as`, `in`, `and`, `or`, `called`, `showing`, `level`, `default`, `that`, `,`, `:`) can never be part of a name.',
          'Misspelled names get a suggestion: *I don\'t know the name "naem". Try this: Did you mean "name"?*',
        ],
      },
      {
        t: 'callout',
        kind: 'tip',
        text: 'The formatter (`engcode format`) standardizes indentation to 4 spaces, but the language itself only cares that a block starts with `:` and ends with `end`.',
      },
      { t: 'h2', text: 'Seeing a value' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set pi to 3.14159
say pi`,
      },
      {
        t: 'p',
        text: 'In a script, `say` prints the value and moves to the next line. Inside an app, `say` shows a toast notification instead.',
      },
    ],
  },
  {
    slug: 'data-types',
    title: 'Data Types',
    blocks: [
      {
        t: 'p',
        text: 'EngCode has seven kinds of values, each written the way you would say it out loud.',
      },
      {
        t: 'table',
        head: ['Type', 'English word', 'Written like'],
        rows: [
          ['Number', 'number', '0 · 25 · 9.99 · -4'],
          ['Text', 'text', '"Sam" · ""'],
          ['True/false', 'yes / no', 'yes · no'],
          ['Nothing', 'nothing', 'nothing'],
          ['List', 'list', 'a list of 1, 2, 3 · an empty list'],
          ['Table', 'table', 'a table with name "Sam", age 25'],
          ['Function', 'function', 'define … with …: blocks'],
        ],
      },
      { t: 'h2', text: 'Numbers' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set n to 42
set x to 3.5
set big to 9007199254740991`,
      },
      {
        t: 'p',
        text: 'Numbers are standard doubles. Arithmetic is spelled in words — see [the operators list](#operators) below for the full precedence table.',
      },
      { t: 'h2', text: 'Text' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say "escaped \\"quotes\\" and \\n newlines \\t tabs"`,
      },
      {
        t: 'ul',
        items: [
          'Strings are double-quoted and never span lines — a dangling quote reports *A string never runs past the end of its line.*',
          'Escapes: `\\"`, `\\\\`, `\\n`, `\\t`.',
          'Join text with `plus`; convert with `text of 42` and `number from "42"`.',
        ],
      },
      { t: 'h2', text: 'yes / no / nothing' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set game over to no
set best friend to nothing`,
      },
      {
        t: 'p',
        text: 'Conditions must be yes or no — a number is not "truthy" in EngCode. Asking `if 1:` is a checker error, not a subtle bug: *A condition must be yes or no, but this is a number.* `nothing` means "no value here", and reading a missing table key or `item 0` of a list gives `nothing` instead of an error.',
      },
      { t: 'h2', text: 'Lists' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set nums to a list of 1, 2, 3
set empty to an empty list
say item 2 of nums
add 4 to nums`,
      },
      {
        t: 'p',
        text: 'Lists are 1-based. See [Arrays](/docs/arrays) for the full set of list commands.',
      },
      { t: 'h2', text: 'Tables' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set row to a table with name "Sam", age 25
say row's name
change row's age to 26`,
      },
      {
        t: 'p',
        text: 'Tables are records with named fields, written `a table with field value, field value`. Read and write fields with the possessive: `row\'s name`. Keys with spaces in them are quoted: `row\'s "full name"`. Missing keys read as `nothing`.',
      },
      { t: 'h2', text: 'Operators' },
      {
        t: 'table',
        head: ['Words', 'Meaning'],
        rows: [
          ['or · and · not', 'Logic — short-circuiting, operands must be yes/no'],
          ['is · is not', 'Equality — `is greater than`, `is less than`, `is at least`, `is at most`, `is between A and B` for order'],
          ['contains · starts with · ends with', 'Text and list checks — also the bare forms `is empty` / `is not empty`'],
          ['plus · minus', 'Add / subtract — `plus` joins text when either side is text'],
          ['times · divided by · remainder', 'Multiply / divide / mod — numbers only'],
          ["'s", 'Possessive field access — binds tightest'],
        ],
      },
      {
        t: 'callout',
        kind: 'info',
        text: 'There are no symbolic operators. `+`, `=`, `==`, `%`, `&&` are not the language — the lexer explains itself: *I found "=", which EngCode does not use.*',
      },
      { t: 'h2', text: 'Kinds (objects)' },
      {
        t: 'code',
        lang: 'engcode',
        code: `define a kind of thing called Dog:
    it has name as "Rex"
    it has age as 3
    it can bark:
        say "Woof!"
    end
end

set rex to a new Dog with name "Rex", age 3
rex bark
say rex's age`,
      },
      {
        t: 'p',
        text: 'A **kind** bundles fields (with defaults) and behaviors. Construct one with `a new Kind with field value, field value`, call a behavior as a bare statement (`rex bark`), or pass arguments with `call rex\'s method with 10`.',
      },
    ],
  },
  {
    slug: 'conditions',
    title: 'Conditions',
    blocks: [
      {
        t: 'p',
        text: 'Decisions in EngCode use **if / otherwise if / otherwise / end** — never braces, never `else`.',
      },
      { t: 'h2', text: 'if' },
      {
        t: 'code',
        lang: 'engcode',
        code: `if score is greater than 10:
    say "high"
end`,
      },
      {
        t: 'p',
        text: 'The condition line ends in `:` and the block ends with `end`. Comparisons are words: `is`, `is not`, `is greater than`, `is less than`, `is at least`, `is at most`, `is between A and B`, `contains`, `starts with`, `ends with`, plus the bare forms `is empty` and `is not empty`.',
      },
      { t: 'h2', text: 'otherwise if and otherwise' },
      {
        t: 'code',
        lang: 'engcode',
        code: `if score is greater than 10:
    say "high"
otherwise if score is 5:
    say "five"
otherwise:
    say "other"
end`,
      },
      {
        t: 'p',
        text: '`otherwise if cond:` and `otherwise:` chain onto the nearest open `if`. Writing `otherwise` without an `if` above it is a parse error with a hint: *Put it inside an if block.*',
      },
      { t: 'h2', text: 'Combining conditions' },
      {
        t: 'code',
        lang: 'engcode',
        code: `if guess is at least 1 and guess is at most 100:
    say "In range"
end

if (player is "rock" and computer is "scissors") or (player is "paper" and computer is "rock"):
    say "You win!"
end`,
      },
      {
        t: 'ul',
        items: [
          '`and` and `or` short-circuit, and both operands must be yes or no.',
          '`not` binds tighter than `and` but looser than comparisons: `not x is empty` means `not (x is empty)`.',
          'Comparisons do not chain — `a is b is c` is rejected with *A comparison cannot be chained; use "and".*',
          'Parentheses group sub-expressions and override precedence.',
        ],
      },
      { t: 'h2', text: 'try / if it fails' },
      {
        t: 'code',
        lang: 'engcode',
        code: `try:
    set x to 1 divided by 0
if it fails:
    say "Caught: " plus the error
end`,
      },
      {
        t: 'p',
        text: '**Every runtime failure is catchable** — divide by zero, a missing file, bad JSON, an invalid number. Inside the handler, `the error` holds the message. Syntax and checker errors are found by `engcode check` before running and cannot be caught.',
      },
      {
        t: 'callout',
        kind: 'warn',
        text: 'Conditions must be yes/no. `if 1:` does not run the block — it is a checker error: *A condition must be yes or no, but this is a number.* Write the comparison out instead.',
      },
    ],
  },
  {
    slug: 'loops',
    title: 'Loops',
    blocks: [
      { t: 'h2', text: 'repeat … times' },
      {
        t: 'code',
        lang: 'engcode',
        code: `repeat 3 times:
    say "hi"
end`,
      },
      {
        t: 'p',
        text: 'Runs the block a fixed number of times. The count must be a number: *"repeat" needs a number of times.*',
      },
      { t: 'h2', text: 'count from … to … as …' },
      {
        t: 'code',
        lang: 'engcode',
        code: `count from 1 to 5 as i:
    say i
end`,
      },
      {
        t: 'p',
        text: 'Inclusive at both ends. The `as name` part is optional — without it, the loop variable is called **counter**.',
      },
      { t: 'h2', text: 'for each … in …' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set people to a list of a table with name "Sam", age 25 and a table with name "Ada", age 36

for each person in people:
    say person's name plus " is " plus person's age
end`,
      },
      {
        t: 'p',
        text: 'Walks a list (or table) one item at a time. The word `each` is required, and looping over a non-list is caught: *"for ... in" needs a list to go through.*',
      },
      { t: 'h2', text: 'while' },
      {
        t: 'code',
        lang: 'engcode',
        code: `while found is no:
    change guesses to guesses plus 1
    if guesses is greater than 10:
        stop the loop
    end
end`,
      },
      {
        t: 'p',
        text: 'Repeats while the condition is yes. Remember that conditions must be yes/no — `while guesses:` is a checker error, `while guesses is greater than 0:` is not.',
      },
      { t: 'h2', text: 'stop the loop and skip to the next one' },
      {
        t: 'code',
        lang: 'engcode',
        code: `count from 1 to 10 as n:
    if n is 3:
        skip to the next one
    end
    if n is 5:
        stop the loop
    end
    say n
end

say 1
say 2
say 4`,
      },
      {
        t: 'ul',
        items: [
          '`stop the loop` exits the innermost loop — or stops an `every` timer if used inside one.',
          '`skip to the next one` jumps to the next iteration.',
          'The exact wording is required; these are not abbreviatable.',
        ],
      },
      { t: 'h2', text: 'Waiting' },
      {
        t: 'code',
        lang: 'engcode',
        code: `wait 2 seconds
say "Two seconds later"`,
      },
      {
        t: 'p',
        text: '`wait N seconds` pauses the program (N must be 0 or more). Inside event handlers it makes the handler asynchronous.',
      },
    ],
  },
  {
    slug: 'input-output',
    title: 'Input/Output',
    blocks: [
      { t: 'h2', text: 'say' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say "Hello, world!"
say "Hello, " plus name plus "! Welcome to EngCode."`,
      },
      {
        t: 'p',
        text: 'Prints a value followed by a newline. Any value works — numbers, lists and tables are printed in a readable form. Inside an app, `say` shows a toast notification instead of writing to stdout.',
      },
      { t: 'h2', text: 'ask … and save it as …' },
      {
        t: 'code',
        lang: 'engcode',
        code: `ask "What is your name?" and save it as name
ask for a number "Guess a number from 1 to 100" and save it as guess`,
      },
      {
        t: 'ul',
        items: [
          'The `and save it as name` clause is **required** — answers always land in a variable.',
          '`ask for a number` keeps asking until it gets a valid number.',
          'In the playground and the REPL, answers come from the input box or the interactive prompt; when a script is run with `engcode run`, prompts appear in the terminal.',
        ],
      },
      { t: 'h2', text: 'Reading and writing files' },
      {
        t: 'code',
        lang: 'engcode',
        code: `write "first line" to file "notes.txt"
append "second line" to file "notes.txt"
read file "notes.txt" and save it as contents
list files in "." and save it as names
delete file "notes.txt"`,
      },
      {
        t: 'p',
        text: 'Files are confined to the project folder — trying to escape it is a catchable error. Every fixed clause (`and save it as`, `to file`, `from`) is matched before expressions are read, so if a value needs the same words, wrap it in parentheses.',
      },
      { t: 'h2', text: 'The network' },
      {
        t: 'code',
        lang: 'engcode',
        code: `get data from address and save it as weather
send data payload to "https://example.com/api"`,
      },
      {
        t: 'callout',
        kind: 'info',
        text: 'Web access needs the flag: `engcode run main.eng --allow-network`. Without it, the program can still run — it just cannot talk to the internet.',
      },
      { t: 'h2', text: 'Device storage' },
      {
        t: 'code',
        lang: 'engcode',
        code: `save tasks to the device as "tasks"
load "tasks" from the device and save it as saved tasks
delete "tasks" from the device`,
      },
      {
        t: 'p',
        text: 'Persistent key–value storage on the machine — how the Notes example app remembers your list between runs. Values can be any EngCode value, including lists and tables.',
      },
      { t: 'h2', text: 'Sounds and waiting' },
      {
        t: 'code',
        lang: 'engcode',
        code: `play sound "jump"
wait 2 seconds`,
      },
    ],
  },
  {
    slug: 'arrays',
    title: 'Arrays',
    blocks: [
      {
        t: 'p',
        text: 'EngCode calls them lists. They are ordered, 1-based, and can hold any mix of values.',
      },
      { t: 'h2', text: 'Creating lists' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set nums to a list of 1, 2, 3
set fruits to a list of "pear", "apple", "fig"
set empty to an empty list`,
      },
      { t: 'h2', text: 'Reading and changing' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say item 1 of nums
say item 2 of nums
say last item of nums
add 4 to nums
remove 1 from nums`,
      },
      {
        t: 'ul',
        items: [
          '`item N of list` is 1-based; `item 0` gives `nothing` instead of an error.',
          '`add X to list` appends; `remove X from list` deletes the first match.',
          '`the length of list` gives the count.',
        ],
      },
      { t: 'h2', text: 'Sorting and shuffling' },
      {
        t: 'code',
        lang: 'engcode',
        code: `sort nums
sort nums descending
reverse nums
shuffle nums`,
      },
      {
        t: 'p',
        text: 'These are statements that change the list in place — not functions that return a new list.',
      },
      { t: 'h2', text: 'Walking a list' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set fruits to a list of "pear", "apple", "fig"

for each fruit in fruits:
    say fruit
end

sort fruits
say join fruits with ", "`,
      },
      { t: 'h2', text: 'Lists of tables' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set people to a list of a table with name "Sam", age 25 and a table with name "Ada", age 36

for each person in people:
    say person's name plus " is " plus person's age
end`,
      },
      { t: 'h2', text: 'Handy phrases' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say random item of nums
say the length of nums
say nums contains 2`,
      },
      {
        t: 'callout',
        kind: 'tip',
        text: 'Need keyed records instead of positions? That is a [table](/docs/data-types#tables) — `a table with name "Sam", age 25`.',
      },
    ],
  },
  {
    slug: 'functions',
    title: 'Functions',
    blocks: [
      { t: 'h2', text: 'Defining a function' },
      {
        t: 'code',
        lang: 'engcode',
        code: `define greet with who default "friend":
    give back "Hello, " plus who
end`,
      },
      {
        t: 'ul',
        items: [
          '`define name with param:` opens the block; `end` closes it.',
          'Zero-parameter functions are written `define setup:`.',
          '`default "friend"` gives a parameter a fallback value.',
        ],
      },
      { t: 'h2', text: 'Calling' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say call greet with "Ada"
say greet "Sam"`,
      },
      {
        t: 'p',
        text: 'The explicit form is `call greet with "Ada"`. Arity mistakes are caught before the program runs: *"greet" takes 1 argument, but 2 were given.* or *"greet" needs 1 more argument.*',
      },
      { t: 'h2', text: 'give back' },
      {
        t: 'code',
        lang: 'engcode',
        code: `define factorial with n:
    if n is at most 1:
        give back 1
    end
    give back n times (call factorial with n minus 1)
end

say factorial 6`,
      },
      {
        t: 'p',
        text: '`give back expr` returns a value and leaves the function. Using it outside a function is a checker error: *"give back" needs to be inside a function.*',
      },
      { t: 'h2', text: 'Parameters are local' },
      {
        t: 'code',
        lang: 'engcode',
        code: `set n to 10

define reset with n:
    give back n
end

say reset 0
say n`,
      },
      {
        t: 'p',
        text: 'A parameter named `n` shadows the global `n` only inside the function. Variables created with `set` inside a function are local too, unless the name already exists in an outer scope.',
      },
      { t: 'h2', text: 'Parentheses in arguments' },
      {
        t: 'code',
        lang: 'engcode',
        code: `say call factorial with (3 times 4)`,
      },
      {
        t: 'p',
        text: 'Inside an argument list, `and` separates arguments — so wrap a logical expression in parentheses when you mean it as one value: `call check with (a is 1 and b is 2)`.',
      },
      {
        t: 'callout',
        kind: 'tip',
        text: 'Want functions bundled to data? That is a [kind](/docs/data-types#kinds-objects) — fields with defaults plus behaviors you call with a bare statement like `rex bark`.',
      },
    ],
  },
];
