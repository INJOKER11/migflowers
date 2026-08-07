import { Section } from '@/components/ui/Section';
import { WHY_US } from '@/lib/content';

export function WhyUs() {
  return (
    <Section pt={84} pb={84}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
          gap: 44,
        }}
      >
        {WHY_US.map((item) => (
          <div key={item.n}>
            <div
              className="tabular"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 13,
                letterSpacing: '.2em',
                color: 'var(--color-accent-700)',
              }}
            >
              {item.n}
            </div>
            <div
              style={{ height: 1, background: 'var(--color-accent)', margin: '12px 0 16px', width: 34 }}
            />
            <h3 style={{ fontSize: 24, margin: '0 0 8px' }}>{item.title}</h3>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.7,
                color: 'var(--color-neutral-700)',
                textAlign: 'justify',
              }}
            >
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
