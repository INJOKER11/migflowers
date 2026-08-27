'use client';

/* Plain `next/link`, not `components/ui/Link` — this is the one place that
   deliberately leaves the current locale, so each href is built in full here
   and must not be prefixed again. */
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { HTML_LANG, LOCALES, LOCALE_NAME, LOCALE_SHORT, localePath, stripLocale } from '@/lib/i18n';
import { useLocale } from '@/lib/use-locale';

/**
 * A segmented control in the header, beside the cart.
 *
 * Both languages are on screen at once: the one you are reading is filled and
 * inert, the other is a real link to the *same page* in that language. That
 * shape is doing three jobs — it says which language you are in without you
 * having to read the page, it says what the alternative is before you commit,
 * and it keeps each locale on its own crawlable URL. A single label that swaps
 * itself would fail all three.
 */
export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname();
  const current = useLocale();
  const here = stripLocale(pathname);

  return (
    <div className="lang-switch" role="group" aria-label={label}>
      {LOCALES.map((locale) =>
        locale === current ? (
          <span key={locale} className="lang-seg" aria-current="true">
            {LOCALE_SHORT[locale]}
          </span>
        ) : (
          <NextLink
            key={locale}
            href={localePath(locale, here)}
            className="lang-seg"
            hrefLang={HTML_LANG[locale]}
            lang={HTML_LANG[locale]}
            title={LOCALE_NAME[locale]}
          >
            {LOCALE_SHORT[locale]}
          </NextLink>
        ),
      )}
    </div>
  );
}
