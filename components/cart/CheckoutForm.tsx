'use client';

import { useState, type ComponentProps, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { PAYMENTS, SLOTS } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { CartLine } from './CartLine';
import { createOrder, OrderValidationError, type FieldErrors } from '@/lib/api';

const PAYMENT_METHOD = ['online', 'online', 'cash_on_delivery'];

const NAMED_FIELDS = [
  'customer_name',
  'customer_email',
  'customer_phone',
  'delivery_address',
  'recipient_name',
  'card_message',
  'delivery_date',
];

function isoDate(addDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + addDays);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function deliveryDate(slot: number): string | null {
  if (slot === 0) return isoDate(0);
  if (slot === 1) return isoDate(1);
  return null;
}

type FieldProps = ComponentProps<'input'> & {
  name: string;
  errors: FieldErrors;
  full?: boolean;
};

function Field({ name, errors, full, ...input }: FieldProps) {
  const message = errors[name]?.[0];
  return (
    <div style={full ? { gridColumn: '1/-1' } : undefined}>
      <input
        {...input}
        name={name}
        className={message ? 'input input-invalid' : 'input'}
        aria-invalid={message ? true : undefined}
        aria-describedby={message ? `${name}-error` : undefined}
      />
      {message && (
        <p className="field-error" id={`${name}-error`}>
          {message}
        </p>
      )}
    </div>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const placeOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const date = deliveryDate(cart.slot);
    if (!date) {
      setErrors({ delivery_date: ['Оберіть дату доставки.'] });
      return;
    }

    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? '').trim();

    setErrors({});
    setSubmitting(true);

    try {
      await createOrder({
        customer_name: text('customer_name'),
        customer_email: text('customer_email'),
        customer_phone: text('customer_phone'),
        delivery_address: text('delivery_address'),
        recipient_name: text('recipient_name') || undefined,
        card_message: text('card_message') || undefined,
        delivery_date: date,
        payment_method: PAYMENT_METHOD[cart.payment],
        items: cart.lines.map((line) => ({
          product_id: Number(line.product.id),
          quantity: line.qty,
        })),
      });
    } catch (error) {
      setErrors(
        error instanceof OrderValidationError
          ? error.fields
          : { form: ['Не вдалося надіслати замовлення. Спробуйте ще раз.'] },
      );
      setSubmitting(false);
      return;
    }

    cart.placeOrder();
    router.push('/checkout/confirmed');
  };

  const generalError = Object.entries(errors).find(([key]) => !NAMED_FIELDS.includes(key))?.[1][0];

  return (
    <form
      onSubmit={placeOrder}
      noValidate
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
        {errors.delivery_date && <p className="field-error">{errors.delivery_date[0]}</p>}

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
          <Field
            name="customer_name"
            errors={errors}
            placeholder="Імʼя отримувача"
            aria-label="Імʼя отримувача"
          />
          <Field
            name="customer_phone"
            errors={errors}
            type="tel"
            placeholder="Телефон"
            aria-label="Телефон"
          />
          <Field
            name="customer_email"
            errors={errors}
            type="email"
            full
            placeholder="Ел. пошта"
            aria-label="Ел. пошта"
          />
          <Field
            name="delivery_address"
            errors={errors}
            full
            placeholder="Вулиця і будинок"
            aria-label="Вулиця і будинок"
          />
          <Field
            name="recipient_name"
            errors={errors}
            full
            placeholder="Кому доставити (за бажанням)"
            aria-label="Кому доставити"
          />
          <Field
            name="card_message"
            errors={errors}
            full
            placeholder="Текст листівки (за бажанням)"
            aria-label="Текст листівки"
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

        {cart.ready && (
          <>
            {cart.isEmpty ? (
              !submitting && (
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--color-neutral-600)',
                    padding: '28px 0',
                    textAlign: 'center',
                  }}
                >
                  Тут поки що порожньо.
                </p>
              )
            ) : (
              <div
                className="cart-lines cart-lines-scroll"
                style={{
                  paddingLeft: '1px',
                  paddingRight: '5px',
                }}
              >
                {cart.lines.map((line) => (
                  <CartLine key={line.product.id} line={line} variant="page" />
                ))}
              </div>
            )}

            <div className="summary-row" style={{ marginTop: 14 }}>
              <span>Доставка</span>
              <span className="tabular">
                {cart.deliveryFee === 0 ? 'Безкоштовно' : uah(cart.deliveryFee)}
              </span>
            </div>
            <div className="summary-total" style={{ marginTop: 14, paddingTop: 14 }}>
              <span>До сплати</span>
              <span className="tabular">{uah(cart.total)}</span>
            </div>
          </>
        )}

        <div style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 10 }}>
          {cart.orderSummary}
        </div>

        {generalError && (
          <p className="field-error" role="alert" style={{ marginTop: 12 }}>
            {generalError}
          </p>
        )}

        <Button
          type="submit"
          block
          cta
          style={{ marginTop: 18, padding: '14px 0' }}
          disabled={!cart.ready || cart.isEmpty || submitting}
        >
          {submitting ? 'Надсилаємо…' : 'Підтвердити замовлення'}
        </Button>
      </div>
    </form>
  );
}
