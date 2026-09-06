import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Plate } from '@/components/ui/Plate';
import { GALLERY } from '@/lib/content';
import type { Dictionary } from '@/lib/dictionaries';

export function InstaGrid({ dict }: { dict: Dictionary['home'] }) {
  return (
    <Section pt={80} pb={80}>
      <SectionHeading
        trailing={
          <span
            style={{
              fontSize: 12,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-600)',
            }}
          >
            @migflowers
          </span>
        }
      >
        {dict.galleryTitle}
      </SectionHeading>

      <div className="grid-auto" style={{ '--min': '150px', '--gap': '12px' } as CSSProperties}>
        {GALLERY.map((src) => (
          <Plate
            key={src}
            src={src}
            alt={dict.galleryAlt}
            sizes="(max-width: 760px) 50vw, 200px"
            zoom={1.07}
            zoomTime="0.5s"
            radius="0"
          />
        ))}
      </div>
    </Section>
  );
}
