import type { Locale } from './i18n';

/** Fills the `{placeholder}` slots a dictionary string carries.
    `fill('До {price}', { price: '500 ₴' })` → 'До 500 ₴'. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * `uk-UA` groups thousands with a non-breaking space (some ICU builds use the
 * narrow one); the design sets an ordinary space, so both are replaced. The
 * grouping is the same in Russian, so the number formatting needs no locale —
 * only the words around it do.
 * 2450 → '2 450'
 */
function grouped(n: number): string {
  return n.toLocaleString('uk-UA').replace(/[  ]/g, ' ');
}

/** Hryvnia. 2450 → '2 450 ₴' */
export function uah(n: number): string {
  return grouped(n) + ' ₴';
}

/** Rounded to the nearest 10 ₴ — how every derived price is quoted. */
export function roundTo10(n: number): number {
  return Math.round(n / 10) * 10;
}

/**
 * Slavic plurals are picked by the last digit, except in the teens, which all
 * take the genitive plural: 1 композиція, 2 композиції, 5 композицій, but
 * 11 композицій and 21 композиція. Both languages follow the same rule, so one
 * chooser serves both — it just needs the three forms.
 */
function plural(n: number, forms: [string, string, string]): string {
  const teens = n % 100 >= 11 && n % 100 <= 14;
  const last = n % 10;
  if (!teens && last === 1) return forms[0];
  if (!teens && last >= 2 && last <= 4) return forms[1];
  return forms[2];
}

const ARRANGEMENTS: Record<Locale, [string, string, string]> = {
  uk: ['композиція', 'композиції', 'композицій'],
  ru: ['композиция', 'композиции', 'композиций'],
};

/** 'композиція' / 'композиції' / 'композицій' — the shop toolbar count. */
export function arrangementCount(n: number, locale: Locale): string {
  return `${n} ${plural(n, ARRANGEMENTS[locale])}`;
}

const SAVED: Record<Locale, { none: string; forms: [string, string, string] }> = {
  uk: {
    none: 'Ви ще нічого не зберегли.',
    forms: ['збережений букет.', 'збережені букети.', 'збережених букетів.'],
  },
  ru: {
    none: 'Вы ещё ничего не сохранили.',
    forms: ['сохранённый букет.', 'сохранённых букета.', 'сохранённых букетов.'],
  },
};

/** 'збережений букет' / 'збережених букетів' — the account favourites line. */
export function savedCount(n: number, locale: Locale): string {
  if (n === 0) return SAVED[locale].none;
  return `${n} ${plural(n, SAVED[locale].forms)}`;
}

/**
 * The zone is pinned because these dates are baked in at build time on a server
 * whose own zone is arbitrary — without it the day flips for any review posted
 * near midnight. The shop is in Odesa, so Kyiv is the calendar to quote.
 */
const DAY_MONTH_YEAR: Record<Locale, Intl.DateTimeFormat> = {
  uk: new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Kyiv',
  }),
  ru: new Intl.DateTimeFormat('ru-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Kyiv',
  }),
};

/** API timestamp → '3 серп. 2026', the same shape the journal dates use. */
export function shortDate(iso: string | undefined, locale: Locale): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  // Both locales close the short form with ' р.'/' г.'; the design doesn't show it.
  return DAY_MONTH_YEAR[locale].format(d).replace(/\s*[рг]\.$/, '');
}

const REVIEWS: Record<Locale, [string, string, string]> = {
  uk: ['відгук', 'відгуки', 'відгуків'],
  ru: ['отзыв', 'отзыва', 'отзывов'],
};

/** '1 284 відгуки'. This count runs into the thousands, so it goes through the
    same three-form rule as the others rather than a one-or-many test. */
export function reviewCount(n: number, locale: Locale): string {
  return `${grouped(n)} ${plural(n, REVIEWS[locale])}`;
}

const RATING: Record<Locale, { none: string; mean: string }> = {
  uk: { none: 'Ще жодного відгуку', mean: 'Середня оцінка' },
  ru: { none: 'Пока ни одного отзыва', mean: 'Средняя оценка' },
};

/** 'Середня оцінка 4,9 · 1 284 відгуки' — the reviews page heading. */
export function ratingSummary(average: number, total: number, locale: Locale): string {
  if (total === 0) return RATING[locale].none;

  const mean = average.toLocaleString(locale === 'ru' ? 'ru-UA' : 'uk-UA', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return `${RATING[locale].mean} ${mean} · ${reviewCount(total, locale)}`;
}

/** The rating as filled stars, e.g. 4 → '★★★★'. */
export function stars(rating: number): string {
  return '★'.repeat(rating);
}

/** First `maxLength` characters of a post body, cut at a word boundary — for blog cards and `<meta description>`. */
export function excerpt(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}
