'use client';

import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { Plate } from '@/components/ui/Plate';
import { STROKE, Trash2 } from '@/components/ui/icons';
import { QuantityStepper } from './QuantityStepper';
import type { CartLine as Line } from '@/types';

interface CartLineProps {
  line: Line;
  variant?: 'drawer' | 'page';
}

export function CartLine({ line, variant = 'drawer' }: CartLineProps) {
  const { bump, remove } = useCart();
  const { product, qty } = line;
  const onPage = variant === 'page';
  const size = onPage ? 84 : 62;

  return (
    <div
      style={{
        display: 'flex',
        gap: onPage ? 18 : 14,
        padding: onPage ? '20px 0' : '18px 0',
        borderBottom: '1px solid var(--color-divider)',
        alignItems: 'center',
      }}
    >
      <Plate
        src={product.image_url}
        alt={product.name}
        sizes={`${size}px`}
        radius="var(--radius-sm)"
        style={{ width: size, height: size, flex: 'none' }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: onPage ? 19 : 17 }}>
          {product.name}
        </div>
        <div className="tabular" style={{ fontSize: 12.5, color: 'var(--color-neutral-600)' }}>
          {uah(product.price)} / шт.
        </div>
      </div>

      <QuantityStepper
        qty={qty}
        label={product.name}
        size={onPage ? 30 : 28}
        onDecrease={() => bump(product.id, -1)}
        onIncrease={() => bump(product.id, 1)}
      />

      {onPage && (
        <div className="tabular" style={{ width: 90, textAlign: 'right', fontSize: 14.5 }}>
          {uah(product.price * qty)}
        </div>
      )}

      <button
        type="button"
        className="icon-plain"
        title="Видалити"
        aria-label={`Видалити: ${product.name}`}
        onClick={() => remove(product.id)}
      >
        <Trash2 size={onPage ? 16 : 15} strokeWidth={STROKE} />
      </button>
    </div>
  );
}
