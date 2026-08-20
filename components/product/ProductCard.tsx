'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Plate } from '@/components/ui/Plate';
import { Heart, STROKE_HEAVY } from '@/components/ui/icons';
import { QuantityStepper } from '@/components/cart/QuantityStepper';
import type { Product } from '@/types';

export type CardVariant = 'home' | 'shop' | 'category' | 'related' | 'wishlist';

interface Spec {
  nameSize: number;
  priceSize: number;
  note: boolean;
  wish: boolean;
  tag: boolean;
  action: 'add' | 'move' | 'none';
  buttonGap: number;
  buttonPad: string;
  /* Height of the add-to-cart button at this spec's padding — the in-cart
     stepper takes it so the two never change the card's height. */
  buttonHeight: number;
}

const SPECS: Record<CardVariant, Spec> = {
  home: { nameSize: 20, priceSize: 15, note: true, wish: true, tag: true, action: 'add', buttonGap: 14, buttonPad: '11px 0', buttonHeight: 38 },
  shop: { nameSize: 19, priceSize: 14.5, note: true, wish: true, tag: true, action: 'add', buttonGap: 12, buttonPad: '10px 0', buttonHeight: 36 },
  category: { nameSize: 19, priceSize: 14.5, note: false, wish: false, tag: false, action: 'add', buttonGap: 12, buttonPad: '10px 0', buttonHeight: 36 },
  related: { nameSize: 18, priceSize: 14, note: false, wish: false, tag: false, action: 'none', buttonGap: 12, buttonPad: '10px 0', buttonHeight: 36 },
  wishlist: { nameSize: 19, priceSize: 14.5, note: false, wish: false, tag: false, action: 'move', buttonGap: 12, buttonPad: '10px 0', buttonHeight: 36 },
};

interface ProductCardProps {
  product: Product;
  variant?: CardVariant;
  priority?: boolean;
}

export function ProductCard({ product, variant = 'shop', priority = false }: ProductCardProps) {
  const spec = SPECS[variant];
  const { add, bump, qtyOf, isSaved, toggleSaved, ready } = useCart();
  const saved = isSaved(product.id);

  const qty = ready ? qtyOf(product.id) : 0;
  const href = `/product/${product.slug}`;

  const plate = (
    <Link href={href} aria-label={product.name} style={{ display: 'block' }}>
      <Plate
        src={product.image_url}
        alt={product.name}
        sizes="(max-width: 760px) 100vw, (max-width: 1000px) 50vw, 300px"
        zoom={1.06}
        priority={priority}
        style={{ cursor: 'pointer' }}
      />
    </Link>
  );

  return (
    <div className="product-card">
      {spec.wish || spec.tag ? (
        <div className="product-media">
          {plate}
          {spec.wish && (
            <button
              type="button"
              className="wish-btn"
              title="Зберегти"
              aria-label={saved ? `Прибрати зі збережених: ${product.name}` : `Зберегти: ${product.name}`}
              aria-pressed={saved}
              onClick={() => toggleSaved(product.id)}
            >
              <Heart
                size={15}
                strokeWidth={STROKE_HEAVY}
                fill={saved ? 'var(--color-accent)' : 'none'}
              />
            </button>
          )}

          {/* todo: add tags? */}

          {/*{spec.tag && product.tag && (*/}
          {/*  <span className="tag tag-outline product-tag">{product.tag}</span>*/}
          {/*)}*/}
        </div>
      ) : (
        plate
      )}

      <div className="product-row">
        <Link href={href} className="product-name" style={{ fontSize: spec.nameSize }}>
          {product.name}
        </Link>
        <div className="tabular nowrap" style={{ fontSize: spec.priceSize }}>
          {uah(product.price)}
        </div>
      </div>

      {spec.note && <div className="product-note">{product.description}</div>}

      {spec.action === 'add' &&
        (qty > 0 ? (
          <div
            style={
              {
                marginTop: spec.buttonGap,
                '--stepper-h': `${spec.buttonHeight}px`,
              } as CSSProperties
            }
          >
            <QuantityStepper
              block
              qty={qty}
              label={product.name}
              onDecrease={() => bump(product.id, -1)}
              onIncrease={() => bump(product.id, 1)}
            />
          </div>
        ) : (
          <Button
            cta="sm"
            style={{ marginTop: spec.buttonGap, width: '100%', padding: spec.buttonPad }}
            onClick={() => add(product)}
          >
            Додати в кошик
          </Button>
        ))}

      {spec.action === 'move' && (
        <>
          <Button cta="sm" style={{ marginTop: 12, padding: '10px 0' }} onClick={() => add(product)}>
            Перенести в кошик
          </Button>
          <Button
            variant="ghost"
            cta="sm"
            style={{ marginTop: 8, padding: '9px 0', fontSize: 11 }}
            onClick={() => toggleSaved(product.id)}
          >
            Видалити
          </Button>
        </>
      )}
    </div>
  );
}
