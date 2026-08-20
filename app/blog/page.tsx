import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { getBlogPosts } from '@/lib/api';
import { shortDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Журнал — MIG Flowers',
  description:
    'Що зараз у сезоні, як зберегти квіти живими і час від часу — суперечки про стрічку.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <Section pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Журнал' }]} />
      <h1 style={{ fontSize: 46, margin: '0 0 12px' }}>Журнал</h1>
      <p
        style={{
          margin: '0 0 40px',
          fontSize: 15,
          color: 'var(--color-neutral-700)',
          maxWidth: '56ch',
        }}
      >
        Що зараз у сезоні, як зберегти квіти живими і час від часу — суперечки про стрічку.
      </p>

      <div
        className="grid-auto grid-fill"
        style={{ '--min': '280px', '--gap': '36px' } as CSSProperties}
      >
        {(posts || []).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ display: 'flex', flexDirection: 'column', color: 'inherit' }}
          >
            <Plate
              src={post.image_url ?? null}
              alt={post.title}
              ratio="3/2"
              sizes="(max-width: 760px) 100vw, 380px"
              zoom={1.05}
            />
            <div
              style={{
                fontSize: 11.5,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-700)',
                marginTop: 16,
              }}
            >
              {post.title}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 24,
                marginTop: 8,
                lineHeight: 1.25,
                color: 'var(--color-text)',
              }}
            >
              {post.title}
            </div>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 14,
                lineHeight: 1.7,
                color: 'var(--color-neutral-700)',
              }}
            >
              {post.content}
            </p>
            <div style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 12 }}>
              {shortDate(post.created_at)}
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
