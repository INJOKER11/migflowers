'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { CartLine } from './CartLine';
import { OrderSummary } from './OrderSummary';

export function CartView() {
  const { lines, isEmpty, ready } = useCart();

  if (!ready) return null;

  if (isEmpty) {
    return (
      <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', lineHeight: 1.8 }}>
        Тут поки що порожньо. Цього тижня дуже гарні півонії.
        <br />
        <Link href="/shop">До магазину</Link>
      </p>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: 48,
        alignItems: 'start',
      }}
    >
      <div className="cart-lines">
        {lines.map((line) => (
          <CartLine key={line.product.id} line={line} variant="page" />
        ))}
      </div>
      <OrderSummary />
    </div>
  );
}
