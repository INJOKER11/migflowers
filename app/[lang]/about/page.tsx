import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { photo } from '@/lib/images';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, metadataFor } from '@/lib/seo';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return metadataFor(props.params, '/about', 'about');
}

const PARAGRAPH = {
  margin: 0,
  fontSize: 15.5,
  lineHeight: 1.85,
  color: 'var(--color-neutral-700)',
  textAlign: 'justify',
} as const;

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <>
      <Section pt={44} pb={40}>
        <Breadcrumb
          locale={locale}
          trail={[{ label: dict.nav.home, href: '/' }, { label: t.crumb }]}
        />
        <h1
          style={{
            fontSize: 'clamp(40px, 5vw, 64px)',
            margin: '0 0 24px',
            maxWidth: '18ch',
            lineHeight: 1.05,
          }}
        >
          {t.h1}
        </h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 48,
            alignItems: 'start',
            marginTop: 36,
          }}
        >
          <p style={PARAGRAPH}>{t.p1}</p>
          <p style={PARAGRAPH}>{t.p2}</p>
        </div>
      </Section>

      <Section pt={0} pb={60}>
        <Plate
          src={photo('bench')}
          alt={t.imageAlt}
          ratio="21/9"
          sizes="(max-width: 1240px) 100vw, 1240px"
        />
        <div
          style={{
            fontSize: 12,
            color: 'var(--color-neutral-600)',
            marginTop: 10,
            fontStyle: 'italic',
          }}
        ></div>
      </Section>
    </>
  );
}
