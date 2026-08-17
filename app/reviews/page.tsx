import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ReviewList } from '@/components/reviews/ReviewList';
import { getAllReviews } from '@/lib/api';
import { ratingSummary } from '@/lib/format';

export async function generateMetadata(): Promise<Metadata> {
  const { total, average } = await getAllReviews();

  return {
    title: 'Відгуки — MIG Flowers',
    description: ratingSummary(average, total),
  };
}

export default async function ReviewsPage() {
  const { reviews, total, average } = await getAllReviews();

  return (
    <Section width={900} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Відгуки' }]} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 46, margin: 0 }}>Відгуки</h1>
        <span className="tabular" style={{ fontSize: 14, color: 'var(--color-neutral-600)' }}>
          {ratingSummary(average, total)}
        </span>
      </div>
      <ReviewList reviews={reviews} />
    </Section>
  );
}
