import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { Plate } from '@/components/ui/Plate';
import { photo } from '@/lib/images';

export default function NotFound() {
  return (
    <Section width={760} pt={90} pb={130} style={{ textAlign: 'center' }}>
      <Plate
        src={photo('poppies', 600)}
        alt="Одна квітка у вазі"
        sizes="210px"
        radius="50%"
        style={{ width: 210, margin: '0 auto 34px' }}
      />

      <div
        className="tabular"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 64,
          color: 'var(--color-accent)',
          lineHeight: 1,
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: 40, margin: '14px 0' }}>Ця сторінка не перезимувала</h1>

      <p
        style={{
          margin: '0 auto',
          fontSize: 15.5,
          lineHeight: 1.8,
          color: 'var(--color-neutral-700)',
          maxWidth: '46ch',
        }}
      >
        Сторінки, яку ви шукали, тут немає. Квіти, на щастя, усі на місці.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          marginTop: 32,
          flexWrap: 'wrap',
        }}
      >
        <Button
          href="/shop"
          cta
          style={{ padding: '13px 30px' }}
        >
          Повернутися до магазину
        </Button>
        <Button
          href="/contact"
          variant="ghost"
          cta
          style={{ padding: '13px 26px' }}
        >
          Розкажіть, що зламалося
        </Button>
      </div>
    </Section>
  );
}
