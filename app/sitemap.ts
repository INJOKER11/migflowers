import type { MetadataRoute } from 'next';
import { getBlogPosts, getSlugMap } from '@/lib/api';
import { LOCALES, RU_INDEXABLE, localeUrl, type Locale } from '@/lib/i18n';

/**
 * The public pages, by hand. Everything under `app/[lang]` that is *not* here
 * is deliberately absent: `/cart`, `/account`, `/login`, `/subscription`,
 * `/gift-cards` and `/corporate` are retired routes that answer `notFound()`,
 * and `/checkout`, `/checkout/<order>`, `/checkout/confirmed` and `/wishlist`
 * are steps in a purchase, not destinations from a search result.
 *
 * The catalogue URLs below come from the API, so the sitemap is only ever as
 * clean as the catalogue is: placeholder products and categories in the
 * backend end up here, and on `/shop`, and in Google.
 */
const STATIC_PATHS: { path: string; priority: number; changeFrequency: Frequency }[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
  { path: '/delivery', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/reviews', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/legal/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/legal/terms', priority: 0.2, changeFrequency: 'yearly' },
];

type Frequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

/** Locales whose URLs belong in the sitemap. Follows `RU_INDEXABLE` — listing
    `noindex` pages here only earns a Search Console warning. */
const indexable: Locale[] = RU_INDEXABLE ? [...LOCALES] : ['uk'];

function entries(
  path: string,
  priority: number,
  changeFrequency: Frequency,
  lastModified?: Date,
  locales: Locale[] = indexable,
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: localeUrl(locale, path),
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
  }));
}

/* The sitemap is generated at build time. A backend hiccup should cost us the
   catalogue URLs, not the whole build — the static pages still ship. */
async function safely<T>(load: () => Promise<T[]>): Promise<T[]> {
  try {
    return await load();
  } catch {
    return [];
  }
}

/* Products, categories and posts carry a slug per locale (`buket-khmarynka`
   / `buket-oblachko`), so each locale lists its own — the other language's
   slug under its prefix would be a redirect, not a page. `getSlugMap` pages
   through the whole list; the default page of 20 used to drop the rest. */
async function catalogue(locale: Locale): Promise<MetadataRoute.Sitemap> {
  const [categories, products, posts] = await Promise.all([
    safely(async () => [...(await getSlugMap('categories', locale)).values()]),
    safely(async () => [...(await getSlugMap('products', locale)).values()]),
    safely(() => getBlogPosts(locale)),
  ]);
  const only = [locale];

  return [
    ...categories.flatMap((slug) => entries(`/category/${slug}`, 0.7, 'weekly', undefined, only)),
    ...products.flatMap((slug) => entries(`/product/${slug}`, 0.8, 'weekly', undefined, only)),
    ...posts.flatMap((post) =>
      entries(`/blog/${post.slug}`, 0.4, 'monthly', new Date(post.created_at), only),
    ),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perLocale = await Promise.all(indexable.map(catalogue));

  return [
    ...STATIC_PATHS.flatMap((page) => entries(page.path, page.priority, page.changeFrequency)),
    ...perLocale.flat(),
  ];
}
