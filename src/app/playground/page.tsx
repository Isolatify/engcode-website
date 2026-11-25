import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Playground } from '@/components/playground/Playground';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';

export const metadata: Metadata = {
  title: 'Playground',
  description:
    'Write and run EngCode in your browser — no account, no install. Load an example, edit it and press Run to see the output instantly.',
  alternates: { canonical: '/playground' },
};

export default function PlaygroundPage() {
  return (
    <>
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            The playground
          </p>
          <h1 className="text-h1 mt-3">
            Write EngCode <span className="text-gradient">right here</span>
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg leading-relaxed text-muted">
            Pick an example, edit it, press Run. No account, no install — your program is saved in
            this browser only.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <Link href="/download" className="btn-secondary h-11 px-6 text-sm">
                Install the full CLI
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/docs" className="btn-secondary h-11 px-6 text-sm">
                Read the docs
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      <div className="container-site py-10 md:py-14">
        <Reveal>
          <Playground />
        </Reveal>
      </div>
    </>
  );
}
