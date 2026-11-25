import type { DocPage } from './types';

/** Building-apps pages. */
export const buildingApps: DocPage[] = [
  {
    slug: 'styling',
    title: 'Styling',
    blocks: [
      {
        t: 'p',
        text: 'Style blocks decide what your app looks like: colors, spacing, fonts, corners, hover states and responsive tweaks. There is no CSS to write — every rule is an English sentence.',
      },
      { t: 'h2', text: 'The style block' },
      {
        t: 'code',
        lang: 'engcode',
        code: `style everything:
    font is "Helvetica"
    background is #f8fafc
    text color is #1e1b4b
    padding is 32
end`,
      },
      { t: 'h2', text: 'Targets' },
      {
        t: 'ul',
        items: [
          '`style everything:` — the whole app.',
          '`style "add button":` — one element, by its `called "…"` id.',
          '`style buttons:` — a group word: `headings`, `cards`, `images`, `navigation bar`, `links`, `buttons`.',
          'A style target that exists on no page is caught at check time: *The style target "…" is not on any page.*',
        ],
      },
      { t: 'h2', text: 'Properties' },
      {
        t: 'code',
        lang: 'engcode',
        code: `style "add button":
    background is blue
    text color is white
    rounded corners of 8
    padding is 12
    border is 1
    shadow is soft
    opacity is full
end`,
      },
      {
        t: 'ul',
        items: [
          'Every rule is `property is value` or `property of value`.',
          'Colors: hex (`#0f766e`, 3 or 6 digits), named colors (`blue`, `dark blue`, `white`), and `rgb(...)`. **Colors are only legal inside style blocks and draw commands** — anywhere else is an error: *Colors only make sense in a style block.*',
          'Size keywords: `full`, `half`, `auto`, `percent`, plus pixel numbers.',
        ],
      },
      { t: 'h2', text: 'Hover states' },
      {
        t: 'code',
        lang: 'engcode',
        code: `style "add button":
    background is blue
    when mouse is over:
        background is dark blue
    end
end`,
      },
      { t: 'h2', text: 'Responsive rules' },
      {
        t: 'code',
        lang: 'engcode',
        code: `style section on small screens:
    padding is 12
end

style navigation bar on big screens:
    alignment is row
end`,
      },
      {
        t: 'p',
        text: 'Add `on small screens`, `on big screens`, `on phones` or `on tablets` to a target to scope the rules to a screen size — compiled to media queries.',
      },
      { t: 'h2', text: 'Animation' },
      {
        t: 'code',
        lang: 'engcode',
        code: `style navigation bar:
    animation is slide down over 0.4 seconds
end`,
      },
      { t: 'h2', text: 'Light and dark themes' },
      {
        t: 'code',
        lang: 'engcode',
        code: `theme "Day":
    background is white
    text color is black
end

theme "Night" in dark mode:
    background is #111827
    text color is white
end`,
      },
      {
        t: 'p',
        text: 'Themes define whole color schemes; `theme "Night" in dark mode` applies automatically when the user prefers dark. Add `themeToggle on` to give generated apps a light/dark switch.',
      },
    ],
  },
  {
    slug: 'blocks',
    title: 'Blocks',
    blocks: [
      {
        t: 'p',
        text: 'Inside a page, **blocks** arrange elements on the screen — the layout equivalent of HTML\'s structural tags, written as plain lines.',
      },
      { t: 'h2', text: 'Layout wrappers' },
      {
        t: 'code',
        lang: 'engcode',
        code: `app "Layout demo":
    page "Home":
        column:
            heading "Weather Now"
            row:
                text "52°" called "temperature"
                text "Partly cloudy" called "summary"
            end
            section:
                text "The forecast for the rest of the week."
            end
            divider
        end
    end
end`,
      },
      {
        t: 'table',
        head: ['Block', 'Arranges its children'],
        rows: [
          ['row:', 'Left to right'],
          ['column:', 'Top to bottom'],
          ['section:', 'A themed region with padding'],
          ['card:', 'A bordered, elevated panel'],
          ['form:', 'Collects inputs and reports `is submitted`'],
          ['navigation bar:', 'App-level links across pages'],
          ['divider', 'A separator line (no children)'],
        ],
      },
      { t: 'h2', text: 'The elements you place inside' },
      {
        t: 'code',
        lang: 'engcode',
        code: `page "Home":
    heading "My Notes"
    paragraph "Everything you save shows up below."
    input called "latitude" with label "Latitude" and hint "For example 52.52"
    text area called "note" with label "Note" and hint "Write something..."
    checkbox called "pin" with label "Pin to top"
    dropdown called "tag" with choices "all", "work", "home"
    slider called "opacity" starting 50 minimum 0 maximum 100
    image "cover.png" called "cover"
    list called "notes" showing saved notes
    button "Check" called "check button"
end`,
      },
      {
        t: 'ul',
        items: [
          'Every element can take `called "id"` — the handle used by events, styles and `change text of …`.',
          'Ids must be unique per page: *The id "x" is used twice on this page.*',
          'Optional modifiers seen on elements: `level N` (heading levels), `required`, `submits`, `showing expr` (live lists), `poster`, `starting`, `minimum`, `maximum`, `width`, `height`.',
        ],
      },
      { t: 'h2', text: 'Nesting rules' },
      {
        t: 'ul',
        items: [
          'Blocks nest: a `row:` inside a `column:` inside a `page:` — each opened with `:` and closed with its own `end`.',
          'An extra `end` is caught: *There is an extra "end" here.* A missing one is caught too: *I expected "end" to close this "…" block.*',
          'Indentation is cosmetic — but `engcode format` standardizes it to 4 spaces.',
        ],
      },
      { t: 'h2', text: 'Popups and pages' },
      {
        t: 'code',
        lang: 'engcode',
        code: `open popup "details"
close popup "details"
go to page "Play"`,
      },
      {
        t: 'callout',
        kind: 'tip',
        text: 'Elements are static definitions; the values you change at runtime live behind events. See [Styling](/docs/styling) for the look and [Apps](/docs/apps) for the behavior side.',
      },
    ],
  },
  {
    slug: 'websites',
    title: 'Websites',
    blocks: [
      {
        t: 'p',
        text: 'An EngCode app with one or more pages **is** a website. `engcode build web` compiles it to static HTML, CSS and JavaScript you can host anywhere — no server needed.',
      },
      { t: 'h2', text: 'A complete page' },
      {
        t: 'code',
        lang: 'engcode',
        code: `app "Launch page":
    page "Home":
        heading "Adopt a reading habit"
        paragraph "Five minutes a day, tracked."
        row:
            button "Start" called "start button"
            link "Learn more" to "https://example.com"
        end
    end

    page "About":
        heading "About"
        text "Built with EngCode."
    end
end

style everything:
    font is modern
    background is #faf9f6
    text color is #141312
    padding is 32
end

when the page opens:
    say "Welcome!"
end`,
      },
      { t: 'h2', text: 'Pages are screens' },
      {
        t: 'ul',
        items: [
          'Each `page "Name":` block compiles to a hash route: `#/home`, `#/about`.',
          'Move the user with `go to page "About"`.',
          'Run setup code when a page appears: `when the page opens:` or `when page "Home" opens:`.',
        ],
      },
      { t: 'h2', text: 'Build and deploy' },
      {
        t: 'code',
        lang: 'bash',
        code: `engcode build web
# dist/ — upload it anywhere static files are served

engcode build web --minify   # smaller output
engcode build web --out site # custom folder`,
      },
      {
        t: 'p',
        text: 'The output is plain static files. Drop the folder on Netlify, GitHub Pages, Vercel or any web server and the site is live.',
      },
      { t: 'h2', text: 'Developing locally' },
      {
        t: 'code',
        lang: 'bash',
        code: `engcode serve main.eng        # http://localhost:3000
engcode serve main.eng --open # also opens the browser`,
      },
      {
        t: 'callout',
        kind: 'info',
        text: '`engcode serve` rebuilds as you save — keep it running in a terminal while you edit.',
      },
      { t: 'h2', text: 'Apps that feel like websites' },
      {
        t: 'p',
        text: 'Everything in the app layer is available: forms with `is submitted`, lists that track a variable with `showing saved notes`, popups with `open popup "…"` and [responsive styles](/docs/styling#responsive-rules). A "website" and a "desktop app" are the same source with a different build command.',
      },
    ],
  },
  {
    slug: 'apps',
    title: 'Apps',
    blocks: [
      {
        t: 'p',
        text: 'The same app source that builds a website builds a **desktop app** for Windows and macOS. `engcode build` wraps the compiled web output into an installable program.',
      },
      { t: 'h2', text: 'The three layers' },
      {
        t: 'table',
        head: ['Layer', 'Written with', 'Answers'],
        rows: [
          ['Structure', 'app, page, blocks and elements', 'What is on the screen'],
          ['Style', 'style and theme blocks', 'What it looks like'],
          ['Behavior', 'when and every blocks', 'What it does'],
        ],
      },
      { t: 'h2', text: 'A complete example' },
      {
        t: 'code',
        lang: 'engcode',
        caption: 'notes/main.eng — from the examples folder',
        code: `note: examples/notes/main.eng
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
end`,
      },
      { t: 'h2', text: 'Events' },
      {
        t: 'code',
        lang: 'engcode',
        code: `when the page opens:
when page "Home" opens:
when "id" is clicked:
when "id" is hovered:
when "id" is submitted:
when "id" changes:
when the user types in "id":
when the user presses key "Enter":
when the mouse enters "id":
when the mouse leaves "id":
when the window is resized:`,
      },
      { t: 'h2', text: 'Timers and drawing' },
      {
        t: 'code',
        lang: 'engcode',
        code: `every frame:
    clear canvas "board" to #111827
    draw circle on "board" at x ball x and y ball y with size 12 in white
end

every 1 seconds:
    change text of "clock" to format of now with "HH:mm:ss"
end`,
      },
      {
        t: 'ul',
        items: [
          '`every frame:` runs about 60 times a second — for canvas games.',
          '`every N seconds:` runs on a slower clock.',
          'Inside timers, `stop the loop` stops the timer and `skip to the next one` skips a tick.',
          'Draw commands: `draw rectangle`, `draw circle`, `draw line`, `draw text`, `draw image` — each takes a canvas id, coordinates, a size and a color.',
        ],
      },
      { t: 'h2', text: 'In-app statements' },
      {
        t: 'code',
        lang: 'engcode',
        code: `change text of "status" to "Saved!"
change value of "title" to note title
set search text to value of "search"
show "notes"
hide "empty hint"
clear "note"
go to page "Play"
open popup "details"
close popup "details"
play sound "ding.mp3"`,
      },
      { t: 'h2', text: 'Build it' },
      {
        t: 'code',
        lang: 'bash',
        code: `engcode app main.eng           # build for this machine
engcode build windows          # Windows desktop build
engcode build mac              # macOS desktop build
engcode serve main.eng         # develop live on localhost:3000`,
      },
      {
        t: 'callout',
        kind: 'tip',
        text: 'Starting a desktop project from scratch? `engcode new my-app --type desktop` scaffolds the whole thing with its own package.json — `npm install` and it runs.',
      },
    ],
  },
];
