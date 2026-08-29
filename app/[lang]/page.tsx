import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { QuickBuy } from '@/components/home/QuickBuy';
import { OccasionGrid } from '@/components/home/OccasionGrid';
import { WhyUs } from '@/components/home/WhyUs';
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel';
import { InstaGrid } from '@/components/home/InstaGrid';
import { Newsletter } from '@/components/home/Newsletter';
import { getReviews } from '@/lib/api';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return metadataFor(props.params, '/', 'home');
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const reviews = await getReviews({ locale, perPage: 5 });

  return (
    <>
      <Hero dict={getDictionary(locale).home} />
      <QuickBuy locale={locale} />
      <OccasionGrid locale={locale} />
      <WhyUs />
      <TestimonialCarousel reviews={reviews} />
      <InstaGrid />
      <Newsletter />
    </>
  );
}
