'use client';

import { useState, type FormEvent } from 'react';
import { createFirstOrderPromoCode, ValidationError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { useDict } from '@/lib/dictionary-context';
import { useLocale } from '@/lib/use-locale';
import { fill } from '@/lib/format';

export function Newsletter() {
  const locale = useLocale();
  const t = useDict().home;

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim();

    setError(null);
    setSending(true);
    try {
      const promo = await createFirstOrderPromoCode(email, locale);
      setSent(promo.code);
    } catch (err) {
      setError(err instanceof ValidationError ? (err.fields.email?.[0] ?? t.newsFailed) : t.newsFailed);
    } finally {
      setSending(false);
    }
  };

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
          <h2 style={{ fontSize: 36, margin: '0 0 12px' }}>{t.newsTitle}</h2>
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
            {t.newsBody}
          </p>
        </div>

        <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 12 }} noValidate>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              name="email"
              className={error ? 'input input-invalid' : 'input'}
              type="email"
              required
              placeholder="your@email.com"
              aria-label={t.newsEmailLabel}
              aria-invalid={error ? true : undefined}
              disabled={sending || sent !== null}
              style={{ flex: 1, minWidth: 220 }}
            />
            <Button type="submit" cta style={{ padding: '0 26px' }} disabled={sending || sent !== null}>
              {sending ? t.newsSending : t.newsCta}
            </Button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-neutral-600)' }} aria-live="polite">
            {sent ? fill(t.newsSent, { code: sent }) : (error ?? t.newsNote)}
          </div>
        </form>
      </div>
    </section>
  );
}
