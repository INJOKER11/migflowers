/**
 * Two locales, two sets of URLs. Ukrainian keeps the bare paths it has always
 * had (`/shop`); Russian lives under a prefix (`/ru/shop`). Both are real,
 * separately-crawlable pages — there is no client-side language toggle, because
 * a toggle without a URL leaves Google with only one version to index.
 *
 * `proxy.ts` maps the bare paths onto the `[lang]` segment and redirects the
 * redundant `/uk/...` form back to the canonical bare one.
 */
export const LOCALES = ['uk', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'uk';

/** The canonical host. The apex and http both 308 here, so every absolute URL
    we emit — canonical, hreflang, sitemap, JSON-LD — has to use this exact
    origin or it points at a redirect. */
export const SITE_URL = 'https://www.migflowers.com';

/**
 * Whether `/ru` is offered to search engines. The interface is written in both
 * languages (`lib/dictionaries.ts`, `lib/content.ts`, `lib/faqs.ts`,
 * `lib/legal.ts`), and the API localizes names and slugs by `?lang=` — a
 * product is `buket-khmarynka` in Ukrainian and `buket-oblachko` in Russian,
 * which `pageMetadata`'s `paths` and the sitemap pair up by id. Some API
 * descriptions are still Ukrainian on the Russian side; that is the backend's
 * copy to translate, not a reason to hide the pages.
 *
 * It governs all three places that have to agree: the `noindex` on Russian
 * pages, the hreflang alternates, and the sitemap. Set it back to `false` and
 * all three withdraw together.
 */
export const RU_INDEXABLE = true;

/** BCP-47 tags for `<html lang>` and hreflang. `uk`/`ru` alone would be right
    too, but the regional form is what the Odesa audience actually searches in. */
export const HTML_LANG: Record<Locale, string> = {
  uk: 'uk-UA',
  ru: 'ru-UA',
};

/** Endonyms — a language is named in its own language, so the switch reads
    the same from either side and these need no dictionary entry. */
export const LOCALE_NAME: Record<Locale, string> = {
  uk: 'Українська',
  ru: 'Русский',
};

/** The short form the header switch is sized for. */
export const LOCALE_SHORT: Record<Locale, string> = {
  uk: 'Укр',
  ru: 'Рус',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** A bare app path (`/shop`, `/`) as it should appear for `locale`. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path;
  return locale === DEFAULT_LOCALE ? clean || '/' : `/${locale}${clean}`;
}

/** The same, absolute — for canonical, hreflang, sitemap and JSON-LD. */
export function localeUrl(locale: Locale, path: string): string {
  const p = localePath(locale, path);
  return p === '/' ? SITE_URL : `${SITE_URL}${p}`;
}

/** Strip the locale prefix off a pathname, giving the bare app path back.
    Used by the language switcher to find the current page in the other locale. */
export function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname || '/';
}
