'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { getProducts } from '@/lib/api';
import { ProductGrid } from './ProductGrid';
import type { Product } from '@/types';

export function WishlistView() {
  const { savedIds, ready } = useCart();
  const [fetched, setFetched] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);


  useEffect(() => {
    if (!ready || savedIds.length === 0) {
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);

    getProducts(savedIds)
      .then((data) => {
        if (!ignore) setFetched(data);
      })
      .catch(() => {
        if (!ignore) setFailed(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (!ready) return null;

  if (savedIds.length === 0) {
    return (
      <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', lineHeight: 1.8 }}>
        Ви ще нічого не зберегли. Натисніть сердечко на будь-якому букеті.
        <br />
        <Link href="/shop">До магазину</Link>
      </p>
    );
  }

  if (loading) {
    return (
      <p style={{ fontSize: 15, color: 'var(--color-neutral-600)', lineHeight: 1.8 }}>
        Завантажуємо збережене…
      </p>
    );
  }

  if (failed) {
    return (
      <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', lineHeight: 1.8 }}>
        Не вдалося завантажити збережені букети. Спробуйте оновити сторінку.
      </p>
    );
  }

  const visible = fetched.filter((product) => savedIds.includes(product.id));

  return <ProductGrid products={visible} variant="wishlist" />;
}
