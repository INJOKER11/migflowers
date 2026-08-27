import type { Metadata } from 'next';
import { getDictionary, type Dictionary } from './dictionaries';
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALES,
  RU_INDEXABLE,
  isLocale,
  localeUrl,
  type Locale,
} from './i18n';

/**
 * Every page's metadata goes through here, so the three things that have to be
 * consistent across the site stay in one place: the canonical URL, the hreflang
 * pair, and whether the page is indexable at all.
 *
 * The canonical is always the clean path. `/shop` reads `category`, `maxPrice`
 * and `sort` out of `searchParams`, which multiplies into hundreds of URLs that
 * are all the same page — they must all point back at the bare one.
 */
interface PageSeo {
  locale: Locale;
  /** The bare app path, without a locale prefix: `/shop`, `/product/x`, `/`. */
  path: string;
  title: string;
  description?: string;
  /** Pages that are useful to a customer but pointless in a search result —
      checkout, saved items. Crawlable, never indexed. */
  noindex?: boolean;
}

/**
 * hreflang has to be reciprocal: uk points at ru and ru points back at uk, or
 * Google treats one as a duplicate of the other instead of an alternative.
 * While the Russian side is untranslated we emit no alternates at all, which
 * is the honest signal — an hreflang pointing at a `noindex` page is a
 * contradiction Search Console reports as an error.
 */
function languageAlternates(path: string): Record<string, string> | undefined {
  if (!RU_INDEXABLE) return undefined;

  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[HTML_LANG[locale]] = localeUrl(locale, path);
  /* Ukrainian is x-default: it is the language of the market the shop
     physically serves, and the one on the bare URLs. */
  languages['x-default'] = localeUrl(DEFAULT_LOCALE, path);
  return languages;
}

export function pageMetadata({ locale, path, title, description, noindex }: PageSeo): Metadata {
  const hidden = noindex || (locale === 'ru' && !RU_INDEXABLE);

  return {
    title,
    ...(description ? { description } : null),
    alternates: {
      canonical: localeUrl(locale, path),
      languages: languageAlternates(path),
    },
    ...(hidden ? { robots: { index: false, follow: true } } : null),
    openGraph: {
      type: 'website',
      siteName: 'MIG Flowers',
      locale: HTML_LANG[locale].replace('-', '_'),
      url: localeUrl(locale, path),
      title,
      ...(description ? { description } : null),
    },
  };
}

/**
 * The one-liner the static pages use: read the locale out of the route params,
 * look the copy up, and build the metadata. `path` stays bare — `pageMetadata`
 * adds the locale prefix when it builds the URLs.
 */
export async function metadataFor(
  params: Promise<{ lang: string }>,
  path: string,
  key: keyof Dictionary['seo'],
): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return pageMetadata({ locale, path, ...getDictionary(locale).seo[key] });
}

/** The locale for a route's params, falling back rather than throwing — an
    unknown `lang` never reaches a page, `proxy.ts` sees to that. */
export async function localeOf(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}
