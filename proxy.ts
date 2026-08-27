import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n';

/**
 * Ukrainian is served from the bare paths and Russian from `/ru/...`, but every
 * route file lives under `app/[lang]`. This bridges the two:
 *
 *   /shop      → rewrite  → /uk/shop   (URL stays `/shop`)
 *   /ru/shop   → through              (already prefixed)
 *   /uk/shop   → redirect → /shop      (one canonical form per page)
 *
 * The redirect matters as much as the rewrite: without it `/uk/shop` and
 * `/shop` would both render, and Google would find the duplicate.
 *
 * We deliberately do not look at `Accept-Language`. Redirecting by header sends
 * Googlebot (which crawls as `en`) somewhere different from what a user sees,
 * and it makes the entry URL unpredictable. The switcher in the header is the
 * way to change language.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefixed = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (prefixed === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || '/';
    return NextResponse.redirect(url, 308);
  }

  if (prefixed) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /* Everything except Next's own assets and the files that must stay at the
     root of the domain — robots.txt, the sitemap and the icons. */
  matcher: ['/((?!_next/|api/|.*\.(?:png|jpg|jpeg|svg|ico|webp|txt|xml|json|woff2?)$).*)'],
};
