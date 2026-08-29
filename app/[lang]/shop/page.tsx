import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { getCategories, getProducts } from '@/lib/api';
import { PRICE_MAX, PRICE_MIN, SORT_OPTIONS } from '@/lib/catalog';
import { SortKey } from '@/types';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  /* The canonical is the bare '/shop'. Category, price and sort all live in
     searchParams, and every combination of them renders the same page — left
     to itself Google would index dozens of them. */
  return metadataFor(props.params, '/shop', 'shop');
}

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

function toSort(value: Param): string | undefined {
  const raw = one(value);
  return SORT_OPTIONS.some((o) => o.value === raw) ? (raw as SortKey) : 'popular';
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const locale = await localeOf(params);
  const dict = getDictionary(locale);
  const t = dict.shop;
  const dictNav = dict.nav;

  const [products, categories] = await Promise.all([
    getProducts({
      locale,
      category: one(sp.category),
      maxPrice: toPrice(sp.maxPrice),
      sort: toSort(sp.sort),
    }),
    getCategories({ locale }),
  ]);

  return (
    <Section pt={44} pb={80}>
      <Breadcrumb
        locale={locale}
        trail={[{ label: dictNav.home, href: '/' }, { label: dictNav.shop }]}
      />
      <h1 style={{ fontSize: 44, margin: '0 0 10px' }}>{t.h1}</h1>
      <p
        style={{
          margin: '0 0 32px',
          fontSize: 15,
          color: 'var(--color-neutral-700)',
          maxWidth: '56ch',
        }}
      >
        {t.intro}
      </p>
      <Suspense fallback={null}>
        <ShopBrowser categories={categories} products={products} />
      </Suspense>
    </Section>
  );
}
