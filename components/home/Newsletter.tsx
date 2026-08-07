'use client';

import { useState } from 'react';
import { PROMO_CODE } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

export function Newsletter() {
  const [sent, setSent] = useState(false);

  return (
    <section style={{ borderTop: '1px solid var(--color-divider)' }}>
      <div
        className="band-inner"
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '70px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ fontSize: 36, margin: '0 0 12px' }}>
            Десять відсотків знижки на перший букет
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.75,
              color: 'var(--color-neutral-700)',
              maxWidth: '46ch',
              textAlign: 'justify',
            }}
          >
            Один лист на місяць: що зараз у сезоні, що надіслали садівники, і час від часу — як
            продовжити життя зрізаним квітам.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              className="input"
              type="email"
              required
              placeholder="your@email.com"
              aria-label="Ел. пошта"
              style={{ flex: 1, minWidth: 220 }}
            />
            <Button
              type="submit"
              cta
              style={{ padding: '0 26px' }}
            >
              Отримати код
            </Button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-neutral-600)' }} aria-live="polite">
            {sent
              ? `Дякуємо — код ${PROMO_CODE} уже в дорозі.`
              : 'Один лист на місяць. Відписка в один клік.'}
          </div>
        </form>
      </div>
    </section>
  );
}
