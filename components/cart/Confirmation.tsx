'use client';

import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/Button';
import { Check, STROKE_LIGHT } from '@/components/ui/icons';
import { useDict } from '@/lib/dictionary-context';

export function Confirmation() {
  const t = useDict().confirmed;
  const { orderSummary } = useCart();

  return (
    <>
      <Check
        size={38}
        strokeWidth={STROKE_LIGHT}
        color="var(--color-accent)"
        style={{ display: 'inline-block' }}
      />
      <h1 style={{ fontSize: 44, margin: '22px 0 14px' }}>{t.h1}</h1>
      <p
        style={{
          margin: 0,
          fontSize: 15.5,
          lineHeight: 1.85,
          color: 'var(--color-neutral-700)',
        }}
      >
        {orderSummary} {t.tail}
      </p>
      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          marginTop: 32,
          flexWrap: 'wrap',
        }}
      >
        <Button href="/shop" cta style={{ padding: '12px 28px' }}>
          {t.cta}
        </Button>
      </div>
    </>
  );
}
