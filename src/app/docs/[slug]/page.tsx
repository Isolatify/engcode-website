import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { allDocsPages, getDocPage, getDocNeighbors, getDocToc } from '@/content/docs';
import { siteConfig } from '@/config/site.config';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocBody } from '@/components/docs/DocBody';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allDocsPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) return { title: 'Not found' };
  const first = page.blocks.find((b): b is Extract<typeof b, { t: 'p' }> => b.t === 'p');
  return {
    title: page.title,
    description: first ? first.text.slice(0, 155) : `EngCode documentation — ${page.title}.`,
    alternates: { canonical: `/docs/${slug}` },
  };
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) notFound();

  const { prev, next } = getDocNeighbors(slug);
  const toc = getDocToc(page);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${page.title} · ${siteConfig.name}`,
    description: siteConfig.description,
    url: `${siteConfig.url}/docs/${slug}`,
  };

  return (
    <div className="container-site flex gap-12 py-10 lg:py-14">
      <DocsSidebar currentSlug={slug} />

      <div className="flex min-w-0 flex-1 gap-10">
        <article className="min-w-0 max-w-3xl flex-1">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-subtle">
            <Link href="/docs" className="hover:text-text">
              Docs
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-medium text-muted">{page.title}</span>
          </nav>

          <h1 className="text-h1 mt-4">{page.title}</h1>

          <div className="mt-8 flex flex-col gap-5">
            <DocBody blocks={page.blocks} />
          </div>

          {/* Prev / next */}
          <nav aria-label="More documentation" className="mt-16 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={`/docs/${prev.slug}`} className="card card-hover group p-5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-subtle">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Previous
                </span>
                <span className="mt-2 block font-heading font-semibold text-text">{prev.title}</span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="card card-hover group p-5 sm:col-start-2 sm:text-right"
              >
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-subtle sm:justify-end">
                  Next
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="mt-2 block font-heading font-semibold text-text">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </article>

        {/* On this page */}
        {toc.length > 0 ? (
          <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-subtle">
              On this page
            </p>
            <ul className="space-y-2 border-l border-border">
              {toc.map((item, i) => (
                <li key={`${item.id}-${i}`} className="border-l-2 border-transparent pl-4">
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
