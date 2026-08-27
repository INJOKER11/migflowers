import type { MetadataRoute } from 'next';
import { LOCALES, SITE_URL } from '@/lib/i18n';

/* Paths that exist for a customer mid-purchase and have nothing to offer a
   searcher. Crawling them is harmless; indexing them is noise. The retired
   routes (`/cart`, `/account`, `/login`, `/subscription`, `/gift-cards`) are
   not listed — they answer `notFound()`, so a 404 already tells crawlers more
   clearly than a Disallow would. */
const PRIVATE_PATHS = ['/checkout', '/wishlist'];

export default function robots(): MetadataRoute.Robots {
  const disallow = PRIVATE_PATHS.flatMap((path) =>
    LOCALES.map((locale) => (locale === 'uk' ? path : `/${locale}${path}`)),
  );

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
