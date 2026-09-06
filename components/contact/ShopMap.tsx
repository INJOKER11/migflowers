import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

/**
 * The workshop on Google Maps — вул. Академіка Корольова, 22.
 *
 * The pin is placed by coordinate rather than by name so it lands on the door
 * and not on whatever Google decides "Mig Flowers, Odesa" means today. The
 * `output=embed` form needs no API key and no billing account — the official
 * Embed API does, and this map is a static picture of one address.
 *
 * The link underneath goes to the business listing itself, which is what a
 * phone actually wants: reviews, opening hours and a Directions button.
 */
const LAT = 46.4109788;
const LNG = 30.7195882;

const PLACE_URL =
  'https://www.google.com/maps/place/Mig+Flowers/@46.4108451,30.720441,1849m/' +
  'data=!3m1!1e3!4m6!3m5!1s0x40c6335ed354e533:0x9930a2f04e64e251!8m2!3d46.4109788!4d30.7195882' +
  '!16s%2Fg%2F11zx2pw7ml';

export function ShopMap({ locale, dict: t }: { locale: Locale; dict: Dictionary['contact'] }) {
  const src = `https://www.google.com/maps?q=${LAT},${LNG}&z=17&hl=${locale}&output=embed`;

  return (
    <div style={{ marginTop: 28 }}>
      <div
        style={{
          border: '1px solid var(--color-divider)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--color-neutral-200)',
          aspectRatio: '3/2',
        }}
      >
        <iframe
          src={src}
          title={t.mapTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ display: 'block', width: '100%', height: '100%', border: 0 }}
        />
      </div>
      <a
        href={PLACE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', marginTop: 10, fontSize: 13 }}
      >
        {t.mapOpen}
      </a>
    </div>
  );
}
