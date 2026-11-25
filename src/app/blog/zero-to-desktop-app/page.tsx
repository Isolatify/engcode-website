import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { ArticleShell, P, Step, CodeBlock, C } from '@/components/blog/ArticleShell';

export const metadata: Metadata = {
  title: 'Zero to desktop app in four steps',
  description:
    'A tutorial: install the EngCode CLI, scaffold a desktop project, read the generated .eng code, and run your first desktop app with engcode app.',
};

const FILES = [
  {
    file: 'my-window/main.eng',
    what: 'The window, its blocks and its behavior — the three layers in one readable file.',
  },
  {
    file: 'my-window/package.json',
    what: 'Written by engcode new --type desktop. Pins the runtime and adds a start script.',
  },
  {
    file: 'my-window/README.md',
    what: 'The two commands you need, generated next to your code so they are never far away.',
  },
];

export default function ZeroToDesktopAppPost() {
  return (
    <ArticleShell
      tag="Tutorial"
      title="Zero to desktop app in four steps"
      lede="An empty folder, four commands and one readable file — this walkthrough ends with a window running on your desktop. No Node project setup, no build tooling, no account."
      date="October 10, 2026"
      dateISO="2026-10-10"
      readingTime="8 min read"
    >
      <P>
        This is the shortest honest path from nothing to a desktop app. You will install the CLI,
        scaffold a project, read every line EngCode generated for you, and run it. The whole thing
        takes about ten minutes, and the only prerequisite is Node.js 18 or newer.
      </P>

      <Step>Step 1 — Install</Step>
      <P>
        The CLI is distributed on npm, which means one command works on Windows, macOS and Linux:
      </P>
      <CodeBlock>{`npm install -g engcode`}</CodeBlock>
      <P>
        Confirm it landed before moving on. You want the version, not an error:
      </P>
      <CodeBlock>{`engcode --version
1.0.0`}</CodeBlock>
      <P>
        On Windows you can skip Node entirely and use the PowerShell installer, and on macOS the
        curl script does the same — both are on the{' '}
        <Link href="/download" className="text-link underline underline-offset-2">
          download page
        </Link>
        . Either way, the rest of this tutorial is identical.
      </P>

      <Step>Step 2 — Scaffold</Step>
      <P>
        Ask for a new project. <C>--type desktop</C> gives you a window project with its own{' '}
        <C>package.json</C> already written:
      </P>
      <CodeBlock>{`engcode new my-window
cd my-window
npm install`}</CodeBlock>
      <P>
        Three lines in, you have a folder that runs. <C>npm install</C> pulls in the desktop
        runtime that the generated <C>package.json</C> declares — this is the only step that
        touches the network after the initial CLI install.
      </P>

      <Step>Step 3 — Read the code</Step>
      <P>Open the project. There are three files, and only one of them matters right now:</P>
      <ul className="mt-5 space-y-4">
        {FILES.map((f) => (
          <li key={f.file} className="flex items-start gap-3">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"
              aria-hidden="true"
            />
            <span className="text-[17px] leading-relaxed text-muted">
              <code className="rounded border border-border bg-code-bg px-1.5 font-mono text-[15px]">
                {f.file}
              </code>{' '}
              — {f.what}
            </span>
          </li>
        ))}
      </ul>
      <P>
        <C>main.eng</C> is where the app lives. It is written in three layers —{' '}
        <strong className="text-text">blocks</strong> for structure,{' '}
        <strong className="text-text">style</strong> for looks,{' '}
        <strong className="text-text">when</strong> for behavior — and then it opens the window:
      </P>
      <CodeBlock>{`app "My Window":
    page "Home":
        button "Hello" called "hello button"
    end
end

style "hello button":
    background is amber
    font size is 18
end

when "hello button" is clicked:
    say "Hello from your first window!"
end`}</CodeBlock>
      <P>
        Read it top to bottom: there is a window, one button in it, how that button looks, what
        happens when it is pressed, and then the window appears. Nothing else is hiding in a
        config file — the file you are reading is the app.
      </P>

      <Step>Step 4 — Run</Step>
      <P>
        From inside the project folder, hand the directory to the app runner:
      </P>
      <CodeBlock>{`engcode app .`}</CodeBlock>
      <P>
        The window opens on your desktop, on whatever platform you are on — Windows 10+ or macOS
        12+. Click the button and <C>&quot;Hello from your first window!&quot;</C> appears in the
        console. Edit <C>background to amber</C>, save, run again: the app is a file you can read
        and change, not a project you have to rebuild.
      </P>
      <P>
        From here the natural moves are adding more blocks, moving behavior into named functions,
        and splitting <C>main.eng</C> into modules when it grows past one screen.
      </P>

      <Reveal delay={0.1} className="mt-12">
        <div className="rounded-2xl border border-border bg-bg-subtle p-6 md:p-8">
          <h2 className="text-h4">What to read next</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            The quick start covers scripts and websites in the same style — and if you do not have
            the CLI installed yet, every option is on the download page.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <Link href="/docs/quick-start" className="btn-primary">
                Open the quick start <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/download" className="btn-secondary">
                <Download className="h-4 w-4" aria-hidden="true" /> Download options
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/learn" className="btn-secondary">
                The 20-lesson course
              </Link>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </ArticleShell>
  );
}
