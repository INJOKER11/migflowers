import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CartView } from '@/components/cart/CartView';

export const metadata: Metadata = { title: 'Ваш кошик — MIG Flowers' };

export default function CartPage() {
  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Кошик' }]} />
      <h1 style={{ fontSize: 44, margin: '0 0 32px' }}>Ваш кошик</h1>
      <CartView />
    </Section>
  );
}
