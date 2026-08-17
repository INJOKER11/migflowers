import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { getCategories, getProducts } from '@/lib/api';
import { PRICE_MAX, PRICE_MIN } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Усі квіти — MIG Flowers',
  description: 'Усе, що майстерня робить цього тижня. Букети, композиції та квіти у вазі.',
};

type Param = string | string[] | undefined;

function one(value: Param): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toPrice(value: Param): number | undefined {
  const raw = one(value);
  if (raw === undefined) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(Math.max(n, PRICE_MIN), PRICE_MAX);
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  /* Independent requests — awaiting them in sequence cost two round trips. */
  const [products, categories] = await Promise.all([
    getProducts({ category: one(sp.category), maxPrice: toPrice(sp.maxPrice) }),
    getCategories(),
  ]);

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
        <ShopBrowser categories={categories} products={products} />
      </Suspense>
    </Section>
  );
}
