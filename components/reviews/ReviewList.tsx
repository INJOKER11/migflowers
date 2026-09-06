import { fill, shortDate, stars } from '@/lib/format';
import { Review } from '@/types';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

export function ReviewList({ reviews, locale }: { reviews: Review[]; locale: Locale }) {
  const t = getDictionary(locale).reviews;

  if (reviews.length === 0) {
    return (
      <p style={{ margin: '40px 0', fontSize: 15, color: 'var(--color-neutral-600)' }}>
        {t.empty}
      </p>
    );
  }

  return (
    <div style={{ marginTop: 30 }}>
      {reviews.map((review) => (
        <div
          key={review.id}
          style={{ padding: '26px 0', borderBottom: '1px solid var(--color-divider)' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              alignItems: 'baseline',
            }}
          >
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19 }}>{review.name}</div>
            <div className="tabular" style={{ fontSize: 12.5, color: 'var(--color-neutral-600)' }}>
              {[shortDate(review.created_at, locale), review.product_name]
                .filter(Boolean)
                .join(' · ')}
            </div>
          </div>

          <div
            style={{
              color: 'var(--color-accent)',
              fontSize: 13,
              letterSpacing: '.2em',
              marginTop: 6,
            }}
            aria-label={fill(t.ratingAria, { n: review.rating })}
          >
            {stars(review.rating)}
          </div>

          <p
            style={{
              margin: '12px 0 0',
              fontSize: 15,
              lineHeight: 1.8,
              color: 'var(--color-neutral-700)',
              maxWidth: '66ch',
              textAlign: 'justify',
            }}
          >
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
