import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getProduct, getRelatedProducts } from '@/lib/api';

interface Params {
  params: Promise<{ slug: string }>;
}

// export function generateStaticParams() {
//   return CATALOG.map((product) => ({ id: product.id }));
// }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return { title: `${product.name} — MIG Flowers`, description: product.description };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

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

      {related.length > 0 && (
        <div style={{ marginTop: 80 }}>
          <SectionHeading size={30}>Вам також може сподобатися</SectionHeading>
          <ProductGrid products={related} variant="related" />
        </div>
      )}
    </Section>
  );
}
