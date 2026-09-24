import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getProduct, getRelatedProducts, localizedSlugs, translateSlug } from '@/lib/api';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary } from '@/lib/dictionaries';
import { productSchema } from '@/lib/schema';
import { localeOf, pageMetadata, slugPaths } from '@/lib/seo';
import { localePath } from '@/lib/i18n';

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
    paths: slugPaths('/product', await localizedSlugs('products', product.id)),
    /* The city belongs in every product title: "Букет Ніжність" on its own
       competes with every florist in the country, "… купити в Одесі" does not. */
    title: `${product.name} — ${getDictionary(locale).product.titleSuffix} | MIG Flowers`,
    description: product.description,
    image: product.image_url,
  });
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const locale = await localeOf(params);
  const product = await getProduct(slug, locale);
  /* One URL per product per locale. A slug from the other language (the
     language switcher keeps the path) is sent to this language's own; the
     backend also answers a Ukrainian slug in Russian, which would otherwise
     render the same product at two addresses. */
  if (!product) {
    const own = await translateSlug('products', slug, locale);
    if (own) permanentRedirect(localePath(locale, `/product/${own}`));
    notFound();
  }
  if (product.slug !== decodeURIComponent(slug)) {
    permanentRedirect(localePath(locale, `/product/${product.slug}`));
  }

  const related = await getRelatedProducts(product, locale);
  const dict = getDictionary(locale);
  const nav = dict.nav;

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
          <SectionHeading size={30}>{dict.product.relatedTitle}</SectionHeading>
          <ProductGrid products={related} variant="related" />
        </div>
      )}
    </Section>
  );
}
