import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CheckoutForm } from '@/components/cart/CheckoutForm';

export const metadata: Metadata = { title: 'Оформлення — MIG Flowers' };

export default function CheckoutPage() {
  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Оформлення' }]} />
      <h1 style={{ fontSize: 44, margin: '0 0 8px' }}>Оформлення</h1>
      <div>
        <p style={{ margin: 0, fontSize: 14.5, color: 'var(--color-neutral-600)' }}>
          Оформлення без реєстрації. Без акаунта, без пароля, на одному екрані.
        </p>
        <p style={{ margin: 0, fontSize: 14.5, color: 'var(--color-neutral-600)' }}>
          Наш менеджер звʼяжеться з вами в Telegram/WhatsApp/Viber, а якщо ні — на email.
        </p>
        <p style={{ margin: '0 0 34px', fontSize: 14.5, color: 'var(--color-neutral-600)' }}>
          Для замовлення великих композицій уточніть наявність у менеджера за телефоном
          +380234923.
        </p>
      </div>
      <CheckoutForm />
    </Section>
  );
}
