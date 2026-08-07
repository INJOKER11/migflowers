import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CATALOG, getProduct, relatedTo } from '@/lib/catalog';

interface Params {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return CATALOG.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};
  return { title: `${product.name} — MIG Flowers`, description: product.note };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <Section pt={36} pb={80}>
      <Breadcrumb
        trail={[
          { label: 'Головна', href: '/' },
          { label: 'Магазин', href: '/shop' },
          { label: product.name },
        ]}
      />

      <ProductDetail product={product} />

      <div style={{ marginTop: 80 }}>
        <SectionHeading size={30}>Вам також може сподобатися</SectionHeading>
        <ProductGrid products={relatedTo(product.id)} variant="related" />
      </div>
    </Section>
  );
}
