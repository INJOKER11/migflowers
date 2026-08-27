import type { Metadata } from 'next';
import { localeOf, pageMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { WishlistView } from '@/components/product/WishlistView';

/* One visitor's saved list — nothing a searcher could ever be looking for. */
export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadata({
    locale: await localeOf(props.params),
    path: '/wishlist',
    title: 'Збережені квіти — MIG Flowers',
    noindex: true,
  });
}

export default function WishlistPage() {
  return (
    <Section pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Збережене' }]} />
      <h1 style={{ fontSize: 44, margin: '0 0 32px' }}>Збережені квіти</h1>
      <WishlistView />
    </Section>
  );
}
