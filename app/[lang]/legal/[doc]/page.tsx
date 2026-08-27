import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LEGAL, LEGAL_UPDATED, getLegal } from '@/lib/legal';
import { getDictionary } from '@/lib/dictionaries';
import { localeOf, pageMetadata } from '@/lib/seo';

interface Params {
  params: Promise<{ lang: string; doc: string }>;
}

export function generateStaticParams() {
  return Object.keys(LEGAL).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { doc } = await params;
  const document = getLegal(doc);
  if (!document) return {};

  return pageMetadata({
    locale: await localeOf(params),
    path: `/legal/${doc}`,
    title: `${document.title} — MIG Flowers`,
  });
}

export default async function LegalPage({ params }: Params) {
  const { doc } = await params;
  const document = getLegal(doc);
  if (!document) notFound();

  const locale = await localeOf(params);
  const nav = getDictionary(locale).nav;

  return (
    <Section width={720} pt={44} pb={90}>
      <Breadcrumb
        locale={locale}
        trail={[{ label: nav.home, href: '/' }, { label: document.title }]}
      />
      <h1 style={{ fontSize: 44, margin: '0 0 10px' }}>{document.title}</h1>
      <div
        style={{
          fontSize: 12.5,
          color: 'var(--color-neutral-600)',
          paddingBottom: 26,
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        {LEGAL_UPDATED}
      </div>

      {document.sections.map((section) => (
        <div key={section.h} style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 24, margin: '0 0 10px' }}>{section.h}</h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.85,
              color: 'var(--color-neutral-700)',
              textAlign: 'justify',
            }}
          >
            {section.p}
          </p>
        </div>
      ))}
    </Section>
  );
}
