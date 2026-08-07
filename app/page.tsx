import { Hero } from '@/components/home/Hero';
import { QuickBuy } from '@/components/home/QuickBuy';
import { OccasionGrid } from '@/components/home/OccasionGrid';
import { WhyUs } from '@/components/home/WhyUs';
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel';
import { InstaGrid } from '@/components/home/InstaGrid';
import { Newsletter } from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickBuy />
      <OccasionGrid />
      <WhyUs />
      <TestimonialCarousel />
      <InstaGrid />
      <Newsletter />
    </>
  );
}
