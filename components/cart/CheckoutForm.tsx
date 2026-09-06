'use client';

import { type ComponentProps, type FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useLocalePath } from '@/lib/use-locale';
import { useCart } from '@/lib/cart-context';
import { fill, uah } from '@/lib/format';
import {
  DELIVERY_METHODS,
  DeliveryEnum,
  PaymentEnum,
  PAYMENT_OPTIONS,
  shopLocation,
} from '@/lib/content';
import { useDict } from '@/lib/dictionary-context';
import { CARD_MESSAGE_FEE } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Checkbox } from '@/components/ui/Checkbox';
import { CartLine } from './CartLine';
import { createOrder, District, type FieldErrors, getDistricts, ValidationError } from '@/lib/api';

const NAMED_FIELDS = [
  'customer_name',
  'customer_email',
  'customer_phone',
  'delivery_address',
  'recipient_name',
  'card_message',
  'delivery_date',
  'promo_code',
];

function isoDate(addDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + addDays);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function deliveryDate(slot: number, custom: string): string | null {
  if (slot === 0) return isoDate(0);
  if (slot === 1) return isoDate(1);
  return custom || null;
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
  const locale = useLocale();
  const t = useDict().checkout;
  const shop = shopLocation(locale);

  const methodLabels: Record<DeliveryEnum, string> = {
    [DeliveryEnum.delivery]: t.methodDelivery,
    [DeliveryEnum.takeaway]: t.methodTakeaway,
  };
  const slotLabels = [t.slotToday, t.slotTomorrow, t.slotPick];
  const paymentLabels: Record<PaymentEnum, string> = {
    [PaymentEnum.card]: t.payCard,
    [PaymentEnum.online]: t.payOnline,
    [PaymentEnum.on_site]: t.payOnSite,
  };
  const withLocale = useLocalePath();
  const cart = useCart();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isForMe, setIsForMe] = useState(false);

  useEffect(() => {
    if (!cart.ready) return;
    let cancelled = false;

    getDistricts(locale)
      .then((fetched) => {
        if (!cancelled) setDistricts(fetched);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [cart.ready, locale]);

  useEffect(() => {
    if (cart.district != null || districts.length === 0) return;
    const first = districts.find((d) => d.price_for_delivery) ?? districts[0];
    cart.setDistrict(first.id);
    cart.setZoneFee(first.price_for_delivery ? Number(first.price_for_delivery) : 0);
  }, [districts]);

  const placeOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? '').trim();

    const isTakeaway = cart.delivery === DeliveryEnum.takeaway;
    const date = isTakeaway ? isoDate(0) : deliveryDate(cart.slot, text('custom_date'));
    if (!date) {
      setErrors({ delivery_date: [t.dateMissing] });
      return;
    }

    const address = isTakeaway ? shop.address : text('delivery_address');

    setErrors({});
    setSubmitting(true);

    try {
      const res = await createOrder(
        {
          delivery_method: cart.delivery,
          district_id: cart.district,
          customer_name: text('customer_name'),
          customer_email: text('customer_email'),
          customer_phone: text('customer_phone'),
          delivery_address: address,
          with_card: cart.hasCardMessage,
          recipient_name: text('recipient_name') || undefined,
          card_message: text('card_message') || undefined,
          delivery_date: date,
          payment_method: cart.payment,
          items: cart.lines.map((line) => ({
            product_id: Number(line.product.id),
            quantity: line.qty,
          })),
          promo_code: text('promo_code') || undefined,
        },
        locale,
      );

      if (cart.payment === PaymentEnum.online && res?.payment_url) {
        cart.placeOrder();
        window.location.href = res.payment_url;
        return;
      }
    } catch (error) {
      setErrors(error instanceof ValidationError ? error.fields : { form: [t.failed] });
      setSubmitting(false);
      return;
    }

    cart.placeOrder();
    router.push(withLocale('/checkout/confirmed'));
  };

  const generalError = Object.entries(errors).find(([key]) => !NAMED_FIELDS.includes(key))?.[1][0];

  /* Paying on site only makes sense when you come to the workshop yourself. */
  const paymentOptions =
    cart.delivery !== DeliveryEnum.delivery
      ? PAYMENT_OPTIONS
      : PAYMENT_OPTIONS.filter((value) => value !== PaymentEnum.on_site);

  const selectedDistrict = districts.find((d) => d.id === cart.district);
  const quoteRequired =
    cart.delivery === DeliveryEnum.delivery &&
    !!selectedDistrict &&
    !selectedDistrict.price_for_delivery;

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
          {t.methodLabel}
        </div>
        <ChipRow>
          {DELIVERY_METHODS.map((method) => (
            <Chip
              key={method}
              size="lg"
              active={method === cart.delivery}
              onClick={() => cart.setDelivery(method)}
            >
              {methodLabels[method]}
            </Chip>
          ))}
        </ChipRow>

        {cart.delivery === DeliveryEnum.delivery ? (
          <>
            <div className="kicker" style={{ margin: '28px 0 12px' }}>
              {t.whenLabel}
            </div>
            <ChipRow>
              {slotLabels.map((label, i) => (
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
            {cart.slot === 2 && (
              <input
                type="date"
                name="custom_date"
                className="input"
                style={{ marginTop: 10, maxWidth: 220 }}
                min={isoDate(0)}
                defaultValue={isoDate(0)}
                aria-label={t.dateLabel}
              />
            )}
            {errors.delivery_date && <p className="field-error">{errors.delivery_date[0]}</p>}
          </>
        ) : (
          <div style={{ marginTop: '12px', fontSize: 14.5, color: 'var(--color-neutral-600)' }}>
            {fill(t.pickupAt, { address: shop.address })}
          </div>
        )}

        <div className="kicker" style={{ margin: '28px 0 12px' }}>
          {t.whereLabel}
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
                  {d.name} · {d.price_for_delivery ? uah(Number(d.price_for_delivery)) : t.quote}
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
          <Field name="customer_name" errors={errors} placeholder={t.name} aria-label={t.name} />
          <Field
            name="customer_phone"
            errors={errors}
            type="tel"
            placeholder={t.phone}
            aria-label={t.phone}
          />
          <Field
            name="customer_email"
            errors={errors}
            type="email"
            full
            placeholder={t.email}
            aria-label={t.email}
          />
          {cart.delivery === DeliveryEnum.delivery && (
            <Field
              name="delivery_address"
              errors={errors}
              full
              placeholder={t.address}
              aria-label={t.address}
            />
          )}
        </div>

        {cart.delivery === DeliveryEnum.delivery && (
          <div style={{ marginTop: 12 }}>
            <Checkbox checked={isForMe} onChange={setIsForMe}>
              {t.forMe}
            </Checkbox>
            {!isForMe && (
              <div style={{ marginTop: 10 }}>
                <Field
                  name="recipient_name"
                  errors={errors}
                  full
                  placeholder={t.recipient}
                  aria-label={t.recipientAria}
                />
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <Checkbox checked={cart.hasCardMessage} onChange={cart.setHasCardMessage}>
            {fill(t.addCard, { fee: uah(CARD_MESSAGE_FEE) })}
          </Checkbox>
          {cart.hasCardMessage && (
            <div style={{ marginTop: 10 }}>
              <Field
                name="card_message"
                errors={errors}
                full
                placeholder={t.cardText}
                aria-label={t.cardText}
              />
            </div>
          )}
        </div>

        <div className="kicker" style={{ margin: '28px 0 12px' }}>
          {t.paymentLabel}
        </div>
        <ChipRow>
          {paymentOptions.map((value) => (
            <Chip
              key={value}
              size="lg"
              active={value === cart.payment}
              onClick={() => cart.setPayment(value)}
            >
              {paymentLabels[value]}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <div className="card" data-sticky style={{ padding: 26, position: 'sticky', top: 100 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 16 }}>
          {t.summaryTitle}
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
                  {t.empty}
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

            {cart.delivery === DeliveryEnum.delivery && (
              <div className="summary-row" style={{ marginTop: 14 }}>
                <span>{t.delivery}</span>
                <span className="tabular">
                  {quoteRequired
                    ? t.quote
                    : cart.deliveryFee === 0
                      ? t.free
                      : uah(cart.deliveryFee)}
                </span>
              </div>
            )}
            {cart.hasCardMessage && (
              <div className="summary-row" style={{ marginTop: 8 }}>
                <span>{t.cardRow}</span>
                <span className="tabular">{uah(CARD_MESSAGE_FEE)}</span>
              </div>
            )}
            <div className="summary-total" style={{ marginTop: 14, paddingTop: 14 }}>
              <span>{t.toPay}</span>
              <span className="tabular">{uah(cart.total)}</span>
            </div>
          </>
        )}

        <div style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 10 }}>
          {cart.orderSummary}
        </div>

        <div style={{ marginTop: 14 }}>
          <Field
            name="promo_code"
            errors={errors}
            placeholder={t.promoLabel}
            aria-label={t.promoLabel}
          />
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
          {submitting ? t.submitting : cart.payment === PaymentEnum.online ? t.pay : t.confirm}
        </Button>
      </div>
    </form>
  );
}
