'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { GIFT_AMOUNTS, GIFT_DELIVERY } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Plate } from '@/components/ui/Plate';
import { photo } from '@/lib/images';

export function GiftCardBuilder() {
  const { openDrawer } = useCart();
  const [amount, setAmount] = useState(1000);
  const [delivery, setDelivery] = useState(0);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: 44,
        alignItems: 'start',
      }}
    >
      <div>
        <div className="kicker" style={{ marginBottom: 12 }}>
          Сума
        </div>
        <ChipRow>
          {GIFT_AMOUNTS.map((value) => (
            <Chip
              key={value}
              size="xl"
              active={value === amount}
              onClick={() => setAmount(value)}
              className="tabular"
            >
              {uah(value)}
            </Chip>
          ))}
        </ChipRow>

        <div className="kicker" style={{ margin: '28px 0 12px' }}>
          Доставка
        </div>
        <ChipRow>
          {GIFT_DELIVERY.map((label, i) => (
            <Chip key={label} size="xl" active={i === delivery} onClick={() => setDelivery(i)}>
              {label}
            </Chip>
          ))}
        </ChipRow>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
          <input
            className="input"
            placeholder="Ел. пошта отримувача"
            aria-label="Ел. пошта отримувача"
          />
          <input
            className="input"
            placeholder="Текст на сертифікаті"
            aria-label="Текст на сертифікаті"
          />
        </div>

        <Button
          block
          cta
          style={{ marginTop: 20, padding: '13px 0' }}
          onClick={openDrawer}
        >
          Додати сертифікат у кошик
        </Button>
      </div>

      {/* Live preview of the card the recipient gets. */}
      <div className="card elev-sm" style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
        <Plate
          src={photo('beige', 900)}
          alt="Фото подарункового сертифіката"
          ratio="8/5"
          sizes="(max-width: 1000px) 100vw, 480px"
          radius="0"
          style={{ border: 'none', outline: 'none' }}
        />
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 15,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
            }}
          >
            MIG Flowers
          </div>
          <div
            className="tabular"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 44, marginTop: 12 }}
          >
            {uah(amount)}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--color-neutral-600)', marginTop: 8 }}>
            {GIFT_DELIVERY[delivery]} · Без терміну дії
          </div>
        </div>
      </div>
    </div>
  );
}
