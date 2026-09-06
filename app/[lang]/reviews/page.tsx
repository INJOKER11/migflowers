import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ReviewList } from '@/components/reviews/ReviewList';
import { getAllReviews } from '@/lib/api';
import { ratingSummary } from '@/lib/format';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return metadataFor(props.params, '/reviews', 'reviews');
}

export default async function ReviewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const { reviews, total, average } = await getAllReviews(locale);
  const dict = getDictionary(locale);
  const t = dict.reviews;

  return (
    <Section width={900} pt={44} pb={90}>
      <Breadcrumb
        locale={locale}
        trail={[{ label: dict.nav.home, href: '/' }, { label: t.crumb }]}
      />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 46, margin: 0 }}>{t.h1}</h1>
        <span className="tabular" style={{ fontSize: 14, color: 'var(--color-neutral-600)' }}>
          {ratingSummary(average, total, locale)}
        </span>
      </div>
      <ReviewList reviews={reviews} locale={locale} />
    </Section>
  );
}
