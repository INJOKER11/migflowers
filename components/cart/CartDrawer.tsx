'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { STROKE_HEAVY, X } from '@/components/ui/icons';
import { CartLine } from './CartLine';

const TITLE = 'Ваш кошик';

export function CartDrawer() {
  const router = useRouter();
  const cart = useCart();
  const panel = useRef<HTMLElement>(null);

  const { drawerOpen, closeDrawer } = cart;

  useEffect(() => {
    if (!drawerOpen) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  /* The drawer is a preview, not a checkout: both actions leave it. */
  const goTo = (href: string) => {
    closeDrawer();
    router.push(href);
  };

  return (
    <>
      <button type="button" className="scrim" aria-label="Закрити кошик" onClick={closeDrawer} />

      <aside
        ref={panel}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={TITLE}
        tabIndex={-1}
      >
        <div className="drawer-head">
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>{TITLE}</span>
          <Button
            variant="ghost"
            icon
            title="Закрити"
            aria-label="Закрити"
            style={{ width: 34, height: 34 }}
            onClick={closeDrawer}
          >
            <X size={15} strokeWidth={STROKE_HEAVY} />
          </Button>
        </div>

        <div className="drawer-body">
          {cart.isEmpty && (
            <p
              style={{
                fontSize: 14,
                color: 'var(--color-neutral-600)',
                padding: '44px 0',
                textAlign: 'center',
                lineHeight: 1.7,
              }}
            >
              Тут поки що порожньо.
              <br />
              Цього тижня дуже гарні півонії.
            </p>
          )}
          <div className="cart-lines">
            {cart.lines.map((line) => (
              <CartLine key={line.product.id} line={line} />
            ))}
          </div>
        </div>

        <div className="drawer-foot">
          <div className="summary-total" style={{ fontSize: 22 }}>
            <span>Сума</span>
            <span className="tabular">{uah(cart.total ?? 0)}</span>
          </div>
          <Button
            block
            cta
            style={{ marginTop: 18, padding: '13px 0' }}
            onClick={() => goTo('/checkout')}
            disabled={cart.isEmpty}
          >
            Оформити
          </Button>
        </div>
      </aside>
    </>
  );
}
