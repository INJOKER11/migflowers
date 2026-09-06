'use client';

import { Link } from '@/components/ui/Link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { getProducts } from '@/lib/api';
import { useLocale } from '@/lib/use-locale';
import { ProductGrid } from './ProductGrid';
import type { Product } from '@/types';
import { useDict } from '@/lib/dictionary-context';

export function WishlistView() {
  const locale = useLocale();
  const t = useDict().wishlist;
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

    getProducts({ locale, ids: savedIds })
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
  }, [ready, locale]);

  if (!ready) return null;

  if (savedIds.length === 0) {
    return (
      <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', lineHeight: 1.8 }}>
        {t.empty}
        <br />
        <Link href="/shop">{t.toShop}</Link>
      </p>
    );
  }

  if (loading) {
    return (
      <p style={{ fontSize: 15, color: 'var(--color-neutral-600)', lineHeight: 1.8 }}>
        {t.loading}
      </p>
    );
  }

  if (failed) {
    return (
      <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', lineHeight: 1.8 }}>
        {t.failed}
      </p>
    );
  }

  const visible = fetched.filter((product) => savedIds.includes(product.id));

  return <ProductGrid products={visible} variant="wishlist" />;
}
