import type { Metadata } from 'next';
import { localeOf, pageMetadata } from '@/lib/seo';
import { getDictionary } from '@/lib/dictionaries';
import { SHOP_DETAILS } from '@/lib/content';
import { fill } from '@/lib/format';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CheckoutForm } from '@/components/cart/CheckoutForm';

/* A step in a purchase, not a destination from a search result: crawlable so
   the links out of it still count, never indexed. */
export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = await localeOf(props.params);

  return pageMetadata({
    locale,
    path: '/checkout',
    title: getDictionary(locale).checkout.metaTitle,
    noindex: true,
  });
}

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const dict = getDictionary(locale);
  const t = dict.checkout;

  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb
        locale={locale}
        trail={[{ label: dict.nav.home, href: '/' }, { label: t.crumb }]}
      />
      <h1 style={{ fontSize: 44, margin: '0 0 8px' }}>{t.h1}</h1>
      <div>
        <p style={{ margin: 0, fontSize: 14.5, color: 'var(--color-neutral-600)' }}>
          {t.noteGuest}
        </p>
        <p style={{ margin: 0, fontSize: 14.5, color: 'var(--color-neutral-600)' }}>
          {t.noteContact}
        </p>
        <p style={{ margin: '0 0 34px', fontSize: 14.5, color: 'var(--color-neutral-600)' }}>
          {fill(t.noteLarge, { phone: SHOP_DETAILS.phone })}
        </p>
      </div>
      <CheckoutForm />
    </Section>
  );
}
