'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { PAYMENTS, SLOTS } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Check, STROKE_HEAVY, STROKE_LIGHT, X } from '@/components/ui/icons';
import { CartLine } from './CartLine';

const TITLES = {
  basket: 'Ваш кошик',
  checkout: 'Доставка та оплата',
  done: 'Дякуємо',
} as const;


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

  const openCartPage = () => {
    closeDrawer();
    router.push('/cart');
  };

  return (
    <>
      <button type="button" className="scrim" aria-label="Закрити кошик" onClick={closeDrawer} />

      <aside
        ref={panel}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={TITLES[cart.step]}
        tabIndex={-1}
      >
        <div className="drawer-head">
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>
            {TITLES[cart.step]}
          </span>
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

        {cart.step === 'basket' && (
          <>
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
              {cart.lines.map((line) => (
                <CartLine key={line.product.id} line={line} />
              ))}
            </div>

            <div className="drawer-foot">
              <div className="summary-row">
                <span>Сума</span>
                <span className="tabular">{uah(cart.subtotal)}</span>
              </div>
              <div className="summary-row" style={{ marginTop: 8 }}>
                <span>Доставка</span>
                <span className="tabular">
                  {cart.deliveryFee === 0 ? 'Безкоштовно' : uah(cart.deliveryFee)}
                </span>
              </div>
              <div className="summary-total" style={{ fontSize: 22, marginTop: 14, paddingTop: 14 }}>
                <span>До сплати</span>
                <span className="tabular">{uah(cart.total)}</span>
              </div>
              <Button
                block
                cta
                style={{ marginTop: 18, padding: '13px 0' }}
                onClick={cart.goToCheckoutStep}
                disabled={cart.isEmpty}
              >
                Оформити
              </Button>
              <Button
                variant="ghost"
                block
                cta="sm"
                style={{ marginTop: 8, padding: '10px 0' }}
                onClick={openCartPage}
              >
                Відкрити кошик
              </Button>
            </div>
          </>
        )}

        {cart.step === 'checkout' && (
          <>
            <div className="drawer-body" style={{ padding: '22px 26px' }}>
              <div className="kicker" style={{ marginBottom: 12 }}>
                Коли
              </div>
              <ChipRow>
                {SLOTS.map((label, i) => (
                  <Chip key={label} active={i === cart.slot} onClick={() => cart.setSlot(i)}>
                    {label}
                  </Chip>
                ))}
              </ChipRow>

              <div className="kicker" style={{ margin: '24px 0 12px' }}>
                Куди
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input className="input" placeholder="Імʼя отримувача" aria-label="Імʼя отримувача" />
                <input className="input" placeholder="Телефон" aria-label="Телефон" />
                <input
                  className="input"
                  placeholder="Вулиця, будинок, квартира"
                  aria-label="Вулиця, будинок, квартира"
                />
                <input
                  className="input"
                  placeholder="Текст листівки (за бажанням)"
                  aria-label="Текст листівки"
                />
              </div>

              <div className="kicker" style={{ margin: '24px 0 12px' }}>
                Оплата
              </div>
              <ChipRow>
                {PAYMENTS.map((label, i) => (
                  <Chip key={label} active={i === cart.payment} onClick={() => cart.setPayment(i)}>
                    {label}
                  </Chip>
                ))}
              </ChipRow>
            </div>

            <div className="drawer-foot">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 22,
                }}
              >
                <span>До сплати</span>
                <span className="tabular">{uah(cart.total)}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 6 }}>
                {cart.orderSummary}
              </div>
              <Button
                block
                cta
                style={{ marginTop: 16, padding: '13px 0' }}
                onClick={cart.placeOrder}
              >
                Оформити замовлення
              </Button>
              <Button
                variant="ghost"
                block
                cta="sm"
                style={{ marginTop: 8, padding: '10px 0' }}
                onClick={cart.goToBasketStep}
              >
                Назад до кошика
              </Button>
            </div>
          </>
        )}

        {cart.step === 'done' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px 34px',
              gap: 14,
            }}
          >
            <Check size={34} strokeWidth={STROKE_LIGHT} color="var(--color-accent)" />
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28 }}>
              Замовлення прийнято
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14.5,
                lineHeight: 1.75,
                color: 'var(--color-neutral-700)',
              }}
            >
              {cart.orderSummary} Флорист надішле фото готового букета, перш ніж він поїде з
              майстерні.
            </p>
            <Button
              variant="ghost"
              cta
              style={{ marginTop: 10, padding: '11px 26px' }}
              onClick={closeDrawer}
            >
              Дивитися далі
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
