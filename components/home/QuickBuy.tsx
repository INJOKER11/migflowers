import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getProducts } from '@/lib/api';

const COUNT = 4;

export async function QuickBuy() {
  const products = await getProducts({ perPage: COUNT });

  return (
    <Section pt={0} pb={84}>
      <SectionHeading
        marginBottom={10}
        trailing={
          <Link
            href="/shop"
            style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}
          >
            Усі квіти
          </Link>
        }
      >
        Готові до відправлення сьогодні
      </SectionHeading>

      <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--color-neutral-600)' }}>
        Один дотик — і букет у кошику. Оформлення на одному екрані.
      </p>

      <ProductGrid products={products} variant="home" min="240px" />
    </Section>
  );
}
