'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { PAYMENTS, SLOTS } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';


export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();

  const placeOrder = () => {
    cart.placeOrder();
    router.push('/checkout/confirmed');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 48,
        alignItems: 'start',
      }}
    >
      <div>
        <div className="kicker" style={{ marginBottom: 12 }}>
          Коли доставити
        </div>
        <ChipRow>
          {SLOTS.map((label, i) => (
            <Chip key={label} size="lg" active={i === cart.slot} onClick={() => cart.setSlot(i)}>
              {label}
            </Chip>
          ))}
        </ChipRow>

        <div className="kicker" style={{ margin: '28px 0 12px' }}>
          Куди доставити
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 10,
          }}
        >
          <input className="input" placeholder="Імʼя отримувача" aria-label="Імʼя отримувача" />
          <input className="input" placeholder="Телефон" aria-label="Телефон" />
          <input
            className="input"
            placeholder="Вулиця і будинок"
            aria-label="Вулиця і будинок"
            style={{ gridColumn: '1/-1' }}
          />
          <input
            className="input"
            placeholder="Квартира, підʼїзд, код"
            aria-label="Квартира, підʼїзд, код"
          />
          <input className="input" defaultValue="Львів" placeholder="Місто" aria-label="Місто" />
          <input
            className="input"
            placeholder="Текст листівки (за бажанням)"
            aria-label="Текст листівки"
            style={{ gridColumn: '1/-1' }}
          />
        </div>

        <div className="kicker" style={{ margin: '28px 0 12px' }}>
          Оплата
        </div>
        <ChipRow>
          {PAYMENTS.map((label, i) => (
            <Chip
              key={label}
              size="lg"
              active={i === cart.payment}
              onClick={() => cart.setPayment(i)}
            >
              {label}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <div className="card" data-sticky style={{ padding: 26, position: 'sticky', top: 100 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 16 }}>
          Разом до сплати
        </div>

        {cart.lines.map((line) => (
          <div
            key={line.product.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              fontSize: 13.5,
              padding: '7px 0',
              color: 'var(--color-neutral-700)',
            }}
          >
            <span>
              {line.product.name} × {line.qty}
            </span>
            <span className="tabular nowrap">{uah(line.product.price * line.qty)}</span>
          </div>
        ))}

        <div className="hr" style={{ margin: '14px 0' }} />

        <div className="summary-row">
          <span>Доставка</span>
          <span className="tabular">
            {cart.deliveryFee === 0 ? 'Безкоштовно' : uah(cart.deliveryFee)}
          </span>
        </div>
        <div className="summary-total" style={{ marginTop: 14, paddingTop: 14 }}>
          <span>До сплати</span>
          <span className="tabular">{uah(cart.total)}</span>
        </div>

        <div style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 10 }}>
          {cart.orderSummary}
        </div>

        <Button
          block
          cta
          style={{ marginTop: 18, padding: '14px 0' }}
          onClick={placeOrder}
          disabled={cart.isEmpty}
        >
          Підтвердити замовлення
        </Button>
      </div>
    </div>
  );
}
