import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getProduct, getRelatedProducts } from '@/lib/api';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary } from '@/lib/dictionaries';
import { productSchema } from '@/lib/schema';
import { localeOf, pageMetadata } from '@/lib/seo';

interface Params {
  params: Promise<{ lang: string; slug: string }>;
}

// export function generateStaticParams() {
//   return CATALOG.map((product) => ({ id: product.id }));
// }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await localeOf(params);
  const product = await getProduct(slug, locale);
  if (!product) return {};

  return pageMetadata({
    locale,
    path: `/product/${product.slug}`,
    /* The city belongs in every product title: "Букет Ніжність" on its own
       competes with every florist in the country, "… купити в Одесі" does not. */
    title: `${product.name} — купити в Одесі | MIG Flowers`,
    description: product.description,
  });
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const locale = await localeOf(params);
  const product = await getProduct(slug, locale);
  if (!product) notFound();

  const related = await getRelatedProducts(product, locale);
  const nav = getDictionary(locale).nav;

  return (
    <Section pt={36} pb={80}>
      <JsonLd data={productSchema(product, locale)} />

      <Breadcrumb
        locale={locale}
        trail={[
          { label: nav.home, href: '/' },
          { label: nav.shop, href: '/shop' },
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
