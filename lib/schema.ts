import type { Faq, Product } from '@/types';
import { unitPriceOf } from './catalog';
import { FREE_DELIVERY_THRESHOLD } from './constants';
import { SHOP_DETAILS, shopLocation } from './content';
import { SITE_URL, localeUrl, type Locale } from './i18n';
import { SHARE_CARD } from './seo';
import type { Crumb } from '@/components/ui/Breadcrumb';

/**
 * Structured data. Everything here is built from facts already in the repo —
 * `SHOP_DETAILS` for the shop, the API's own fields for a product. Nothing is
 * invented: a florist's rich result that claims hours or a rating it does not
 * have is a manual-action risk, not a ranking win.
 */

/** The catalogue's real span, confirmed by the owner: single stems from 60 ₴,
    the largest bouquets around 2 000 ₴. Revisit if the catalogue moves. */
const PRICE_RANGE: string | null = '60–2000 ₴';

/* One shop, two spellings of the city it stands in — the block is emitted on
   both locales' pages. */
const CITY: Record<Locale, { locality: string; region: string }> = {
  uk: { locality: 'Одеса', region: 'Одеська область' },
  ru: { locality: 'Одесса', region: 'Одесская область' },
};

/** `Florist` is the schema.org type for a flower shop. (`FloristsShop` is a
    Google Business Profile category — it is not part of the vocabulary.) */
export function floristSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    '@id': `${SITE_URL}/#florist`,
    name: 'MIG Flowers',
    url: SITE_URL,
    /* `image` is what Google shows beside the result, so it gets the shop's
       photograph; the round mark goes in `logo`. */
    image: SHARE_CARD.url,
    logo: `${SITE_URL}/logo.png`,
    telephone: SHOP_DETAILS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: shopLocation(locale).addressShort,
      addressLocality: CITY[locale].locality,
      addressRegion: CITY[locale].region,
      addressCountry: 'UA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: SHOP_DETAILS.lat, longitude: SHOP_DETAILS.lng },
    hasMap: SHOP_DETAILS.mapsUrl,
    areaServed: { '@type': 'City', name: CITY[locale].locality },
    currenciesAccepted: 'UAH',
    /* The shop keeps the same window every day, so one specification covers
       the week. */
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '20:00',
    },
    sameAs: ['https://www.instagram.com/migflowers__/'],
    ...(PRICE_RANGE ? { priceRange: PRICE_RANGE } : null),
  };
}

/**
 * `deliveryFee` is the dearest priced district — the most a customer can pay
 * to have this bouquet brought, and what Merchant Center's shipping settings
 * quote — or `null` when the districts could not be loaded, in which case the
 * offer says nothing about shipping rather than guess.
 */
export function productSchema(product: Product, locale: Locale, deliveryFee: number | null) {
  /* `is_available` alone: the backend dropped its `stock` column, so `stock`
     arrives as null, and reading it marked every bouquet OutOfStock. */
  const inStock = product.is_available;
  /* The price the page shows on load — with the size and colour preselected
     as default, the discount only when it is a real one. Google compares this
     with the visible price and with the Merchant Center feed, which the
     backend builds by the same rule; the bare `price` disagreed with both
     wherever a default size carries a surcharge. */
  const price = unitPriceOf(
    product,
    product.sizes.find((s) => s.is_default) ?? null,
    product.colors.find((c) => c.is_default) ?? null,
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'MIG Flowers' },
    ...(product.image_url ? { image: product.image_url } : null),
    /* No `category`: Google reads it as a product-taxonomy value and
       reported the shop's own names («Букети», «Троянди») as invalid. The
       taxonomy id goes in the Merchant Center feed instead. */
    offers: {
      '@type': 'Offer',
      url: localeUrl(locale, `/product/${product.slug}`),
      price,
      priceCurrency: 'UAH',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#florist` },
      ...(deliveryFee !== null
        ? {
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: price >= FREE_DELIVERY_THRESHOLD ? 0 : deliveryFee,
                currency: 'UAH',
              },
              shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'UA' },
              /* Same day when the flowers are in, otherwise the next. */
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 0,
                  unitCode: 'DAY',
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 1,
                  unitCode: 'DAY',
                },
              },
            },
          }
        : null),
      /* /legal/returns: flowers of proper quality are not taken back — they
         are perishable. A bouquet that arrives wilted or damaged is replaced
         or refunded, which is a quality claim, not a return. */
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'UA',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        merchantReturnLink: localeUrl(locale, '/legal/returns'),
      },
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

/** Questions shown on the page, as asked and answered there. Google keeps the
    FAQ rich result for government and health sites, so this earns no snippet;
    it is here because it states plainly which text answers which question. */
export function faqSchema(items: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
