'use client';

import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/Button';
import { savedCount } from '@/lib/format';

export function SavedSummary() {
  const { savedIds, ready } = useCart();

  return (
    <>
      <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--color-neutral-700)' }}>
        {ready ? savedCount(savedIds.length) : savedCount(0)}
      </p>
      <Button
        href="/wishlist"
        variant="ghost"
        cta="sm"
        style={{ padding: '10px 22px' }}
      >
        Відкрити збережене
      </Button>
    </>
  );
}
