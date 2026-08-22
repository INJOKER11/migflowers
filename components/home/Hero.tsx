import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { Plate } from '@/components/ui/Plate';
import { photo } from '@/lib/images';
import type { CSSProperties } from 'react';

const STAT_LABEL: CSSProperties = {
  fontSize: 12,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: 'var(--color-neutral-600)',
  marginTop: 4,
};

export function Hero() {
  return (
    <Section
      pt={64}
      pb={80}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
        gap: 64,
        alignItems: 'center',
      }}
    >
      <div style={{ animation: 'migRise .7s ease both' }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: '.24em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-700)',
          }}
        >
          Родинна майстерня з 1998 року
        </div>

        <h1
          style={{
            fontSize: 'clamp(44px, 5.2vw, 74px)',
            lineHeight: 1.03,
            margin: '22px 0 0',
            letterSpacing: '-.01em',
          }}
        >
          Свіжі квіти,
          <br />
          <em>доставлені з любовʼю</em>
        </h1>

        <p
          style={{
            maxWidth: '44ch',
            margin: '26px 0 0',
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--color-neutral-700)',
            textAlign: 'justify',
            textWrap: 'pretty',
          }}
        >
          Три покоління однієї родини, одна невелика майстерня і ранкова поїздка на ринок, яка не
          змінилася за двадцять пʼять років. Кожен букет зрізають, напувають і звʼязують руками того
          самого дня, коли він їде до вас.
        </p>

        <div style={{ display: 'flex', gap: 14, marginTop: 34, flexWrap: 'wrap' }}>
          <Button href="/shop" cta style={{ padding: '13px 30px', fontSize: 12.5 }}>
            Купити зараз
          </Button>
          {/*<Button*/}
          {/*  href="/subscription"*/}
          {/*  variant="ghost"*/}
          {/*  cta*/}
          {/*  style={{ padding: '13px 26px', fontSize: 12.5 }}*/}
          {/*>*/}
          {/*  Підписка на квіти*/}
          {/*</Button>*/}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 36,
            marginTop: 46,
            paddingTop: 26,
            borderTop: '1px solid var(--color-divider)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div className="tabular" style={{ fontFamily: 'var(--font-heading)', fontSize: 30 }}>
              Від 3 годин
            </div>
            <div style={STAT_LABEL}>Доставка містом того ж дня</div>
          </div>
        </div>
      </div>

      <Plate
        src={photo('roseBouquet', 1100)}
        alt="Букет рожевих і білих троянд"
        ratio="4/5"
        sizes="(max-width: 1000px) 100vw, 560px"
        priority
        style={{ animation: 'migRise .9s ease both' }}
      />
    </Section>
  );
}
