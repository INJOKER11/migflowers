import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ReviewList } from '@/components/reviews/ReviewList';
import { RATING_SUMMARY } from '@/lib/reviews';

export const metadata: Metadata = {
  title: 'Відгуки — MIG Flowers',
  description: RATING_SUMMARY,
};

export default function ReviewsPage() {
  return (
    <Section width={900} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Відгуки' }]} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 46, margin: 0 }}>Відгуки</h1>
        <span className="tabular" style={{ fontSize: 14, color: 'var(--color-neutral-600)' }}>
          {RATING_SUMMARY}
        </span>
      </div>
      <ReviewList />
    </Section>
  );
}
