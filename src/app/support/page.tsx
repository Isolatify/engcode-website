import type { Metadata } from 'next';
import { SupportContent } from '@/components/support/SupportContent';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Get help with EngCode — FAQ, GitHub Issues and Discussions, a contact form and community links.',
};

export default function SupportPage() {
  return (
    <>
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Support
          </p>
          <h1 className="text-h1 mt-3">How can we help?</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            Search the FAQ, browse troubleshooting in the docs, or ask the community directly —
            everyone here was a beginner once.
          </p>
        </div>
      </header>

      <SupportContent />
    </>
  );
}
