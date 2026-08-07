import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ShopBrowser } from '@/components/shop/ShopBrowser';

export const metadata: Metadata = {
  title: 'Усі квіти — MIG Flowers',
  description: 'Усе, що майстерня робить цього тижня. Букети, композиції та квіти у вазі.',
};

export default function ShopPage() {
  return (
    <Section pt={44} pb={80}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Магазин' }]} />
      <h1 style={{ fontSize: 44, margin: '0 0 10px' }}>Усі квіти</h1>
      <p
        style={{
          margin: '0 0 32px',
          fontSize: 15,
          color: 'var(--color-neutral-700)',
          maxWidth: '56ch',
        }}
      >
        Усе, що майстерня робить цього тижня. Звузьте пошук або скажіть нагоду — ми виберемо самі.
      </p>
      <Suspense fallback={null}>
        <ShopBrowser />
      </Suspense>
    </Section>
  );
}
