import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductGrid } from '@/components/product/ProductGrid';
// import { CATALOG, relatedTo } from '@/lib/catalog';

interface Params {
  params: Promise<{ slug: string }>;
}

// export function generateStaticParams() {
//   return CATALOG.map((product) => ({ id: product.id }));
// }

async function getProduct(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
        next: {
            revalidate: 3600,
        }
    })
    if(!res.ok) throw new Error('Product not found');
    const data = await res.json();
    return data.data;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return { title: `${product.name} — MIG Flowers`, description: product.note };
    return {title: "test", description: "Fsdfsd"}
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);
  console.log(product.data);
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
        {/*<ProductGrid products={relatedTo(product.id)} variant="related" />*/}
      </div>
    </Section>
  );
}
