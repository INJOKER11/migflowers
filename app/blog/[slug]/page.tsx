import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { POSTS, getPost } from '@/lib/posts';
import { getBlogPost } from '@/lib/api';
import { shortDate } from '@/lib/format';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;

  const post = await getBlogPost(slug);
  if (!post) return {};
  return { title: `${post.title} — MIG Flowers`, description: post.content };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <Section width={760} pt={44} pb={90}>
      <Breadcrumb
        trail={[
          { label: 'Головна', href: '/' },
          { label: 'Журнал', href: '/blog' },
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
        {shortDate(post.created_at)}
      </div>

      <Plate
        src={post.image_url ?? null}
        alt={post.title}
        ratio="3/2"
        sizes="(max-width: 760px) 100vw, 760px"
        priority
        style={{ margin: '28px 0' }}
      />

      {/*{post.content.map((paragraph, i) => (*/}
      <p
        // key={i}
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
      {/*))}*/}

      <div style={{ marginTop: 40, paddingTop: 26, borderTop: '1px solid var(--color-divider)' }}>
        <Link
          href="/blog"
          style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}
        >
          ← Усі записи журналу
        </Link>
      </div>
    </Section>
  );
}
