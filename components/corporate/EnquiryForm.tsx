'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function EnquiryForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="card"
      style={{ padding: 26 }}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 18 }}>
        Запросити кошторис
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input className="input" placeholder="Компанія" aria-label="Компанія" />
        <input className="input" placeholder="Контактна особа" aria-label="Контактна особа" />
        <input
          className="input"
          type="email"
          placeholder="Ел. пошта"
          aria-label="Ел. пошта"
          required
        />
        <input
          className="input"
          placeholder="Приблизна кількість композицій"
          aria-label="Приблизна кількість композицій"
        />
        <input className="input" placeholder="Коли і як часто" aria-label="Коли і як часто" />
      </div>

      <Button
        type="submit"
        block
        cta
        style={{ marginTop: 18, padding: '13px 0' }}
      >
        Надіслати запит
      </Button>

      <div
        aria-live="polite"
        style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 10 }}
      >
        {sent
          ? 'Дякуємо — надішлемо кошторис того ж робочого дня.'
          : 'Відповідаємо того ж робочого дня.'}
      </div>
    </form>
  );
}
