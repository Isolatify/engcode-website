import { Hero } from '@/components/home/Hero';
import { StatsStrip } from '@/components/home/StatsStrip';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { SideBySide } from '@/components/home/SideBySide';
import { ExamplesCarousel } from '@/components/home/ExamplesCarousel';
import { HowItWorks } from '@/components/home/HowItWorks';
import { InstallTabs } from '@/components/home/InstallTabs';
import { Comparison } from '@/components/home/Comparison';
import { Testimonials } from '@/components/home/Testimonials';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { FinalCta } from '@/components/home/FinalCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <FeatureGrid />
      <SideBySide />
      <ExamplesCarousel />
      <HowItWorks />
      <InstallTabs />
      <Comparison />
      <Testimonials />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}
