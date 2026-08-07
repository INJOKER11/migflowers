import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CATEGORIES } from '@/lib/content';
import { byOccasion } from '@/lib/catalog';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES[slug];
  if (!category) return {};
  return { title: `${category.name} — MIG Flowers`, description: category.blurb.slice(0, 160) };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = CATEGORIES[slug];
  if (!category) notFound();

  return (
    <section>
      <Plate
        src={category.banner}
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
          {category.blurb}
        </p>

        <ProductGrid products={byOccasion(category.occasion)} variant="category" />
      </Section>
    </section>
  );
}
