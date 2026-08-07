'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ProductGrid } from './ProductGrid';

export function WishlistView() {
  const { savedProducts, ready } = useCart();

  if (!ready) return null;

  if (savedProducts.length === 0) {
    return (
      <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', lineHeight: 1.8 }}>
        Ви ще нічого не зберегли. Натисніть сердечко на будь-якому букеті.
        <br />
        <Link href="/shop">До магазину</Link>
      </p>
    );
  }

  return <ProductGrid products={savedProducts} variant="wishlist" />;
}
