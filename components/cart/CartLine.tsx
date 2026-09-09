'use client';

import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { Plate } from '@/components/ui/Plate';
import { STROKE, Trash2 } from '@/components/ui/icons';
import { QuantityStepper } from './QuantityStepper';
import { isDiscounted, optionAdjustment, unitPriceOf } from '@/lib/catalog';
import type { CartLine as Line } from '@/types';
import { useDict } from '@/lib/dictionary-context';
import { fill } from '@/lib/format';

interface CartLineProps {
  line: Line;
  variant?: 'drawer' | 'page';
  /** A backend validation message for this exact line — e.g. its size/colour
      got deactivated between page load and checkout. Purely presentational;
      the caller decides which line it belongs to. */
  error?: string;
  /** Freezes the qty stepper and remove button — used while a checkout
      submission is in flight, so the line a 422 error names can't shift out
      from under the response's `items` index. */
  locked?: boolean;
}

export function CartLine({ line, variant = 'drawer', error, locked = false }: CartLineProps) {
  const { bump, remove } = useCart();
  const t = useDict().cart;
  const { product, size, color, qty } = line;
  const onPage = variant === 'page';
  const unitPrice = unitPriceOf(product, size, color);
  const wasPrice = product.price + optionAdjustment(size, color);
  const options = [size?.name, color?.name].filter(Boolean).join(' · ');

  return (
    <div className={onPage ? 'cart-line cart-line-page' : 'cart-line'}>
      <Plate
        src={color?.image_url ?? product.image_url}
        alt={product.name}
        sizes={onPage ? '84px' : '62px'}
        radius="var(--radius-sm)"
        className="cart-line-media"
      />

      <div className="cart-line-text">
        <div className="cart-line-name">{product.name}</div>
        {options && <div className="cart-line-options">{options}</div>}
        <div className="tabular cart-line-unit">
          {isDiscounted(product) && <span className="price-was">{uah(wasPrice)}</span>}
          {uah(unitPrice)} {t.perUnit}
        </div>
        {error && (
          <p className="field-error" role="alert" style={{ marginTop: 4 }}>
            {error}
          </p>
        )}
      </div>

      <div className="cart-line-controls">
        <QuantityStepper
          qty={qty}
          label={product.name}
          size={onPage ? 30 : 28}
          disabled={locked}
          onDecrease={() => bump(product.id, -1, size?.id, color?.id)}
          onIncrease={() => bump(product.id, 1, size?.id, color?.id)}
        />

        {onPage && <div className="tabular cart-line-total">{uah(unitPrice * qty)}</div>}

        <button
          type="button"
          className="icon-plain"
          title={t.remove}
          aria-label={fill(t.removeAria, { name: product.name })}
          disabled={locked}
          onClick={() => remove(product.id, size?.id, color?.id)}
        >
          <Trash2 size={onPage ? 16 : 15} strokeWidth={STROKE} />
        </button>
      </div>
    </div>
  );
}
