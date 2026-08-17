import { shortDate, stars } from '@/lib/format';
import { Review } from '@/types';

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p style={{ margin: '40px 0', fontSize: 15, color: 'var(--color-neutral-600)' }}>
        Ще жодного відгуку. Ваш може стати першим.
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
              {[shortDate(review.created_at), review.product_name].filter(Boolean).join(' · ')}
            </div>
          </div>

          <div
            style={{
              color: 'var(--color-accent)',
              fontSize: 13,
              letterSpacing: '.2em',
              marginTop: 6,
            }}
            aria-label={`Оцінка ${review.rating} з 5`}
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
