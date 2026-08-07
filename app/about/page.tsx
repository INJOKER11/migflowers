import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Plate } from '@/components/ui/Plate';
import { TEAM } from '@/lib/content';
import { photo } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Про нас — MIG Flowers',
  description: 'Дві сестри, одна бабуся і дуже ранній будильник. Родинна майстерня з 1998 року.',
};

const PARAGRAPH = {
  margin: 0,
  fontSize: 15.5,
  lineHeight: 1.85,
  color: 'var(--color-neutral-700)',
  textAlign: 'justify',
} as const;

export default function AboutPage() {
  return (
    <>
      <Section pt={44} pb={40}>
        <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Про нас' }]} />
        <h1
          style={{
            fontSize: 'clamp(40px, 5vw, 64px)',
            margin: '0 0 24px',
            maxWidth: '18ch',
            lineHeight: 1.05,
          }}
        >
          Дві сестри, одна бабуся і дуже ранній будильник
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
            Марія відкрила крамницю на площі Ринок у 1998 році — розкладний столик і відро гвоздик.
            Ремеслу вона навчилася від власної матері, яка продавала квіти на цій самій площі ще до
            того, як війна змінила її призначення. Одинадцять років крамниця була однією жінкою й
            одним столиком.
          </p>
          <p style={PARAGRAPH}>
            Тепер її ведуть онучки — Ірина і Галина. Поїздка на ринок досі о пʼятій ранку. Стрічку
            досі завʼязують руками. З майстерні не виходить нічого, що ми не хотіли б отримати самі,
            а якщо ви телефонуєте вдень, відповідає хтось із нас.
          </p>
        </div>
      </Section>

      <Section pt={0} pb={60}>
        <Plate
          src={photo('bench', 2000)}
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
        >
          Стіл у четвер зранку, у розпалі замовлення.
        </div>
      </Section>

      <Section pt={20} pb={90}>
        <SectionHeading size={32} marginBottom={28}>
          Наші люди
        </SectionHeading>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: 32,
          }}
        >
          {TEAM.map((member) => (
            <div key={member.name}>
              <Plate
                src={member.img}
                alt={member.name}
                ratio="4/5"
                sizes="(max-width: 760px) 100vw, 380px"
              />
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, marginTop: 14 }}>
                {member.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent-700)',
                  marginTop: 4,
                }}
              >
                {member.role}
              </div>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'var(--color-neutral-700)',
                }}
              >
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
