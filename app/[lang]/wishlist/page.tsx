import type { Metadata } from 'next';
import { localeOf, pageMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { WishlistView } from '@/components/product/WishlistView';
import { getDictionary } from '@/lib/dictionaries';

/* One visitor's saved list — nothing a searcher could ever be looking for. */
export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = await localeOf(props.params);

  return pageMetadata({
    locale,
    path: '/wishlist',
    title: getDictionary(locale).wishlist.metaTitle,
    noindex: true,
  });
}

export default async function WishlistPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const dict = getDictionary(locale);
  const t = dict.wishlist;

  return (
    <Section pt={44} pb={90}>
      <Breadcrumb
        locale={locale}
        trail={[{ label: dict.nav.home, href: '/' }, { label: t.crumb }]}
      />
      <h1 style={{ fontSize: 44, margin: '0 0 32px' }}>{t.h1}</h1>
      <WishlistView />
    </Section>
  );
}
