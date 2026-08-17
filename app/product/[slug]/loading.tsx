import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function Loading() {
  return (
    <Section pt={36} pb={80}>
      <Breadcrumb
        trail={[
          { label: 'Головна', href: '/' },
          { label: 'Магазин', href: '/shop' },
        ]}
      />

      <div
        role="status"
        aria-label="Завантажуємо букет"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 56,
          alignItems: 'start',
        }}
      >
        <div>
          <div
            className="skeleton"
            style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-md)' }}
          />
          <div className="skeleton" style={{ height: 11.5, width: 180, margin: '8px auto 0' }} />
        </div>

        <div>
          <div className="skeleton" style={{ height: 46, width: '72%' }} />
          <div className="skeleton" style={{ height: 34, width: '34%', marginTop: 20 }} />

          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <div className="skeleton" style={{ height: 48, flex: 1, minWidth: 180 }} />
            <div className="skeleton" style={{ height: 48, width: 132 }} />
          </div>

          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: '1px solid var(--color-divider)',
            }}
          >
            <div className="skeleton" style={{ height: 18, width: 64 }} />
          </div>

          {/* Five lines at the description's 1.85 line-height. */}
          <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
            <div className="skeleton" style={{ height: 12 }} />
            <div className="skeleton" style={{ height: 12 }} />
            <div className="skeleton" style={{ height: 12 }} />
            <div className="skeleton" style={{ height: 12 }} />
            <div className="skeleton" style={{ height: 12, width: '45%' }} />
          </div>
        </div>
      </div>
    </Section>
  );
}
