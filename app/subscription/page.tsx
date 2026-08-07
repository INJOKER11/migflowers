import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PlanPicker } from '@/components/subscription/PlanPicker';

export const metadata: Metadata = {
  title: 'Підписка — MIG Flowers',
  description: 'Квіти в домі, про які не треба згадувати. Три плани, будь-яка періодичність.',
};

export default function SubscriptionPage() {
  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Підписка' }]} />
      <h1
        style={{
          fontSize: 'clamp(38px, 4.6vw, 56px)',
          margin: '0 0 14px',
          maxWidth: '20ch',
          lineHeight: 1.08,
        }}
      >
        Квіти в домі, про які не треба згадувати
      </h1>
      <p
        style={{
          margin: '0 0 20px',
          fontSize: 15.5,
          lineHeight: 1.8,
          color: 'var(--color-neutral-700)',
          maxWidth: '56ch',
          textAlign: 'justify',
        }}
      >
        Ви кажете, як часто. Ми привозимо те, що було на ринку того ранку — ніколи двічі однаковий
        букет. Призупинити, пропустити чи скасувати можна будь-якого тижня одним повідомленням.
      </p>

      <PlanPicker />

      <p style={{ margin: '28px 0 0', fontSize: 13.5, color: 'var(--color-neutral-600)' }}>
        Перша доставка протягом 48 годин. Підписка включає безкоштовну доставку в усі зони.
      </p>
    </Section>
  );
}
