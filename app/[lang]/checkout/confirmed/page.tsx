import type { Metadata } from 'next';
import { localeOf, pageMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/Section';
import { Confirmation } from '@/components/cart/Confirmation';
import { getDictionary } from '@/lib/dictionaries';

/* A step in a purchase, not a destination from a search result: crawlable so
   the links out of it still count, never indexed. */
export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = await localeOf(props.params);

  return pageMetadata({
    locale,
    path: '/checkout/confirmed',
    title: getDictionary(locale).confirmed.metaTitle,
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
