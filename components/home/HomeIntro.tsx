import { Fragment } from 'react';
import { Link } from '@/components/ui/Link';
import { Section } from '@/components/ui/Section';
import { getCategories, getDistricts } from '@/lib/api';
import { homeIntro } from '@/lib/content';
import { FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import { fill, uah } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

/** «А, Б і В» — the last pair joined by the conjunction, the rest by commas. */
function list<T>(items: T[], and: string, render: (item: T) => React.ReactNode) {
  return items.map((item, i) => (
    <Fragment key={i}>
      {i === 0 ? '' : i === items.length - 1 ? ` ${and} ` : ', '}
      {render(item)}
    </Fragment>
  ));
}

/* The home page is the one Google matches to «купити квіти Одеса», and before
   this block it said so only in the title — the rest was product cards and
   short captions. The API calls degrade to an empty list: a missing district
   is better than a home page that will not render. */
export async function HomeIntro({ locale }: { locale: Locale }) {
  const t = homeIntro(locale);
  const [districts, categories] = await Promise.all([
    getDistricts(locale).catch(() => []),
    getCategories({ locale }).catch(() => []),
  ]);
  const priced = districts.filter((d) => d.price_for_delivery);
  const [before, after] = t.delivery.split('{districts}');
  const [catBefore, catAfter] = t.catalogue.split('{categories}');

  const paragraph = {
    margin: '0 0 16px',
    fontSize: 15,
    lineHeight: 1.8,
    color: 'var(--color-neutral-700)',
  };

  return (
    <Section width={900} pt={20} pb={84}>
      <h2 style={{ fontSize: 34, margin: '0 0 20px' }}>{t.title}</h2>
      <p style={paragraph}>{t.shop}</p>
      {priced.length > 0 && (
        <p style={paragraph}>
          {before}
          {list(priced, t.and, (d) => d.name)}
          {fill(after, { free: uah(FREE_DELIVERY_THRESHOLD) })}
          {priced.length < districts.length && ` ${t.suburbs}`}
        </p>
      )}
      {categories.length > 0 && (
        <p style={{ ...paragraph, margin: 0 }}>
          {catBefore}
          {list(categories, t.and, (c) => (
            <Link href={`/category/${c.slug}`}>{c.name.toLowerCase()}</Link>
          ))}
          {catAfter}
        </p>
      )}
    </Section>
  );
}
