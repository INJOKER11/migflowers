import Link from 'next/link';
import { OCCASIONS } from '@/lib/content';

export function OccasionGrid() {
  return (
    <section className="occasion-band">
      <div className="band-inner" style={{ maxWidth: 1240, margin: '0 auto', padding: '72px 32px' }}>
        <h2 style={{ fontSize: 34, margin: '0 0 8px', color: '#fff' }}>Квіти на кожен випадок</h2>
        <p style={{ margin: '0 0 34px', fontSize: 14.5, color: 'var(--color-neutral-400)' }}>
          Скажіть, з якої нагоди, а ми підкажемо, що зараз найкраще.
        </p>
        <div className="occasion-grid">
          {OCCASIONS.map((occasion) => (
            <Link
              key={occasion.name}
              href={`/shop?occasion=${encodeURIComponent(occasion.name)}`}
              className="occasion-cell"
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26 }}>{occasion.name}</div>
              <div
                style={{ fontSize: 12.5, color: 'var(--color-neutral-400)', marginTop: 6 }}
              >
                {occasion.blurb}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
