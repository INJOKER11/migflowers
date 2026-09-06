import type { Metadata } from 'next';
import { Link } from '@/components/ui/Link';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Accordion } from '@/components/ui/Accordion';
import { getFaqs } from '@/lib/faqs';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return metadataFor(props.params, '/faq', 'faq');
}

export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const dict = getDictionary(locale);
  const t = dict.faq;

  return (
    <Section width={800} pt={44} pb={90}>
      <Breadcrumb
        locale={locale}
        trail={[{ label: dict.nav.home, href: '/' }, { label: t.crumb }]}
      />
      <h1 style={{ fontSize: 46, margin: '0 0 34px' }}>{t.h1}</h1>

      <Accordion items={getFaqs(locale)} />

      <p style={{ margin: '34px 0 0', fontSize: 15, color: 'var(--color-neutral-700)' }}>
        {t.moreBefore} <Link href="/contact">{t.moreLink}</Link> {t.moreAfter}
      </p>
    </Section>
  );
}
