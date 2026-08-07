import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CheckoutForm } from '@/components/cart/CheckoutForm';

export const metadata: Metadata = { title: 'Оформлення — MIG Flowers' };

export default function CheckoutPage() {
  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Кошик', href: '/cart' }, { label: 'Оформлення' }]} />
      <h1 style={{ fontSize: 44, margin: '0 0 8px' }}>Оформлення</h1>
      <p style={{ margin: '0 0 34px', fontSize: 14.5, color: 'var(--color-neutral-600)' }}>
        Оформлення без реєстрації. Без акаунта, без пароля, на одному екрані.
      </p>
      <CheckoutForm />
    </Section>
  );
}
