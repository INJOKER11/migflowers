'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalePath } from '@/lib/use-locale';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { STROKE_HEAVY, X } from '@/components/ui/icons';
import { CartLine } from './CartLine';
import { useDict } from '@/lib/dictionary-context';

export function CartDrawer() {
  const t = useDict().cart;
  const router = useRouter();
  const withLocale = useLocalePath();
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
    router.push(withLocale(href));
  };

  return (
    <>
      <button type="button" className="scrim" aria-label={t.closeCart} onClick={closeDrawer} />

      <aside
        ref={panel}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t.drawerTitle}
        tabIndex={-1}
      >
        <div className="drawer-head">
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>{t.drawerTitle}</span>
          <Button
            variant="ghost"
            icon
            title={t.close}
            aria-label={t.close}
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
              {t.emptyA}
              <br />
              {t.emptyB}
            </p>
          )}
          <div className="cart-lines">
            {cart.lines.map((line) => (
              <CartLine key={line.key} line={line} />
            ))}
          </div>
        </div>

        <div className="drawer-foot">
          <div className="summary-total" style={{ fontSize: 22 }}>
            <span>{t.sum}</span>
            <span className="tabular">{uah(cart.total ?? 0)}</span>
          </div>
          <Button
            block
            cta
            style={{ marginTop: 18, padding: '13px 0' }}
            onClick={() => goTo('/checkout')}
            disabled={cart.isEmpty}
          >
            {t.checkout}
          </Button>
        </div>
      </aside>
    </>
  );
}
