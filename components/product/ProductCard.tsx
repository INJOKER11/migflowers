'use client';

import { Link } from '@/components/ui/Link';
import type { CSSProperties } from 'react';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Plate } from '@/components/ui/Plate';
import { Heart, STROKE_HEAVY } from '@/components/ui/icons';
import { QuantityStepper } from '@/components/cart/QuantityStepper';
import { isDiscounted, optionAdjustment, productAlt, unitPriceOf } from '@/lib/catalog';
import type { Product } from '@/types';
import { useDict } from '@/lib/dictionary-context';
import { fill } from '@/lib/format';

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
  const t = useDict().product;
  const { add, bump, qtyOf, isSaved, toggleSaved, ready } = useCart();
  const saved = isSaved(product.id);

  /* Same backend-driven defaults the product page starts on — at most one
     size/colour per product is flagged `is_default`. Using them here too
     keeps the grid's price and photo in agreement with what "Add" actually
     puts in the cart. */
  const defaultSize = product.sizes.find((s) => s.is_default) ?? null;
  const defaultColor = product.colors.find((c) => c.is_default) ?? null;
  const unitPrice = unitPriceOf(product, defaultSize, defaultColor);
  const wasPrice = product.price + optionAdjustment(defaultSize, defaultColor);
  const image = defaultColor ? (defaultColor.image_url ?? product.image_url) : product.image_url;

  const qty = ready ? qtyOf(product.id, defaultSize?.id, defaultColor?.id) : 0;
  const href = `/product/${product.slug}`;

  const plate = (
    <Link href={href} aria-label={product.name} style={{ display: 'block' }}>
      <Plate
        src={image}
        alt={productAlt(product)}
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
              title={t.save}
              aria-label={fill(saved ? t.unsaveAria : t.saveAria, { name: product.name })}
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
          {isDiscounted(product) && <span className="price-was">{uah(wasPrice)}</span>}
          <span className={isDiscounted(product) ? 'price-now' : undefined}>
            {uah(unitPrice)}
          </span>
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
              onDecrease={() => bump(product.id, -1, defaultSize?.id, defaultColor?.id)}
              onIncrease={() => bump(product.id, 1, defaultSize?.id, defaultColor?.id)}
            />
          </div>
        ) : (
          <Button
            cta="sm"
            style={{ marginTop: spec.buttonGap, width: '100%', padding: spec.buttonPad }}
            onClick={() => add(product, defaultSize, defaultColor)}
          >
            {t.addToCart}
          </Button>
        ))}

      {spec.action === 'move' && (
        <>
          <Button
            cta="sm"
            style={{ marginTop: 12, padding: '10px 0' }}
            onClick={() => add(product, defaultSize, defaultColor)}
          >
            {t.moveToCart}
          </Button>
          <Button
            variant="ghost"
            cta="sm"
            style={{ marginTop: 8, padding: '9px 0', fontSize: 11 }}
            onClick={() => toggleSaved(product.id)}
          >
            {t.removeSaved}
          </Button>
        </>
      )}
    </div>
  );
}
