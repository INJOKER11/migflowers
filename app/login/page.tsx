import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { LoginForm } from '@/components/account/LoginForm';

/* Retired along with /account, kept on disk rather than deleted. No metadata
   export, so the tab title falls back to the root layout's. */
export default function LoginPage() {
  notFound();

  return (
    <Section width={440} pt={80} pb={120}>
      <LoginForm />
    </Section>
  );
}
