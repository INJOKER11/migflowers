import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Accordion } from '@/components/ui/Accordion';
import { FAQS } from '@/lib/faqs';

export const metadata: Metadata = {
  title: 'Питання — MIG Flowers',
  description: 'Доставка, гарантія свіжості, підписки та сертифікати — вісім поширених питань.',
};

export default function FaqPage() {
  return (
    <Section width={800} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Питання' }]} />
      <h1 style={{ fontSize: 46, margin: '0 0 34px' }}>Питання, які нам ставлять</h1>

      <Accordion items={FAQS} />

      <p style={{ margin: '34px 0 0', fontSize: 15, color: 'var(--color-neutral-700)' }}>
        Не знайшли відповіді? <Link href="/contact">Напишіть нам</Link> — хтось із нас відповість,
        зазвичай протягом години.
      </p>
    </Section>
  );
}
