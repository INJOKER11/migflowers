'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { HTML_LANG, LOCALES, localePath, stripLocale } from '@/lib/i18n';
import { useLocale } from '@/lib/use-locale';

export function LanguageSwitcher({ label, switchTo }: { label: string; switchTo: string }) {
  const pathname = usePathname();
  const locale = useLocale();
  const other = LOCALES.find((candidate) => candidate !== locale) ?? locale;

  return (
    <NextLink
      href={localePath(other, stripLocale(pathname))}
      className="nav-link"
      hrefLang={HTML_LANG[other]}
      lang={HTML_LANG[other]}
      title={label}
    >
      {switchTo}
    </NextLink>
  );
}
