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

  return (
    <div className={onPage ? 'cart-line cart-line-page' : 'cart-line'}>
      <Plate
        src={product.image_url}
        alt={product.name}
        sizes={onPage ? '84px' : '62px'}
        radius="var(--radius-sm)"
        className="cart-line-media"
      />

      <div className="cart-line-text">
        <div className="cart-line-name">{product.name}</div>
        <div className="tabular cart-line-unit">{uah(product.price)} / шт.</div>
      </div>

      <div className="cart-line-controls">
        <QuantityStepper
          qty={qty}
          label={product.name}
          size={onPage ? 30 : 28}
          onDecrease={() => bump(product.id, -1)}
          onIncrease={() => bump(product.id, 1)}
        />

        {onPage && (
          <div className="tabular cart-line-total">{uah(product.price * qty)}</div>
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
    </div>
  );
}
