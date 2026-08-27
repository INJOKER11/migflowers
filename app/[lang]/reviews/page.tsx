import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ReviewList } from '@/components/reviews/ReviewList';
import { getAllReviews } from '@/lib/api';
import { ratingSummary } from '@/lib/format';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return metadataFor(props.params, '/reviews', 'reviews');
}

export default async function ReviewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const { reviews, total, average } = await getAllReviews();

  return (
    <Section width={900} pt={44} pb={90}>
      <Breadcrumb locale={locale} trail={[{ label: 'Головна', href: '/' }, { label: 'Відгуки' }]} />
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
