'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Quote, STROKE_HEAVY } from '@/components/ui/icons';
import { Review } from '@/types';

export function TestimonialCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);

  const current = reviews.length ? reviews[index % reviews.length] : null;
  const step = (delta: number) => setIndex((i) => (i + delta + reviews.length) % reviews.length);

  if (!current) return null;

  return (
    <section
      style={{
        borderTop: '1px solid var(--color-divider)',
        borderBottom: '1px solid var(--color-divider)',
        background: 'var(--color-neutral-100)',
      }}
    >
      <div
        className="band-inner"
        style={{ maxWidth: 900, margin: '0 auto', padding: '76px 32px', textAlign: 'center' }}
      >
        <Quote
          size={26}
          strokeWidth={1.3}
          color="var(--color-accent)"
          style={{ marginBottom: 20, display: 'inline-block' }}
        />

        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 2.7vw, 34px)',
            lineHeight: 1.35,
            margin: '0 auto',
            maxWidth: '22ch',
            textWrap: 'pretty',
          }}
        >
          {current.comment}
        </p>

        <div
          style={{
            marginTop: 26,
            fontSize: 13,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--color-neutral-600)',
          }}
        >
          {current.name}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            marginTop: 30,
          }}
        >
          <Button
            variant="ghost"
            icon
            title="Назад"
            aria-label="Попередній відгук"
            style={{ width: 38, height: 38, borderRadius: '50%' }}
            onClick={() => step(-1)}
          >
            <ChevronLeft size={15} strokeWidth={STROKE_HEAVY} />
          </Button>
          <span className="tabular" style={{ fontSize: 12, color: 'var(--color-neutral-600)' }}>
            {index + 1} / {reviews.length}
          </span>
          <Button
            variant="ghost"
            icon
            title="Далі"
            aria-label="Наступний відгук"
            style={{ width: 38, height: 38, borderRadius: '50%' }}
            onClick={() => step(1)}
          >
            <ChevronRight size={15} strokeWidth={STROKE_HEAVY} />
          </Button>
        </div>

        <Link
          href="/reviews"
          style={{
            display: 'inline-block',
            marginTop: 24,
            fontSize: 12,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
          }}
        >
          Усі відгуки
        </Link>
      </div>
    </section>
  );
}
