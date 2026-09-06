import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ShopMap } from '@/components/contact/ShopMap';
import { ContactForm } from '@/components/contact/ContactForm';
import { SHOP_DETAILS, shopLocation } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return metadataFor(props.params, '/contact', 'contact');
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="kicker">{label}</div>
      <div style={{ fontSize: 16, marginTop: 5 }}>{children}</div>
    </div>
  );
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const dict = getDictionary(locale);
  const t = dict.contact;
  const shop = shopLocation(locale);

  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb
        locale={locale}
        trail={[{ label: dict.nav.home, href: '/' }, { label: t.crumb }]}
      />
      <h1 style={{ fontSize: 46, margin: '0 0 14px' }}>{t.h1}</h1>
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
        {t.intro}
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
            <Detail label={t.address}>{shop.address}</Detail>
            <Detail label={t.phone}>
              <a href={SHOP_DETAILS.phoneHref}>{SHOP_DETAILS.phone}</a>
            </Detail>
            <Detail label={t.hours}>{shop.hours}</Detail>
          </div>

          <ShopMap locale={locale} dict={t} />
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
