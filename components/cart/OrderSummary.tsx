'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalePath } from '@/lib/use-locale';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { PROMO_CODE } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useDict } from '@/lib/dictionary-context';
import { fill } from '@/lib/format';

export function OrderSummary() {
  const t = useDict().cart;
  const router = useRouter();
  const withLocale = useLocalePath();
  const cart = useCart();
  const [draft, setDraft] = useState('');

  const promoNote = {
    none: fill(t.promoNone, { code: PROMO_CODE }),
    applied: fill(t.promoApplied, { code: PROMO_CODE }),
    rejected: t.promoRejected,
  } as const;

  return (
    <div className="card" style={{ padding: 26 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 18 }}>
        {t.summaryTitle}
      </div>

      <div className="summary-row">
        <span>{t.sum}</span>
        <span className="tabular">{uah(cart.subtotal)}</span>
      </div>
      <div className="summary-row" style={{ marginTop: 8 }}>
        <span>{t.delivery}</span>
        <span className="tabular">
          {cart.deliveryFee === 0 ? t.free : uah(cart.deliveryFee)}
        </span>
      </div>
      {cart.discount > 0 && (
        <div className="summary-row" style={{ marginTop: 8, color: 'var(--color-accent-700)' }}>
          <span>
            {t.promoRow} {PROMO_CODE}
          </span>
          <span className="tabular">− {uah(cart.discount)}</span>
        </div>
      )}

      <div className="summary-total">
        <span>{t.toPay}</span>
        <span className="tabular">{uah(cart.total)}</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          cart.applyPromo(draft);
        }}
        style={{ display: 'flex', gap: 8, marginTop: 20 }}
      >
        <input
          className="input"
          placeholder={t.promoPlaceholder}
          aria-label={t.promoPlaceholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={{ flex: 1, fontSize: 13 }}
        />
        <Button type="submit" variant="ghost" cta="sm" style={{ padding: '0 16px' }}>
          {t.apply}
        </Button>
      </form>
      <div
        aria-live="polite"
        style={{ fontSize: 11.5, color: 'var(--color-neutral-600)', marginTop: 8 }}
      >
        {promoNote[cart.promo]}
      </div>

      <Button
        block
        cta
        style={{ marginTop: 22, padding: '14px 0' }}
        onClick={() => router.push(withLocale('/checkout'))}
      >
        {t.goCheckout}
      </Button>
    </div>
  );
}
