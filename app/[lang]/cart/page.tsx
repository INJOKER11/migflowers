import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CartView } from '@/components/cart/CartView';

/* Retired in favour of the checkout drawer / direct /checkout — kept on disk,
   disabled rather than deleted. No metadata export, so the tab title falls
   back to the root layout's instead of claiming a live page. */
export default function CartPage() {
  notFound();

  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Кошик' }]} />
      <h1 style={{ fontSize: 44, margin: '0 0 32px' }}>Ваш кошик</h1>
      <CartView />
    </Section>
  );
}
