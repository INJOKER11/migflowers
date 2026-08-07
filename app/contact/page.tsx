import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ShopMap } from '@/components/contact/ShopMap';
import { ContactForm } from '@/components/contact/ContactForm';
import { SHOP_DETAILS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Контакти — MIG Flowers',
  description: 'Зелені двері з північного боку площі Ринок. Щодня, 08:00 – 21:00.',
};

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="kicker">{label}</div>
      <div style={{ fontSize: 16, marginTop: 5 }}>{children}</div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Контакти' }]} />
      <h1 style={{ fontSize: 46, margin: '0 0 14px' }}>Приходьте до нас</h1>
      <p
        style={{
          margin: '0 0 40px',
          fontSize: 15.5,
          lineHeight: 1.8,
          color: 'var(--color-neutral-700)',
          maxWidth: '54ch',
          textAlign: 'justify',
        }}
      >
        Крамниця — зелені двері з північного боку площі Ринок, між аптекою і палітурнею. Майстерня —
        позаду, і ви можете заглянути.
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Detail label="Адреса">{SHOP_DETAILS.address}</Detail>
            <Detail label="Телефон">
              <a href={SHOP_DETAILS.phoneHref}>{SHOP_DETAILS.phone}</a>
            </Detail>
            <Detail label="Ел. пошта">
              <a href={`mailto:${SHOP_DETAILS.email}`}>{SHOP_DETAILS.email}</a>
            </Detail>
            <Detail label="Години роботи">{SHOP_DETAILS.hours}</Detail>
          </div>

          <ShopMap />
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
