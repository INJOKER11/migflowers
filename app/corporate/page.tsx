import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { EnquiryForm } from '@/components/corporate/EnquiryForm';
import { VOLUME_TIERS } from '@/lib/content';
import { photo } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Для бізнесу — MIG Flowers',
  description: 'Офіси, ресторани, весілля та великі обсяги. Кошторис того ж робочого дня.',
};

export default function CorporatePage() {
  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Для бізнесу' }]} />
      <h1
        style={{
          fontSize: 'clamp(38px, 4.6vw, 54px)',
          margin: '0 0 14px',
          maxWidth: '20ch',
          lineHeight: 1.08,
        }}
      >
        Офіси, ресторани, весілля та великі обсяги
      </h1>
      <p
        style={{
          margin: '0 0 40px',
          fontSize: 15.5,
          lineHeight: 1.8,
          color: 'var(--color-neutral-700)',
          maxWidth: '58ch',
          textAlign: 'justify',
        }}
      >
        Ми маємо постійні щотижневі замовлення для одинадцяти ресторанів і чотирьох готелів в Одесі
        та оформлюємо близько тридцяти весіль на рік. Скажіть масштаб — надішлемо кошторис того ж
        дня.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Обсяг</th>
                <th>Знижка</th>
                <th>Умови</th>
              </tr>
            </thead>
            <tbody>
              {VOLUME_TIERS.map((tier) => (
                <tr key={tier.volume}>
                  <td>{tier.volume}</td>
                  <td className={tier.discount.endsWith('%') ? 'tabular' : undefined}>
                    {tier.discount}
                  </td>
                  <td>{tier.terms}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Plate
            src={photo('centerpiece', 1000)}
            alt="Настільні композиції, підготовлені до події"
            ratio="3/2"
            sizes="(max-width: 1000px) 100vw, 500px"
            style={{ marginTop: 28 }}
          />
        </div>

        <EnquiryForm />
      </div>
    </Section>
  );
}
