import type { Metadata } from 'next';
import { localeOf, pageMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/Section';
import { Confirmation } from '@/components/cart/Confirmation';

/* A step in a purchase, not a destination from a search result: crawlable so
   the links out of it still count, never indexed. */
export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadata({
    locale: await localeOf(props.params),
    path: '/checkout/confirmed',
    title: 'Замовлення прийнято — MIG Flowers',
    noindex: true,
  });
}

export default function ConfirmedPage() {
  return (
    <Section width={660} pt={110} pb={140} style={{ textAlign: 'center' }}>
      <Confirmation />
    </Section>
  );
}
