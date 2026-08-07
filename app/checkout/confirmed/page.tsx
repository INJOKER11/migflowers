import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Confirmation } from '@/components/cart/Confirmation';

export const metadata: Metadata = { title: 'Замовлення прийнято — MIG Flowers' };

export default function ConfirmedPage() {
  return (
    <Section width={660} pt={110} pb={140} style={{ textAlign: 'center' }}>
      <Confirmation />
    </Section>
  );
}
