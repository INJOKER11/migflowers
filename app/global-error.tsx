'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SHOP_DETAILS } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, localePath, type Locale } from '@/lib/i18n';
import './globals.css';

/**
 * The last resort, for a failure in `app/[lang]/layout.tsx` itself — anything
 * below the layout is caught by `app/[lang]/error.tsx` instead. It replaces
 * the whole document, so there is no dictionary provider, no header and no
 * fonts; the locale comes off the URL and the stylesheet is imported here.
 *
 * The shop link is a plain `<a>`: after a layout crash a full page load is the
 * recovery we want, not a client-side navigation into the same broken tree.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const pathname = usePathname() ?? '/';
  const locale: Locale =
    LOCALES.find(
      (l) => l !== DEFAULT_LOCALE && (pathname === `/${l}` || pathname.startsWith(`/${l}/`)),
    ) ?? DEFAULT_LOCALE;
  const t = getDictionary(locale).error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={HTML_LANG[locale]}>
      <body>
        <title>{`${t.title} — MIG Flowers`}</title>
        <main
          style={{
            maxWidth: 760,
            margin: '0 auto',
            padding: '90px 16px 130px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: 40, margin: '0 0 14px' }}>{t.title}</h1>
          <p style={{ margin: '0 auto', fontSize: 15.5, lineHeight: 1.8, maxWidth: '46ch' }}>
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
            <button type="button" className="btn btn-primary btn-cta" onClick={() => retry()}>
              {t.retry}
            </button>
            <a className="btn btn-ghost btn-cta" href={localePath(locale, '/shop')}>
              {t.shop}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
