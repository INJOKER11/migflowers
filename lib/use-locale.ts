'use client';

import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, LOCALES, localePath, type Locale } from './i18n';

/**
 * The locale a client component is currently rendering in, read off the URL.
 *
 * The address bar is the source of truth: `/ru/shop` is Russian, everything
 * else is Ukrainian. The proxy's internal rewrite of `/shop` onto `/uk/shop`
 * never reaches the client, so `usePathname` reports the canonical form.
 */
export function useLocale(): Locale {
  const pathname = usePathname();
  return (
    LOCALES.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) ??
    DEFAULT_LOCALE
  );
}

/** For `router.push` and anywhere else a bare path has to become a real URL. */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return (path) => localePath(locale, path);
}
