'use client';

import { useState } from 'react';
import { REVIEW_FILTERS, filterReviews, stars, type ReviewFilter } from '@/lib/reviews';
import { Chip } from '@/components/ui/Chip';

export function ReviewList() {
  const [filter, setFilter] = useState<ReviewFilter>('Усі');
  const reviews = filterReviews(filter);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, margin: '30px 0 10px', flexWrap: 'wrap' }}>
        {REVIEW_FILTERS.map((label) => (
          <Chip
            key={label}
            active={label === filter}
            onClick={() => setFilter(label)}
            className="chip-review"
          >
            {label}
          </Chip>
        ))}
      </div>

      {reviews.map((review) => (
        <div
          key={review.name}
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
              {review.meta}
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
            {review.text}
          </p>
        </div>
      ))}
    </>
  );
}
