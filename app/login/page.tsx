import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { LoginForm } from '@/components/account/LoginForm';

export const metadata: Metadata = { title: 'Вхід — MIG Flowers' };

export default function LoginPage() {
  return (
    <Section width={440} pt={80} pb={120}>
      <LoginForm />
    </Section>
  );
}
