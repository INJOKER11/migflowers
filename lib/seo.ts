import type { Metadata } from 'next';
import { getDictionary, type Dictionary } from './dictionaries';
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALES,
  RU_INDEXABLE,
  SITE_URL,
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
  /** The picture to show when the page is shared — a product's or a post's own
      photograph, absolute, straight from the API. Falls back to the shop's
      card when a page has none, or when the API has no photo for that record. */
  image?: string | null;
  /** The page's path in each locale, when they differ — products, categories
      and posts carry a slug per language. Omitted, every locale shares `path`.
      A locale missing from the map means the record doesn't exist there, and
      the page gets no hreflang pair at all rather than one pointing at a 404. */
  paths?: Partial<Record<Locale, string>>;
}

/**
 * The share card. Facebook, Telegram and Viber all read `og:image`, and a link
 * posted without one renders as a bare grey box — which is most of what gets
 * shared here, since people send bouquets to each other in messengers.
 *
 * 1200×630 is the size every platform crops from; `public/og.jpg` is cut to it
 * exactly, so nothing important is lost at the edges. It is a photograph with
 * no text: the platform draws the title and description next to it from the
 * tags below, in whichever language the page is.
 */
export const SHARE_CARD = {
  url: `${SITE_URL}/og.jpg`,
  width: 1200,
  height: 630,
  alt: 'MIG Flowers',
};

/**
 * hreflang has to be reciprocal: uk points at ru and ru points back at uk, or
 * Google treats one as a duplicate of the other instead of an alternative.
 * While the Russian side is untranslated we emit no alternates at all, which
 * is the honest signal — an hreflang pointing at a `noindex` page is a
 * contradiction Search Console reports as an error.
 */
function languageAlternates(paths: Partial<Record<Locale, string>>): Record<string, string> | undefined {
  if (!RU_INDEXABLE || LOCALES.some((locale) => !paths[locale])) return undefined;

  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[HTML_LANG[locale]] = localeUrl(locale, paths[locale]!);
  /* Ukrainian is x-default: it is the language of the market the shop
     physically serves, and the one on the bare URLs. */
  languages['x-default'] = localeUrl(DEFAULT_LOCALE, paths[DEFAULT_LOCALE]!);
  return languages;
}

/** `og:locale:alternate` says "this page also exists in that language". Like
    the hreflang pair it stays quiet while the Russian side is `noindex` —
    advertising a version we are asking Google to ignore says two things at
    once. */
function alternateLocales(locale: Locale, paired: boolean): string[] | undefined {
  if (!paired) return undefined;
  return LOCALES.filter((other) => other !== locale).map((other) =>
    HTML_LANG[other].replace('-', '_'),
  );
}

/** `{ uk: 'buket-khmarynka', ru: 'buket-oblachko' }` → the `paths` a
    per-locale-slug page hands to `pageMetadata`. */
export function slugPaths(
  base: string,
  slugs: Partial<Record<Locale, string>>,
): Partial<Record<Locale, string>> {
  const paths: Partial<Record<Locale, string>> = {};
  for (const locale of LOCALES) {
    const slug = slugs[locale];
    if (slug) paths[locale] = `${base}/${slug}`;
  }
  return paths;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex,
  image,
  paths,
}: PageSeo): Metadata {
  const languages = languageAlternates(
    paths ?? Object.fromEntries(LOCALES.map((l) => [l, path])),
  );
  const hidden = noindex || (locale === 'ru' && !RU_INDEXABLE);
  const images = [image ? { url: image, alt: title } : SHARE_CARD];

  return {
    title,
    ...(description ? { description } : null),
    alternates: {
      canonical: localeUrl(locale, path),
      languages,
    },
    ...(hidden ? { robots: { index: false, follow: true } } : null),
    openGraph: {
      type: 'website',
      siteName: 'MIG Flowers',
      locale: HTML_LANG[locale].replace('-', '_'),
      alternateLocale: alternateLocales(locale, languages !== undefined),
      url: localeUrl(locale, path),
      title,
      ...(description ? { description } : null),
      images,
    },
    /* Twitter falls back to the Open Graph tags on its own, but only for the
       small card. The large one has to be asked for. */
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description ? { description } : null),
      images,
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
