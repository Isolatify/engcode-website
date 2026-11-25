import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { GitHubMark } from '@/components/ui/GitHubMark';
import { ArticleShell, P, H3, CodeBlock, C } from '@/components/blog/ArticleShell';

export const metadata: Metadata = {
  title: 'EngCode 1.0.0 is here',
  description:
    'EngCode 1.0.0: desktop apps that scaffold their own package.json, a VS Code file icon theme, an optional themeToggle for generated apps, and a friendlier CLI first run.',
};

const HIGHLIGHTS = [
  'engcode new --type desktop now writes its own package.json — no manual npm init.',
  'A file icon theme ships with the VS Code extension, so .eng files carry the EngCode mark.',
  'Generated apps can opt into a light/dark toggle with themeToggle on.',
  'The CLI first run greets you, lists what it created, and prints the two commands to run next.',
  'Error messages gained line numbers everywhere, including the playground.',
];

export default function EngcodeOneOhOhPost() {
  return (
    <ArticleShell
      tag="Release · v1.0.0"
      title="EngCode 1.0.0 is here"
      lede="The first stable release is out. Desktop apps install cleanly, your editor recognizes EngCode files, generated apps can carry a light/dark toggle, and the CLI finally introduces itself properly."
      date="November 12, 2026"
      dateISO="2026-11-12"
      readingTime="4 min read"
    >
      <P>
        Today we are tagging <C>v1.0.0</C>. Twelve weeks after the first public preview, the
        language, the CLI and the project templates are stable enough that we are comfortable
        telling beginners: start here, nothing under your feet is going to move.
      </P>
      <P>
        This post covers the four changes you will notice first. Everything else — tables, error
        message rewording, smaller fixes — is listed in full on{' '}
        <Link href="/changelog" className="text-link underline underline-offset-2">
          the changelog
        </Link>
        .
      </P>

      <H3>Desktop apps that install cleanly</H3>
      <P>
        Before 1.0.0, scaffolding a desktop app gave you an <C>.eng</C> file and a shrug: you had
        to create a <C>package.json</C> by hand and guess which dependencies the window needed.
        The new desktop template brings its own:
      </P>
      <CodeBlock>{`engcode new my-window --type desktop
cd my-window
npm install
engcode app .`}</CodeBlock>
      <P>
        <C>engcode new --type desktop</C> writes a complete <C>package.json</C> with the runtime
        pinned to the version you just installed, a <C>start</C> script, and the windowing
        dependency already resolved. Two commands later the app opens. There is nothing to
        configure and nothing to look up.
      </P>

      <H3>A file icon theme for VS Code</H3>
      <P>
        Small thing, big quality-of-life win: the VS Code extension now registers a file icon
        theme. Any <C>.eng</C> file in your project — scripts, blocks, styles, behavior — gets the
        EngCode mark instead of the generic page icon. Switch it on once:
      </P>
      <CodeBlock>{`code --install-extension engcode.engcode`}</CodeBlock>
      <P>
        Then pick <strong className="text-text">EngCode Icons</strong> from the File Icon Theme
        picker. Syntax highlighting, the Run button and friendly inline errors all keep working
        exactly as before.
      </P>

      <H3>An optional light/dark toggle in generated apps</H3>
      <P>
        Apps generated from any template can now ship with a light/dark toggle in the window bar.
        It is opt-in — one line in the app source — and it persists the visitor&apos;s choice:
      </P>
      <CodeBlock>{`app "Notes":

themeToggle on

style everything:
    background is #f8fafc

when "new note" is clicked:
    say "A new note!"
end`}</CodeBlock>
      <P>
        With <C>themeToggle on</C>, the generated window gets a toggle button, follows the system
        preference on first launch, and remembers what was picked last time. Leave the line out
        and your app stays a single theme — nothing changes unless you ask for it.
      </P>

      <H3>Friendlier CLI first-run output</H3>
      <P>
        The first thing a beginner sees from a CLI should be a sentence, not a wall of flags.
        Running <C>engcode new</C> for the first time now looks like this:
      </P>
      <CodeBlock>{`$ engcode new hello

  Welcome to EngCode 1.0.0

  ✔ Created  hello/hello.eng
  ✔ Added    VS Code workspace settings
  ✔ Added    README with your next steps

  Next:
    cd hello
    engcode run hello.eng`}</CodeBlock>
      <P>
        No jargon, no telemetry notice, no guessing which command comes next — just what was made
        and the two lines that turn it into a running program.
      </P>

      <H3>The short list</H3>
      <ul className="mt-5 space-y-3">
        {HIGHLIGHTS.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[17px] leading-relaxed text-muted">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>

      <H3>Upgrading</H3>
      <P>
        If you had a preview build installed, run the same command you installed with:
      </P>
      <CodeBlock>{`npm install -g engcode
engcode --version   # 1.0.0`}</CodeBlock>
      <P>
        Existing projects keep working — 1.0.0 reads every preview project format. If anything
        breaks,{' '}
        <a
          href={`${siteConfig.github.url}/issues/new/choose`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline underline-offset-2"
        >
          open an issue
        </a>{' '}
        and include your version output.
      </P>

      <Reveal delay={0.1} className="mt-12">
        <div className="rounded-2xl border border-border bg-bg-subtle p-6 md:p-8">
          <h2 className="text-h4">Get 1.0.0</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Windows installer, macOS disk image, npm, curl or PowerShell — and the full release
            notes on GitHub.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <Link href="/download" className="btn-primary">
                Download EngCode <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/changelog" className="btn-secondary">
                Changelog
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a
                href={`${siteConfig.github.url}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                GitHub releases <GitHubMark className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </ArticleShell>
  );
}
