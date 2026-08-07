'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
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
        Написати нам
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input className="input" placeholder="Ваше імʼя" aria-label="Ваше імʼя" />
        <input
          className="input"
          type="email"
          placeholder="Ел. пошта"
          aria-label="Ел. пошта"
          required
        />
        <input
          className="input"
          placeholder="Номер замовлення (якщо є)"
          aria-label="Номер замовлення"
        />
        <textarea
          className="input"
          placeholder="Чим ми можемо допомогти?"
          aria-label="Повідомлення"
          rows={5}
        />
      </div>

      <Button
        type="submit"
        block
        cta
        style={{ marginTop: 18, padding: '13px 0' }}
      >
        Надіслати
      </Button>

      <div
        aria-live="polite"
        style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 10 }}
      >
        {sent
          ? 'Надіслано. Хтось із нас невдовзі відповість.'
          : 'Відповідає хтось із нас, зазвичай протягом години.'}
      </div>
    </form>
  );
}
