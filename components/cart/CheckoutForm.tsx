'use client';

import { type ComponentProps, type FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { uah } from '@/lib/format';
import { DELIVERY, DeliveryEnum, PaymentEnum, PAYMENTS, SHOP_DETAILS, SLOTS } from '@/lib/content';
import { CARD_MESSAGE_FEE } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Checkbox } from '@/components/ui/Checkbox';
import { CartLine } from './CartLine';
import {
  createOrder,
  District,
  type FieldErrors,
  getDistricts,
  getProduct,
  OrderValidationError,
} from '@/lib/api';

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
  const [checkingStock, setCheckingStock] = useState(false);
  const [droppedNames, setDroppedNames] = useState<string[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isForMe, setIsForMe] = useState(false);

  useEffect(() => {
    if (!cart.ready) return;
    let cancelled = false;

    getDistricts()
      .then((fetched) => {
        if (!cancelled) setDistricts(fetched);
      })
      .catch(() => {});

    if (!cart.isEmpty) {
      const lines = cart.lines;
      setCheckingStock(true);
      Promise.all(lines.map((line) => getProduct(line.product.slug)))
        .then((fresh) => {
          if (cancelled) return;

          const dropped: string[] = [];
          lines.forEach((line, i) => {
            const product = fresh[i];
            if (!product || !product.is_available) dropped.push(line.product.name);
            cart.syncProduct(line.product.id, product);
          });
          setDroppedNames(dropped);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setCheckingStock(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [cart.ready]);

  useEffect(() => {
    if (cart.district != null || districts.length === 0) return;
    const first = districts.find((d) => d.price_for_delivery) ?? districts[0];
    cart.setDistrict(first.id);
    cart.setZoneFee(first.price_for_delivery ? Number(first.price_for_delivery) : 0);
  }, [districts]);

  const placeOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const isTakeaway = cart.delivery === DeliveryEnum.takeaway;
    const date = isTakeaway ? isoDate(0) : deliveryDate(cart.slot);
    if (!date) {
      setErrors({ delivery_date: ['Оберіть дату доставки.'] });
      return;
    }

    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? '').trim();

    const districtName = districts.find((z) => z.id === cart.district)?.name;
    const address = isTakeaway
      ? SHOP_DETAILS.address
      : [districtName, text('delivery_address')].filter(Boolean).join(', ');

    setErrors({});
    setSubmitting(true);

    try {
      await createOrder({
        customer_name: text('customer_name'),
        customer_email: text('customer_email'),
        customer_phone: text('customer_phone'),
        delivery_address: address,
        recipient_name: text('recipient_name') || undefined,
        card_message: text('card_message') || undefined,
        delivery_date: date,
        payment_method: cart.payment,
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

  const paymentMethods =
    cart.delivery !== DeliveryEnum.delivery
      ? PAYMENTS
      : PAYMENTS.filter((p) => p.value !== PaymentEnum.on_site);

  const selectedDistrict = districts.find((d) => d.id === cart.district);
  const quoteRequired =
    cart.delivery === DeliveryEnum.delivery && !!selectedDistrict && !selectedDistrict.price_for_delivery;

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
          Спосіб отримання
        </div>
        <ChipRow>
          {DELIVERY.map((d) => (
            <Chip
              key={d.value}
              size="lg"
              active={d.value === cart.delivery}
              onClick={() => cart.setDelivery(d.value)}
            >
              {d.name}
            </Chip>
          ))}
        </ChipRow>

        {cart.delivery === DeliveryEnum.delivery ? (
          <>
            <div className="kicker" style={{ margin: '28px 0 12px' }}>
              Коли доставити
            </div>
            <ChipRow>
              {SLOTS.map((label, i) => (
                <Chip
                  key={label}
                  size="lg"
                  active={i === cart.slot}
                  onClick={() => cart.setSlot(i)}
                >
                  {label}
                </Chip>
              ))}
            </ChipRow>
            {errors.delivery_date && <p className="field-error">{errors.delivery_date[0]}</p>}
          </>
        ) : (
          <div style={{ marginTop: '12px', fontSize: 14.5, color: 'var(--color-neutral-600)' }}>
            Заберете самі з майстерні: {SHOP_DETAILS.address}
          </div>
        )}

        <div className="kicker" style={{ margin: '28px 0 12px' }}>
          Куди доставити
        </div>

        {cart.delivery === DeliveryEnum.delivery && (
          <div style={{ margin: '20px 0' }}>
            <ChipRow>
              {districts.map((d) => (
                <Chip
                  key={d.id}
                  size="lg"
                  active={d.id === cart.district}
                  onClick={() => {
                    cart.setDistrict(d.id);
                    cart.setZoneFee(d.price_for_delivery ? Number(d.price_for_delivery) : 0);
                  }}
                >
                  {d.name} · {d.price_for_delivery ? uah(Number(d.price_for_delivery)) : 'Уточніть у менеджера'}
                </Chip>
              ))}
            </ChipRow>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            marginTop: cart.delivery === DeliveryEnum.delivery ? 12 : 0,
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 10,
          }}
        >
          <Field name="customer_name" errors={errors} placeholder="Імʼя" aria-label="Імʼя" />
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
          {cart.delivery === DeliveryEnum.delivery && (
            <Field
              name="delivery_address"
              errors={errors}
              full
              placeholder="Вулиця і будинок"
              aria-label="Вулиця і будинок"
            />
          )}
        </div>

        {cart.delivery === DeliveryEnum.delivery && (
          <div style={{ marginTop: 12 }}>
            <Checkbox checked={isForMe} onChange={setIsForMe}>
              Це для мене
            </Checkbox>
            {!isForMe && (
              <div style={{ marginTop: 10 }}>
                <Field
                  name="recipient_name"
                  errors={errors}
                  full
                  placeholder="Кому доставити (за бажанням)"
                  aria-label="Кому доставити"
                />
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <Checkbox checked={cart.hasCardMessage} onChange={cart.setHasCardMessage}>
            Додати листівку (+{uah(CARD_MESSAGE_FEE)})
          </Checkbox>
          {cart.hasCardMessage && (
            <div style={{ marginTop: 10 }}>
              <Field
                name="card_message"
                errors={errors}
                full
                placeholder="Текст листівки"
                aria-label="Текст листівки"
              />
            </div>
          )}
        </div>

        <div className="kicker" style={{ margin: '28px 0 12px' }}>
          Оплата
        </div>
        <ChipRow>
          {paymentMethods.map((p) => (
            <Chip
              key={p.value}
              size="lg"
              active={p.value === cart.payment}
              onClick={() => cart.setPayment(p.value)}
            >
              {p.name}
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

            {droppedNames.length > 0 && (
              <p className="field-error" role="alert" style={{ marginTop: 12 }}>
                {droppedNames.length === 1
                  ? `«${droppedNames[0]}» більше немає в наявності — товар прибрано з кошика.`
                  : `Немає в наявності — прибрано з кошика: ${droppedNames.join(', ')}.`}
              </p>
            )}

            {cart.delivery === DeliveryEnum.delivery && (
              <div className="summary-row" style={{ marginTop: 14 }}>
                <span>Доставка</span>
                <span className="tabular">
                  {quoteRequired
                    ? 'Уточніть у менеджера'
                    : cart.deliveryFee === 0
                      ? 'Безкоштовно'
                      : uah(cart.deliveryFee)}
                </span>
              </div>
            )}
            {cart.hasCardMessage && (
              <div className="summary-row" style={{ marginTop: 8 }}>
                <span>Листівка</span>
                <span className="tabular">{uah(CARD_MESSAGE_FEE)}</span>
              </div>
            )}
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
          disabled={!cart.ready || cart.isEmpty || submitting || checkingStock}
        >
          {submitting ? 'Надсилаємо…' : 'Підтвердити замовлення'}
        </Button>
      </div>
    </form>
  );
}
