import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PAYMENT_METHODS } from '@/lib/content';
import { FREE_DELIVERY_THRESHOLD, SAME_DAY_CUTOFF } from '@/lib/constants';
import { uah } from '@/lib/format';
import { getDistricts } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Доставка та оплата — MIG Flowers',
  description: 'Вартість за районом, доставка того ж дня і безкоштовна доставка від 2 500 ₴.',
};

export default async function DeliveryPage() {
  const districts = await getDistricts();
  return (
    <Section width={1000} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Доставка та оплата' }]} />
      <h1 style={{ fontSize: 46, margin: '0 0 16px' }}>Доставка та оплата</h1>
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
        Ми доставляємо по Одесі щодня, включно з неділями та святами. Замовлення до{' '}
        {SAME_DAY_CUTOFF} виїжджають того ж дня по обіді.
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Район</th>
            <th>Вартість</th>
            <th>Час</th>
          </tr>
        </thead>
        <tbody>
          {districts.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td className="tabular">
                {d.price_for_delivery ? uah(Number(d.price_for_delivery)) : 'Уточніть у менеджера'}
              </td>
              {/*<td>{d.time}</td>*/}
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ margin: '16px 0 0', fontSize: 13.5, color: 'var(--color-neutral-600)' }}>
        Доставка безкоштовна для замовлень понад {uah(FREE_DELIVERY_THRESHOLD)} — у будь-якій зоні.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
          gap: 32,
          marginTop: 56,
        }}
      >
        {PAYMENT_METHODS.map((method) => (
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
          Щось залишилося незрозумілим? <Link href="/faq">Прочитайте поширені питання</Link> або{' '}
          <Link href="/contact">напишіть нам</Link>.
        </p>
      </div>
    </Section>
  );
}
