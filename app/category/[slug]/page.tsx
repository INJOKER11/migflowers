import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { ProductGrid } from '@/components/product/ProductGrid';
import {getCategories, getCategory, getProducts} from "@/lib/api";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const categories = await getCategories();
  return (categories ?? []).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) return {};
  return { title: `${category.name} — MIG Flowers`, description: category.description.slice(0, 160) };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const products = await getProducts();
  if (!category) notFound();

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
          trail={[
            { label: 'Головна', href: '/' },
            { label: 'Магазин', href: '/shop' },
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
