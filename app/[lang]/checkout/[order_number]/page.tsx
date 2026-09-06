import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { OrderStatusView } from '@/components/cart/OrderStatusView';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, pageMetadata } from '@/lib/seo';

interface Params {
  params: Promise<{ lang: string; order_number: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { order_number } = await params;
  const locale = await localeOf(params);

  return pageMetadata({
    locale,
    path: `/checkout/${order_number}`,
    title: getDictionary(locale).orderStatus.metaTitle,
    noindex: true,
  });
}

export default async function OrderStatusPage({ params }: Params) {
  const { order_number } = await params;
  const locale = await localeOf(params);
  const dict = getDictionary(locale);

  return (
    <Section width={660} pt={44} pb={130}>
      <Breadcrumb
        locale={locale}
        trail={[
          { label: dict.nav.home, href: '/' },
          { label: dict.checkout.crumb, href: '/checkout' },
          { label: dict.orderStatus.crumb },
        ]}
      />
      <div style={{ textAlign: 'center', paddingTop: 46 }}>
        <OrderStatusView orderNumber={order_number} />
      </div>
    </Section>
  );
}
