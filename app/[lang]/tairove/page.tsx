import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { ShopMap } from '@/components/contact/ShopMap';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getDistricts, getProducts } from '@/lib/api';
import { SHOP_DETAILS, shopLocation } from '@/lib/content';
import { FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import { getDictionary } from '@/lib/dictionaries';
import { fill, uah } from '@/lib/format';
import { faqSchema } from '@/lib/schema';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return metadataFor(props.params, '/tairove', 'tairove');
}

/* Tairove is in the Kyivskyi district; its fee comes from the API so the page
   never quotes a price the checkout would not charge. Looked up by id — the
   name is translated and could be edited in the admin. */
const KYIVSKYI_DISTRICT_ID = 1;

const POPULAR_COUNT = 6;

const PROSE = {
  margin: '0 0 16px',
  fontSize: 15.5,
  lineHeight: 1.8,
  color: 'var(--color-neutral-700)',
  maxWidth: '62ch',
} as const;

/**
 * The shop's own neighbourhood. People search «квіти Таїрове» / «цветы
 * Таирово» and the shop already ranks for it from the home page alone; this
 * gives that query a page that answers it — the address, pickup, the
 * district's delivery price — instead of a home page that mentions Tairove
 * once. Everything quoted comes from the same sources as the rest of the
 * site, so it cannot disagree with the contact or delivery page.
 */
export default async function TairovePage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const dict = getDictionary(locale);
  const t = dict.tairove;
  const shop = shopLocation(locale);

  /* Both degrade: without them the page still has its address, map and text. */
  const [districts, popular] = await Promise.all([
    getDistricts(locale).catch(() => []),
    getProducts({ locale, sort: 'popular', perPage: POPULAR_COUNT }).catch(() => []),
  ]);
  const fee = districts.find((d) => d.id === KYIVSKYI_DISTRICT_ID)?.price_for_delivery;

  const values = {
    hours: shop.hours.charAt(0).toLowerCase() + shop.hours.slice(1),
    phone: SHOP_DETAILS.phone,
    free: uah(FREE_DELIVERY_THRESHOLD),
    ...(fee ? { price: uah(Number(fee)) } : null),
  };
  const faq = t.faq
    .filter(({ a }) => fee || !a.includes('{price}'))
    .map(({ q, a }) => ({ q, a: fill(a, values) }));

  return (
    <Section width={1100} pt={44} pb={90}>
      <JsonLd data={faqSchema(faq)} />
      <Breadcrumb
        locale={locale}
        trail={[{ label: dict.nav.home, href: '/' }, { label: t.crumb }]}
      />
      <h1 style={{ fontSize: 46, margin: '0 0 14px' }}>{t.h1}</h1>
      <p style={{ ...PROSE, margin: '0 0 40px' }}>{t.intro}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <div>
          <SectionHeading size={28} marginBottom={16}>
            {t.pickupTitle}
          </SectionHeading>
          <p style={PROSE}>{fill(t.pickup, values)}</p>
          <p style={PROSE}>
            {shop.address}
            <br />
            <a href={SHOP_DETAILS.phoneHref}>{SHOP_DETAILS.phone}</a>
          </p>

          {fee && (
            <div style={{ marginTop: 36 }}>
              <SectionHeading size={28} marginBottom={16}>
                {t.deliveryTitle}
              </SectionHeading>
              <p style={PROSE}>{fill(t.delivery, values)}</p>
            </div>
          )}
        </div>

        <ShopMap locale={locale} dict={dict.contact} />
      </div>

      {popular.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <SectionHeading size={30}>{t.popularTitle}</SectionHeading>
          <ProductGrid products={popular} variant="category" />
        </div>
      )}

      <div style={{ marginTop: 64, maxWidth: 800 }}>
        <SectionHeading size={30} marginBottom={6}>
          {dict.category.faqTitle}
        </SectionHeading>
        <Accordion items={faq} />
      </div>
    </Section>
  );
}
