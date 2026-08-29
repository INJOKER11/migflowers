import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Plate } from '@/components/ui/Plate';
import { photo } from '@/lib/images';
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

  return (
    <>
      <Section pt={44} pb={40}>
        <Breadcrumb
          locale={locale}
          trail={[{ label: 'Головна', href: '/' }, { label: 'Про нас' }]}
        />
        <h1
          style={{
            fontSize: 'clamp(40px, 5vw, 64px)',
            margin: '0 0 24px',
            maxWidth: '18ch',
            lineHeight: 1.05,
          }}
        >
          Родинна майстерня і теплиця, з якої все починається
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
          <p style={PARAGRAPH}>
            Ми — родинна справа: вирощуємо і продаємо квіти в Одесі вже понад десять років. Частину
            букета складають квіти з наших теплиць, а частину докуповуємо — коли сезон ще не дав
            того, що потрібно для композиції. У букет іде тільки те, за якість чого ми відповідаємо.
          </p>
          <p style={PARAGRAPH}>
            Майстерня стоїть на Люстдорфській дорозі, у Таїрово. Стрічку й досі завʼязуємо вручну, і
            з неї не виходить нічого, що ми не хотіли б отримати самі. Якщо ви телефонуєте вдень,
            відповідає хтось із родини.
          </p>
        </div>
      </Section>

      <Section pt={0} pb={60}>
        <Plate
          src={photo('bench')}
          alt="Робочий стіл у майстерні"
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
