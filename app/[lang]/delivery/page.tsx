import type { Metadata } from 'next';
import { Link } from '@/components/ui/Link';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { paymentMethods } from '@/lib/content';
import { FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import { fill, uah } from '@/lib/format';
import { getDictionary } from '@/lib/dictionaries';
import { getDistricts } from '@/lib/api';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return metadataFor(props.params, '/delivery', 'delivery');
}

export default async function DeliveryPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);

  const dict = getDictionary(locale);
  const t = dict.delivery;

  const districts = await getDistricts(locale);
  return (
    <Section width={1000} pt={44} pb={90}>
      <Breadcrumb
        locale={locale}
        trail={[{ label: dict.nav.home, href: '/' }, { label: t.crumb }]}
      />
      <h1 style={{ fontSize: 46, margin: '0 0 16px' }}>{t.h1}</h1>
      <p
        style={{
          margin: '0 0 40px',
          fontSize: 15.5,
          lineHeight: 1.8,
          color: 'var(--color-neutral-700)',
          maxWidth: '60ch',
          textAlign: 'justify',
        }}
      >
        {t.intro}
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>{t.colDistrict}</th>
            <th>{t.colPrice}</th>
            <th>{t.colTime}</th>
          </tr>
        </thead>
        <tbody>
          {districts.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td className="tabular">
                {d.price_for_delivery ? uah(Number(d.price_for_delivery)) : t.quote}
              </td>
              {/*<td>{d.time}</td>*/}
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ margin: '16px 0 0', fontSize: 13.5, color: 'var(--color-neutral-600)' }}>
        {fill(t.freeNote, { amount: uah(FREE_DELIVERY_THRESHOLD) })}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
          gap: 32,
          marginTop: 56,
        }}
      >
        {paymentMethods(locale).map((method) => (
          <div key={method.title}>
            <h3 style={{ fontSize: 22, margin: '0 0 8px' }}>{method.title}</h3>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.7,
                color: 'var(--color-neutral-700)',
              }}
            >
              {method.body}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--color-divider)' }}>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--color-neutral-700)' }}>
          {t.helpBefore} <Link href="/faq">{t.helpFaq}</Link> {t.helpOr}{' '}
          <Link href="/contact">{t.helpContact}</Link>.
        </p>
      </div>
    </Section>
  );
}
