'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { PROMO_CODE } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

const PROMO_NOTE = {
  none: `Спробуйте ${PROMO_CODE} — десять відсотків знижки.`,
  applied: `${PROMO_CODE} застосовано.`,
  rejected: 'Такий код не розпізнано.',
} as const;

export function OrderSummary() {
  const router = useRouter();
  const cart = useCart();
  const [draft, setDraft] = useState('');

  return (
    <div className="card" style={{ padding: 26 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 18 }}>
        Разом до сплати
      </div>

      <div className="summary-row">
        <span>Сума</span>
        <span className="tabular">{uah(cart.subtotal)}</span>
      </div>
      <div className="summary-row" style={{ marginTop: 8 }}>
        <span>Доставка</span>
        <span className="tabular">
          {cart.deliveryFee === 0 ? 'Безкоштовно' : uah(cart.deliveryFee)}
        </span>
      </div>
      {cart.discount > 0 && (
        <div className="summary-row" style={{ marginTop: 8, color: 'var(--color-accent-700)' }}>
          <span>Промокод {PROMO_CODE}</span>
          <span className="tabular">− {uah(cart.discount)}</span>
        </div>
      )}

      <div className="summary-total">
        <span>До сплати</span>
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
          placeholder="Промокод"
          aria-label="Промокод"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={{ flex: 1, fontSize: 13 }}
        />
        <Button type="submit" variant="ghost" cta="sm" style={{ padding: '0 16px' }}>
          Застосувати
        </Button>
      </form>
      <div
        aria-live="polite"
        style={{ fontSize: 11.5, color: 'var(--color-neutral-600)', marginTop: 8 }}
      >
        {PROMO_NOTE[cart.promo]}
      </div>

      <Button
        block
        cta
        style={{ marginTop: 22, padding: '14px 0' }}
        onClick={() => router.push('/checkout')}
      >
        Перейти до оформлення
      </Button>
    </div>
  );
}
