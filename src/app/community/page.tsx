import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  MessagesSquare,
  HeartHandshake,
  CalendarDays,
  Megaphone,
  Sparkles,
  LifeBuoy,
  ExternalLink,
} from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { GitHubMark } from '@/components/ui/GitHubMark';

export const metadata: Metadata = {
  title: 'Community',
  description:
    'Where the EngCode community meets — Discord, GitHub Discussions, contribution channels, recurring events and the code of conduct we all follow.',
};

const CHANNELS = [
  {
    icon: MessagesSquare,
    title: 'Discord',
    text: 'Quick chat, show-and-tell and pairing with other learners. The invite link is pinned at the top of GitHub Discussions so it always stays current.',
    cta: 'Find the invite',
    href: `${siteConfig.github.url}/discussions`,
    external: true,
  },
  {
    icon: GitHubMark,
    title: 'GitHub Discussions',
    text: 'Questions, ideas and decisions about the language. Everything here stays searchable, so the answer you need already exists — or you ask it once for everyone after you.',
    cta: 'Open Discussions',
    href: `${siteConfig.github.url}/discussions`,
    external: true,
  },
  {
    icon: HeartHandshake,
    title: 'Contribute',
    text: 'Docs, examples, translations or code — contribution is the on-ramp. Plenty of tasks need zero programming experience.',
    cta: 'Ways to help',
    href: '/contribute',
    external: false,
  },
] as const;

const EVENTS = [
  {
    icon: Megaphone,
    title: 'Community call',
    cadence: 'First Thursday of every month',
    text: 'Thirty minutes on video: what shipped, what is next, and an open floor. Notes are posted to Discussions afterwards for anyone who missed it.',
  },
  {
    icon: Sparkles,
    title: 'New example showcase',
    cadence: 'With every release',
    text: 'The examples added in the release get a written tour — how they are built, which lessons they practise, and what to change first.',
  },
  {
    icon: LifeBuoy,
    title: 'Beginner Q&A Saturdays',
    cadence: 'Every Saturday, asynchronous',
    text: 'A dedicated Discussions thread where nothing is too basic. Stuck on Lesson 3 for the third time? That is exactly what it is for.',
  },
] as const;

export default function CommunityPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Community
          </p>
          <h1 className="text-h1 mt-3">Nobody learns a language alone</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-muted">
            Ask the question you think is too basic, show what you built, or help someone else
            across the same wall you just crossed. Every channel below is beginner-safe by rule.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <a
                href={`${siteConfig.github.url}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Introduce yourself <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a href="#code-of-conduct" className="btn-secondary">
                Read the code of conduct
              </a>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Channels */}
      <section className="container-site py-14 md:py-20" aria-label="Community channels">
        <div className="grid gap-6 lg:grid-cols-3">
          {CHANNELS.map((channel, i) => {
            const Icon = channel.icon;
            const inner = (
              <>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-h4 mt-4">{channel.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{channel.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-link">
                  {channel.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </>
            );
            return (
              <Reveal key={channel.title} delay={i * 0.1}>
                {channel.external ? (
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card card-hover flex h-full flex-col p-6"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={channel.href} className="card card-hover flex h-full flex-col p-6">
                    {inner}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Events */}
      <section
        className="border-t border-border bg-bg-subtle py-14 md:py-20"
        aria-labelledby="events-heading"
      >
        <div className="container-site">
          <Reveal>
            <h2 id="events-heading" className="text-h2">
              Recurring events
            </h2>
            <p className="mt-3 max-w-2xl text-body-lg text-muted">
              Three rhythms, all low-pressure. Drop into any of them — cameras off is fine.
            </p>
          </Reveal>

          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {EVENTS.map((event, i) => {
              const Icon = event.icon;
              return (
                <Reveal as="li" key={event.title} delay={i * 0.1}>
                  <div className="card card-hover h-full p-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-h4 mt-4">{event.title}</h3>
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-caption font-semibold text-subtle">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      {event.cadence}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{event.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Code of conduct */}
      <section
        id="code-of-conduct"
        className="scroll-mt-20 border-t border-border"
        aria-labelledby="conduct-heading"
      >
        <div className="container-site max-w-3xl py-14 md:py-20">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
              Everyone&apos;s responsibility
            </p>
            <h2 id="conduct-heading" className="text-h2 mt-3">
              Code of conduct
            </h2>
            <p className="mt-4 text-body-lg leading-relaxed text-muted">
              EngCode exists so that programming feels safe to start. That only works if the
              community is too. This policy applies everywhere the project is present — GitHub
              issues and discussions, Discord, the community call, events and any private
              messaging that originates from those spaces.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card mt-8 divide-y divide-border overflow-hidden">
              {[
                {
                  h: 'Our pledge',
                  p: 'We pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.',
                },
                {
                  h: 'The behaviour we expect',
                  p: 'Be kind and precise. Assume the person asking has done their best. Welcome questions that reveal a misunderstanding — a confused beginner is reporting a confusing design, not wasting anyone’s time. Credit other people’s work, argue about ideas without insulting the person holding them, and accept “no” and “not now” the first time it is said.',
                },
                {
                  h: 'Behaviour that is not acceptable',
                  p: 'Sexualised language or imagery, unwelcome sexual attention, trolling, insults, derogatory comments, personal and political attacks, publishing others’ private information without permission, and any conduct that would reasonably be considered inappropriate in a professional setting. Dismissing or mocking someone for their accent, grammar or experience level is included — this project is built for people for whom English is a second surface, and language ability is never a measure of worth here.',
                },
                {
                  h: 'Enforcement',
                  p: 'Maintainers are responsible for clarifying and enforcing these standards. They may remove, edit or reject comments, commits, code, wiki edits, issues and other contributions that do not align with this code of conduct, and will communicate moderation decisions publicly when the safety of the people involved allows it. Temporary or permanent bans from project spaces are a last resort, used when a pattern continues after one clear warning.',
                },
                {
                  h: 'Reporting an incident',
                  p: 'If you experience or witness anything that breaks this code, report it to the maintainers at hello@engcode.dev, or privately through a GitHub maintainer contact. Include whatever you are comfortable sharing — who, where, and what happened. Reports are read by a named maintainer, acknowledged within 72 hours, and handled in confidence. Retaliating against someone who reports in good faith is itself a violation of this code.',
                },
                {
                  h: 'Attribution',
                  p: 'This code of conduct is adapted from the Contributor Covenant, version 2.1, the standard used across open-source communities. The full text of the original is available at contributor-covenant.org.',
                },
              ].map((block) => (
                <div key={block.h} className="p-5 md:p-6">
                  <h3 className="text-h5">{block.h}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{block.p}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <a
                href={`${siteConfig.github.url}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Join the discussion <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/contribute" className="btn-secondary">
                Ways to contribute
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
