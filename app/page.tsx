import { Hero } from '@/components/home/Hero';
import { QuickBuy } from '@/components/home/QuickBuy';
import { OccasionGrid } from '@/components/home/OccasionGrid';
import { WhyUs } from '@/components/home/WhyUs';
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel';
import { InstaGrid } from '@/components/home/InstaGrid';
import { Newsletter } from '@/components/home/Newsletter';
import { getReviews } from '@/lib/api';

export default async function HomePage() {
  const reviews = await getReviews({ perPage: 5 });

  return (
    <>
      <Hero />
      <QuickBuy />
      <OccasionGrid />
      <WhyUs />
      <TestimonialCarousel reviews={reviews} />
      <InstaGrid />
      <Newsletter />
    </>
  );
}
