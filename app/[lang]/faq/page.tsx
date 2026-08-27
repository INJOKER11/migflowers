import type { Metadata } from 'next';
import { Link } from '@/components/ui/Link';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Accordion } from '@/components/ui/Accordion';
import { FAQS } from '@/lib/faqs';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return metadataFor(props.params, '/faq', 'faq');
}

export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);

  return (
    <Section width={800} pt={44} pb={90}>
      <Breadcrumb locale={locale} trail={[{ label: 'Головна', href: '/' }, { label: 'Питання' }]} />
      <h1 style={{ fontSize: 46, margin: '0 0 34px' }}>Питання, які нам ставлять</h1>

      <Accordion items={FAQS} />

      <p style={{ margin: '34px 0 0', fontSize: 15, color: 'var(--color-neutral-700)' }}>
        Не знайшли відповіді? <Link href="/contact">Напишіть нам</Link> — хтось із нас відповість,
        зазвичай протягом години.
      </p>
    </Section>
  );
}
