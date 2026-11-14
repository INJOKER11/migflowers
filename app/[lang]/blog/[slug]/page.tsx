import type { Metadata } from 'next';
import { Link } from '@/components/ui/Link';
import { notFound, permanentRedirect } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { getBlogPost, getBlogPosts, localizedSlugs, translateSlug } from '@/lib/api';
import { excerpt, plainText, shortDate } from '@/lib/format';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, pageMetadata, slugPaths, withBrand } from '@/lib/seo';
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
    /* The editor's SEO fields win when set (`/admin`, per language);
       otherwise the title and the opening of the text. No text at all
       (`null`) leaves the tag out rather than inheriting the site's default. */
    title: post.seo_title?.trim() || withBrand(post.title),
    description: post.meta_description?.trim() || excerpt(plainText(post.content)) || null,
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

  /* The admin's content field is plain text with blank lines between
     paragraphs; rendered as one <p> they collapsed into a single wall. */
  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Section width={760} pt={44} pb={90}>
      {/* The heading block is centred over the centred photo; left-aligned
          above it, the page read as shifted to one side. */}
      <header style={{ textAlign: 'center' }}>
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
            fontSize: 'clamp(34px, 4.4vw, 52px)',
            margin: '16px auto 14px',
            lineHeight: 1.1,
            maxWidth: '24ch',
            textWrap: 'balance',
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
      </header>

      <Plate
        src={post.image_url}
        alt={post.title}
        ratio="3/2"
        sizes="(max-width: 760px) 100vw, 760px"
        priority
        style={{ margin: '28px 0 32px' }}
      />

      {/* Left-aligned: justified Ukrainian at this measure opened wide gaps
          between words. Single line breaks inside a paragraph are kept. */}
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            margin: '0 0 22px',
            fontSize: 16.5,
            lineHeight: 1.85,
            color: 'var(--color-neutral-800)',
            whiteSpace: 'pre-line',
          }}
        >
          {p}
        </p>
      ))}

      <div
        style={{
          marginTop: 40,
          paddingTop: 26,
          borderTop: '1px solid var(--color-divider)',
          textAlign: 'center',
        }}
      >
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
