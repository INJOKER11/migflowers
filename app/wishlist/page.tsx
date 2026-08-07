import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { WishlistView } from '@/components/product/WishlistView';

export const metadata: Metadata = { title: 'Збережені квіти — MIG Flowers' };

export default function WishlistPage() {
  return (
    <Section pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Збережене' }]} />
      <h1 style={{ fontSize: 44, margin: '0 0 32px' }}>Збережені квіти</h1>
      <WishlistView />
    </Section>
  );
}
