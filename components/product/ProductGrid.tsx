import type { CSSProperties } from 'react';
import type { Product } from '@/types';
import { ProductCard, type CardVariant } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  variant?: CardVariant;
  min?: string;
  gap?: number;
  priorityCount?: number;
}

export function ProductGrid({
  products,
  variant = 'shop',
  min = '220px',
  gap = 26,
  priorityCount = 0,
}: ProductGridProps) {
  return (
    <div className="grid-auto grid-fill" style={{ '--min': min, '--gap': `${gap}px` } as CSSProperties}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}
