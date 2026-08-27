import type { Product } from '@/types';
import { SHOP_DETAILS } from './content';
import { SITE_URL, localeUrl, type Locale } from './i18n';
import type { Crumb } from '@/components/ui/Breadcrumb';

/**
 * Structured data. Everything here is built from facts already in the repo —
 * `SHOP_DETAILS` for the shop, the API's own fields for a product. Nothing is
 * invented: a florist's rich result that claims hours or a rating it does not
 * have is a manual-action risk, not a ranking win.
 */

/** TODO — ask the owner. Google reads `priceRange` as a rough band ("₴₴"), and
    guessing it would be a claim about the business we cannot support. The
    catalogue is empty today, so it cannot be derived from real prices either. */
const PRICE_RANGE: string | null = null;

/** `Florist` is the schema.org type for a flower shop. (`FloristsShop` is a
    Google Business Profile category — it is not part of the vocabulary.) */
export function floristSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    '@id': `${SITE_URL}/#florist`,
    name: 'MIG Flowers',
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    telephone: SHOP_DETAILS.phone,
    email: SHOP_DETAILS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SHOP_DETAILS.addressShort,
      addressLocality: 'Одеса',
      addressRegion: 'Одеська область',
      addressCountry: 'UA',
    },
    areaServed: { '@type': 'City', name: 'Одеса' },
    /* `SHOP_DETAILS.hours` is "Щодня, 08:00 – 21:00" — the same window every
       day, so one specification covers the week. */
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '21:00',
    },
    sameAs: ['https://www.instagram.com/migflowers__/'],
    ...(PRICE_RANGE ? { priceRange: PRICE_RANGE } : null),
  };
}

export function productSchema(product: Product, locale: Locale) {
  const inStock = product.is_available && product.stock > 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(product.image_url ? { image: product.image_url } : null),
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      url: localeUrl(locale, `/product/${product.slug}`),
      price: product.discount_price ?? product.price,
      priceCurrency: 'UAH',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@id': `${SITE_URL}/#florist` },
    },
  };
}

export function breadcrumbSchema(trail: Crumb[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      /* The last crumb is the current page and carries no href — schema.org
         allows the final item to omit `item`. */
      ...(crumb.href ? { item: localeUrl(locale, crumb.href) } : null),
    })),
  };
}
