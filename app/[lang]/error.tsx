'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SHOP_DETAILS } from '@/lib/content';
import { useDict } from '@/lib/dictionary-context';

/**
 * What a visitor sees when a page throws — in practice, the API being slow or
 * down. It sits under `app/[lang]/layout.tsx`, so the header, footer and cart
 * survive and `useDict()` still answers in the page's language. A failure in
 * the layout itself falls through to `app/global-error.tsx`.
 *
 * `retry` re-fetches the segment on the server, which is what a transient
 * backend hiccup needs; `reset` would only re-render the same failed payload.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useDict().error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section width={760} pt={90} pb={130} style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: 40, margin: '0 0 14px' }}>{t.title}</h1>

      <p
        style={{
          margin: '0 auto',
          fontSize: 15.5,
          lineHeight: 1.8,
          color: 'var(--color-neutral-700)',
          maxWidth: '46ch',
        }}
      >
        {t.body}
      </p>

      <p style={{ marginTop: 18, fontSize: 18 }}>
        <a href={SHOP_DETAILS.phoneHref}>{SHOP_DETAILS.phone}</a>
      </p>

      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          marginTop: 28,
          flexWrap: 'wrap',
        }}
      >
        <Button cta onClick={() => retry()} style={{ padding: '13px 30px' }}>
          {t.retry}
        </Button>
        <Button href="/shop" variant="ghost" cta style={{ padding: '13px 26px' }}>
          {t.shop}
        </Button>
      </div>
    </Section>
  );
}
