'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { CARE_TEXT, descriptionFor, productShots, variantPrice } from '@/lib/catalog';
import { Button } from '@/components/ui/Button';
import { Plate } from '@/components/ui/Plate';
import { Chip, ChipRow } from '@/components/ui/Chip';
import type { Product, VariantSize } from '@/types';

const SIZES: VariantSize[] = ['Мала', 'Стандарт', 'Велика'];
const TABS = [
  { key: 'desc', label: 'Опис' },
  { key: 'care', label: 'Догляд' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export function ProductDetail({ product }: { product: Product }) {
  const { add, isSaved, toggleSaved } = useCart();
  const [shot, setShot] = useState(0);
  /* 'Стандарт' is the quoted price. */
  const [variant, setVariant] = useState(1);
  const [tab, setTab] = useState<TabKey>('desc');

  const saved = isSaved(product.id);
  const large = productShots(product, 700);
  const thumbs = productShots(product, 400);

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
          src={large[shot]}
          alt={product.name}
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
          Наведіть на фото, щоб збільшити
        </div>

        <div className="thumbs" style={{ marginTop: 14 }}>
          {thumbs.map((src, i) => (
            <button
              key={src}
              type="button"
              className="thumb-btn"
              onClick={() => setShot(i)}
              aria-current={i === shot}
              aria-label={`Ракурс ${i + 1}`}
            >
              <Plate src={src} alt="Інший ракурс" sizes="140px" radius="0" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h1 style={{ fontSize: 42, margin: '0 0 8px', lineHeight: 1.1 }}>{product.name}</h1>
        <div style={{ fontSize: 14, color: 'var(--color-neutral-600)', fontStyle: 'italic' }}>
          {product.note}
        </div>
        <div
          className="tabular"
          style={{ fontFamily: 'var(--font-heading)', fontSize: 32, margin: '20px 0 0' }}
        >
          {uah(variantPrice(product.price, variant))}
        </div>

        <div className="kicker" style={{ margin: '26px 0 10px' }}>
          Розмір
        </div>
        <ChipRow>
          {SIZES.map((label, i) => (
            <Chip key={label} size="variant" active={i === variant} onClick={() => setVariant(i)}>
              {label}
            </Chip>
          ))}
        </ChipRow>

        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <Button
            cta
            style={{ flex: 1, minWidth: 180, padding: '14px 0' }}
            onClick={() => add(product)}
          >
            Додати в кошик
          </Button>
          <Button
            variant="ghost"
            cta
            aria-pressed={saved}
            style={{ padding: '14px 22px' }}
            onClick={() => toggleSaved(product.id)}
          >
            {saved ? 'Збережено ♥' : 'Зберегти'}
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
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls="tab-body"
              className="tab-btn"
              onClick={() => setTab(t.key)}
            >
              {t.label}
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
          {tab === 'desc' ? descriptionFor(product) : CARE_TEXT}
        </p>
      </div>
    </div>
  );
}
