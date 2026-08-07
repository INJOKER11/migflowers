import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { GiftCardBuilder } from '@/components/gift/GiftCardBuilder';

export const metadata: Metadata = {
  title: 'Подарункові сертифікати — MIG Flowers',
  description: 'Надходить на пошту за хвилину або друкується на бавовняному картоні. Без терміну дії.',
};

export default function GiftCardsPage() {
  return (
    <Section width={1000} pt={44} pb={90}>
      <Breadcrumb
        trail={[{ label: 'Головна', href: '/' }, { label: 'Подарункові сертифікати' }]}
      />
      <h1 style={{ fontSize: 46, margin: '0 0 14px' }}>Подарункові сертифікати</h1>
      <p
        style={{
          margin: '0 0 40px',
          fontSize: 15.5,
          lineHeight: 1.8,
          color: 'var(--color-neutral-700)',
          maxWidth: '56ch',
          textAlign: 'justify',
        }}
      >
        Коли краще, щоб людина обрала сама. Надходить на пошту за хвилину або друкується на
        бавовняному картоні й вирушає поштою. Без терміну дії.
      </p>

      <GiftCardBuilder />
    </Section>
  );
}
