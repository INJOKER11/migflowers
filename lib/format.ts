/**
 * `uk-UA` groups thousands with a non-breaking space (some ICU builds use the
 * narrow one); the design sets an ordinary space, so both are replaced.
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

/** 'композиція' / 'композицій' — the shop toolbar count. */
export function arrangementCount(n: number): string {
  return `${n} ${n === 1 ? 'композиція' : 'композицій'}`;
}

/** 'збережений букет' / 'збережених букетів' — the account favourites line. */
export function savedCount(n: number): string {
  if (n === 0) return 'Ви ще нічого не зберегли.';
  return `${n} ${n === 1 ? 'збережений букет.' : 'збережених букетів.'}`;
}

/**
 * The zone is pinned because these dates are baked in at build time on a server
 * whose own zone is arbitrary — without it the day flips for any review posted
 * near midnight. The shop is in Odesa, so Kyiv is the calendar to quote.
 */
const DAY_MONTH_YEAR = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Europe/Kyiv',
});

/** API timestamp → '3 серп. 2026', the same shape the journal dates use. */
export function shortDate(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  // uk-UA closes the short form with ' р.'; the design doesn't show it.
  return DAY_MONTH_YEAR.format(d).replace(/\s*р\.$/, '');
}

/**
 * 'відгук' / 'відгуки' / 'відгуків'. Unlike the other counts here this one runs
 * into the thousands, so it needs the full rule rather than a one-or-many test:
 * the form is chosen by the last digit, except in the teens, which are all
 * genitive plural (11 відгуків, but 21 відгук).
 */
export function reviewCount(n: number): string {
  const teens = n % 100 >= 11 && n % 100 <= 14;
  const last = n % 10;

  if (!teens && last === 1) return `${grouped(n)} відгук`;
  if (!teens && last >= 2 && last <= 4) return `${grouped(n)} відгуки`;
  return `${grouped(n)} відгуків`;
}

/** 'Середня оцінка 4,9 · 1 284 відгуки' — the reviews page heading. */
export function ratingSummary(average: number, total: number): string {
  if (total === 0) return 'Ще жодного відгуку';

  const mean = average.toLocaleString('uk-UA', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return `Середня оцінка ${mean} · ${reviewCount(total)}`;
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
