import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getCategories, getCategory, getProducts, localizedSlugs, translateSlug } from '@/lib/api';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, pageMetadata, slugPaths } from '@/lib/seo';
import { DEFAULT_LOCALE, isLocale, localePath } from '@/lib/i18n';

interface Params {
  params: Promise<{ lang: string; slug: string }>;
}

/* Runs once per `lang` from the layout's params — each locale has its own
   slugs (`hryzantemy` / `hrizantemy`), so each prerenders its own. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const categories = await getCategories({ locale });
  return (categories ?? []).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await localeOf(params);
  const category = await getCategory(slug, locale);
  if (!category) return {};

  return pageMetadata({
    locale,
    path: `/category/${category.slug}`,
    paths: slugPaths('/category', await localizedSlugs('categories', category.id)),
    title: `${category.name} — ${getDictionary(locale).category.titleSuffix} | MIG Flowers`,
    description: category.description.slice(0, 160),
    image: category.image_url,
  });
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const locale = await localeOf(params);
  const category = await getCategory(slug, locale);
  /* Same rule as the product page: one URL per category per locale. */
  if (!category) {
    const own = await translateSlug('categories', slug, locale);
    if (own) permanentRedirect(localePath(locale, `/category/${own}`));
    notFound();
  }
  if (category.slug !== decodeURIComponent(slug)) {
    permanentRedirect(localePath(locale, `/category/${category.slug}`));
  }

  /* Filtered by this category, not the whole catalogue. Fetching everything
     made each category page a copy of /shop — the same products under a
     different heading, which is what duplicate content means. */
  const products = await getProducts({ locale, category: slug });
  const nav = getDictionary(locale).nav;

  return (
    <section>
      <Plate
        src={category.image_url}
        alt={category.name}
        ratio="auto"
        sizes="100vw"
        priority
        radius="0"
        style={{ height: 340, borderLeft: 'none', borderRight: 'none' }}
      />

      <Section pt={36} pb={80}>
        <Breadcrumb
          locale={locale}
          trail={[
            { label: nav.home, href: '/' },
            { label: nav.shop, href: '/shop' },
            { label: category.name },
          ]}
        />
        <h1 style={{ fontSize: 46, margin: '0 0 14px' }}>{category.name}</h1>
        <p
          style={{
            margin: '0 0 36px',
            fontSize: 15.5,
            lineHeight: 1.8,
            color: 'var(--color-neutral-700)',
            maxWidth: '62ch',
            textAlign: 'justify',
          }}
        >
          {category.description}
        </p>

        <ProductGrid products={products} variant="category" />
      </Section>
    </section>
  );
}
