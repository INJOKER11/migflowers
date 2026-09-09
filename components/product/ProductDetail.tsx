'use client';

import { useState, type CSSProperties } from 'react';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import {
  careText,
  descriptionFor,
  isDiscounted,
  optionAdjustment,
  productAlt,
  productShots,
  unitPriceOf,
} from '@/lib/catalog';
import { useDict } from '@/lib/dictionary-context';
import { useLocale } from '@/lib/use-locale';
import { fill } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Plate } from '@/components/ui/Plate';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { QuantityStepper } from '@/components/cart/QuantityStepper';
import type { Product, ProductColor, ProductSize } from '@/types';

const TAB_KEYS = ['desc'] as const; // 'care' is behind the commented-out tab.

type TabKey = (typeof TAB_KEYS)[number];

export function ProductDetail({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useDict().product;
  const { add, bump, qtyOf, isSaved, toggleSaved, ready } = useCart();
  const [shot, setShot] = useState(0);
  const [tab, setTab] = useState<TabKey>('desc');
  /* Hover/focus preview only — colours with no photo never set this, so
     hovering them is a no-op and the main plate just keeps showing the base
     image below. */
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const defaultColor = product.colors.find((c) => c.is_default) ?? null;

  /* Backend-driven: at most one size/colour per product is flagged
     `is_default`, and picking either is optional either way — if none is
     flagged, neither starts selected. */
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    () => product.sizes.find((s) => s.is_default) ?? null,
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(() => defaultColor);

  /* Pure client-side reset, back to the same state the page opened in — no
     API call, and clears the hover preview too so a lingering swatch hover
     can't keep the old photo on screen after the click. */
  const resetColor = () => {
    setSelectedColor(defaultColor);
    setPreviewImage(null);
  };

  const saved = isSaved(product.id);
  /* Held back until `ready` so the first client render still matches the server. */
  const qty = ready ? qtyOf(product.id, selectedSize?.id, selectedColor?.id) : 0;
  const large = productShots(product);
  /* The selected colour's own photo outranks the shot gallery — picking a
     colour is a stronger signal of "what am I looking at" than whichever
     angle `shot` happens to be on. No colour selected falls back to the
     gallery (today, always the product's own `image_url`, index 0). */
  const baseImage = selectedColor
    ? (selectedColor.image_url ?? product.image_url)
    : (large?.[shot] ?? null);
  const unitPrice = unitPriceOf(product, selectedSize, selectedColor);
  const wasPrice = product.price + optionAdjustment(selectedSize, selectedColor);
  /* Against `wasPrice`/`unitPrice`, not the base product price — a flat
     size/colour surcharge dilutes the percentage a discount actually is, and
     the badge sits right next to these two figures, so it has to agree with
     them rather than with numbers the page isn't showing. Guarded on
     `wasPrice > 0` and `unitPrice < wasPrice`: a size surcharge can be
     negative (see `ProductSize.price_adjustment`), and a "sale" badge showing
     a nonsense or negative percentage off a zero-or-negative reference price
     is worse than showing none. */
  const discount =
    isDiscounted(product) && wasPrice > 0 && unitPrice < wasPrice
      ? Math.round((1 - unitPrice / wasPrice) * 100)
      : null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: 56,
        alignItems: 'start',
      }}
    >
      <div>
        <Plate
          src={previewImage ?? baseImage}
          alt={productAlt(product)}
          sizes="(max-width: 1000px) 100vw, 560px"
          priority
          zoom={1.35}
          zoomTime="0.8s"
        />
        <div
          style={{
            fontSize: 11.5,
            color: 'var(--color-neutral-600)',
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          {t.zoomHint}
        </div>

        {/* todo: support multiple images on backend */}
        {/*<div className="thumbs" style={{ marginTop: 14 }}>*/}
        {/*  {thumbs.map((src, i) => (*/}
        {/*    <button*/}
        {/*      key={src}*/}
        {/*      type="button"*/}
        {/*      className="thumb-btn"*/}
        {/*      onClick={() => setShot(i)}*/}
        {/*      aria-current={i === shot}*/}
        {/*      aria-label={`Ракурс ${i + 1}`}*/}
        {/*    >*/}
        {/*      <Plate src={src} alt="Інший ракурс" sizes="140px" radius="0" />*/}
        {/*    </button>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </div>

      <div>
        <h1 style={{ fontSize: 42, margin: '0 0 8px', lineHeight: 1.1 }}>{product.name}</h1>
        {/*<div style={{ fontSize: 14, color: 'var(--color-neutral-600)', fontStyle: 'italic' }}>*/}
        {/*  {product.description}*/}
        {/*</div>*/}

        {product.sizes.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="kicker" style={{ marginBottom: 10 }}>
              {t.sizeLabel}
            </div>
            <ChipRow>
              {product.sizes.map((size) => (
                <Chip
                  key={size.id}
                  size="variant"
                  active={selectedSize?.id === size.id}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.name}
                </Chip>
              ))}
            </ChipRow>
          </div>
        )}

        {product.colors.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div
              className="kicker"
              style={{
                marginBottom: 10,
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
              }}
            >
              <span>{t.colorLabel}</span>
              {selectedColor && selectedColor.id !== defaultColor?.id && (
                <button
                  type="button"
                  onClick={resetColor}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                    fontSize: 11.5,
                    textTransform: 'none',
                    letterSpacing: 0,
                    color: 'var(--color-neutral-600)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {t.resetColor}
                </button>
              )}
            </div>
            <ChipRow>
              {product.colors.map((color) =>
                color.image_url ? (
                  <button
                    key={color.id}
                    type="button"
                    className="swatch"
                    aria-pressed={selectedColor?.id === color.id}
                    aria-label={color.name}
                    title={color.name}
                    onClick={() => setSelectedColor(color)}
                    onMouseEnter={() => setPreviewImage(color.image_url)}
                    onMouseLeave={() => setPreviewImage(null)}
                    onFocus={() => setPreviewImage(color.image_url)}
                    onBlur={() => setPreviewImage(null)}
                  >
                    <Plate src={color.image_url} alt={color.name} sizes="56px" />
                    <span className="swatch-label">{color.name}</span>
                  </button>
                ) : (
                  <Chip
                    key={color.id}
                    size="variant"
                    active={selectedColor?.id === color.id}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color.name}
                  </Chip>
                ),
              )}
            </ChipRow>
          </div>
        )}

        <div
          className="tabular"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 32,
            margin: '20px 0 0',
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {isDiscounted(product) && (
            /* Struck through at the size the discounted figure is not, so the
               eye lands on what the bouquet costs today. */
            <span className="price-was" style={{ fontSize: 20 }}>
              {uah(wasPrice)}
            </span>
          )}
          <span className={isDiscounted(product) ? 'price-now' : undefined}>{uah(unitPrice)}</span>
          {discount !== null && <span className="tag tag-sale">−{discount}%</span>}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          {qty > 0 ? (
            /* Same flex-basis as the button it replaces, so it takes the exact
               same width and the "Зберегти" button next to it doesn't shift. */
            <div style={{ flex: 1, minWidth: 180, '--stepper-h': '44px' } as CSSProperties}>
              <QuantityStepper
                block
                qty={qty}
                label={product.name}
                onDecrease={() => bump(product.id, -1, selectedSize?.id, selectedColor?.id)}
                onIncrease={() => bump(product.id, 1, selectedSize?.id, selectedColor?.id)}
              />
            </div>
          ) : (
            <Button
              cta
              style={{ flex: 1, minWidth: 180, padding: '14px 0' }}
              onClick={() => add(product, selectedSize, selectedColor)}
            >
              {t.addToCart}
            </Button>
          )}
          <Button
            variant="ghost"
            cta
            aria-pressed={saved}
            /* Fixed to the width "Збережено ♥" needs, so toggling the label
               doesn't resize the button and shove it sideways. */
            style={{ padding: '14px 22px', width: 144 }}
            onClick={() => toggleSaved(product.id)}
          >
            {saved ? t.saved : t.save}
          </Button>
        </div>

        <div
          role="tablist"
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 32,
            paddingTop: 20,
            borderTop: '1px solid var(--color-divider)',
          }}
        >
          {TAB_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={tab === key}
              aria-controls="tab-body"
              className="tab-btn"
              onClick={() => setTab(key)}
            >
              {key === 'desc' ? t.tabDescription : t.tabCare}
            </button>
          ))}
        </div>

        <p
          id="tab-body"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          style={{
            margin: '20px 0 0',
            fontSize: 15,
            lineHeight: 1.85,
            color: 'var(--color-neutral-700)',
            textAlign: 'justify',
          }}
        >
          {/*{tab === 'desc' ? descriptionFor(product, locale) : careText(locale)}*/}
          {product.description}
        </p>
      </div>
    </div>
  );
}
