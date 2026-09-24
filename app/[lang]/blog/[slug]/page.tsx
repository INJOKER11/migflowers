import type { Metadata } from 'next';
import { Link } from '@/components/ui/Link';
import { notFound, permanentRedirect } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { getBlogPost, getBlogPosts, localizedSlugs, translateSlug } from '@/lib/api';
import { excerpt, shortDate } from '@/lib/format';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, pageMetadata, slugPaths } from '@/lib/seo';
import { DEFAULT_LOCALE, isLocale, localePath } from '@/lib/i18n';

interface Params {
  params: Promise<{ lang: string; slug: string }>;
}

/* Per `lang`, like the category page: posts may carry a slug per locale. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const posts = await getBlogPosts(isLocale(params.lang) ? params.lang : DEFAULT_LOCALE);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await localeOf(params);
  const post = await getBlogPost(slug, locale);
  if (!post) return {};

  return pageMetadata({
    locale,
    path: `/blog/${post.slug}`,
    paths: slugPaths('/blog', await localizedSlugs('posts', post.id)),
    title: `${post.title} — MIG Flowers`,
    description: excerpt(post.content),
    image: post.image_url,
  });
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const locale = await localeOf(params);
  const post = await getBlogPost(slug, locale);
  /* Same rule as the product page: one URL per post per locale. */
  if (!post) {
    const own = await translateSlug('posts', slug, locale);
    if (own) permanentRedirect(localePath(locale, `/blog/${own}`));
    notFound();
  }
  if (post.slug !== decodeURIComponent(slug)) {
    permanentRedirect(localePath(locale, `/blog/${post.slug}`));
  }

  const dict = getDictionary(locale);
  const nav = dict.nav;

  return (
    <Section width={760} pt={44} pb={90}>
      <Breadcrumb
        locale={locale}
        trail={[
          { label: nav.home, href: '/' },
          { label: nav.blog, href: '/blog' },
          { label: post.title },
        ]}
      />

      <div
        style={{
          fontSize: 11.5,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: 'var(--color-accent-700)',
        }}
      >
        {post.subject}
      </div>

      <h1
        style={{
          fontSize: 'clamp(36px, 4.6vw, 56px)',
          margin: '16px 0 12px',
          lineHeight: 1.08,
        }}
      >
        {post.title}
      </h1>

      <div
        style={{
          fontSize: 12.5,
          color: 'var(--color-neutral-600)',
          paddingBottom: 26,
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        {shortDate(post.created_at, locale)}
      </div>

      <Plate
        src={post.image_url}
        alt={post.title}
        ratio="3/2"
        sizes="(max-width: 760px) 100vw, 760px"
        priority
        style={{ margin: '28px 0' }}
      />

      <p
        style={{
          margin: '0 0 20px',
          fontSize: 16,
          lineHeight: 1.9,
          color: 'var(--color-neutral-800)',
          textAlign: 'justify',
        }}
      >
        {post.content}
      </p>

      <div style={{ marginTop: 40, paddingTop: 26, borderTop: '1px solid var(--color-divider)' }}>
        <Link
          href="/blog"
          style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}
        >
          {dict.blog.back}
        </Link>
      </div>
    </Section>
  );
}
